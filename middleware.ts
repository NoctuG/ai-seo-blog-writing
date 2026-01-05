import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const AUTH_COOKIE = 'auth_session';
const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

interface Settings {
  auth?: {
    passwordHash?: string;
  };
}

async function hasPassword(): Promise<boolean> {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    const settings: Settings = JSON.parse(data);
    return !!settings.auth?.passwordHash;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 定义始终允许的公开路径
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/auth/login')
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthenticated = authCookie === 'authenticated';
  const passwordExists = await hasPassword();

  // 如果还没有设置密码，只允许访问设置页面和相关API
  if (!passwordExists) {
    if (pathname === '/settings' || pathname.startsWith('/api/settings')) {
      return NextResponse.next();
    }
    // 重定向到设置页面进行初始化
    const settingsUrl = request.nextUrl.clone();
    settingsUrl.pathname = '/settings';
    return NextResponse.redirect(settingsUrl);
  }

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
  if (isAuthenticated) {
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