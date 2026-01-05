'use client';

import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import { Build, AutoAwesome, Edit, Article } from '@mui/icons-material';

const tools = [
  {
    title: 'AI文章生成',
    description: '输入关键词，快速生成SEO优化的完整文章草稿。',
    href: '/generate',
    icon: AutoAwesome,
  },
  {
    title: 'SEO编辑器',
    description: '在编辑器中优化标题、关键词与结构，完善内容质量。',
    href: '/editor',
    icon: Edit,
  },
  {
    title: '文章示例库',
    description: '查看已生成的文章示例，了解最佳实践。',
    href: '/articles',
    icon: Article,
  },
];

export default function ToolsPage() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Box textAlign="center">
            <Build sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              SEO工具中心
            </Typography>
            <Typography variant="body1" color="text.secondary">
              选择一个工具开始高效内容创作与优化
            </Typography>
          </Box>

          <Divider />

          <Stack spacing={2}>
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.title} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'primary.50',
                        }}
                      >
                        <Icon sx={{ color: 'primary.main' }} />
                      </Box>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {tool.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tool.description}
                        </Typography>
                      </Box>
                      <Button component={Link} href={tool.href} variant="contained" aria-label={`打开${tool.title}`}>
                        打开
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}