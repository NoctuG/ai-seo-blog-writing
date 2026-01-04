import { SitemapEntry } from '@/types';
import config from '@/lib/config';

export class SitemapGenerator {
  /**
   * Generate sitemap XML
   */
  generateSitemap(entries: SitemapEntry[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const urlsetClose = '</urlset>';

    const urls = entries
      .map(entry => this.generateUrlEntry(entry))
      .join('\n  ');

    return `${xmlHeader}\n${urlsetOpen}\n  ${urls}\n${urlsetClose}`;
  }

  /**
   * Generate single URL entry
   */
  private generateUrlEntry(entry: SitemapEntry): string {
    return `<url>
    <loc>${this.escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(sitemapUrl?: string): string {
    const sitemap = sitemapUrl || `${config.site.url}/sitemap.xml`;

    return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Yandex
Allow: /

Sitemap: ${sitemap}
`;
  }

  /**
   * Create sitemap entry from article
   */
  createEntryFromArticle(slug: string, lastModified: string): SitemapEntry {
    return {
      url: `${config.site.url}/articles/${slug}`,
      lastmod: lastModified,
      changefreq: 'weekly',
      priority: 0.8,
    };
  }
}

export default SitemapGenerator;
