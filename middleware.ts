import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthConfig } from '@/lib/auth';

const AUTH_COOKIE = 'auth_session';

// 定义公开页面（不需要登录即可访问）
const PUBLIC_PATHS = [
  '/login',      // 登录页
  '/api/auth/login', // 登录API
];

// 定义始终允许的系统路径
const SYSTEM_PATHS = [
  '/_next',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 始终允许系统路径和静态资源
  if (SYSTEM_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 允许GET请求访问设置API（用于检查是否已设置密码）
  if (pathname.startsWith('/api/settings') && request.method === 'GET') {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthenticated = authCookie === 'authenticated';
  const { hasPassword } = getAuthConfig();

  // 检查是否是公开路径
  const isPublicPath = PUBLIC_PATHS.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // 登录页面的处理
  if (pathname === '/login') {
    // 如果已登录，重定向到目标页面或 Dashboard
    if (isAuthenticated) {
      const nextParam = request.nextUrl.searchParams.get('next');
      if (nextParam) {
        const nextUrl = new URL(nextParam, request.url);
        return NextResponse.redirect(nextUrl);
      }
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = '/dash';
      return NextResponse.redirect(dashUrl);
    }
    return NextResponse.next();
  }

  // 如果是公开路径，允许访问
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 所有其他路径都需要认证保护
  // 如果没有设置密码，重定向到登录页提示设置
  if (!hasPassword) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // 如果设置了密码但未登录，重定向到登录页
  if (!isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // 已登录且设置了密码，允许访问
  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
