// AI Service Types
export type AIProvider = 'claude' | 'openai';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

// Article Types
export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  keywords: string[];
  coverImage?: string;
  author?: string;
  publishDate: string;
  lastModified: string;
  category?: string;
  tags?: string[];
  metadata: ArticleMetadata;
  seoScore?: SEOScore;
}

export interface ArticleMetadata {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  schema?: Record<string, any>;
  canonicalUrl?: string;
}

// Content Generation Types
export interface ContentGenerationRequest {
  topic: string;
  keywords: string[];
  targetAudience?: string;
  tone?: 'professional' | 'casual' | 'technical' | 'friendly';
  length?: 'short' | 'medium' | 'long';
  language?: string;
  brandInfo?: BrandInfo;
  connectToWeb?: boolean;
  // CMS and social fields kept for backward compatibility
  cms?: CMSConfig;
  social?: SocialConfig;
  includeImages?: boolean;
  includeFacts?: boolean;
}

export interface BrandInfo {
  name: string;
  description?: string;
  products?: string[];
  values?: string[];
}

export interface ContentGenerationResult {
  article: Article;
  suggestions: string[];
  serpAnalysis?: SERPAnalysis;
  cmsPayload?: CMSPayload;
  socialCopy?: SocialCopy;
}

export interface CMSConfig {
  provider: 'wordpress';
  siteUrl?: string;
  username?: string;
  applicationPassword?: string;
  defaultStatus?: 'draft' | 'publish' | 'private' | 'pending';
  defaultCategory?: string;
  defaultTags?: string[];
}

export interface CMSPayload {
  provider: 'wordpress';
  endpoint?: string;
  post: {
    title: string;
    content: string;
    excerpt: string;
    status: 'draft' | 'publish' | 'private' | 'pending';
    slug: string;
    categories?: string[];
    tags?: string[];
  };
}

export interface SocialConfig {
  twitter?: SocialChannelConfig;
  facebook?: SocialChannelConfig;
}

export interface SocialChannelConfig {
  enabled?: boolean;
  handle?: string;
  hashtags?: string[];
  language?: string;
}

export interface SocialCopy {
  twitter?: SocialCopyItem;
  facebook?: SocialCopyItem;
}

export interface SocialCopyItem {
  text: string;
  hashtags?: string[];
  url?: string;
}

// SERP Analysis Types
export interface SERPAnalysis {
  searchIntent: string;
  topResults: SERPResult[];
  commonKeywords: string[];
  trendingTopics: string[];
  recommendedStructure: string[];
}

export interface SERPResult {
  title: string;
  url: string;
  snippet: string;
  position: number;
}

// SEO Types
export interface SEOScore {
  overall: number;
  keywordOptimization: number;
  contentQuality: number;
  technicalSEO: number;
  userExperience: number;
  details: SEOScoreDetails;
}

export interface SEOScoreDetails {
  keywordDensity: { keyword: string; density: number }[];
  headingStructure: boolean;
  metaTagsPresent: boolean;
  imageOptimization: number;
  internalLinks: number;
  externalLinks: number;
  readabilityScore: number;
  mobileOptimized: boolean;
  loadSpeed: string;
  eatScore: EATScore;
}

export interface EATScore {
  experience: number;
  expertise: number;
  authority: number;
  trustworthiness: number;
}

// Link Types
export interface Link {
  text: string;
  url: string;
  type: 'internal' | 'external';
  rel?: string;
}

// Sitemap Types
export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

