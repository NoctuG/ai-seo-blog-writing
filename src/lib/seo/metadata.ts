import { Article, ArticleMetadata } from '@/types';
import config from '@/lib/config';

export class MetadataGenerator {
  /**
   * Generate article metadata
   */
  generateMetadata(article: Partial<Article>): ArticleMetadata {
    const metaTitle = this.generateMetaTitle(article.title || '');
    const metaDescription = this.generateMetaDescription(article.description || article.content || '');
    const schema = this.generateSchema(article);
    const canonicalUrl = article.slug
      ? `${config.site.url}/articles/${article.slug}`
      : undefined;

    return {
      metaTitle,
      metaDescription,
      ogImage: article.coverImage,
      schema,
      canonicalUrl,
    };
  }

  /**
   * Generate optimized meta title
   */
  private generateMetaTitle(title: string): string {
    // Ensure title is between 30-60 characters
    if (title.length > 60) {
      return title.substring(0, 57) + '...';
    }

    if (title.length < 30) {
      return `${title} | ${config.site.name}`;
    }

    return title;
  }

  /**
   * Generate meta description
   */
  private generateMetaDescription(description: string): string {
    // Clean markdown and HTML
    let cleaned = description
      .replace(/[#*_~`]/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .trim();

    // Ensure description is between 120-160 characters
    if (cleaned.length > 160) {
      cleaned = cleaned.substring(0, 157) + '...';
    }

    return cleaned;
  }

  /**
   * Generate Schema.org JSON-LD
   */
  private generateSchema(article: Partial<Article>): Record<string, any> {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      image: article.coverImage,
      author: {
        '@type': 'Person',
        name: article.author || config.site.author,
      },
      publisher: {
        '@type': 'Organization',
        name: config.site.name,
        logo: {
          '@type': 'ImageObject',
          url: `${config.site.url}/logo.png`,
        },
      },
      datePublished: article.publishDate,
      dateModified: article.lastModified,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': article.slug
          ? `${config.site.url}/articles/${article.slug}`
          : config.site.url,
      },
    };

    // Add keywords if available
    if (article.keywords && article.keywords.length > 0) {
      (schema as any).keywords = article.keywords.join(', ');
    }

    // Add article section/category
    if (article.category) {
      (schema as any).articleSection = article.category;
    }

    return schema;
  }

  /**
   * Generate Open Graph tags
   */
  generateOpenGraphTags(article: Partial<Article>): Record<string, string> {
    return {
      'og:type': 'article',
      'og:title': article.title || '',
      'og:description': article.description || '',
      'og:image': article.coverImage || `${config.site.url}/og-image.png`,
      'og:url': article.slug
        ? `${config.site.url}/articles/${article.slug}`
        : config.site.url,
      'og:site_name': config.site.name,
      'article:published_time': article.publishDate || '',
      'article:modified_time': article.lastModified || '',
      'article:author': article.author || config.site.author,
    };
  }

  /**
   * Generate Twitter Card tags
   */
  generateTwitterCardTags(article: Partial<Article>): Record<string, string> {
    return {
      'twitter:card': 'summary_large_image',
      'twitter:title': article.title || '',
      'twitter:description': article.description || '',
      'twitter:image': article.coverImage || `${config.site.url}/og-image.png`,
    };
  }
}

export default MetadataGenerator;
