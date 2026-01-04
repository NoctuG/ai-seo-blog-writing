import Link from 'next/link';
import { loadAllArticles, formatDate, estimateReadingTime } from '@/utils/article';

export const metadata = {
  title: '文章列表',
  description: '浏览所有AI生成的SEO优化文章',
};

export default async function ArticlesPage() {
  const articles = await loadAllArticles();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">文章列表</h1>
          <p className="text-gray-600">共 {articles.length} 篇文章</p>
        </div>

        {articles.length === 0 ? (
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

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {article.keywords.slice(0, 3).map((keyword) => (
                    <span key={keyword} className="badge badge-blue text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{formatDate(article.publishDate)}</span>
                  <span>{estimateReadingTime(article.content)} 分钟阅读</span>
                </div>

                {article.seoScore && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SEO评分</span>
                      <span
                        className={`text-lg font-bold ${
                          article.seoScore.overall >= 0.8
                            ? 'text-green-600'
                            : article.seoScore.overall >= 0.6
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {Math.round(article.seoScore.overall * 100)}
                      </span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
