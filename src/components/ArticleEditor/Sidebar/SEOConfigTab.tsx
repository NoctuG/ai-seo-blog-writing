'use client';

import { Article, SchemaType } from '@/types';
import { useState } from 'react';

interface SEOConfigTabProps {
  article: Partial<Article>;
  onUpdate: (updates: Partial<Article>) => void;
}

export default function SEOConfigTab({ article, onUpdate }: SEOConfigTabProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const metaTitle = article.metadata?.metaTitle || article.title || '';
  const metaDescription = article.metadata?.metaDescription || article.description || '';
  const titleLength = metaTitle.length;
  const descLength = metaDescription.length;

  const getTitleColor = () => {
    if (titleLength === 0) return 'text-gray-400';
    if (titleLength >= 30 && titleLength <= 60) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getDescColor = () => {
    if (descLength === 0) return 'text-gray-400';
    if (descLength >= 120 && descLength <= 160) return 'text-green-600';
    return 'text-yellow-600';
  };

  return (
    <div className="space-y-6">
      {/* SERP Preview */}
      <div>
        <label className="block text-sm font-medium mb-3">SERP预览</label>
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="text-blue-600 text-lg font-medium mb-1 line-clamp-1">
            {metaTitle || '您的SEO标题会显示在这里'}
          </div>
          <div className="text-green-700 text-xs mb-2">
            {article.metadata?.canonicalUrl || 'https://yoursite.com/article-slug'}
          </div>
          <div className="text-sm text-gray-700 line-clamp-2">
            {metaDescription || '您的元描述会显示在这里，吸引用户点击...'}
          </div>
        </div>
      </div>

      {/* URL Slug */}
      <div>
        <label className="block text-sm font-medium mb-2">URL别名 (Slug)</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">/articles/</span>
          <input
            type="text"
            value={article.slug || ''}
            onChange={(e) => onUpdate({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
            className="input flex-1"
            placeholder="url-slug"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          仅使用小写字母、数字和连字符
        </p>
      </div>

      {/* SEO Title */}
      <div>
        <label className="block text-sm font-medium mb-2">SEO标题</label>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => onUpdate({
            metadata: { ...article.metadata, metaTitle: e.target.value }
          })}
          className="input"
          placeholder="优化的标题，30-60字符"
          maxLength={70}
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">建议长度：30-60字符</p>
          <span className={`text-xs font-medium ${getTitleColor()}`}>
            {titleLength}/60
          </span>
        </div>
        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              titleLength >= 30 && titleLength <= 60
                ? 'bg-green-500'
                : titleLength > 60
                ? 'bg-red-500'
                : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-sm font-medium mb-2">元描述</label>
        <textarea
          value={metaDescription}
          onChange={(e) => onUpdate({
            metadata: { ...article.metadata, metaDescription: e.target.value }
          })}
          className="textarea"
          placeholder="吸引人的描述，120-160字符"
          rows={3}
          maxLength={170}
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">建议长度：120-160字符</p>
          <span className={`text-xs font-medium ${getDescColor()}`}>
            {descLength}/160
          </span>
        </div>
        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              descLength >= 120 && descLength <= 160
                ? 'bg-green-500'
                : descLength > 160
                ? 'bg-red-500'
                : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Focus Keyword */}
      <div>
        <label className="block text-sm font-medium mb-2">
          焦点关键词
          <span className="ml-1 text-xs text-gray-500">(主要优化目标)</span>
        </label>
        <input
          type="text"
          value={article.focusKeyword || ''}
          onChange={(e) => onUpdate({ focusKeyword: e.target.value })}
          className="input"
          placeholder="例如：AI内容生成"
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium mb-2">相关关键词</label>
        <input
          type="text"
          value={article.keywords?.join(', ') || ''}
          onChange={(e) => onUpdate({
            keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
          })}
          className="input"
          placeholder="关键词1, 关键词2, 关键词3"
        />
        <p className="text-xs text-gray-500 mt-1">用逗号分隔多个关键词</p>
      </div>

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full text-left text-sm text-blue-600 hover:text-blue-700 flex items-center justify-between"
      >
        <span>高级选项</span>
        <span>{showAdvanced ? '▼' : '▶'}</span>
      </button>

      {showAdvanced && (
        <div className="space-y-4 pt-2 border-t">
          {/* Canonical URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Canonical链接</label>
            <input
              type="url"
              value={article.metadata?.canonicalUrl || ''}
              onChange={(e) => onUpdate({
                metadata: { ...article.metadata, canonicalUrl: e.target.value }
              })}
              className="input"
              placeholder="https://..."
            />
            <p className="text-xs text-gray-500 mt-1">
              用于避免重复内容问题
            </p>
          </div>

          {/* Robots Meta */}
          <div>
            <label className="block text-sm font-medium mb-2">Robots指令</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={article.metadata?.robotsIndex !== false}
                  onChange={(e) => onUpdate({
                    metadata: { ...article.metadata, robotsIndex: e.target.checked }
                  })}
                />
                <span className="text-sm">允许索引 (Index)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={article.metadata?.robotsFollow !== false}
                  onChange={(e) => onUpdate({
                    metadata: { ...article.metadata, robotsFollow: e.target.checked }
                  })}
                />
                <span className="text-sm">允许跟踪链接 (Follow)</span>
              </label>
            </div>
          </div>

          {/* Schema Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Schema架构类型</label>
            <select
              value={article.metadata?.schemaType || 'Article'}
              onChange={(e) => onUpdate({
                metadata: { ...article.metadata, schemaType: e.target.value as SchemaType }
              })}
              className="input"
            >
              <option value="Article">Article（文章）</option>
              <option value="BlogPosting">BlogPosting（博客）</option>
              <option value="NewsArticle">NewsArticle（新闻）</option>
              <option value="Review">Review（评测）</option>
              <option value="HowTo">HowTo（教程）</option>
              <option value="FAQ">FAQ（常见问题）</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
