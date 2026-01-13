'use client';

import Link from 'next/link';
import { Typography, Card, Button, Divider, Space, Row, Col } from 'antd';
import { ToolOutlined, RocketOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const tools = [
  {
    title: 'AI文章生成',
    description: '输入关键词，快速生成SEO优化的完整文章草稿。',
    href: '/generate',
    icon: <RocketOutlined style={{ fontSize: 24 }} />,
    color: '#1677ff',
  },
  {
    title: 'SEO编辑器',
    description: '在编辑器中优化标题、关键词与结构，完善内容质量。',
    href: '/editor',
    icon: <EditOutlined style={{ fontSize: 24 }} />,
    color: '#722ed1',
  },
  {
    title: '文章示例库',
    description: '查看已生成的文章示例，了解最佳实践。',
    href: '/articles',
    icon: <FileTextOutlined style={{ fontSize: 24 }} />,
    color: '#52c41a',
  },
];

export default function ToolsPage() {
  return (
    <div style={{ padding: '48px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <ToolOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
          <Title level={2}>SEO工具中心</Title>
          <Paragraph type="secondary">
            选择一个工具开始高效内容创作与优化
          </Paragraph>
        </div>

        <Divider />

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {tools.map((tool) => (
            <Card key={tool.title} style={{ borderRadius: 12 }}>
              <Row gutter={16} align="middle">
                <Col xs={24} sm={4}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${tool.color}15`,
                      color: tool.color,
                      marginBottom: 16,
                    }}
                  >
                    {tool.icon}
                  </div>
                </Col>
                <Col xs={24} sm={14}>
                  <Title level={5} style={{ marginBottom: 4 }}>
                    {tool.title}
                  </Title>
                  <Paragraph type="secondary" style={{ margin: 0 }}>
                    {tool.description}
                  </Paragraph>
                </Col>
                <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
                  <Link href={tool.href}>
                    <Button type="primary">打开</Button>
                  </Link>
                </Col>
              </Row>
            </Card>
          ))}
        </Space>
      </div>
    </div>
  );
}
