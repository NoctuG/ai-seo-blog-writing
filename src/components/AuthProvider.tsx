'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  // 如果你需要在此处暴露 hasPassword，请取消下行的注释并更新 Context.Provider 的 value
  // hasPassword: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 保留了 codex 分支的新增状态：用于判断系统是否已设置密码
  const [hasPassword, setHasPassword] = useState(false); 
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(!!data.auth?.authenticated);
        
        // 注意：你可能还需要在这里更新 hasPassword 的状态
        // 例如: setHasPassword(!!data.auth?.hasPassword);
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return (
    // 目前 hasPassword 定义了但未使用，建议将其添加到 value 中以供全局使用
    <AuthContext.Provider value={{ isAuthenticated, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}