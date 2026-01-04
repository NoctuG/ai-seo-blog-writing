import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { loadArticleBySlug, formatDate, estimateReadingTime } from '@/utils/article';
import SEOScoreCard from '@/components/SEOScoreCard';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await loadArticleBySlug(params.slug);

  if (!article) {
    return {
      title: '文章未找到',
    };
  }

  return {
    title: article.metadata.metaTitle,
    description: article.metadata.metaDescription,
    keywords: article.keywords.join(', '),
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishDate,
      modifiedTime: article.lastModified,
      authors: [article.author || ''],
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await loadArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const contentHtml = marked(article.content);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article>
              {/* Header */}
              <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>{formatDate(article.publishDate)}</span>
                  <span>•</span>
                  <span>{estimateReadingTime(article.content)} 分钟阅读</span>
                  {article.category && (
                    <>
                      <span>•</span>
                      <span className="badge badge-blue">{article.category}</span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((keyword) => (
                    <span key={keyword} className="badge badge-green">
                      {keyword}
                    </span>
                  ))}
                </div>
              </header>

              {/* Content */}
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* Schema.org JSON-LD */}
              {article.metadata.schema && (
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(article.metadata.schema),
                  }}
                />
              )}
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {article.seoScore && (
              <div className="sticky top-4">
                <SEOScoreCard score={article.seoScore} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
