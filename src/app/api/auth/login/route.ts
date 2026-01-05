import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');
const AUTH_COOKIE = 'auth_session';

interface Settings {
  auth?: {
    username?: string;
    passwordHash?: string;
  };
}

async function loadSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

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

  const settings = await loadSettings();
  const expectedUsername = settings.auth?.username || 'admin';
  const passwordHash = settings.auth?.passwordHash;

  if (!passwordHash) {
    return NextResponse.json(
      { error: '请先在设置中配置登录密码。' },
      { status: 400 }
    );
  }

  if (username !== expectedUsername || hashPassword(password) !== passwordHash) {
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
