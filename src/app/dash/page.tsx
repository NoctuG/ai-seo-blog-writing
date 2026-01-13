'use client';

import Link from 'next/link';
import { Typography, Card, Row, Col, Statistic, Space, Button } from 'antd';
import {
  FileTextOutlined,
  EditOutlined,
  PlusOutlined,
  ToolOutlined,
  SettingOutlined,
  RiseOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const dashboardCards = [
  {
    icon: <FileTextOutlined style={{ fontSize: 28 }} />,
    title: 'Articles',
    description: 'View and manage your published articles',
    link: '/articles',
    color: '#1677ff',
  },
  {
    icon: <EditOutlined style={{ fontSize: 28 }} />,
    title: 'Editor',
    description: 'Create and edit content with SEO optimization',
    link: '/editor',
    color: '#722ed1',
  },
  {
    icon: <PlusOutlined style={{ fontSize: 28 }} />,
    title: 'Generate',
    description: 'Generate new AI-powered content',
    link: '/generate',
    color: '#52c41a',
  },
  {
    icon: <ToolOutlined style={{ fontSize: 28 }} />,
    title: 'Tools',
    description: 'Access SEO tools and utilities',
    link: '/tools',
    color: '#fa8c16',
  },
  {
    icon: <SettingOutlined style={{ fontSize: 28 }} />,
    title: 'Settings',
    description: 'Configure your preferences',
    link: '/settings',
    color: '#13c2c2',
  },
];

export default function DashboardPage() {
  return (
    <div style={{ padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <Title
            level={2}
            style={{
              marginBottom: 8,
              background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Dashboard
          </Title>
          <Paragraph type="secondary" style={{ fontSize: 16 }}>
            Welcome to your content creation workspace
          </Paragraph>
        </div>

        {/* Quick Stats */}
        <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Articles"
                value={0}
                suffix={
                  <Space style={{ marginLeft: 8 }}>
                    <RiseOutlined style={{ color: '#52c41a', fontSize: 14 }} />
                    <span style={{ color: '#52c41a', fontSize: 12 }}>Ready to create</span>
                  </Space>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Drafts" value={0} />
              <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
                No drafts yet
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="SEO Score" value="-" />
              <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
                Create content to see stats
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Last Updated" value="-" />
              <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
                Never
              </Paragraph>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <div style={{ marginBottom: 48 }}>
          <Title level={4} style={{ marginBottom: 24 }}>
            Quick Actions
          </Title>
          <Row gutter={[24, 24]}>
            {dashboardCards.map((card, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Link href={card.link} style={{ textDecoration: 'none' }}>
                  <Card
                    hoverable
                    style={{
                      height: '100%',
                      borderRadius: 12,
                      transition: 'all 0.3s ease',
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
                        backgroundColor: `${card.color}15`,
                        color: card.color,
                        marginBottom: 16,
                      }}
                    >
                      {card.icon}
                    </div>
                    <Title level={5} style={{ marginBottom: 8 }}>
                      {card.title}
                    </Title>
                    <Paragraph type="secondary" style={{ margin: 0 }}>
                      {card.description}
                    </Paragraph>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>

        {/* Get Started Section */}
        <Card
          style={{
            background: 'linear-gradient(135deg, #e6f4ff 0%, #f9f0ff 100%)',
            border: 'none',
            borderRadius: 16,
            textAlign: 'center',
            padding: '24px',
          }}
        >
          <Title level={3} style={{ marginBottom: 16 }}>
            Ready to create amazing content?
          </Title>
          <Paragraph
            type="secondary"
            style={{ maxWidth: 600, margin: '0 auto 24px' }}
          >
            Start generating SEO-optimized articles with AI assistance. Choose a
            template or create from scratch.
          </Paragraph>
          <Space size="middle" wrap style={{ justifyContent: 'center' }}>
            <Link href="/generate">
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
                  border: 'none',
                }}
              >
                Generate Article
              </Button>
            </Link>
            <Link href="/editor">
              <Button size="large">Open Editor</Button>
            </Link>
          </Space>
        </Card>
      </div>
    </div>
  );
}
