import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import config from '@/lib/config';
import { Article } from '@/types';

export interface ArticleIndexItem {
  id: string;
  title: string;
  slug: string;
  publishDate: string;
}

const indexFileName = 'index.json';

function getArticlesDir(): string {
  return path.join(process.cwd(), config.paths.articles);
}

function sortByPublishDate<T extends { publishDate: string }>(items: T[]): T[] {
  return items.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

async function writeArticleIndex(articlesDir: string, index: ArticleIndexItem[]): Promise<void> {
  const filePath = path.join(articlesDir, indexFileName);
  await fs.writeFile(filePath, JSON.stringify(index, null, 2), 'utf-8');
}

async function buildArticleIndex(articlesDir: string): Promise<ArticleIndexItem[]> {
  const files = await fs.readdir(articlesDir);
  const jsonFiles = files.filter(
    (file) => file.endsWith('.json') && file !== indexFileName
  );

  const articles = await Promise.all(
    jsonFiles.map(async (file) => {
      const content = await fs.readFile(path.join(articlesDir, file), 'utf-8');
      return JSON.parse(content) as Article;
    })
  );

  const index = sortByPublishDate(
    articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      publishDate: article.publishDate,
    }))
  );

  await writeArticleIndex(articlesDir, index);
  return index;
}

export async function loadArticleIndex(): Promise<ArticleIndexItem[]> {
  const articlesDir = getArticlesDir();

  try {
    await fs.mkdir(articlesDir, { recursive: true });
    const filePath = path.join(articlesDir, indexFileName);
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      throw new Error('Article index is not an array');
    }
    return sortByPublishDate(parsed as ArticleIndexItem[]);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return buildArticleIndex(articlesDir);
    }
    console.error('Error loading article index:', error);
    try {
      return await buildArticleIndex(articlesDir);
    } catch (buildError) {
      console.error('Error rebuilding article index:', buildError);
      return [];
    }
  }
}

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string, fallbackId?: string): string {
  const slug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });

  return slug || fallbackId || '';
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
  const articlesDir = getArticlesDir();

  try {
    // Ensure directory exists
    await fs.mkdir(articlesDir, { recursive: true });

    // Save article
    const filePath = path.join(articlesDir, `${article.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(article, null, 2), 'utf-8');

    const index = await loadArticleIndex();
    const nextIndex = index.filter((item) => item.id !== article.id);
    nextIndex.push({
      id: article.id,
      title: article.title,
      slug: article.slug,
      publishDate: article.publishDate,
    });
    sortByPublishDate(nextIndex);
    await writeArticleIndex(articlesDir, nextIndex);
  } catch (error) {
    console.error('Error saving article:', error);
    throw new Error('Failed to save article');
  }
}

/**
 * Load article from JSON file
 */
export async function loadArticle(id: string): Promise<Article | null> {
  const articlesDir = getArticlesDir();
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
  const index = await loadArticleIndex();
  const entry = index.find((item) => item.slug === slug);
  if (!entry) {
    return null;
  }
  return loadArticle(entry.id);
}

/**
 * Load all articles
 */
export async function loadAllArticles(): Promise<Article[]> {
  try {
    const index = await loadArticleIndex();
    const articles = await Promise.all(index.map((item) => loadArticle(item.id)));
    return articles.filter((article): article is Article => Boolean(article));
  } catch (error) {
    console.error('Error loading articles:', error);
    return [];
  }
}

export async function loadArticlesPage(
  page: number = 1,
  limit: number = 12
): Promise<{ articles: ArticleIndexItem[]; total: number }> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;
  const index = await loadArticleIndex();
  const total = index.length;
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;
  return {
    articles: index.slice(start, end),
    total,
  };
}

/**
 * Delete article
 */
export async function deleteArticle(id: string): Promise<void> {
  const articlesDir = getArticlesDir();
  const filePath = path.join(articlesDir, `${id}.json`);

  try {
    await fs.unlink(filePath);
    const index = await loadArticleIndex();
    const nextIndex = index.filter((item) => item.id !== id);
    await writeArticleIndex(articlesDir, nextIndex);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw new Error('Failed to delete article');
  }
}

/**
 * Extract excerpt from content
 */
export function extractExcerpt(content: string, maxLength: number = 200): string {
  if (!content) {
    return '';
  }

  const stripped = content
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_>#~=-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (stripped.length <= maxLength) {
    return stripped;
  }

  const truncated = stripped.slice(0, maxLength);
  return `${truncated.replace(/\s+\S*$/, '').trim()}...`;
}
