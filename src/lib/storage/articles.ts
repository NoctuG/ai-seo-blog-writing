import { Article } from '@/types';

type StorageConfig = {
  url: string;
  key: string;
  table: string;
};

const getStorageConfig = (): StorageConfig => {
  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  const table = process.env.SUPABASE_ARTICLES_TABLE || 'articles';

  if (!url || !key) {
    throw new Error(
      'Supabase storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY).'
    );
  }

  return { url: url.replace(/\/+$/, ''), key, table };
};

const buildHeaders = (key: string, extra?: Record<string, string>) => ({
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  ...extra,
});

const requestJson = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Storage request failed: ${response.status} ${errorText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const saveArticle = async (article: Article): Promise<void> => {
  const { url, key, table } = getStorageConfig();
  const endpoint = `${url}/rest/v1/${table}`;

  await requestJson<Article[]>(endpoint, {
    method: 'POST',
    headers: buildHeaders(key, {
      Prefer: 'resolution=merge-duplicates,return=representation',
    }),
    body: JSON.stringify(article),
  });
};

export const loadArticle = async (id: string): Promise<Article | null> => {
  try {
    const { url, key, table } = getStorageConfig();
    const params = new URLSearchParams({
      select: '*',
      id: `eq.${id}`,
      limit: '1',
    });
    const endpoint = `${url}/rest/v1/${table}?${params.toString()}`;
    const results = await requestJson<Article[]>(endpoint, {
      method: 'GET',
      headers: buildHeaders(key),
    });

    return results[0] ?? null;
  } catch (error) {
    console.error('Error loading article:', error);
    return null;
  }
};

export const loadArticleBySlug = async (
  slug: string
): Promise<Article | null> => {
  try {
    const { url, key, table } = getStorageConfig();
    const params = new URLSearchParams({
      select: '*',
      slug: `eq.${slug}`,
      limit: '1',
    });
    const endpoint = `${url}/rest/v1/${table}?${params.toString()}`;
    const results = await requestJson<Article[]>(endpoint, {
      method: 'GET',
      headers: buildHeaders(key),
    });

    return results[0] ?? null;
  } catch (error) {
    console.error('Error loading article by slug:', error);
    return null;
  }
};

export const loadAllArticles = async (): Promise<Article[]> => {
  try {
    const { url, key, table } = getStorageConfig();
    const params = new URLSearchParams({
      select: '*',
      order: 'publishDate.desc',
    });
    const endpoint = `${url}/rest/v1/${table}?${params.toString()}`;
    return await requestJson<Article[]>(endpoint, {
      method: 'GET',
      headers: buildHeaders(key),
    });
  } catch (error) {
    console.error('Error loading articles:', error);
    return [];
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  const { url, key, table } = getStorageConfig();
  const params = new URLSearchParams({
    id: `eq.${id}`,
  });
  const endpoint = `${url}/rest/v1/${table}?${params.toString()}`;

  await requestJson(endpoint, {
    method: 'DELETE',
    headers: buildHeaders(key),
  });
};
