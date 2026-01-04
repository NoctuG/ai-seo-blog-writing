'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Save,
  Settings as SettingsIcon,
  Security,
  Api,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface SettingsData {
  // AI Settings
  anthropicApiKey: string;
  anthropicBaseUrl: string;
  openaiApiKey: string;
  openaiBaseUrl: string;
  defaultAiService: 'claude' | 'openai';
  // Auth Settings
  username: string;
  password: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [settings, setSettings] = useState<SettingsData>({
    anthropicApiKey: '',
    anthropicBaseUrl: '',
    openaiApiKey: '',
    openaiBaseUrl: '',
    defaultAiService: 'claude',
    username: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsed,
          password: '',
          confirmPassword: '',
        }));
      } catch (e) {
        console.error('Failed to parse saved settings');
      }
    }
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field: keyof SettingsData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSettings(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: keyof SettingsData) => (
    event: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const saveApiSettings = async () => {
    try {
      const apiSettings = {
        anthropicApiKey: settings.anthropicApiKey,
        anthropicBaseUrl: settings.anthropicBaseUrl,
        openaiApiKey: settings.openaiApiKey,
        openaiBaseUrl: settings.openaiBaseUrl,
        defaultAiService: settings.defaultAiService,
      };

      localStorage.setItem('appSettings', JSON.stringify(apiSettings));

      // Also save to server-side config via API
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'api', ...apiSettings }),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'API 设置已保存',
          severity: 'success',
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: '保存设置失败',
        severity: 'error',
      });
    }
  };

  const saveAuthSettings = async () => {
    if (settings.password !== settings.confirmPassword) {
      setSnackbar({
        open: true,
        message: '密码不匹配',
        severity: 'error',
      });
      return;
    }

    if (settings.password && settings.password.length < 6) {
      setSnackbar({
        open: true,
        message: '密码至少需要6个字符',
        severity: 'error',
      });
      return;
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'auth',
          username: settings.username,
          password: settings.password,
        }),
      });

      if (response.ok) {
        setSettings(prev => ({
          ...prev,
          password: '',
          confirmPassword: '',
        }));
        setSnackbar({
          open: true,
          message: '认证设置已保存',
          severity: 'success',
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: '保存设置失败',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <SettingsIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight={700}>
          系统设置
        </Typography>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="settings tabs"
            sx={{ px: 2 }}
          >
            <Tab
              icon={<Api sx={{ mr: 1 }} />}
              iconPosition="start"
              label="API 配置"
            />
            <Tab
              icon={<Security sx={{ mr: 1 }} />}
              iconPosition="start"
              label="认证设置"
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* API Settings Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              AI 服务配置
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              配置 Claude 和 OpenAI API 密钥及自定义端点
            </Typography>

            <Grid container spacing={3}>
              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>默认 AI 服务</InputLabel>
                  <Select
                    value={settings.defaultAiService}
                    label="默认 AI 服务"
                    onChange={handleSelectChange('defaultAiService')}
                  >
                    <MenuItem value="claude">Claude (Anthropic)</MenuItem>
                    <MenuItem value="openai">OpenAI (GPT)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Claude (Anthropic)
                  </Typography>
                </Divider>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Anthropic API Key"
                  type={showPassword['anthropicApiKey'] ? 'text' : 'password'}
                  value={settings.anthropicApiKey}
                  onChange={handleInputChange('anthropicApiKey')}
                  placeholder="sk-ant-..."
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('anthropicApiKey')}
                          edge="end"
                        >
                          {showPassword['anthropicApiKey'] ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Anthropic Base URL (可选)"
                  value={settings.anthropicBaseUrl}
                  onChange={handleInputChange('anthropicBaseUrl')}
                  placeholder="https://api.anthropic.com"
                  helperText="留空使用官方 API 端点，或输入自定义端点地址"
                />
              </Grid>

              <Grid size={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OpenAI
                  </Typography>
                </Divider>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="OpenAI API Key"
                  type={showPassword['openaiApiKey'] ? 'text' : 'password'}
                  value={settings.openaiApiKey}
                  onChange={handleInputChange('openaiApiKey')}
                  placeholder="sk-..."
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('openaiApiKey')}
                          edge="end"
                        >
                          {showPassword['openaiApiKey'] ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="OpenAI Base URL (可选)"
                  value={settings.openaiBaseUrl}
                  onChange={handleInputChange('openaiBaseUrl')}
                  placeholder="https://api.openai.com/v1"
                  helperText="留空使用官方 API 端点，或输入自定义端点地址 (如兼容 API)"
                />
              </Grid>

              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={saveApiSettings}
                    size="large"
                  >
                    保存 API 设置
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Auth Settings Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              登录认证
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              设置系统管理员用户名和密码
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              这些凭据将用于保护系统设置和敏感操作
            </Alert>

            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="用户名"
                  value={settings.username}
                  onChange={handleInputChange('username')}
                  placeholder="admin"
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="新密码"
                  type={showPassword['password'] ? 'text' : 'password'}
                  value={settings.password}
                  onChange={handleInputChange('password')}
                  placeholder="输入新密码"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('password')}
                          edge="end"
                        >
                          {showPassword['password'] ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="确认密码"
                  type={showPassword['confirmPassword'] ? 'text' : 'password'}
                  value={settings.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  placeholder="再次输入密码"
                  error={settings.password !== settings.confirmPassword && settings.confirmPassword !== ''}
                  helperText={
                    settings.password !== settings.confirmPassword && settings.confirmPassword !== ''
                      ? '密码不匹配'
                      : ''
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                          edge="end"
                        >
                          {showPassword['confirmPassword'] ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={saveAuthSettings}
                    size="large"
                  >
                    保存认证设置
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
