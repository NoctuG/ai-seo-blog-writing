# AI SEO Blog Writing

AI驱动的SEO博客生成系统 - 自动生成高质量、SEO优化的博客文章

## 🚀 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ai-seo-blog-writing)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/ai-seo-blog-writing)

## ✨ 主要功能

### 轻松生成高质量文章

1. **AI驱动的内容生成**: 输入您的关键词或主题，本程序将分析搜索意图，从网络上提取相关信息，生成用户友好且高转化率的博客文章。
2. **自动SERP分析**: 了解用户搜索意图，获取与目标受众共鸣的内容推荐。
3. **热门话题发现**: 识别并利用当前趋势，创建相关且引人入胜的内容。
4. **事实与证据嵌入**: 自动整合相关事实与证据，提高内容的可信度和互动性。
5. **品牌和产品整合**: 提示AI包含您的品牌和产品信息，定制您的内容。

### 优化您的内容以最大化可见性

1. **自动关键词嵌入**: 基于SERP分析，自动插入相关关键词，提高内容的搜索引擎排名。
2. **内外链接插入**: 通过自动嵌入内部和外部链接，简化链接构建，增强SEO和用户体验。
3. **封面图片和文章图片生成**: 自动生成引人注目的图片，为您的文章增加视觉吸引力和互动性。
4. **技术SEO优化**: 自动生成站点地图、元标题/描述、URL slug和schema标记，简化技术SEO。
5. **移动优化**: 采用响应式设计优化加载速度和移动友好内容，确保无缝的移动体验。
6. **自定义页面框架**: 通过自定义页眉和页脚，控制博客的外观和风格。

### 使用内置工具和自动SEO优化

- **关键词评分**: 分析竞争对手的关键词策略，比较内容指标，并提供优化建议。
- **页面检查**: 提供全面的SEO检查，确保您的内容符合最佳实践，包括关键词密度、标题标签、内部/外部链接、图片优化等。
- **内容质量评分**: 根据Google的E-E-A-T原则（经验、专业知识、权威、可信度）评估文章质量，以确保内容的可信度和专业性。

### 轻松管理和托管您的博客

1. **用户友好文章编辑器**: 通过支持富媒体和代码嵌入的直观编辑器，创建结构合理、引人入胜的内容。
2. **搜索引擎集成**: 确保您的博客能被Google、Bing和Yandex等主要搜索引擎发现。
3. **社交媒体内容分发**: 无缝分享您的博客文章到Facebook、Twitter和LinkedIn等热门社交媒体平台。

## 🚀 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **AI服务**: Claude API + OpenAI API
- **部署**: Vercel / Netlify / Cloudflare Pages
- **SEO**: 自动sitemap、robots.txt、schema.org
- **PWA**: 完整PWA支持

## 📦 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并配置您的API密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 至少配置一个AI API密钥
ANTHROPIC_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# 选择默认AI服务 (claude 或 openai)
DEFAULT_AI_SERVICE=claude

# 站点配置
SITE_URL=http://localhost:3000
SITE_NAME=AI SEO Blog Generator
```

### 3. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
ai-seo-blog-writing/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API路由
│   │   ├── articles/       # 文章页面
│   │   ├── generate/       # 生成器页面
│   │   └── layout.tsx      # 根布局
│   ├── components/         # React组件
│   ├── lib/                # 核心库
│   │   ├── ai/            # AI服务
│   │   └── seo/           # SEO工具
│   ├── types/             # TypeScript类型
│   └── utils/             # 工具函数
├── public/                # 静态文件
├── data/                  # 数据存储
│   └── articles/         # 文章JSON文件
└── package.json
```

## 🌐 部署

### Vercel部署

1. 推送代码到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署

### Netlify部署

1. 推送代码到GitHub
2. 在Netlify中导入项目
3. 配置环境变量
4. 部署

### Cloudflare Pages部署

1. 推送代码到GitHub
2. 在Cloudflare Pages中导入项目
3. 构建命令: `npm run build`
4. 输出目录: `.next`
5. 配置环境变量
6. 部署

## 🔧 配置说明

### AI服务配置

系统支持两种AI服务：

- **Claude (Anthropic)**: 推荐用于中文内容生成
- **OpenAI**: 支持GPT-4等模型

在 `.env` 中配置 `DEFAULT_AI_SERVICE` 来选择默认服务。

### SEO配置

在 `src/lib/config.ts` 中自定义SEO参数：

```typescript
seo: {
  minKeywordDensity: 0.5,
  maxKeywordDensity: 2.5,
  minContentLength: 300,
  optimalContentLength: 1500,
}
```

## 📊 使用示例

### 1. 生成文章

访问 `/generate` 页面：

1. 输入文章主题
2. 添加3-5个目标关键词
3. 选择语言风格和长度
4. 点击"生成文章"

### 2. 查看SEO评分

文章生成后自动进行SEO分析，包括：

- 关键词优化评分
- 内容质量评分
- 技术SEO评分
- E-E-A-T评分

### 3. 优化文章

根据SEO评分和改进建议优化您的文章。

## 🛠️ 开发

### 类型检查

```bash
npm run type-check
```

### 代码检查

```bash
npm run lint
```

## 📄 License

MIT

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📧 支持

如有问题，请提交Issue或联系开发团队。

---

**AI SEO Blog Generator** - 让SEO内容创作变得简单高效
