// AI Service Types
export type AIProvider = 'claude' | 'openai';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

// Article Types
export type ArticleStatus = 'draft' | 'review' | 'published';
export type SchemaType = 'Article' | 'BlogPosting' | 'NewsArticle' | 'Review' | 'HowTo' | 'FAQ';

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  keywords: string[];
  focusKeyword?: string;
  coverImage?: string;
  author?: string;
  publishDate: string;
  lastModified: string;
  status?: ArticleStatus;
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
  schemaType?: SchemaType;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
}

// SEO Checklist Types
export interface SEOChecklistItem {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  message?: string;
}

export interface SEOChecklist {
  h1Unique: SEOChecklistItem;
  titleLength: SEOChecklistItem;
  descriptionLength: SEOChecklistItem;
  keywordInTitle: SEOChecklistItem;
  keywordInDescription: SEOChecklistItem;
  keywordDensity: SEOChecklistItem;
  imageAltTags: SEOChecklistItem;
  internalLinks: SEOChecklistItem;
  externalLinks: SEOChecklistItem;
  contentLength: SEOChecklistItem;
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

// Image Generation Types
export interface ImageGenerationRequest {
  prompt: string;
  style?: string;
  size?: { width: number; height: number };
}

export interface GeneratedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

// Sitemap Types
export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// Analytics Types
export interface KeywordAnalysis {
  keyword: string;
  searchVolume?: number;
  competition?: string;
  difficulty?: number;
  relatedKeywords: string[];
}

export interface CompetitorAnalysis {
  url: string;
  title: string;
  keywords: string[];
  contentLength: number;
  backlinks?: number;
  domainAuthority?: number;
}
