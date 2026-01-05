import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'auth_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 定义不需要鉴权的公开路径
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/login' ||
    pathname.startsWith('/api/auth/login')
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (authCookie === 'authenticated') {
    return NextResponse.next();
  }

  // 未登录则重定向至登录页
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  // 登录后跳转回首页（这里也可以改为跳转回 request.url）
  loginUrl.searchParams.set('next', '/');
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/:path*'],
};