'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ConfigProvider, theme as antdTheme, App } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import zhCN from 'antd/locale/zh_CN';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// 蓝色主题配置
const primaryColor = '#1677ff';

function AntdConfigProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 避免服务端渲染时的主题闪烁
  if (!mounted) {
    return (
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: primaryColor,
            borderRadius: 8,
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          },
          algorithm: antdTheme.defaultAlgorithm,
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: primaryColor,
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          colorInfo: primaryColor,
          borderRadius: 8,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        components: {
          Button: {
            fontWeight: 500,
          },
          Card: {
            borderRadiusLG: 12,
          },
          Menu: {
            itemBorderRadius: 8,
          },
          Input: {
            borderRadius: 8,
          },
          Select: {
            borderRadius: 8,
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AntdRegistry>
        <AntdConfigProvider>{children}</AntdConfigProvider>
      </AntdRegistry>
    </ThemeProvider>
  );
}
