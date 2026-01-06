import Link from 'next/link';
import { loadArticlesPage, formatDate } from '@/utils/article';

export const metadata = {
  title: '文章列表',
  description: '浏览所有AI生成的SEO优化文章',
};

interface ArticlesPageProps {
  searchParams?: {
    page?: string;
    limit?: string;
  };
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const page = Number(searchParams?.page ?? '1');
  const limit = Number(searchParams?.limit ?? '12');
  const { articles, total } = await loadArticlesPage(page, limit);
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;
  const currentPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">文章列表</h1>
          <p className="text-gray-600">共 {total} 篇文章</p>
        </div>

        {total === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">还没有文章</p>
            <Link href="/generate" className="btn btn-primary">
              创建第一篇文章
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article key={article.id} className="card hover:shadow-lg transition-shadow">
                <Link href={`/articles/${article.slug}`}>
                  <h2 className="text-xl font-bold mb-2 hover:text-blue-600">
                    {article.title}
                  </h2>
                </Link>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{formatDate(article.publishDate)}</span>
                  <span>查看详情</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link
              href={`/articles?page=${Math.max(1, currentPage - 1)}&limit=${safeLimit}`}
              className={`btn btn-outline ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
            >
              上一页
            </Link>
            <span className="text-sm text-gray-600">
              第 {currentPage} / {totalPages} 页
            </span>
            <Link
              href={`/articles?page=${Math.min(totalPages, currentPage + 1)}&limit=${safeLimit}`}
              className={`btn btn-outline ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
            >
              下一页
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
