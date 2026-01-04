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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">文章列表</h1>
            <p className="text-gray-600">共 {articles.length} 篇文章</p>
          </div>
          <Link
            href="/editor/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            ✏️ 新建文章
          </Link>
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
                <div className="flex items-start justify-between mb-3">
                  <Link href={`/articles/${article.slug}`} className="flex-1">
                    <h2 className="text-xl font-bold hover:text-blue-600">
                      {article.title}
                    </h2>
                  </Link>
                  <Link
                    href={`/editor/${article.id}`}
                    className="text-gray-400 hover:text-blue-600 transition-colors ml-2"
                    title="编辑文章"
                  >
                    ✏️
                  </Link>
                </div>

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

                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>{formatDate(article.publishDate)}</span>
                  <span>{estimateReadingTime(article.content)} 分钟阅读</span>
                </div>

                {article.status && (
                  <div className="mb-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : article.status === 'review'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {article.status === 'published' ? '已发布' : article.status === 'review' ? '待审核' : '草稿'}
                    </span>
                  </div>
                )}

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
