'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Create,
  Article,
  Build,
  Settings,
  AutoAwesome,
} from '@mui/icons-material';

const navItems = [
  { label: '仪表盘', href: '/dash', icon: Home },
  { label: '生成文章', href: '/generate', icon: Create },
  { label: '文章列表', href: '/articles', icon: Article },
  { label: 'SEO工具', href: '/tools', icon: Build },
  { label: '设置', href: '/settings', icon: Settings },
];

export default function NavigationBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const isActive = (href: string) => {
    // 对于顶级导航项进行精确匹配或前缀匹配
    if (href === '/dash') {
      return pathname === '/dash' || pathname.startsWith('/dash/');
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <AutoAwesome sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
              <Typography
                variant="h6"
                component={Link}
                href="/dash"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                AI SEO Blog
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Button
                      key={item.href}
                      component={Link}
                      href={item.href}
                      startIcon={<Icon />}
                      sx={{
                        color: active ? 'primary.main' : 'text.secondary',
                        fontWeight: active ? 600 : 500,
                        backgroundColor: active ? 'primary.50' : 'transparent',
                        '&:hover': {
                          backgroundColor: active ? 'primary.100' : 'action.hover',
                        },
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
        }}
      >
        <Box sx={{ pt: 2, pb: 1, px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoAwesome sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" fontWeight={700}>
              AI SEO Blog
            </Typography>
          </Box>
        </Box>
        <List sx={{ px: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={toggleDrawer(false)}
                  selected={active}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.50',
                      '&:hover': {
                        backgroundColor: 'primary.100',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Icon color={active ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      color: active ? 'primary.main' : 'text.primary',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
