import { NextRequest, NextResponse } from 'next/server';
import { createAIService } from '@/lib/ai';
import { SEOAnalyzer } from '@/lib/seo/analyzer';
import { MetadataGenerator } from '@/lib/seo/metadata';
import { generateSlug, generateArticleId, saveArticle } from '@/utils/article';
import { Article } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();

    // Validate
    if (!config.topic || !config.keywords || config.keywords.length === 0) {
      return NextResponse.json(
        { error: '请提供主题和至少一个关键词' },
        { status: 400 }
      );
    }

    // Initialize AI
    const aiService = createAIService(config.aiModel);

    // Build enhanced prompt based on config
    const enhancedPrompt = buildEnhancedPrompt(config);

    // Generate content
    const content = await aiService.generateText(enhancedPrompt);

    // Extract title
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : config.topic;

    // Generate metadata
    const slug = generateSlug(title);
    const descriptionMatch = content.match(/##\s+简介\n+([\s\S]+?)(?=\n##|$)/);
    const description = descriptionMatch
      ? descriptionMatch[1].trim().substring(0, 160)
      : `关于${config.topic}的详细介绍`;

    // Create article
    const now = new Date().toISOString();
    const article: Article = {
      id: generateArticleId(),
      title,
      slug,
      description,
      content,
      keywords: config.keywords,
      publishDate: config.postDate ? new Date(config.postDate).toISOString() : now,
      lastModified: now,
      category: config.articleType || '未分类',
      tags: config.keywords,
      metadata: {
        metaTitle: title,
        metaDescription: description,
      },
    };

    // Generate full metadata
    const metadataGenerator = new MetadataGenerator();
    article.metadata = metadataGenerator.generateMetadata(article);

    // SEO Analysis
    const seoAnalyzer = new SEOAnalyzer();
    article.seoScore = seoAnalyzer.analyzeArticle(content, config.keywords, title);

    // Save
    await saveArticle(article);

    // Generate suggestions
    const suggestions = article.seoScore
      ? seoAnalyzer.generateSuggestions(article.seoScore)
      : [];

    // Syndication info (if enabled)
    const syndication = {
      twitter: config.twitterPost,
      linkedin: config.linkedinPost,
      facebook: config.facebookPost,
      email: config.emailNewsletter,
      pinterest: config.pinterestPin,
    };

    return NextResponse.json({
      article,
      suggestions,
      syndication,
      message: '文章生成成功！',
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '生成文章时出错，请重试',
      },
      { status: 500 }
    );
  }
}

function buildEnhancedPrompt(config: any): string {
  const sections = [];

  // System prompt
  sections.push(`你是一个专业的SEO内容写作专家。请根据以下详细要求创建一篇高质量的${config.articleType}类型文章。`);

  // Topic
  sections.push(`\n## 文章主题\n${config.topic}`);

  // Keywords
  sections.push(`\n## 目标关键词\n${config.keywords.join(', ')}`);
  if (config.focusKeyword) {
    sections.push(`主要焦点关键词：${config.focusKeyword}`);
  }

  // Brand Voice
  sections.push(`\n## 语言风格\n${config.tone}`);
  if (config.brandVoiceCustom) {
    sections.push(`品牌特色：${config.brandVoiceCustom}`);
  }

  // Custom Details
  if (config.customDetails) {
    sections.push(`\n## 必须包含的信息\n${config.customDetails}`);
  }

  // Structure
  if (config.introductionBrief) {
    sections.push(`\n## 引言要求\n${config.introductionBrief}`);
  }

  if (config.h2Topics && config.h2Topics.length > 0) {
    sections.push(`\n## 主要章节（H2）\n${config.h2Topics.map((t: string, i: number) => `${i + 1}. ${t}`).join('\n')}`);
  }

  if (config.h3Topics && config.h3Topics.length > 0) {
    sections.push(`\n## 子章节（H3）建议\n${config.h3Topics.join(', ')}`);
  }

  if (config.listsInclude) {
    sections.push('\n## 格式要求\n- 使用列表和要点提高可读性');
  }

  if (config.conclusion) {
    sections.push(`\n## 结论要求\n${config.conclusion}`);
  }

  // Media
  if (config.imageCount > 0) {
    sections.push(`\n## 图片要求\n- 在合适位置添加${config.imageCount}个图片占位符`);
    sections.push(`- 图片风格：${config.imageStyle}`);
  }

  // Linking
  if (config.internalLinks && config.internalLinks.length > 0) {
    sections.push(`\n## 内部链接\n建议链接到这些相关文章：\n${config.internalLinks.join('\n')}`);
  }

  if (config.externalLinkType === 'auto') {
    sections.push('\n## 外部链接\n添加2-3个权威来源的引用链接');
  }

  // Technical requirements
  sections.push(`\n## 技术要求
- 语言：${config.targetLanguage}
- 目标地区：${config.targetCountry}
- 文章长度：${getLengthByType(config.articleType)}
- SEO优化：自然融入关键词，保持密度在0.5%-2.5%
- 结构：使用清晰的H1/H2/H3标题层级
- 可读性：段落简洁，每段不超过100字`);

  // Output format
  sections.push(`\n## 输出格式
请按照Markdown格式输出完整文章，包括：
1. H1标题（文章标题）
2. 简介段落
3. 主要内容（使用H2、H3标题）
4. 结论总结
5. 自然融入所有关键词
6. 在合适位置添加图片占位符：![图片描述](image-placeholder.jpg)`);

  return sections.join('\n');
}

function getLengthByType(type: string): string {
  const lengthMap: { [key: string]: string } = {
    'blog-post': '1500-2000字',
    'how-to': '2000-2500字',
    'listicle': '1200-1800字',
    'comparison': '2000-3000字',
    'review': '1500-2000字',
    'news': '800-1200字',
    'case-study': '2500-3500字',
  };
  return lengthMap[type] || '1500-2000字';
}
