'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Menu, Button, Drawer, Space, Switch, Typography, Grid } from 'antd';
import {
  HomeOutlined,
  EditOutlined,
  FileTextOutlined,
  ToolOutlined,
  SettingOutlined,
  MenuOutlined,
  BulbOutlined,
  BulbFilled,
  RocketOutlined,
} from '@ant-design/icons';
import { useTheme } from '@/contexts/ThemeContext';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const navItems = [
  { label: '仪表盘', href: '/dash', icon: <HomeOutlined /> },
  { label: '生成文章', href: '/generate', icon: <EditOutlined /> },
  { label: '文章列表', href: '/articles', icon: <FileTextOutlined /> },
  { label: 'SEO工具', href: '/tools', icon: <ToolOutlined /> },
  { label: '设置', href: '/settings', icon: <SettingOutlined /> },
];

export default function NavigationBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const screens = useBreakpoint();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = !screens.md;

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/dash') {
      return pathname === '/dash' || pathname.startsWith('/dash/');
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getSelectedKeys = () => {
    const active = navItems.find(item => isActive(item.href));
    return active ? [active.href] : [];
  };

  const menuItems = navItems.map(item => ({
    key: item.href,
    icon: item.icon,
    label: <Link href={item.href}>{item.label}</Link>,
  }));

  const ThemeSwitch = () => (
    <Switch
      checked={theme === 'dark'}
      onChange={toggleTheme}
      checkedChildren={<BulbFilled />}
      unCheckedChildren={<BulbOutlined />}
    />
  );

  return (
    <>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: theme === 'dark' ? '#141414' : '#fff',
          borderBottom: `1px solid ${theme === 'dark' ? '#303030' : '#f0f0f0'}`,
          height: 64,
        }}
      >
        {/* Logo */}
        <Link href="/dash" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <RocketOutlined style={{ fontSize: 24, color: '#1677ff' }} />
          <Typography.Title
            level={4}
            style={{
              margin: 0,
              background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            AI SEO Blog
          </Typography.Title>
        </Link>

        {/* Desktop Navigation */}
        {mounted && !isMobile && (
          <Space size="middle">
            <Menu
              mode="horizontal"
              selectedKeys={getSelectedKeys()}
              items={menuItems}
              style={{
                border: 'none',
                background: 'transparent',
                minWidth: 500,
              }}
            />
            <ThemeSwitch />
          </Space>
        )}

        {/* Mobile Menu Button */}
        {mounted && isMobile && (
          <Space>
            <ThemeSwitch />
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
            />
          </Space>
        )}
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <Space>
            <RocketOutlined style={{ fontSize: 20, color: '#1677ff' }} />
            <span style={{ fontWeight: 700 }}>AI SEO Blog</span>
          </Space>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
      >
        <Menu
          mode="vertical"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          onClick={() => setDrawerOpen(false)}
          style={{ border: 'none' }}
        />
      </Drawer>
    </>
  );
}
