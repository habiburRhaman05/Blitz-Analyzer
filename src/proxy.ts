import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole, UserStatus } from './interfaces/enums';

const AUTH_ROUTES = ['/sign-in', '/sign-up'];
const PUBLIC_ROUTES = ['/', '/about-us', "/contact-us", '/reviews', '/verify-email', '/issues', '/blogs', '/pricing', '/testing'];

type SessionUser = {
  role: UserRole;
  status?: UserStatus;
  isDeleted?: boolean;
};

// Single source of truth for auth: ask the backend's better-auth session
// endpoint directly, instead of decoding a locally-issued token.
async function getSessionUser(cookie: string): Promise<SessionUser | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/auth/get-session`, {
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
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

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
