# AI SEO Blog Writing

AI 驱动的 SEO 博客生成系统，支持 Claude / OpenAI，并可切换是否联网生成内容。

## ✨ 功能概览

- 关键词驱动的文章生成与结构化输出
- SERP 分析与内容建议
- 关键词密度与 SEO 质量评分
- 支持自定义品牌信息与语气、长度、语言
- 支持自定义 AI 服务端点

## 🚀 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 配置环境变量（重点）

复制 `.env.example` 为 `.env`，并按需求配置：

```bash
cp .env.example .env
```

#### ✅ 必填项

- `DEFAULT_AI_SERVICE`：选择默认 AI 服务（`claude` 或 `openai`）
- 对应服务的 API Key

```env
# 选择默认 AI 服务
DEFAULT_AI_SERVICE=openai

# OpenAI API Key
OPENAI_API_KEY=your_openai_key

# Claude API Key（当 DEFAULT_AI_SERVICE=claude 时必填）
ANTHROPIC_API_KEY=your_claude_key
```

#### ✅ OpenAI 自定义 Base URL（支持 GPTGod）

你可以指定 OpenAI 兼容接口的 base_url。下面示例适配 GPTGod 的可用地址（系统会自动规范化）：

```env
# 任意一种都可，建议用 /v1
OPENAI_BASE_URL=https://api.gptgod.online/v1
```

> 支持的输入示例：
> - `https://api.gptgod.online/`
> - `https://api.gptgod.online/v1/`
> - `https://api.gptgod.online/v1/chat/completions`
>
> 系统会自动转为兼容的 base_url（以 `/v1` 结尾）。

> 若调用时开启联网，系统会自动将模型前缀加上 `net-`（例如 `net-gpt-4`）。

#### ✅ 站点配置（可选）

```env
SITE_URL=http://localhost:3000
SITE_NAME=AI SEO Blog Generator
DEFAULT_LANGUAGE=zh-CN
```

### 3) 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 🌐 联网生成（重要说明）

当调用 OpenAI 生成内容时，可以通过参数开启联网：

- `search: true` 开启联网
- `search: false` 关闭联网
- 开启联网时模型会自动变为 `net-` 前缀

示例（伪代码）：

```ts
aiService.generateText("...", "...", { connectToWeb: true })
```

## 📦 项目结构

```
ai-seo-blog-writing/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React 组件
│   ├── lib/                 # AI/SEO 核心库
│   ├── types/               # TypeScript 类型
│   └── utils/               # 工具函数
├── public/
└── package.json
```

## 🧪 开发命令

```bash
npm run type-check
npm run lint
```

## 📄 License

MIT
