'use client';

import { useState } from 'react';
import { ContentGenerationRequest } from '@/types';

export default function ArticleGenerator() {
  const [formData, setFormData] = useState<ContentGenerationRequest>({
    topic: '',
    keywords: [],
    targetAudience: '',
    tone: 'professional',
    length: 'medium',
    language: 'zh-CN',
    includeImages: true,
    includeFacts: true,
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic */}
        <div>
          <label className="block text-sm font-medium mb-2">
            文章主题 *
          </label>
          <input
            type="text"
            required
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="input"
            placeholder="例如：人工智能在内容营销中的应用"
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium mb-2">
            目标关键词 *
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
              className="input"
              placeholder="输入关键词后按回车添加"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="btn btn-secondary"
            >
              添加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map((keyword) => (
              <span key={keyword} className="badge badge-blue flex items-center gap-1">
                {keyword}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium mb-2">
            目标受众
          </label>
          <input
            type="text"
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            className="input"
            placeholder="例如：数字营销人员、内容创作者"
          />
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium mb-2">
            语言风格
          </label>
          <select
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
            className="input"
          >
            <option value="professional">专业</option>
            <option value="casual">轻松</option>
            <option value="technical">技术性</option>
            <option value="friendly">友好</option>
          </select>
        </div>

        {/* Length */}
        <div>
          <label className="block text-sm font-medium mb-2">
            文章长度
          </label>
          <select
            value={formData.length}
            onChange={(e) => setFormData({ ...formData, length: e.target.value as any })}
            className="input"
          >
            <option value="short">短篇 (约800字)</option>
            <option value="medium">中篇 (约1500字)</option>
            <option value="long">长篇 (约2500字)</option>
          </select>
        </div>

        {/* Options */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.includeImages}
              onChange={(e) => setFormData({ ...formData, includeImages: e.target.checked })}
            />
            <span className="text-sm">生成配图建议</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.includeFacts}
              onChange={(e) => setFormData({ ...formData, includeFacts: e.target.checked })}
            />
            <span className="text-sm">嵌入事实和证据</span>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || formData.keywords.length === 0}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner"></span>
              生成中...
            </span>
          ) : (
            '生成文章'
          )}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">✅ 文章生成成功！</h3>
          <p className="text-sm text-gray-600 mb-4">
            文章ID: {result.article?.id}
          </p>
          <a
            href={`/articles/${result.article?.slug}`}
            className="btn btn-primary"
          >
            查看文章
          </a>
        </div>
      )}
    </div>
  );
}
