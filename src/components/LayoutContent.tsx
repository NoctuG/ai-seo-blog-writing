'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import config from '@/lib/config';

function LayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // 从 useAuth 获取完整状态，包括是否有密码(hasPassword)和加载状态(loading)
  const { isAuthenticated, hasPassword, loading } = useAuth();

  // 不显示导航栏的页面
  const hideNavbar = pathname === '/login';

  // 核心逻辑：路由保护
  // 所有页面都需要登录，未登录用户强制跳转到登录页
  useEffect(() => {
    if (loading) {
      return;
    }

    // 如果未登录且不在登录页，重定向到登录页
    if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, pathname, router]);

  // 防止未授权内容闪烁（Flash of Unauthenticated Content）
  // 在重定向发生前，暂时不渲染页面内容
  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 仅在非隐藏页面且已登录状态下显示导航栏 */}
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