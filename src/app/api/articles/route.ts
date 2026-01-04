import { NextResponse } from 'next/server';
import { loadAllArticles } from '@/utils/article';

export async function GET() {
  try {
    const articles = await loadAllArticles();

    return NextResponse.json({
      articles,
      total: articles.length,
    });
  } catch (error) {
    console.error('Error loading articles:', error);
    return NextResponse.json(
      { error: '加载文章列表失败' },
      { status: 500 }
    );
  }
}
