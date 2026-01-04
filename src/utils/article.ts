import { Article } from '@/types';
import slugify from 'slugify';
import { promises as fs } from 'fs';
import path from 'path';
import config from '@/lib/config';

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
}

/**
 * Generate unique article ID
 */
export function generateArticleId(): string {
  return `article-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Save article to JSON file
 */
export async function saveArticle(article: Article): Promise<void> {
  const articlesDir = path.join(process.cwd(), config.paths.articles);

  try {
    // Ensure directory exists
    await fs.mkdir(articlesDir, { recursive: true });

    // Save article
    const filePath = path.join(articlesDir, `${article.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(article, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving article:', error);
    throw new Error('Failed to save article');
  }
}

/**
 * Load article from JSON file
 */
export async function loadArticle(id: string): Promise<Article | null> {
  const articlesDir = path.join(process.cwd(), config.paths.articles);
  const filePath = path.join(articlesDir, `${id}.json`);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Article;
  } catch (error) {
    console.error('Error loading article:', error);
    return null;
  }
}

/**
 * Load article by slug
 */
export async function loadArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await loadAllArticles();
  return articles.find(a => a.slug === slug) || null;
}

/**
 * Load all articles
 */
export async function loadAllArticles(): Promise<Article[]> {
  const articlesDir = path.join(process.cwd(), config.paths.articles);

  try {
    const files = await fs.readdir(articlesDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const articles = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(articlesDir, file), 'utf-8');
        return JSON.parse(content) as Article;
      })
    );

    // Sort by publish date (newest first)
    return articles.sort((a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  } catch (error) {
    console.error('Error loading articles:', error);
    return [];
  }
}

/**
 * Delete article
 */
export async function deleteArticle(id: string): Promise<void> {
  const articlesDir = path.join(process.cwd(), config.paths.articles);
  const filePath = path.join(articlesDir, `${id}.json`);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw new Error('Failed to delete article');
  }
}

/**
 * Extract excerpt from content
 */
export function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/[#*_~`]/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + '...';
}

/**
 * Estimate reading time in minutes
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
