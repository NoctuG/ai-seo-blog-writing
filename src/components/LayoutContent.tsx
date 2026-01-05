'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import config from '@/lib/config';

function LayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, hasPassword, loading } = useAuth();

  // 不显示导航栏的页面
  const hideNavbar = pathname === '/login';

  useEffect(() => {
    if (loading) {
      return;
    }

    if (hasPassword && !isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
  }, [hasPassword, isAuthenticated, loading, pathname, router]);

  if (hasPassword && !isAuthenticated && pathname !== '/login') {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNavbar && isAuthenticated && <NavigationBar />}
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <footer style={{
        borderTop: '1px solid #e0e0e0',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#fafafa',
      }}>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} {config.site.name}. All rights reserved.
        </p>
        <p style={{ margin: '8px 0 0', color: '#888', fontSize: '12px' }}>
          AI驱动的SEO博客生成系统
        </p>
      </footer>
    </div>
  );
}

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutInner>{children}</LayoutInner>
    </AuthProvider>
  );
}
