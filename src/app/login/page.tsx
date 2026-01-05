'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface SettingsResponse {
  auth?: {
    username?: string;
    hasPassword?: boolean;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPassword, setHasPassword] = useState(true);

  const redirectTarget = useMemo(() => searchParams.get('next') || '/', [searchParams]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as SettingsResponse;
        setUsername(data.auth?.username || 'admin');
        setHasPassword(!!data.auth?.hasPassword);
      } catch {
        // Ignore settings fetch errors to avoid blocking login UI.
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!username || !password) {
      setError('请输入用户名和密码。');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error || '登录失败，请检查用户名和密码。');
        setLoading(false);
        return;
      }

      router.replace(redirectTarget);
    } catch {
      setError('登录失败，请稍后再试。');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  登录
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  请输入用户名与密码访问主页
                </Typography>
              </Box>

              {!hasPassword && (
                <Alert severity="warning">
                  还未设置登录密码，请先前往{' '}
                  <Link href="/settings">设置</Link> 页面配置。
                </Alert>
              )}

              {error && <Alert severity="error">{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  <TextField
                    label="用户名"
                    name="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    fullWidth
                    required
                  />
                  <TextField
                    label="密码"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    fullWidth
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || !hasPassword}
                    sx={{ py: 1.2, fontWeight: 600 }}
                  >
                    {loading ? '登录中...' : '登录'}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
