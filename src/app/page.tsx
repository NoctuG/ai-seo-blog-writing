'use client';

import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
} from '@mui/material';
import {
  SmartToy,
  Analytics,
  Search,
  TrendingUp,
  Verified,
  PhoneIphone,
  ArrowForward,
  Edit,
} from '@mui/icons-material';

const features = [
  {
    icon: SmartToy,
    title: 'AI驱动的内容生成',
    description: '输入关键词，AI自动分析搜索意图并生成高质量文章',
    color: '#1976d2',
  },
  {
    icon: Analytics,
    title: '自动SERP分析',
    description: '了解用户搜索意图，获取与目标受众共鸣的内容推荐',
    color: '#9c27b0',
  },
  {
    icon: Search,
    title: 'SEO优化',
    description: '自动关键词嵌入、链接插入、元标签生成等全方位SEO优化',
    color: '#2e7d32',
  },
  {
    icon: TrendingUp,
    title: '热门话题发现',
    description: '识别并利用当前趋势，创建相关且引人入胜的内容',
    color: '#ed6c02',
  },
  {
    icon: Verified,
    title: '质量评分',
    description: '基于Google E-E-A-T原则评估文章质量和可信度',
    color: '#0288d1',
  },
  {
    icon: PhoneIphone,
    title: '移动优化',
    description: '响应式设计，PWA支持，确保完美的移动体验',
    color: '#d32f2f',
  },
];

export default function Home() {
  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            轻松生成高质量文章
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto', fontWeight: 400 }}
          >
            AI驱动的内容生成，自动SEO优化，让您的博客脱颖而出
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              component={Link}
              href="/generate"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              开始生成文章
            </Button>
            <Button
              component={Link}
              href="/editor"
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Edit />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              打开SEO编辑器
            </Button>
            <Button
              component={Link}
              href="/articles"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              查看示例
            </Button>
          </Stack>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={3} sx={{ mb: { xs: 6, md: 10 } }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                      borderColor: feature.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${feature.color}15`,
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 28, color: feature.color }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* CTA Section */}
        <Card
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            border: 'none',
            textAlign: 'center',
            p: { xs: 4, md: 6 },
          }}
        >
          <Typography variant="h4" fontWeight={700} gutterBottom>
            准备好开始了吗？
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}
          >
            支持Claude和OpenAI，轻量化部署，完全免费使用
          </Typography>
          <Button
            component={Link}
            href="/generate"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            立即开始
          </Button>
        </Card>
      </Container>
    </Box>
  );
}
