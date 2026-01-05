import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthConfig } from '@/lib/auth';

const AUTH_COOKIE = 'auth_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 定义始终允许的公开路径
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/auth/login') ||
    (pathname.startsWith('/api/settings') && request.method === 'GET')
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthenticated = authCookie === 'authenticated';
  const { hasPassword } = getAuthConfig();

  // 已设置密码后的逻辑
  // 登录页面在已登录时重定向到首页
  if (pathname === '/login') {
    if (isAuthenticated) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = '/';
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }

  // 已登录用户可以访问所有页面
  if (isAuthenticated && hasPassword) {
    return NextResponse.next();
  }

  // 未登录则重定向至登录页
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/:path*'],
};
