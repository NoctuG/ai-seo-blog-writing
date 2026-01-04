'use client';

import { useState } from 'react';
import { ContentGenerationRequest, OutlineSection } from '@/types';

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
  const [outlineLoading, setOutlineLoading] = useState(false);
  const [error, setError] = useState('');
  const [outlineError, setOutlineError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [outlineItems, setOutlineItems] = useState<OutlineSection[]>([]);
  const [outlineConfirmed, setOutlineConfirmed] = useState(false);

  const parseOutline = (rawOutline: string): OutlineSection[] => {
    const lines = rawOutline
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const sections: OutlineSection[] = [];

    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        sections.push({
          id: crypto.randomUUID(),
          title: line.replace(/^##\s+/, '').trim(),
          children: [],
        });
      } else if (line.startsWith('### ')) {
        const title = line.replace(/^###\s+/, '').trim();
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
          lastSection.children.push({ id: crypto.randomUUID(), title });
        } else {
          sections.push({
            id: crypto.randomUUID(),
            title: '未命名章节',
            children: [{ id: crypto.randomUUID(), title }],
          });
        }
      }
    });

    return sections;
  };

  const handleOutlineChange = (updated: OutlineSection[]) => {
    setOutlineItems(updated);
    setOutlineConfirmed(false);
  };

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
      if (!outlineConfirmed || outlineItems.length === 0) {
        throw new Error('请先生成并确认大纲');
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          outline: outlineItems,
          mode: 'article',
        }),
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

  const handleGenerateOutline = async () => {
    setOutlineLoading(true);
    setOutlineError('');
    setOutlineConfirmed(false);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          mode: 'outline',
        }),
      });

      if (!response.ok) {
        throw new Error('生成大纲失败');
      }

      const data = await response.json();
      const parsedOutline = parseOutline(data.outline || '');
      if (parsedOutline.length === 0) {
        throw new Error('未能解析大纲，请重试');
      }
      setOutlineItems(parsedOutline);
    } catch (err) {
      setOutlineError(err instanceof Error ? err.message : '生成大纲失败，请重试');
    } finally {
      setOutlineLoading(false);
    }
  };

  const addSection = () => {
    handleOutlineChange([
      ...outlineItems,
      { id: crypto.randomUUID(), title: '新章节', children: [] },
    ]);
  };

  const addSubheading = (sectionIndex: number) => {
    const updated = outlineItems.map((section, index) => {
      if (index !== sectionIndex) return section;
      return {
        ...section,
        children: [...section.children, { id: crypto.randomUUID(), title: '新子章节' }],
      };
    });
    handleOutlineChange(updated);
  };

  const updateSectionTitle = (sectionIndex: number, title: string) => {
    const updated = outlineItems.map((section, index) =>
      index === sectionIndex ? { ...section, title } : section
    );
    handleOutlineChange(updated);
  };

  const updateSubheadingTitle = (sectionIndex: number, headingIndex: number, title: string) => {
    const updated = outlineItems.map((section, index) => {
      if (index !== sectionIndex) return section;
      const children = section.children.map((heading, childIndex) =>
        childIndex === headingIndex ? { ...heading, title } : heading
      );
      return { ...section, children };
    });
    handleOutlineChange(updated);
  };

  const removeSection = (sectionIndex: number) => {
    handleOutlineChange(outlineItems.filter((_, index) => index !== sectionIndex));
  };

  const removeSubheading = (sectionIndex: number, headingIndex: number) => {
    const updated = outlineItems.map((section, index) => {
      if (index !== sectionIndex) return section;
      const children = section.children.filter((_, childIndex) => childIndex !== headingIndex);
      return { ...section, children };
    });
    handleOutlineChange(updated);
  };

  const moveSection = (sectionIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    if (targetIndex < 0 || targetIndex >= outlineItems.length) return;
    const updated = [...outlineItems];
    const [moved] = updated.splice(sectionIndex, 1);
    updated.splice(targetIndex, 0, moved);
    handleOutlineChange(updated);
  };

  const moveSubheading = (
    sectionIndex: number,
    headingIndex: number,
    direction: 'up' | 'down'
  ) => {
    const updated = outlineItems.map((section, index) => {
      if (index !== sectionIndex) return section;
      const targetIndex = direction === 'up' ? headingIndex - 1 : headingIndex + 1;
      if (targetIndex < 0 || targetIndex >= section.children.length) return section;
      const children = [...section.children];
      const [moved] = children.splice(headingIndex, 1);
      children.splice(targetIndex, 0, moved);
      return { ...section, children };
    });
    handleOutlineChange(updated);
  };

  const handleConfirmOutline = () => {
    if (outlineItems.length === 0) {
      setOutlineError('请先生成大纲');
      return;
    }
    setOutlineError('');
    setOutlineConfirmed(true);
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

        {/* Outline */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGenerateOutline}
            disabled={outlineLoading || formData.keywords.length === 0}
            className="btn btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {outlineLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner"></span>
                生成大纲中...
              </span>
            ) : (
              '生成大纲'
            )}
          </button>

          {outlineError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {outlineError}
            </div>
          )}

          {outlineItems.length > 0 && (
            <div className="p-4 border border-gray-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Outline Editor</h3>
                <button type="button" onClick={addSection} className="btn btn-secondary">
                  添加H2
                </button>
              </div>

              <div className="space-y-4">
                {outlineItems.map((section, sectionIndex) => (
                  <div key={section.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        value={section.title}
                        onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                        className="input flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => moveSection(sectionIndex, 'up')}
                        className="btn btn-secondary"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(sectionIndex, 'down')}
                        className="btn btn-secondary"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => addSubheading(sectionIndex)}
                        className="btn btn-secondary"
                      >
                        添加H3
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSection(sectionIndex)}
                        className="btn btn-secondary"
                      >
                        删除
                      </button>
                    </div>

                    {section.children.length > 0 && (
                      <div className="mt-3 space-y-2 pl-4 border-l border-gray-200">
                        {section.children.map((heading, headingIndex) => (
                          <div key={heading.id} className="flex flex-wrap items-center gap-2">
                            <input
                              value={heading.title}
                              onChange={(e) =>
                                updateSubheadingTitle(sectionIndex, headingIndex, e.target.value)
                              }
                              className="input flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => moveSubheading(sectionIndex, headingIndex, 'up')}
                              className="btn btn-secondary"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSubheading(sectionIndex, headingIndex, 'down')}
                              className="btn btn-secondary"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSubheading(sectionIndex, headingIndex)}
                              className="btn btn-secondary"
                            >
                              删除
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleConfirmOutline} className="btn btn-primary">
                  确认大纲
                </button>
                {outlineConfirmed && (
                  <span className="text-sm text-green-600 flex items-center">
                    ✅ 已确认大纲
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || formData.keywords.length === 0 || !outlineConfirmed}
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
