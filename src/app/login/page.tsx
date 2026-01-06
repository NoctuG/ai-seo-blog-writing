'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';

interface SettingsResponse {
  auth?: {
    username?: string;
    hasPassword?: boolean;
  };
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPassword, setHasPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTarget = useMemo(() => searchParams.get('next') || '/', [searchParams]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as SettingsResponse;
        setEmail(data.auth?.username || 'admin');
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

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (password.length < 8) {
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
        body: JSON.stringify({ username: email, password }),
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
    // Placeholder for Google OAuth integration
    setError('Google login is not configured yet.');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Left Panel - Purple Gradient with Illustration */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.5px',
            }}
          >
            SEO<span style={{ color: '#ffd700' }}>WRITING</span>.AI
          </Typography>
        </Box>

        {/* Illustration Placeholder */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Box
            sx={{
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: '120px',
                color: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              ✍️
            </Typography>
          </Box>
        </Box>

        {/* Tagline */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Your super agent for
            <br />
            content creation
          </Typography>
        </Box>
      </Box>

      {/* Right Panel - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
          backgroundColor: '#fafafa',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 450 }}>
          <Stack spacing={4}>
            {/* Header */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: '#1a1a1a',
                }}
              >
                Sign in to your account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back to the SeoWriting.AI
              </Typography>
            </Box>

            {/* Google Login Button */}
            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                py: 1.5,
                borderColor: '#dadce0',
                color: '#3c4043',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#dadce0',
                  backgroundColor: '#f8f9fa',
                },
              }}
            >
              Log in with Google
            </Button>

            {/* Divider */}
            <Divider sx={{ color: 'text.secondary' }}>Or use Email</Divider>

            {/* Alerts */}
            {!hasPassword && (
              <Alert severity="info">
                Password not configured. Please set ADMIN_PASSWORD in .env file.
              </Alert>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                {/* Email Field */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: '#1a1a1a',
                    }}
                  >
                    Email
                  </Typography>
                  <TextField
                    placeholder="name@example.com"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    fullWidth
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                      },
                    }}
                  />
                </Box>

                {/* Password Field */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: '#1a1a1a',
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    placeholder="8+ characters required"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                      },
                    }}
                  />
                </Box>

                {/* Forgot Password Link */}
                <Box sx={{ textAlign: 'right' }}>
                  <Link
                    href="#"
                    style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                    }}
                  >
                    Forgot your password
                  </Link>
                </Box>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || !hasPassword}
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '15px',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                    },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </Stack>
            </Box>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No Account yet?{' '}
                <Link
                  href="#"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Box sx={{ minHeight: '100vh' }} />}>
      <LoginPageContent />
    </Suspense>
  );
}
