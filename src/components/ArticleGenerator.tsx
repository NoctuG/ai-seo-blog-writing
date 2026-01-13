'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Form,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Card,
  Checkbox,
  Row,
  Col,
  Alert,
  Result,
  Spin,
  Typography,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  CloseOutlined,
  SendOutlined,
  GlobalOutlined,
  TwitterOutlined,
  FacebookOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { ContentGenerationRequest } from '@/types';

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function ArticleGenerator() {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<ContentGenerationRequest>({
    topic: '',
    keywords: [],
    targetAudience: '',
    tone: 'professional',
    length: 'medium',
    language: 'zh-CN',
    cms: {
      provider: 'wordpress',
      siteUrl: '',
      username: '',
      applicationPassword: '',
      defaultStatus: 'draft',
      defaultCategory: '',
      defaultTags: [],
    },
    social: {
      twitter: {
        enabled: false,
        handle: '',
        hashtags: [],
      },
      facebook: {
        enabled: false,
        handle: '',
        hashtags: [],
      },
    },
    includeImages: true,
    includeFacts: true,
    connectToWeb: false,
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={formData}
      >
        {/* Topic */}
        <Form.Item
          label="文章主题"
          required
          rules={[{ required: true, message: '请输入文章主题' }]}
        >
          <Input
            size="large"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="例如：人工智能在内容营销中的应用"
          />
        </Form.Item>

        {/* Keywords */}
        <Form.Item label="目标关键词" required>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              size="large"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onPressEnter={(e) => {
                e.preventDefault();
                handleAddKeyword();
              }}
              placeholder="输入关键词后按回车添加"
              style={{ flex: 1 }}
            />
            <Button size="large" icon={<PlusOutlined />} onClick={handleAddKeyword}>
              添加
            </Button>
          </Space.Compact>
          <div style={{ marginTop: 12 }}>
            {formData.keywords.map((keyword) => (
              <Tag
                key={keyword}
                color="blue"
                closable
                onClose={() => handleRemoveKeyword(keyword)}
                style={{ marginBottom: 8 }}
              >
                {keyword}
              </Tag>
            ))}
          </div>
        </Form.Item>

        {/* Target Audience */}
        <Form.Item label="目标受众">
          <Input
            size="large"
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            placeholder="例如：数字营销人员、内容创作者"
          />
        </Form.Item>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="语言风格">
              <Select
                size="large"
                value={formData.tone}
                onChange={(value) => setFormData({ ...formData, tone: value })}
              >
                <Select.Option value="professional">专业</Select.Option>
                <Select.Option value="casual">轻松</Select.Option>
                <Select.Option value="technical">技术性</Select.Option>
                <Select.Option value="friendly">友好</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="文章长度">
              <Select
                size="large"
                value={formData.length}
                onChange={(value) => setFormData({ ...formData, length: value })}
              >
                <Select.Option value="short">短篇 (约800字)</Select.Option>
                <Select.Option value="medium">中篇 (约1500字)</Select.Option>
                <Select.Option value="long">长篇 (约2500字)</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Options */}
        <Form.Item label="生成选项">
          <Space direction="vertical">
            <Checkbox
              checked={formData.includeImages}
              onChange={(e) => setFormData({ ...formData, includeImages: e.target.checked })}
            >
              生成配图建议
            </Checkbox>
            <Checkbox
              checked={formData.includeFacts}
              onChange={(e) => setFormData({ ...formData, includeFacts: e.target.checked })}
            >
              嵌入事实和证据
            </Checkbox>
            <Checkbox
              checked={formData.connectToWeb}
              onChange={(e) => setFormData({ ...formData, connectToWeb: e.target.checked })}
            >
              <Space>
                <GlobalOutlined />
                Connect to Web (联网搜索最新信息)
              </Space>
            </Checkbox>
          </Space>
        </Form.Item>

        {/* CMS Config */}
        <Card
          title="CMS 配置（WordPress）"
          size="small"
          style={{ marginBottom: 24 }}
        >
          <Form.Item label="站点地址">
            <Input
              value={formData.cms?.siteUrl || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cms: { provider: 'wordpress', ...formData.cms, siteUrl: e.target.value },
                })
              }
              placeholder="https://example.com"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="用户名">
                <Input
                  value={formData.cms?.username || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cms: { provider: 'wordpress', ...formData.cms, username: e.target.value },
                    })
                  }
                  placeholder="wordpress-user"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Application Password">
                <Input.Password
                  value={formData.cms?.applicationPassword || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cms: { provider: 'wordpress', ...formData.cms, applicationPassword: e.target.value },
                    })
                  }
                  placeholder="xxxx xxxx xxxx xxxx"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="默认发布状态">
                <Select
                  value={formData.cms?.defaultStatus || 'draft'}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      cms: { provider: 'wordpress', ...formData.cms, defaultStatus: value },
                    })
                  }
                >
                  <Select.Option value="draft">草稿</Select.Option>
                  <Select.Option value="publish">发布</Select.Option>
                  <Select.Option value="private">私有</Select.Option>
                  <Select.Option value="pending">待审核</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="默认分类">
                <Input
                  value={formData.cms?.defaultCategory || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cms: { provider: 'wordpress', ...formData.cms, defaultCategory: e.target.value },
                    })
                  }
                  placeholder="内容营销"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="默认标签（逗号分隔）">
            <Input
              value={formData.cms?.defaultTags?.join(', ') || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cms: {
                    provider: 'wordpress',
                    ...formData.cms,
                    defaultTags: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
                  },
                })
              }
              placeholder="AI, 内容营销, SEO"
            />
          </Form.Item>
        </Card>

        {/* Social Config */}
        <Card
          title="社交媒体文案配置"
          size="small"
          style={{ marginBottom: 24 }}
        >
          {/* Twitter */}
          <div style={{ marginBottom: 16 }}>
            <Checkbox
              checked={formData.social?.twitter?.enabled || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  social: {
                    ...formData.social,
                    twitter: { ...formData.social?.twitter, enabled: e.target.checked },
                  },
                })
              }
            >
              <Space>
                <TwitterOutlined />
                Twitter
              </Space>
            </Checkbox>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col xs={24} md={12}>
                <Input
                  value={formData.social?.twitter?.handle || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social: {
                        ...formData.social,
                        twitter: { ...formData.social?.twitter, handle: e.target.value },
                      },
                    })
                  }
                  placeholder="@brand"
                />
              </Col>
              <Col xs={24} md={12}>
                <Input
                  value={formData.social?.twitter?.hashtags?.join(', ') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social: {
                        ...formData.social,
                        twitter: {
                          ...formData.social?.twitter,
                          hashtags: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
                        },
                      },
                    })
                  }
                  placeholder="话题标签（逗号分隔）"
                />
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Facebook */}
          <div>
            <Checkbox
              checked={formData.social?.facebook?.enabled || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  social: {
                    ...formData.social,
                    facebook: { ...formData.social?.facebook, enabled: e.target.checked },
                  },
                })
              }
            >
              <Space>
                <FacebookOutlined />
                Facebook
              </Space>
            </Checkbox>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col xs={24} md={12}>
                <Input
                  value={formData.social?.facebook?.handle || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social: {
                        ...formData.social,
                        facebook: { ...formData.social?.facebook, handle: e.target.value },
                      },
                    })
                  }
                  placeholder="@brand"
                />
              </Col>
              <Col xs={24} md={12}>
                <Input
                  value={formData.social?.facebook?.hashtags?.join(', ') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social: {
                        ...formData.social,
                        facebook: {
                          ...formData.social?.facebook,
                          hashtags: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
                        },
                      },
                    })
                  }
                  placeholder="话题标签（逗号分隔）"
                />
              </Col>
            </Row>
          </div>
        </Card>

        {/* Error */}
        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Submit */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            disabled={formData.keywords.length === 0 || !formData.topic}
            icon={<SendOutlined />}
          >
            {loading ? '生成中...' : '生成文章'}
          </Button>
        </Form.Item>
      </Form>

      {/* Result */}
      {result && (
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="文章生成成功！"
          subTitle={`文章ID: ${result.article?.id}`}
          extra={[
            <Link key="view" href={`/articles/${result.article?.slug}`}>
              <Button type="primary" size="large">
                查看文章
              </Button>
            </Link>,
          ]}
        />
      )}
    </div>
  );
}
