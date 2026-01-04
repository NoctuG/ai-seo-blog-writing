import { NextRequest, NextResponse } from 'next/server';
import { createAIService } from '@/lib/ai';
import { SEOAnalyzer } from '@/lib/seo/analyzer';
import { MetadataGenerator } from '@/lib/seo/metadata';
import { generateSlug, generateArticleId, saveArticle } from '@/utils/article';
import { Article, ContentGenerationRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ContentGenerationRequest = await request.json();

    // Validate input
    if (!body.topic || !body.keywords || body.keywords.length === 0) {
      return NextResponse.json(
        { error: '请提供主题和至少一个关键词' },
        { status: 400 }
      );
    }

    // Initialize AI service
    const aiService = createAIService();

    // Generate article content
    const content = await aiService.generateArticle(body.topic, body.keywords, {
      tone: body.tone,
      length: body.length,
      language: body.language,
      brandInfo: body.brandInfo,
    });

    // Extract title from content (first H1)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : body.topic;

    // Generate slug
    const slug = generateSlug(title);

    // Extract description
    const descriptionMatch = content.match(/##\s+简介\n+([\s\S]+?)(?=\n##|$)/);
    const description = descriptionMatch
      ? descriptionMatch[1].trim().substring(0, 160)
      : `关于${body.topic}的详细介绍`;

    // Create article object
    const now = new Date().toISOString();
    const article: Article = {
      id: generateArticleId(),
      title,
      slug,
      description,
      content,
      keywords: body.keywords,
      publishDate: now,
      lastModified: now,
      category: body.targetAudience || '未分类',
      tags: body.keywords,
      metadata: {
        metaTitle: title,
        metaDescription: description,
      },
    };

    // Generate metadata
    const metadataGenerator = new MetadataGenerator();
    article.metadata = metadataGenerator.generateMetadata(article);

    // Analyze SEO
    const seoAnalyzer = new SEOAnalyzer();
    article.seoScore = seoAnalyzer.analyzeArticle(content, body.keywords, title);

    // Save article
    await saveArticle(article);

    // Generate suggestions
    const suggestions = article.seoScore
      ? seoAnalyzer.generateSuggestions(article.seoScore)
      : [];

    // Optionally analyze SERP for the main keyword
    let serpAnalysis;
    if (body.keywords.length > 0) {
      try {
        serpAnalysis = await aiService.analyzeSERP(body.keywords[0]);
      } catch (error) {
        console.error('SERP analysis failed:', error);
      }
    }

    return NextResponse.json({
      article,
      suggestions,
      serpAnalysis,
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
