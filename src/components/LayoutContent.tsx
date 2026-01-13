'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Typography } from 'antd';
import NavigationBar from '@/components/NavigationBar';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { useTheme } from '@/contexts/ThemeContext';
import config from '@/lib/config';

const { Content, Footer } = Layout;

function LayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  const { isAuthenticated, loading } = useAuth();

  const hideNavbar = pathname === '/login';

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!hideNavbar && isAuthenticated && <NavigationBar />}
      <Content
        style={{
          flex: 1,
          background: theme === 'dark' ? '#000' : '#f5f5f5',
        }}
      >
        {children}
      </Content>
      <Footer
        style={{
          textAlign: 'center',
          background: theme === 'dark' ? '#141414' : '#fafafa',
          borderTop: `1px solid ${theme === 'dark' ? '#303030' : '#e8e8e8'}`,
          padding: '24px 50px',
        }}
      >
        <Typography.Text type="secondary">
          &copy; {new Date().getFullYear()} {config.site.name}. All rights reserved.
        </Typography.Text>
        <br />
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          AI驱动的SEO博客生成系统
        </Typography.Text>
      </Footer>
    </Layout>
  );
}

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutInner>{children}</LayoutInner>
    </AuthProvider>
  );
}
