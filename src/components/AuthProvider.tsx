'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  // 建议：既然定义了 hasPassword，这里应该暴露出去
  hasPassword: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
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
  
  // 冲突已解决：保留了 hasPassword 状态定义
  // 用于判断系统是否已设置密码
  const [hasPassword, setHasPassword] = useState(false); 
  
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(!!data.auth?.authenticated);
        
        // 建议：在这里更新 hasPassword 的状态，否则默认值永远是 false
        if (data.auth?.hasPassword !== undefined) {
            setHasPassword(!!data.auth?.hasPassword);
        }
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
    // 更新 value，将 hasPassword 传递给下层组件
    <AuthContext.Provider value={{ isAuthenticated, loading, checkAuth, hasPassword }}>
      {children}
    </AuthContext.Provider>
  );
}