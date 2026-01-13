'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography, Button, Input, Form, Alert, Divider, Space, Card } from 'antd';
import { GoogleOutlined, EyeOutlined, EyeInvisibleOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface SettingsResponse {
  auth?: {
    username?: string;
    hasPassword?: boolean;
  };
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPassword, setHasPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTarget = useMemo(() => searchParams?.get('next') || '/dash', [searchParams]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as SettingsResponse;
        form.setFieldsValue({ email: data.auth?.username || 'admin' });
        setHasPassword(!!data.auth?.hasPassword);
      } catch {
        // Ignore settings fetch errors
      }
    };

    loadSettings();
  }, [form]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError('');

    if (!values.email || !values.password) {
      setError('Please enter your email and password.');
      return;
    }

    if (values.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: values.email, password: values.password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      router.replace(redirectTarget);
    } catch {
      setError('Login failed. Please try again later.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('Google login is not configured yet.');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Left Panel - Gradient with Illustration */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 48,
          position: 'relative',
          overflow: 'hidden',
        }}
        className="login-left-panel"
      >
        {/* Logo */}
        <div>
          <Title
            level={3}
            style={{
              color: 'white',
              margin: 0,
              letterSpacing: '0.5px',
            }}
          >
            SEO<span style={{ color: '#ffd700' }}>WRITING</span>.AI
          </Title>
        </div>

        {/* Illustration */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <div
            style={{
              width: 320,
              height: 320,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <EditOutlined style={{ fontSize: 120, color: 'rgba(255, 255, 255, 0.3)' }} />
          </div>
        </div>

        {/* Tagline */}
        <div style={{ textAlign: 'center' }}>
          <Title
            level={3}
            style={{
              color: 'white',
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Your super agent for
            <br />
            content creation
          </Title>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          backgroundColor: '#fafafa',
        }}
      >
        <Card style={{ width: '100%', maxWidth: 450, borderRadius: 16 }} bordered={false}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ marginBottom: 8 }}>
                Sign in to your account
              </Title>
              <Text type="secondary">
                Welcome back to the SeoWriting.AI
              </Text>
            </div>

            {/* Google Login Button */}
            <Button
              size="large"
              block
              icon={<GoogleOutlined />}
              onClick={handleGoogleLogin}
              style={{ height: 48 }}
            >
              Log in with Google
            </Button>

            <Divider>Or use Email</Divider>

            {/* Alerts */}
            {!hasPassword && (
              <Alert
                type="info"
                message="Password not configured. Please set ADMIN_PASSWORD in .env file."
                showIcon
              />
            )}

            {error && <Alert type="error" message={error} showIcon />}

            {/* Login Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ email: '', password: '' }}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please enter your email' }]}
              >
                <Input
                  size="large"
                  placeholder="name@example.com"
                  type="email"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input
                  size="large"
                  placeholder="8+ characters required"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  suffix={
                    <Button
                      type="text"
                      size="small"
                      icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              </Form.Item>

              <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <Link
                  href="#"
                  style={{
                    color: '#1677ff',
                    textDecoration: 'none',
                    fontSize: 14,
                  }}
                >
                  Forgot your password
                </Link>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  disabled={!hasPassword}
                  style={{
                    height: 48,
                    background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
                    border: 'none',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </Form.Item>
            </Form>

            {/* Sign Up Link */}
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">
                No Account yet?{' '}
                <Link
                  href="#"
                  style={{
                    color: '#1677ff',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Link>
              </Text>
            </div>
          </Space>
        </Card>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .login-left-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <LoginPageContent />
    </Suspense>
  );
}
