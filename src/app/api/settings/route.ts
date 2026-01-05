import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getAuthConfig } from '@/lib/auth';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');
const AUTH_COOKIE = 'auth_session';

interface Settings {
  api?: {
    anthropicApiKey?: string;
    anthropicBaseUrl?: string;
    openaiApiKey?: string;
    openaiBaseUrl?: string;
    defaultAiService?: 'claude' | 'openai';
  };
}

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function loadSettings(): Promise<Settings> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveSettings(settings: Settings): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const settings = await loadSettings();
    const authCookie = request.cookies.get(AUTH_COOKIE)?.value;

    // Don't expose sensitive data
    const safeSettings = {
      api: {
        anthropicBaseUrl: settings.api?.anthropicBaseUrl || '',
        openaiBaseUrl: settings.api?.openaiBaseUrl || '',
        defaultAiService: settings.api?.defaultAiService || 'claude',
        hasAnthropicKey: !!settings.api?.anthropicApiKey,
        hasOpenaiKey: !!settings.api?.openaiApiKey,
      },
      auth: {
        username: getAuthConfig().username,
        hasPassword: getAuthConfig().hasPassword,
        authenticated: authCookie === 'authenticated',
      },
    };

    return NextResponse.json(safeSettings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get(AUTH_COOKIE)?.value;
    const body = await request.json();
    const { type } = body;

    const settings = await loadSettings();
    const { hasPassword } = getAuthConfig();
    const isAuthenticated = authCookie === 'authenticated';

    if (hasPassword && !isAuthenticated) {
      return NextResponse.json(
        { error: '未登录，无法修改设置。' },
        { status: 401 }
      );
    }

    if (!hasPassword) {
      return NextResponse.json(
        { error: '请先在环境变量中配置登录密码。' },
        { status: 403 }
      );
    }

    if (type === 'api') {
      settings.api = {
        ...settings.api,
        anthropicApiKey: body.anthropicApiKey || settings.api?.anthropicApiKey,
        anthropicBaseUrl: body.anthropicBaseUrl || '',
        openaiApiKey: body.openaiApiKey || settings.api?.openaiApiKey,
        openaiBaseUrl: body.openaiBaseUrl || '',
        defaultAiService: body.defaultAiService || 'claude',
      };
    } else {
      return NextResponse.json(
        { error: '无效的设置类型。' },
        { status: 400 }
      );
    }

    await saveSettings(settings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
