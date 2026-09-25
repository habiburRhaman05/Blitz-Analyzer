import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole, UserStatus } from './interfaces/enums';

const AUTH_ROUTES = ['/sign-in', '/sign-up'];
const PUBLIC_ROUTES = ['/', '/about-us', "/contact-us", '/reviews', '/verify-email', '/issues', '/blogs', '/pricing', '/testing'];
// Prefix-matched public routes (covers dynamic segments, e.g. /templates/[id])
const PUBLIC_ROUTE_PREFIXES = ['/templates'];

type SessionUser = {
  role: UserRole;
  status?: UserStatus;
  isDeleted?: boolean;
};

// Single source of truth for auth: ask the backend's better-auth session
// endpoint directly, instead of decoding a locally-issued token.
//
// better-auth's own handler is mounted at `/api/auth` on the bare origin
// (see backend/src/app.ts: `app.use("/api/auth", toNodeHandler(auth))`),
// separate from the versioned `/api/v1` prefix our custom REST routes use.
// API_URL already includes `/api/v1`, so strip it before appending here -
// appending directly produced a doubled `/api/v1/api/auth/get-session`
// path that 404'd on every request, making this always resolve to "logged
// out" and bounce every authenticated navigation back to /sign-in.
const API_ORIGIN = (process.env.API_URL ?? '').replace(/\/api\/v1\/?$/, '');

async function getSessionUser(cookie: string): Promise<SessionUser | null> {
  try {
    const res = await fetch(`${API_ORIGIN}/api/auth/get-session`, {
      headers: { cookie },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
    || PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const cookie = request.headers.get('cookie') ?? '';
  const user = cookie ? await getSessionUser(cookie) : null;

  if (isAuthRoute) {
    if (user) {
      const redirectPath = user.role === UserRole.ADMIN
        ? '/admin/dashboard'
        : user.role === UserRole.MANAGER
          ? '/moderator/dashboard'
          : '/dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return NextResponse.next();
  }

  const signInUrl = new URL('/sign-in', request.url);

  if (!user || user.status === UserStatus.BANNED || user.status === UserStatus.DELETED || user.isDeleted) {
    return NextResponse.redirect(signInUrl);
  }

  if (pathname.startsWith('/moderator') && user.role !== UserRole.MANAGER) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  if (pathname.startsWith('/admin') && user.role !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  if (pathname.startsWith('/dashboard') && user.role !== UserRole.USER) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
