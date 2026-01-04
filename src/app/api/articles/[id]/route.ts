import { NextRequest, NextResponse } from 'next/server';
import { loadArticle } from '@/utils/article';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await loadArticle(params.id);

    if (!article) {
      return NextResponse.json(
        { error: '文章未找到' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error('Load article error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '加载失败',
      },
      { status: 500 }
    );
  }
}
