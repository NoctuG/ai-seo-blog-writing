// Application configuration
export const config = {
  site: {
    name: process.env.SITE_NAME || 'AI SEO Blog Generator',
    description: process.env.SITE_DESCRIPTION || 'AI-powered blog generation with automatic SEO optimization',
    url: process.env.SITE_URL || 'http://localhost:3000',
    author: 'AI SEO Blog Generator',
    language: process.env.DEFAULT_LANGUAGE || 'zh-CN',
  },

  ai: {
    defaultProvider: (process.env.DEFAULT_AI_SERVICE || 'claude') as 'claude' | 'openai',
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      baseUrl: process.env.ANTHROPIC_BASE_URL || '',
      model: 'claude-3-5-sonnet-20241022',
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      baseUrl: process.env.OPENAI_BASE_URL || '',
      model: 'gpt-4-turbo-preview',
    },
  },

  auth: {
    username: process.env.AUTH_USERNAME || 'admin',
    password: process.env.AUTH_PASSWORD || '',
  },

  content: {
    maxArticleLength: parseInt(process.env.MAX_ARTICLE_LENGTH || '3000'),
    defaultTone: 'professional' as const,
    supportedLanguages: ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'],
  },

  seo: {
    minKeywordDensity: 0.5,
    maxKeywordDensity: 2.5,
    minContentLength: 300,
    optimalContentLength: 1500,
    minInternalLinks: 2,
    minExternalLinks: 1,
  },

  images: {
    formats: ['image/avif', 'image/webp', 'image/jpeg'],
    sizes: {
      thumbnail: { width: 400, height: 300 },
      medium: { width: 800, height: 600 },
      large: { width: 1200, height: 900 },
      cover: { width: 1920, height: 1080 },
    },
  },

  search: {
    googleApiKey: process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || '',
    googleEngineId: process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID || '',
  },

  paths: {
    articles: 'data/articles',
    images: 'public/images',
    generatedImages: 'public/images/generated',
  },
};

export default config;
