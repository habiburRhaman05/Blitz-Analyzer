import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { decodeToken } from './lib/token';
import { getTokens, isTokenExpiringSoon, refreshTokens } from './services/auth.services';
import { UserRole } from './interfaces/enums';

const AUTH_ROUTES = ['/sign-in', '/sign-up'];
const PUBLIC_ROUTES = ['/', '/about-us',"/contact-us", '/verify-email','/issues','/blogs','/pricing'];


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // 1. Get tokens from cookies
  let { accessToken, refreshToken } = await getTokens(request);
  const signInUrl = new URL('/sign-in', request.url);

 
  if (isAuthRoute) {
    if (accessToken) {
      try {
        const userData = await decodeToken(accessToken);
        if (userData?.user) {
          const userRole = userData.user.role as UserRole;
          console.log(userRole);
          
          const redirectPath = userRole === UserRole.ADMIN ? '/admin/dashboard' : userRole === UserRole.MANAGER ? '/moderator/dashboard' : '/dashboard';
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      } catch (e) {
        // Token is invalid/expired, let them stay on the sign-in page
      }
    }
    return NextResponse.next();
  }

  // 3. Public routes are always allowed
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 4. Protection: No tokens at all → redirect to sign‑in
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(signInUrl);
  }

  // 5. Token Refresh Logic
  const needsRefresh = !accessToken || (await isTokenExpiringSoon(accessToken));
  let newAccessToken: string | undefined;
  let newRefreshToken: string | undefined;
  let newSessionToken: string | undefined;

  if (needsRefresh && refreshToken) {
    try {
      const refreshResponse = await refreshTokens(refreshToken, process.env.API_URL!);
      const { data } = refreshResponse;
      
      newAccessToken = data.accessToken;
      newRefreshToken = data.refreshToken;
      newSessionToken = data.sessionToken;
      
      accessToken = newAccessToken; 
    } catch (error) {
      // Refresh failed (e.g., refresh token expired) → clear cookies and redirect
      const response = NextResponse.redirect(signInUrl);
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  // 6. Validate final access token
  if (!accessToken) return NextResponse.redirect(signInUrl);

  let userData;
  try {
    userData = await decodeToken(accessToken);
  } catch {
    return NextResponse.redirect(signInUrl);
  }

  const userRole = userData?.user?.role as UserRole | undefined;
console.log("role",userRole,userData);

  // 7. Role‑based Access Control (RBAC)
   if (pathname.startsWith('/moderator') && userRole !== UserRole.MANAGER) {
    console.log("re-form-here");
    
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  if (pathname.startsWith('/admin') && userRole !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  if (pathname.startsWith('/dashboard') && userRole !== UserRole.USER) {
    console.log("re-form-here user");

    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  
 

  // 8. Finalize response and set refreshed cookies if necessary
  const response = NextResponse.next();

  if (newAccessToken) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax' as const, 
    };

    response.cookies.set('accessToken', newAccessToken, { 
        ...cookieOptions, 
        maxAge: 60 * 30 
    });

    if (newSessionToken) {
      response.cookies.set('better-auth.session_token', newSessionToken, { 
        ...cookieOptions, 
        maxAge: 60 * 30 
    });
    }
    
    if (newRefreshToken) {
      response.cookies.set('refreshToken', newRefreshToken, { 
        ...cookieOptions, 
        maxAge: 60 * 60 * 24 * 30 
    });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
