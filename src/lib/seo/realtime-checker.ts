import { SEOChecklist, SEOChecklistItem } from '@/types';

/**
 * 实时SEO检查器 - 用于编辑器中的实时校验
 */
export class RealtimeSEOChecker {
  /**
   * 执行完整的SEO检查清单
   */
  checkArticle(
    title: string,
    content: string,
    metaTitle: string,
    metaDescription: string,
    focusKeyword?: string
  ): SEOChecklist {
    return {
      h1Unique: this.checkH1Unique(content),
      titleLength: this.checkTitleLength(metaTitle || title),
      descriptionLength: this.checkDescriptionLength(metaDescription),
      keywordInTitle: this.checkKeywordInTitle(metaTitle || title, focusKeyword),
      keywordInDescription: this.checkKeywordInDescription(metaDescription, focusKeyword),
      keywordDensity: this.checkKeywordDensity(content, focusKeyword),
      imageAltTags: this.checkImageAltTags(content),
      internalLinks: this.checkInternalLinks(content),
      externalLinks: this.checkExternalLinks(content),
      contentLength: this.checkContentLength(content),
    };
  }

  /**
   * 检查H1唯一性
   */
  private checkH1Unique(content: string): SEOChecklistItem {
    const h1Matches = content.match(/^#\s+/gm) || [];
    const h1Count = h1Matches.length;

    if (h1Count === 0) {
      return {
        id: 'h1-unique',
        label: 'H1标签存在',
        status: 'fail',
        message: '文章缺少H1标题',
      };
    } else if (h1Count === 1) {
      return {
        id: 'h1-unique',
        label: 'H1标签唯一',
        status: 'pass',
        message: 'H1标签正确',
      };
    } else {
      return {
        id: 'h1-unique',
        label: 'H1标签唯一',
        status: 'fail',
        message: `检测到${h1Count}个H1标签，应该只有1个`,
      };
    }
  }

  /**
   * 检查标题长度
   */
  private checkTitleLength(title: string): SEOChecklistItem {
    const length = title.length;

    if (length === 0) {
      return {
        id: 'title-length',
        label: 'SEO标题长度',
        status: 'fail',
        message: 'SEO标题不能为空',
      };
    } else if (length >= 30 && length <= 60) {
      return {
        id: 'title-length',
        label: 'SEO标题长度',
        status: 'pass',
        message: `标题长度${length}字符（理想：30-60）`,
      };
    } else if (length < 30) {
      return {
        id: 'title-length',
        label: 'SEO标题长度',
        status: 'warning',
        message: `标题过短（${length}字符），建议30-60字符`,
      };
    } else {
      return {
        id: 'title-length',
        label: 'SEO标题长度',
        status: 'warning',
        message: `标题过长（${length}字符），可能被截断`,
      };
    }
  }

  /**
   * 检查描述长度
   */
  private checkDescriptionLength(description: string): SEOChecklistItem {
    const length = description.length;

    if (length === 0) {
      return {
        id: 'description-length',
        label: '元描述长度',
        status: 'fail',
        message: '缺少元描述',
      };
    } else if (length >= 120 && length <= 160) {
      return {
        id: 'description-length',
        label: '元描述长度',
        status: 'pass',
        message: `描述长度${length}字符（理想：120-160）`,
      };
    } else if (length < 120) {
      return {
        id: 'description-length',
        label: '元描述长度',
        status: 'warning',
        message: `描述过短（${length}字符），建议120-160字符`,
      };
    } else {
      return {
        id: 'description-length',
        label: '元描述长度',
        status: 'warning',
        message: `描述过长（${length}字符），可能被截断`,
      };
    }
  }

  /**
   * 检查焦点关键词是否在标题中
   */
  private checkKeywordInTitle(title: string, focusKeyword?: string): SEOChecklistItem {
    if (!focusKeyword) {
      return {
        id: 'keyword-in-title',
        label: '关键词在标题中',
        status: 'warning',
        message: '未设置焦点关键词',
      };
    }

    const titleLower = title.toLowerCase();
    const keywordLower = focusKeyword.toLowerCase();

    if (titleLower.includes(keywordLower)) {
      return {
        id: 'keyword-in-title',
        label: '关键词在标题中',
        status: 'pass',
        message: `焦点关键词"${focusKeyword}"出现在标题中`,
      };
    } else {
      return {
        id: 'keyword-in-title',
        label: '关键词在标题中',
        status: 'fail',
        message: `焦点关键词"${focusKeyword}"未出现在标题中`,
      };
    }
  }

  /**
   * 检查焦点关键词是否在描述中
   */
  private checkKeywordInDescription(description: string, focusKeyword?: string): SEOChecklistItem {
    if (!focusKeyword) {
      return {
        id: 'keyword-in-description',
        label: '关键词在描述中',
        status: 'warning',
        message: '未设置焦点关键词',
      };
    }

    const descLower = description.toLowerCase();
    const keywordLower = focusKeyword.toLowerCase();

    if (descLower.includes(keywordLower)) {
      return {
        id: 'keyword-in-description',
        label: '关键词在描述中',
        status: 'pass',
        message: `焦点关键词"${focusKeyword}"出现在描述中`,
      };
    } else {
      return {
        id: 'keyword-in-description',
        label: '关键词在描述中',
        status: 'warning',
        message: `建议在描述中包含"${focusKeyword}"`,
      };
    }
  }

  /**
   * 检查关键词密度
   */
  private checkKeywordDensity(content: string, focusKeyword?: string): SEOChecklistItem {
    if (!focusKeyword) {
      return {
        id: 'keyword-density',
        label: '关键词密度',
        status: 'warning',
        message: '未设置焦点关键词',
      };
    }

    const text = content.toLowerCase();
    const keyword = focusKeyword.toLowerCase();
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    if (wordCount === 0) {
      return {
        id: 'keyword-density',
        label: '关键词密度',
        status: 'warning',
        message: '内容为空',
      };
    }

    const keywordMatches = (text.match(new RegExp(keyword, 'g')) || []).length;
    const density = (keywordMatches / wordCount) * 100;

    if (density >= 0.5 && density <= 2.5) {
      return {
        id: 'keyword-density',
        label: '关键词密度',
        status: 'pass',
        message: `关键词密度${density.toFixed(2)}%（理想：0.5%-2.5%）`,
      };
    } else if (density < 0.5) {
      return {
        id: 'keyword-density',
        label: '关键词密度',
        status: 'warning',
        message: `关键词密度过低（${density.toFixed(2)}%），建议增加关键词使用`,
      };
    } else {
      return {
        id: 'keyword-density',
        label: '关键词密度',
        status: 'fail',
        message: `关键词密度过高（${density.toFixed(2)}%），可能被视为关键词堆砌`,
      };
    }
  }

  /**
   * 检查图片Alt标签
   */
  private checkImageAltTags(content: string): SEOChecklistItem {
    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
    const images = [...content.matchAll(imageRegex)];

    if (images.length === 0) {
      return {
        id: 'image-alt-tags',
        label: '图片Alt标签',
        status: 'warning',
        message: '文章中没有图片',
      };
    }

    const imagesWithoutAlt = images.filter(img => !img[1] || img[1].trim() === '');

    if (imagesWithoutAlt.length === 0) {
      return {
        id: 'image-alt-tags',
        label: '图片Alt标签',
        status: 'pass',
        message: `所有${images.length}张图片都有Alt标签`,
      };
    } else {
      return {
        id: 'image-alt-tags',
        label: '图片Alt标签',
        status: 'fail',
        message: `${imagesWithoutAlt.length}/${images.length}张图片缺少Alt标签`,
      };
    }
  }

  /**
   * 检查内部链接
   */
  private checkInternalLinks(content: string): SEOChecklistItem {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [...content.matchAll(linkRegex)];
    const internalLinks = links.filter(link => {
      const url = link[2];
      return !url.startsWith('http://') && !url.startsWith('https://');
    });

    if (internalLinks.length >= 2) {
      return {
        id: 'internal-links',
        label: '内部链接',
        status: 'pass',
        message: `包含${internalLinks.length}个内部链接`,
      };
    } else if (internalLinks.length === 1) {
      return {
        id: 'internal-links',
        label: '内部链接',
        status: 'warning',
        message: '建议添加更多内部链接（至少2个）',
      };
    } else {
      return {
        id: 'internal-links',
        label: '内部链接',
        status: 'fail',
        message: '缺少内部链接',
      };
    }
  }

  /**
   * 检查外部链接
   */
  private checkExternalLinks(content: string): SEOChecklistItem {
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    const externalLinks = [...content.matchAll(linkRegex)];

    if (externalLinks.length >= 1) {
      return {
        id: 'external-links',
        label: '外部链接',
        status: 'pass',
        message: `包含${externalLinks.length}个外部链接`,
      };
    } else {
      return {
        id: 'external-links',
        label: '外部链接',
        status: 'warning',
        message: '建议添加至少1个权威外部链接',
      };
    }
  }

  /**
   * 检查内容长度
   */
  private checkContentLength(content: string): SEOChecklistItem {
    const text = content.replace(/[#*_~`]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    if (wordCount >= 1500) {
      return {
        id: 'content-length',
        label: '内容长度',
        status: 'pass',
        message: `文章长度${wordCount}字（理想：1500+）`,
      };
    } else if (wordCount >= 300) {
      return {
        id: 'content-length',
        label: '内容长度',
        status: 'warning',
        message: `文章长度${wordCount}字，建议至少1500字`,
      };
    } else {
      return {
        id: 'content-length',
        label: '内容长度',
        status: 'fail',
        message: `文章过短（${wordCount}字），建议至少300字`,
      };
    }
  }

  /**
   * 计算总体通过率
   */
  calculatePassRate(checklist: SEOChecklist): number {
    const items = Object.values(checklist);
    const passCount = items.filter(item => item.status === 'pass').length;
    return Math.round((passCount / items.length) * 100);
  }
}

export const realtimeSEOChecker = new RealtimeSEOChecker();
