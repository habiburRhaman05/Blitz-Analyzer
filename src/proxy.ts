import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { decodeToken } from './lib/token';
import { getTokens, isTokenExpiringSoon, refreshTokens } from './services/auth.services';
import { UserRole } from './interfaces/enums';

const AUTH_ROUTES = ['/sign-in', '/sign-up'];
const PUBLIC_ROUTES = ['/', '/about-us', '/verify-email'];


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname)
   

  // Public routes are always allowed
  if (isPublicRoute) {
    return NextResponse.next();
  }

  //  Get tokens from cookies
  let { accessToken, refreshToken } = await getTokens(request);
  const signInUrl = new URL('/sign-in', request.url);

  // No tokens at all → redirect to sign‑in
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(signInUrl);
  }

  // Check if the access token is missing or about to expire
  const needsRefresh = !accessToken || (await isTokenExpiringSoon(accessToken));
  let newAccessToken: string | undefined;
  let newRefreshToken: string | undefined;
  let newSessionToken: string | undefined;

  if (needsRefresh && refreshToken) {
    try {
      const { data } = await refreshTokens(refreshToken, process.env.API_URL!);
      newAccessToken = data.accessToken;
      newRefreshToken = data.refreshToken;
      newSessionToken = data.sessionToken; // adjust if your response has a different name
      // Use the new token for the rest of the middleware
      accessToken = newAccessToken;
    } catch {
      // Refresh failed → redirect to sign‑in
      return NextResponse.redirect(signInUrl);
    }
  }

  // 5. If we still have no access token (shouldn't happen, but just in case) → redirect
  if (!accessToken) {
    return NextResponse.redirect(signInUrl);
  }

  // 6. Decode the (possibly refreshed) access token to get user data and role
  let userData;
  try {
    userData = await decodeToken(accessToken);
  } catch {
    // Invalid token → redirect to sign‑in
    return NextResponse.redirect(signInUrl);
  }

  const userRole = userData?.user?.role as UserRole | undefined;

  // If user is already authenticated and tries to visit an auth route → redirect to dashboard
  if (isAuthRoute && userData?.user) {
    const redirectPath = userRole === UserRole.ADMIN ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Role‑based routes
  if (pathname.startsWith('/admin') && userRole !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  if (pathname.startsWith('/dashboard') && userRole !== UserRole.USER) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  //  refreshed tokens
  const response = NextResponse.next();
  if (newAccessToken) {
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 30,             
      sameSite: 'none',
    });
    if (newSessionToken) {
      response.cookies.set('better-auth.session_token', newSessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 30,
        sameSite: 'none',
      });
    }
    if (newRefreshToken) {
      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,    
        sameSite: 'none',
      });
    }
    console.log('Tokens refreshed and cookies updated');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};