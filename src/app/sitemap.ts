import { MetadataRoute } from 'next';
import { loadAllArticles } from '@/lib/storage/articles';
import config from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await loadAllArticles();

  const articleUrls = articles.map((article) => ({
    url: `${config.site.url}/articles/${article.slug}`,
    lastModified: new Date(article.lastModified),
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
