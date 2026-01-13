'use client';

import { useState, useEffect } from 'react';
import { Typography, Card, Input, Button, Form, Select, Divider, message, Row, Col, Space } from 'antd';
import { SettingOutlined, SaveOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface SettingsData {
  anthropicApiKey: string;
  anthropicBaseUrl: string;
  openaiApiKey: string;
  openaiBaseUrl: string;
  defaultAiService: 'claude' | 'openai';
}

export default function SettingsPage() {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        form.setFieldsValue(parsed);
      } catch {
        console.error('Failed to parse saved settings');
      }
    }
  }, [form]);

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const saveApiSettings = async (values: SettingsData) => {
    setLoading(true);
    try {
      localStorage.setItem('appSettings', JSON.stringify(values));

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'api', ...values }),
      });

      if (response.ok) {
        message.success('API 设置已保存');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch {
      message.error('保存设置失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Space align="center" style={{ marginBottom: 32 }}>
          <SettingOutlined style={{ fontSize: 32, color: '#1677ff' }} />
          <Title level={2} style={{ margin: 0 }}>
            系统设置
          </Title>
        </Space>

        <Card>
          <Title level={4}>AI 服务配置</Title>
          <Paragraph type="secondary" style={{ marginBottom: 24 }}>
            配置 Claude 和 OpenAI API 密钥及自定义端点
          </Paragraph>

          <Form
            form={form}
            layout="vertical"
            onFinish={saveApiSettings}
            initialValues={{
              defaultAiService: 'claude',
              anthropicApiKey: '',
              anthropicBaseUrl: '',
              openaiApiKey: '',
              openaiBaseUrl: '',
            }}
          >
            <Form.Item label="默认 AI 服务" name="defaultAiService">
              <Select>
                <Select.Option value="claude">Claude (Anthropic)</Select.Option>
                <Select.Option value="openai">OpenAI (GPT)</Select.Option>
              </Select>
            </Form.Item>

            <Divider>Claude (Anthropic)</Divider>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item label="Anthropic API Key" name="anthropicApiKey">
                  <Input
                    placeholder="sk-ant-..."
                    type={showPassword['anthropicApiKey'] ? 'text' : 'password'}
                    suffix={
                      <Button
                        type="text"
                        size="small"
                        icon={showPassword['anthropicApiKey'] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => togglePasswordVisibility('anthropicApiKey')}
                      />
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Anthropic Base URL (可选)"
                  name="anthropicBaseUrl"
                  extra="留空使用官方 API 端点，或输入自定义端点地址"
                >
                  <Input placeholder="https://api.anthropic.com" />
                </Form.Item>
              </Col>
            </Row>

            <Divider>OpenAI</Divider>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item label="OpenAI API Key" name="openaiApiKey">
                  <Input
                    placeholder="sk-..."
                    type={showPassword['openaiApiKey'] ? 'text' : 'password'}
                    suffix={
                      <Button
                        type="text"
                        size="small"
                        icon={showPassword['openaiApiKey'] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => togglePasswordVisibility('openaiApiKey')}
                      />
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="OpenAI Base URL (可选)"
                  name="openaiBaseUrl"
                  extra="留空使用官方 API 端点，或输入自定义端点地址 (如兼容 API)"
                >
                  <Input placeholder="https://api.openai.com/v1" />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
              >
                保存 API 设置
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
