import { NextRequest, NextResponse } from 'next/server';
import { Article } from '@/types';
import { saveArticle, generateArticleId, generateSlug } from '@/utils/article';

export async function POST(request: NextRequest) {
  try {
    const articleData: Partial<Article> = await request.json();

    // Generate ID if new article
    if (!articleData.id || articleData.id === 'new') {
      articleData.id = generateArticleId();
    }

    // Generate slug if not provided
    if (!articleData.slug && articleData.title) {
      articleData.slug = generateSlug(articleData.title);
    }

    // Ensure required fields
    const article: Article = {
      id: articleData.id,
      title: articleData.title || '未命名文章',
      slug: articleData.slug || generateSlug(articleData.title || 'untitled'),
      description: articleData.description || '',
      content: articleData.content || '',
      keywords: articleData.keywords || [],
      focusKeyword: articleData.focusKeyword,
      coverImage: articleData.coverImage,
      author: articleData.author,
      publishDate: articleData.publishDate || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: articleData.status || 'draft',
      category: articleData.category,
      tags: articleData.tags || [],
      metadata: {
        metaTitle: articleData.metadata?.metaTitle || articleData.title || '',
        metaDescription: articleData.metadata?.metaDescription || articleData.description || '',
        ogImage: articleData.metadata?.ogImage || articleData.coverImage,
        schemaType: articleData.metadata?.schemaType || 'Article',
        canonicalUrl: articleData.metadata?.canonicalUrl,
        robotsIndex: articleData.metadata?.robotsIndex !== false,
        robotsFollow: articleData.metadata?.robotsFollow !== false,
        schema: articleData.metadata?.schema,
      },
      seoScore: articleData.seoScore,
    };

    // Save article
    await saveArticle(article);

    return NextResponse.json({
      success: true,
      article,
      message: '文章已保存',
    });
  } catch (error) {
    console.error('Save article error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '保存失败',
      },
      { status: 500 }
    );
  }
}
