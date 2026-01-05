import { NextRequest, NextResponse } from 'next/server';
import { getAuthConfig } from '@/lib/auth';

const AUTH_COOKIE = 'auth_session';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const username = (body.username || '').trim();
  const password = body.password || '';

  if (!username || !password) {
    return NextResponse.json(
      { error: '请输入用户名和密码。' },
      { status: 400 }
    );
  }

  const authConfig = getAuthConfig();
  const expectedUsername = authConfig.username;
  const expectedPassword = authConfig.password;

  if (!authConfig.hasPassword) {
    return NextResponse.json(
      { error: '请先在环境变量中配置登录密码。' },
      { status: 400 }
    );
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json(
      { error: '用户名或密码错误。' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE, 'authenticated', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
