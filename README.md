# AI SEO Blog Writing

AI驱动的SEO博客生成系统 - 自动生成高质量、SEO优化的博客文章

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NoctuG/ai-seo-blog-writing&env=ANTHROPIC_API_KEY,OPENAI_API_KEY,DEFAULT_AI_SERVICE&envDescription=AI%20API%20Keys%20Configuration&envLink=https://github.com/NoctuG/ai-seo-blog-writing%23%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/NoctuG/ai-seo-blog-writing)

## 主要功能

- **AI内容生成** - 支持 Claude / OpenAI，自动分析搜索意图生成高质量文章
- **SERP分析** - 了解用户搜索意图，获取内容优化建议
- **SEO优化** - 自动关键词嵌入、链接插入、元标签生成
- **质量评分** - 基于 Google E-E-A-T 原则评估文章质量
- **Material Design** - 现代化的 Material Design 界面

## 技术栈

- Next.js 14+ / TypeScript / Tailwind CSS / Material UI
- Claude API + OpenAI API（支持自定义 Base URL）

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 运行开发服务器
npm run dev
```

## 环境变量

```env
# AI API Keys (至少配置一个)
ANTHROPIC_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key

# 自定义 API 端点 (可选，支持第三方兼容 API)
ANTHROPIC_BASE_URL=
OPENAI_BASE_URL=

# 默认 AI 服务 (claude 或 openai)
DEFAULT_AI_SERVICE=claude

# 认证设置
AUTH_USERNAME=admin
AUTH_PASSWORD=your_password
```

## 项目结构

```
src/
├── app/           # Next.js App Router
├── components/    # React 组件
├── lib/           # 核心库 (AI, SEO)
├── types/         # TypeScript 类型
└── utils/         # 工具函数
```

## License

MIT
