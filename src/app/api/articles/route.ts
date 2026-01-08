import { NextRequest, NextResponse } from 'next/server';
// 采纳 Codex 分支：引入支持分页的函数，以匹配下方的分页逻辑
import { loadArticlesPage } from '@/utils/article';

// 强制该API路由为动态渲染，避免静态构建时的searchParams错误
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '12');
    
    // 使用分页函数获取数据
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