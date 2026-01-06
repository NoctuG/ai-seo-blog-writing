import { MetadataRoute } from 'next';
// 采纳 Codex 分支：引入 loadArticleIndex 以匹配下方的函数调用
import { loadArticleIndex } from '@/utils/article';
import config from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 这里使用了 loadArticleIndex，所以必须保留上面的对应 import
  const articles = await loadArticleIndex();

  const articleUrls = articles.map((article) => ({
    url: `${config.site.url}/articles/${article.slug}`,
    lastModified: new Date(article.publishDate),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: config.site.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${config.site.url}/generate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${config.site.url}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...articleUrls,
  ];
}