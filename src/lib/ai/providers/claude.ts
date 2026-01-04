import Anthropic from '@anthropic-ai/sdk';
import { AIConfig } from '@/types';
import config from '@/lib/config';

export class ClaudeProvider {
  private client: Anthropic;

  constructor(aiConfig?: AIConfig) {
    const apiKey = aiConfig?.apiKey || config.ai.anthropic.apiKey;

    if (!apiKey) {
      throw new Error('Claude API key is required');
    }

    this.client = new Anthropic({
      apiKey,
    });
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: config.ai.anthropic.model,
        max_tokens: 4096,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response format from Claude');
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(`Claude generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateArticle(
    topic: string,
    keywords: string[],
    options: {
      tone?: string;
      length?: string;
      language?: string;
      brandInfo?: any;
      includeConclusion?: boolean;
      includeTables?: boolean;
      includeLists?: boolean;
      includeKeyTakeaways?: boolean;
      includeFAQs?: boolean;
    } = {}
  ): Promise<string> {
    const includeConclusion = options.includeConclusion ?? true;
    const includeTables = options.includeTables ?? false;
    const includeLists = options.includeLists ?? true;
    const includeKeyTakeaways = options.includeKeyTakeaways ?? true;
    const includeFAQs = options.includeFAQs ?? false;

    const systemPrompt = `你是一个专业的SEO内容写作专家。你的任务是创建高质量、SEO优化的博客文章。

要求：
- 内容必须原创、有价值、引人入胜
- 自然地融入关键词，避免过度优化
- 使用清晰的标题结构（H1, H2, H3）
- 包含实用的信息和见解
- 语言风格：${options.tone || '专业'}
- 文章长度：${options.length || '中等'} (约1500-2000字)
- 语言：${options.language || 'zh-CN'}`;

    const structureSections = [
      '## 简介\n[引人入胜的开场，介绍主题]',
      '## [主要章节1]\n[详细内容]',
      '### [子章节1.1]\n[详细内容]',
      '### [子章节1.2]\n[详细内容]',
      '## [主要章节2]\n[详细内容]',
      includeLists ? '## 列表\n[使用项目符号或编号列出关键点]' : null,
      includeTables
        ? '## 表格\n[用Markdown表格展示关键数据；如暂无具体数据，提供合理占位符表格]'
        : null,
      includeKeyTakeaways ? '## 关键要点\n[3-6条简洁要点]' : null,
      includeFAQs ? '## 常见问题（FAQs）\nQ: 问题1\nA: 回答1\n\nQ: 问题2\nA: 回答2' : null,
      includeConclusion ? '## 结论\n[总结要点，提供行动建议]' : null,
    ].filter(Boolean);

    const prompt = `请为以下主题创建一篇博客文章：

主题：${topic}

目标关键词：${keywords.join(', ')}

${options.brandInfo ? `品牌信息：
- 品牌名称：${options.brandInfo.name}
- 品牌描述：${options.brandInfo.description || ''}
- 产品/服务：${options.brandInfo.products?.join(', ') || ''}
` : ''}

请按照以下格式输出文章：

# [文章标题]

${structureSections.join('\n\n')}

请确保文章：
1. 自然融入所有目标关键词
2. 提供实用价值
3. 结构清晰，易于阅读
4. 包含具体例子和事实
5. SEO友好但不过度优化`;

    return this.generateText(prompt, systemPrompt);
  }

  async analyzeSERP(keyword: string): Promise<any> {
    const systemPrompt = '你是一个SEO分析专家，擅长分析搜索引擎结果页面（SERP）和用户搜索意图。';

    const prompt = `请分析关键词 "${keyword}" 的搜索意图和内容策略：

1. 搜索意图分类（信息型/导航型/交易型/商业调查型）
2. 用户最可能寻找什么信息
3. 推荐的内容结构
4. 相关长尾关键词（5-10个）
5. 内容创作建议

请以JSON格式输出分析结果。`;

    const response = await this.generateText(prompt, systemPrompt);

    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, return structured text
    }

    return {
      searchIntent: '需要人工分析',
      analysis: response,
    };
  }

  async improveContent(content: string, improvements: string[]): Promise<string> {
    const systemPrompt = '你是一个内容优化专家，专注于提升文章质量和SEO效果。';

    const prompt = `请根据以下改进建议优化文章内容：

原始内容：
${content}

改进建议：
${improvements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}

请输出优化后的完整文章内容。`;

    return this.generateText(prompt, systemPrompt);
  }
}
