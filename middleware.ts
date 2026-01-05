import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'auth_session';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (authCookie === 'authenticated') {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('next', '/');
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/'],
};
