'use client';

import Link from 'next/link';
import { Typography, Button, Card, Row, Col, Space } from 'antd';
import {
  RobotOutlined,
  BarChartOutlined,
  SearchOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
  ArrowRightOutlined,
  EditOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const features = [
  {
    icon: <RobotOutlined style={{ fontSize: 28 }} />,
    title: 'AI驱动的内容生成',
    description: '输入关键词，AI自动分析搜索意图并生成高质量文章',
    color: '#1677ff',
  },
  {
    icon: <BarChartOutlined style={{ fontSize: 28 }} />,
    title: '自动SERP分析',
    description: '了解用户搜索意图，获取与目标受众共鸣的内容推荐',
    color: '#722ed1',
  },
  {
    icon: <SearchOutlined style={{ fontSize: 28 }} />,
    title: 'SEO优化',
    description: '自动关键词嵌入、链接插入、元标签生成等全方位SEO优化',
    color: '#52c41a',
  },
  {
    icon: <RiseOutlined style={{ fontSize: 28 }} />,
    title: '热门话题发现',
    description: '识别并利用当前趋势，创建相关且引人入胜的内容',
    color: '#fa8c16',
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 28 }} />,
    title: '质量评分',
    description: '基于Google E-E-A-T原则评估文章质量和可信度',
    color: '#13c2c2',
  },
  {
    icon: <MobileOutlined style={{ fontSize: 28 }} />,
    title: '移动优化',
    description: '响应式设计，PWA支持，确保完美的移动体验',
    color: '#eb2f96',
  },
];

export default function Home() {
  return (
    <div style={{ padding: '48px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <Title
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              marginBottom: 24,
              background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            轻松生成高质量文章
          </Title>
          <Paragraph
            style={{
              fontSize: 18,
              color: 'rgba(0, 0, 0, 0.65)',
              maxWidth: 600,
              margin: '0 auto 32px',
            }}
          >
            AI驱动的内容生成，自动SEO优化，让您的博客脱颖而出
          </Paragraph>
          <Space size="middle" wrap style={{ justifyContent: 'center' }}>
            <Link href="/generate">
              <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                开始生成文章
              </Button>
            </Link>
            <Link href="/editor">
              <Button size="large" icon={<EditOutlined />}>
                打开SEO编辑器
              </Button>
            </Link>
            <Link href="/articles">
              <Button size="large" type="default">
                查看示例
              </Button>
            </Link>
          </Space>
        </div>

        {/* Features Grid */}
        <Row gutter={[24, 24]} style={{ marginBottom: 80 }}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  borderRadius: 16,
                  transition: 'all 0.3s ease',
                }}
                styles={{
                  body: { padding: 24 },
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `${feature.color}15`,
                    color: feature.color,
                    marginBottom: 16,
                  }}
                >
                  {feature.icon}
                </div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  {feature.title}
                </Title>
                <Paragraph type="secondary" style={{ margin: 0 }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        {/* CTA Section */}
        <Card
          style={{
            background: 'linear-gradient(135deg, #e6f4ff 0%, #f9f0ff 100%)',
            border: 'none',
            borderRadius: 16,
            textAlign: 'center',
            padding: '32px 24px',
          }}
        >
          <Title level={3} style={{ marginBottom: 16 }}>
            准备好开始了吗？
          </Title>
          <Paragraph type="secondary" style={{ maxWidth: 500, margin: '0 auto 24px' }}>
            支持Claude和OpenAI，轻量化部署，完全免费使用
          </Paragraph>
          <Link href="/generate">
            <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
              立即开始
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
