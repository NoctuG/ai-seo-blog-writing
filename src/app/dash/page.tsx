'use client';

import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import {
  Article,
  Edit,
  Settings,
  TrendingUp,
  Analytics,
  Add,
} from '@mui/icons-material';

const dashboardCards = [
  {
    icon: Article,
    title: 'Articles',
    description: 'View and manage your published articles',
    link: '/articles',
    color: '#1976d2',
  },
  {
    icon: Edit,
    title: 'Editor',
    description: 'Create and edit content with SEO optimization',
    link: '/editor',
    color: '#9c27b0',
  },
  {
    icon: Add,
    title: 'Generate',
    description: 'Generate new AI-powered content',
    link: '/generate',
    color: '#2e7d32',
  },
  {
    icon: Analytics,
    title: 'Tools',
    description: 'Access SEO tools and utilities',
    link: '/tools',
    color: '#ed6c02',
  },
  {
    icon: Settings,
    title: 'Settings',
    description: 'Configure your preferences',
    link: '/settings',
    color: '#0288d1',
  },
];

export default function DashboardPage() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome to your content creation workspace
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Total Articles
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    0
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                    <Typography variant="caption" color="success.main">
                      Ready to create
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Drafts
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    0
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    No drafts yet
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    SEO Score
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    -
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Create content to see stats
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    -
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Never
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {dashboardCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                        borderColor: card.color,
                      },
                    }}
                    component={Link}
                    href={card.link}
                    style={{ textDecoration: 'none' }}
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
                          backgroundColor: `${card.color}15`,
                          mb: 2,
                        }}
                      >
                        <Icon sx={{ fontSize: 28, color: card.color }} />
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Get Started Section */}
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
            Ready to create amazing content?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
          >
            Start generating SEO-optimized articles with AI assistance. Choose a
            template or create from scratch.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={Link}
              href="/generate"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                },
              }}
            >
              Generate Article
            </Button>
            <Button
              component={Link}
              href="/editor"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#5568d3',
                  backgroundColor: 'rgba(102, 126, 234, 0.04)',
                },
              }}
            >
              Open Editor
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
