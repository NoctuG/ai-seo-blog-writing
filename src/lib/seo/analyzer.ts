import { SEOScore, EATScore } from '@/types';
import config from '@/lib/config';

export class SEOAnalyzer {
  /**
   * Analyze article for SEO score
   */
  analyzeArticle(content: string, keywords: string[], title?: string): SEOScore {
    const keywordOptimization = this.analyzeKeywords(content, keywords);
    const contentQuality = this.analyzeContentQuality(content);
    const technicalSEO = this.analyzeTechnicalSEO(content, title);
    const userExperience = this.analyzeUserExperience(content);
    const eatScore = this.analyzeEAT(content);

    const overall = Math.round(
      (keywordOptimization * 0.25 +
        contentQuality * 0.30 +
        technicalSEO * 0.20 +
        userExperience * 0.25) * 100
    ) / 100;

    return {
      overall,
      keywordOptimization,
      contentQuality,
      technicalSEO,
      userExperience,
      details: {
        keywordDensity: this.getKeywordDensity(content, keywords),
        headingStructure: this.hasProperHeadingStructure(content),
        metaTagsPresent: this.checkMetaTags(title),
        imageOptimization: this.analyzeImages(content),
        internalLinks: this.countLinks(content, 'internal'),
        externalLinks: this.countLinks(content, 'external'),
        readabilityScore: this.calculateReadability(content),
        mobileOptimized: true, // Assuming responsive design
        loadSpeed: 'good', // This would need actual measurement
        eatScore,
      },
    };
  }

  /**
   * Analyze keyword optimization
   */
  private analyzeKeywords(content: string, keywords: string[]): number {
    const text = content.toLowerCase();
    const wordCount = this.getWordCount(content);
    let score = 0;
    let totalDensity = 0;

    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      const matches = (text.match(new RegExp(keywordLower, 'g')) || []).length;
      const density = (matches / wordCount) * 100;

      totalDensity += density;

      // Optimal keyword density is 0.5% - 2.5%
      if (density >= config.seo.minKeywordDensity && density <= config.seo.maxKeywordDensity) {
        score += 1;
      } else if (density > 0 && density < config.seo.maxKeywordDensity * 1.5) {
        score += 0.5;
      }
    }

    // Check if keywords appear in first 100 words
    const firstWords = text.substring(0, 500);
    const keywordsInIntro = keywords.filter(k =>
      firstWords.includes(k.toLowerCase())
    ).length;

    score += (keywordsInIntro / keywords.length) * 0.5;

    return Math.min(score / keywords.length, 1);
  }

  /**
   * Analyze content quality
   */
  private analyzeContentQuality(content: string): number {
    const wordCount = this.getWordCount(content);
    let score = 0;

    // Word count score (optimal: 1500+ words)
    if (wordCount >= config.seo.optimalContentLength) {
      score += 0.3;
    } else if (wordCount >= config.seo.minContentLength) {
      score += 0.15;
    }

    // Paragraph structure
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    if (paragraphs.length >= 5) {
      score += 0.2;
    }

    // Heading usage
    const headings = this.extractHeadings(content);
    if (headings.length >= 3) {
      score += 0.2;
    }

    // Lists usage
    const hasLists = /[-*]\s/.test(content) || /\d+\.\s/.test(content);
    if (hasLists) {
      score += 0.1;
    }

    // Sentence variety (not too short, not too long)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = wordCount / sentences.length;
    if (avgSentenceLength >= 10 && avgSentenceLength <= 25) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  /**
   * Analyze technical SEO
   */
  private analyzeTechnicalSEO(content: string, title?: string): number {
    let score = 0;

    // Title presence and length
    if (title && title.length >= 30 && title.length <= 60) {
      score += 0.3;
    } else if (title) {
      score += 0.15;
    }

    // Heading structure
    if (this.hasProperHeadingStructure(content)) {
      score += 0.3;
    }

    // Internal links
    const internalLinks = this.countLinks(content, 'internal');
    if (internalLinks >= config.seo.minInternalLinks) {
      score += 0.2;
    }

    // External links
    const externalLinks = this.countLinks(content, 'external');
    if (externalLinks >= config.seo.minExternalLinks) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  /**
   * Analyze user experience
   */
  private analyzeUserExperience(content: string): number {
    let score = 0;

    // Readability
    const readabilityScore = this.calculateReadability(content);
    score += readabilityScore * 0.4;

    // Content structure
    const hasHeadings = this.extractHeadings(content).length > 0;
    const hasParagraphs = content.split('\n\n').length > 3;

    if (hasHeadings && hasParagraphs) {
      score += 0.3;
    }

    // Media presence (images, videos)
    const hasImages = /!\[.*?\]\(.*?\)/.test(content);
    if (hasImages) {
      score += 0.15;
    }

    // Not too dense
    const avgParagraphLength = this.getWordCount(content) / content.split('\n\n').length;
    if (avgParagraphLength < 100) {
      score += 0.15;
    }

    return Math.min(score, 1);
  }

  /**
   * Analyze E-E-A-T (Experience, Expertise, Authority, Trustworthiness)
   */
  private analyzeEAT(content: string): EATScore {
    const text = content.toLowerCase();

    // Experience indicators
    const experienceKeywords = ['我的经验', '实践', '案例', '实际', '亲身', '测试'];
    const experienceScore = this.countKeywordMatches(text, experienceKeywords) > 0 ? 0.7 : 0.3;

    // Expertise indicators
    const expertiseKeywords = ['研究', '数据', '分析', '专业', '技术', '方法'];
    const expertiseScore = Math.min(this.countKeywordMatches(text, expertiseKeywords) * 0.15, 1);

    // Authority indicators
    const hasReferences = this.countLinks(content, 'external') >= 2;
    const hasCitations = /\[.*?\]/.test(content);
    const authorityScore = (hasReferences ? 0.5 : 0) + (hasCitations ? 0.3 : 0);

    // Trustworthiness indicators
    const trustKeywords = ['来源', '参考', '研究表明', '根据', '官方'];
    const hasFacts = this.countKeywordMatches(text, trustKeywords) > 0;
    const hasProperLinks = this.countLinks(content, 'external') > 0;
    const trustScore = (hasFacts ? 0.4 : 0) + (hasProperLinks ? 0.4 : 0);

    return {
      experience: Math.min(experienceScore, 1),
      expertise: Math.min(expertiseScore, 1),
      authority: Math.min(authorityScore, 1),
      trustworthiness: Math.min(trustScore, 1),
    };
  }

  /**
   * Helper: Get keyword density
   */
  private getKeywordDensity(content: string, keywords: string[]): { keyword: string; density: number }[] {
    const text = content.toLowerCase();
    const wordCount = this.getWordCount(content);

    return keywords.map(keyword => {
      const matches = (text.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      const density = Math.round((matches / wordCount) * 1000) / 10;
      return { keyword, density };
    });
  }

  /**
   * Helper: Count word occurrences
   */
  private getWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Helper: Extract headings
   */
  private extractHeadings(content: string): string[] {
    const headingRegex = /^#{1,6}\s+(.+)$/gm;
    const matches = content.match(headingRegex) || [];
    return matches;
  }

  /**
   * Helper: Check heading structure
   */
  private hasProperHeadingStructure(content: string): boolean {
    const headings = this.extractHeadings(content);

    // Should have at least H1 and H2
    const hasH1 = /^#\s+/.test(content);
    const hasH2 = /^##\s+/.test(content);

    return hasH1 && hasH2 && headings.length >= 2;
  }

  /**
   * Helper: Check meta tags
   */
  private checkMetaTags(title?: string): boolean {
    return !!title && title.length >= 30 && title.length <= 60;
  }

  /**
   * Helper: Count links
   */
  private countLinks(content: string, type: 'internal' | 'external'): number {
    const linkRegex = /\[.*?\]\((https?:\/\/[^\)]+)\)/g;
    const matches = content.match(linkRegex) || [];

    if (type === 'external') {
      return matches.filter(link =>
        link.includes('http://') || link.includes('https://')
      ).length;
    }

    // For internal links, we'd need to check against the site domain
    // For now, assume links without http/https are internal
    return matches.filter(link =>
      !link.includes('http://') && !link.includes('https://')
    ).length;
  }

  /**
   * Helper: Analyze images
   */
  private analyzeImages(content: string): number {
    const imageRegex = /!\[.*?\]\(.*?\)/g;
    const images = content.match(imageRegex) || [];

    // Check if images have alt text
    const imagesWithAlt = images.filter(img => {
      const altMatch = img.match(/!\[(.*?)\]/);
      return altMatch && altMatch[1].length > 0;
    });

    if (images.length === 0) return 0;
    return imagesWithAlt.length / images.length;
  }

  /**
   * Helper: Calculate readability score (simplified)
   */
  private calculateReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = this.getWordCount(content);
    const avgWordsPerSentence = words / sentences.length;

    // Optimal: 15-20 words per sentence
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
      return 1;
    } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
      return 0.7;
    } else {
      return 0.5;
    }
  }

  /**
   * Helper: Count keyword matches
   */
  private countKeywordMatches(text: string, keywords: string[]): number {
    return keywords.reduce((count, keyword) => {
      return count + (text.includes(keyword) ? 1 : 0);
    }, 0);
  }

  /**
   * Generate SEO improvement suggestions
   */
  generateSuggestions(score: SEOScore): string[] {
    const suggestions: string[] = [];

    if (score.keywordOptimization < 0.7) {
      suggestions.push('增加目标关键词的使用频率，确保关键词密度在0.5%-2.5%之间');
      suggestions.push('在文章开头100字内包含主要关键词');
    }

    if (score.contentQuality < 0.7) {
      suggestions.push('扩充文章内容，建议达到1500字以上');
      suggestions.push('增加更多段落和小标题，提升内容结构');
      suggestions.push('添加列表和要点，提高可读性');
    }

    if (score.technicalSEO < 0.7) {
      suggestions.push('优化标题长度，建议在30-60个字符之间');
      suggestions.push('添加更多内部链接，建议至少2个');
      suggestions.push('添加高质量外部链接作为引用');
    }

    if (score.userExperience < 0.7) {
      suggestions.push('添加相关图片提升视觉体验');
      suggestions.push('缩短段落长度，每段不超过100字');
      suggestions.push('使用更清晰的标题结构');
    }

    if (score.details.eatScore.expertise < 0.6) {
      suggestions.push('增加专业数据和研究支持');
    }

    if (score.details.eatScore.trustworthiness < 0.6) {
      suggestions.push('添加可信来源的引用和链接');
    }

    return suggestions;
  }
}

export default SEOAnalyzer;
