import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { decodeToken } from './lib/token';
import { getTokens, isTokenExpiringSoon, refreshTokens } from './services/auth.services';
import { UserRole } from './interfaces/enums';

const AUTH_ROUTES = ['/sign-in', '/sign-up'];
const PUBLIC_ROUTES = ['/', '/about-us',"/ai"];
const PUBLIC_DYNAMIC_PREFIXES = ['/doctors'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;



  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_DYNAMIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isPublicRoute || isAuthRoute) return NextResponse.next();

  // ---  GET TOKENS ---
  let { accessToken, refreshToken } = await getTokens(request);
  const signInUrl = new URL('/sign-in?session=expire', request.url);

  if (!accessToken && !refreshToken) return NextResponse.redirect(signInUrl);

  // --- REFRESH TOKEN IF NEEDED ---
  const tokenExpireSoon = await isTokenExpiringSoon(accessToken!)
  const shouldRefresh = !accessToken || tokenExpireSoon;
  if (shouldRefresh && refreshToken) {
    try {
      const data = await refreshTokens(refreshToken, process.env.API_URL!);
      accessToken = data.data.accessToken;

      const response = NextResponse.next();
      response.cookies.set('accessToken', data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 10,
        sameSite: 'lax',
      });
      response.cookies.set('better-auth.session_token', data.data.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 10,
        sameSite: 'lax',
      });
      response.cookies.set('refreshToken', data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      });

      return response;
    } catch {
      return NextResponse.redirect(signInUrl);
    }
  }

  // ---  DECODE USER & ROLE ---
  const userData = accessToken ? await decodeToken(accessToken) : null;
 
  
  const userRole = userData?.user?.role as UserRole | undefined;

  // ---  ROLE BASED ACCESS ---
  if (pathname.startsWith('/admin') && userRole !== UserRole.ADMIN)
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  if (pathname.startsWith('/dashboard') && userRole !== UserRole.USER)
    return NextResponse.redirect(new URL('/unauthorized', request.url));
 
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};