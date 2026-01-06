import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthConfig } from '@/lib/auth';

const AUTH_COOKIE = 'auth_session';

// 定义公开页面（不需要登录即可访问）
const PUBLIC_PATHS = [
  '/',           // 首页
  '/login',      // 登录页
];

// 定义受保护的页面（必须登录才能访问）
const PROTECTED_PATHS = [
  '/generate',
  '/editor',
  '/dash',
  '/articles',
  '/settings',
  '/tools',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 定义始终允许的系统路径和 API
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

  // 登录页面的处理
  if (pathname === '/login') {
    // 如果已登录，重定向到首页
    if (isAuthenticated) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = '/';
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }

  // 检查是否是公开页面
  const isPublicPath = PUBLIC_PATHS.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // 如果是公开页面，允许访问
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 对于受保护的页面，检查认证状态
  const isProtectedPath = PROTECTED_PATHS.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtectedPath || !isPublicPath) {
    // 如果没有设置密码，重定向到登录页并提示
    if (!hasPassword) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 如果设置了密码但未登录，重定向到登录页
    if (!isAuthenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 已登录且设置了密码，允许访问
    return NextResponse.next();
  }

  // 默认允许访问其他页面
  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
