# AI SEO Blog Writing

基于 AI 的 SEO 博客生成系统，支持 Claude 和 OpenAI，具备自动内容优化和 SEO 分析功能。

## ✨ 核心功能

- 🤖 **多 AI 支持** - 支持 Claude 和 OpenAI，可自由切换
- 🔍 **SEO 优化** - 自动关键词优化、密度分析和质量评分
- 📊 **SERP 分析** - 搜索意图分析和内容策略建议
- 🌐 **联网生成** - OpenAI 模型支持联网搜索实时信息
- 🎯 **品牌定制** - 支持自定义品牌信息、语气和语言
- 📝 **结构化输出** - 自动生成 Meta 标签、Schema.org 和 Open Graph
- 📈 **E-E-A-T 评分** - 评估内容的专业性、权威性和可信度

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制 `.env.example` 为 `.env` 并配置：

```bash
cp .env.example .env
```

#### 必填配置

```env
# 选择默认 AI 服务
DEFAULT_AI_SERVICE=claude  # 或 openai

# OpenAI 配置
OPENAI_API_KEY=sk-...

# Claude 配置
ANTHROPIC_API_KEY=sk-ant-...
```

#### 可选配置

**自定义 API 端点**（支持 GPTGod 等兼容服务）：

```env
# OpenAI 兼容服务 (系统会自动规范化为 /v1 结尾)
OPENAI_BASE_URL=https://api.gptgod.online/v1

# 支持的输入格式：
# - https://api.gptgod.online/
# - https://api.gptgod.online/v1
# - https://api.gptgod.online/v1/chat/completions

# Claude 自定义端点
ANTHROPIC_BASE_URL=https://api.anthropic.com
```

**站点配置**：

```env
SITE_URL=http://localhost:3000
SITE_NAME=AI SEO Blog Generator
DEFAULT_LANGUAGE=zh-CN
MAX_ARTICLE_LENGTH=3000
```

### 3. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 🌐 联网生成功能

OpenAI 模型支持联网搜索实时信息：

- 在生成请求中设置 `connectToWeb: true`
- 系统自动为模型添加 `net-` 前缀（如 `gpt-4` → `net-gpt-4`）
- 适用于需要最新信息或实时数据的内容生成

**示例**：

```typescript
const result = await aiService.generateArticle(
  "2024年AI发展趋势",
  ["人工智能", "技术趋势"],
  { connectToWeb: true }
);
```

## 📂 项目结构

```
ai-seo-blog-writing/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API 路由
│   │   │   ├── generate/       # 文章生成 API
│   │   │   ├── articles/       # 文章管理 API
│   │   │   └── settings/       # 设置 API
│   │   ├── articles/           # 文章页面
│   │   ├── generate/           # 生成页面
│   │   └── settings/           # 设置页面
│   ├── components/             # React 组件
│   │   ├── ArticleGenerator.tsx
│   │   ├── SEOScoreCard.tsx
│   │   └── NavigationBar.tsx
│   ├── lib/                    # 核心库
│   │   ├── ai/                 # AI 服务
│   │   │   ├── index.ts        # AI 服务主类
│   │   │   └── providers/      # AI 提供商
│   │   │       ├── openai.ts
│   │   │       └── claude.ts
│   │   ├── seo/                # SEO 工具
│   │   │   ├── analyzer.ts     # SEO 分析器
│   │   │   ├── metadata.ts     # 元数据生成
│   │   │   └── sitemap.ts      # Sitemap 生成
│   │   └── config.ts           # 配置管理
│   ├── types/                  # TypeScript 类型定义
│   │   └── index.ts
│   └── utils/                  # 工具函数
│       └── article.ts          # 文章处理工具
├── public/                     # 静态资源
├── data/
│   └── articles/               # 文章存储（JSON）
└── package.json
```

## 🔧 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: React 18, Material-UI, Tailwind CSS
- **AI SDK**:
  - `@anthropic-ai/sdk` - Claude API
  - `openai` - OpenAI API
- **SEO**: 自研 SEO 分析和优化引擎
- **语言**: TypeScript
- **数据存储**: 本地 JSON 文件

## 📊 SEO 功能详解

### 1. SEO 评分系统

- **关键词优化** (25%) - 密度、位置、分布
- **内容质量** (30%) - 长度、结构、可读性
- **技术 SEO** (20%) - 标题、链接、标签
- **用户体验** (25%) - 段落结构、图片、可读性

### 2. E-E-A-T 评估

- **Experience** - 实践经验指标
- **Expertise** - 专业知识深度
- **Authority** - 权威性和引用
- **Trustworthiness** - 可信度评估

### 3. 自动优化建议

系统自动分析文章并提供针对性改进建议，包括：
- 关键词密度优化
- 内容结构调整
- 链接添加建议
- 标题和标签优化

## 🛠️ 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 📄 API 接口

### POST /api/generate

生成 SEO 优化的文章

**请求体**:
```json
{
  "topic": "文章主题",
  "keywords": ["关键词1", "关键词2"],
  "tone": "professional",
  "length": "medium",
  "language": "zh-CN",
  "brandInfo": {
    "name": "品牌名称",
    "description": "品牌描述"
  },
  "connectToWeb": false
}
```

**响应**:
```json
{
  "article": {
    "id": "...",
    "title": "...",
    "content": "...",
    "seoScore": { ... }
  },
  "suggestions": ["建议1", "建议2"],
  "serpAnalysis": { ... }
}
```

## 📝 许可证

MIT License

---

**提示**: 本项目仅用于内容生成和 SEO 优化，请遵守各 AI 服务商的使用条款。
