import { NextResponse } from 'next/server';
import { loadArticlesPage } from '@/utils/article';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '12');
    const { articles, total } = await loadArticlesPage(page, limit);

    return NextResponse.json({
      articles,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error loading articles:', error);
    return NextResponse.json(
      { error: '加载文章列表失败' },
      { status: 500 }
    );
  }
}
