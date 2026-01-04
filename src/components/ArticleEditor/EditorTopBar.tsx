'use client';

import { useState } from 'react';
import { ArticleStatus } from '@/types';

interface EditorTopBarProps {
  articleId?: string;
  status: ArticleStatus;
  wordCount: number;
  readingTime: number;
  lastSaved?: Date;
  onSave: () => Promise<void>;
  onPublish: () => Promise<void>;
  onPreview: (device: 'desktop' | 'mobile') => void;
  onImprove: () => void;
}

export default function EditorTopBar({
  articleId,
  status,
  wordCount,
  readingTime,
  lastSaved,
  onSave,
  onPublish,
  onPreview,
  onImprove,
}: EditorTopBarProps) {
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onPublish();
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="h-16 border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <a
            href="/articles"
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← 返回
          </a>

          <div className="h-8 w-px bg-gray-200" />

          <div className="flex items-center gap-2">
            {saving ? (
              <span className="text-sm text-gray-500">保存中...</span>
            ) : lastSaved ? (
              <span className="text-sm text-gray-500">
                已保存 {lastSaved.toLocaleTimeString()}
              </span>
            ) : (
              <span className="text-sm text-gray-400">未保存</span>
            )}
          </div>
        </div>

        {/* Center Section */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">{wordCount.toLocaleString()}</span>
            <span>字</span>
          </div>

          <div className="h-4 w-px bg-gray-200" />

          <div className="flex items-center gap-2">
            <span className="font-medium">{readingTime}</span>
            <span>分钟阅读</span>
          </div>

          <div className="h-4 w-px bg-gray-200" />

          <div>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : status === 'review'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status === 'published' ? '已发布' : status === 'review' ? '待审核' : '草稿'}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Preview Buttons */}
          <div className="flex items-center gap-1 border rounded-lg">
            <button
              onClick={() => onPreview('desktop')}
              className="px-3 py-1.5 hover:bg-gray-50 rounded-l-lg text-sm transition-colors"
              title="桌面预览"
            >
              💻
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <button
              onClick={() => onPreview('mobile')}
              className="px-3 py-1.5 hover:bg-gray-50 rounded-r-lg text-sm transition-colors"
              title="移动预览"
            >
              📱
            </button>
          </div>

          {/* Improve Button */}
          <button
            onClick={onImprove}
            className="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
          >
            ✨ 改进
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={publishing || status === 'published'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishing ? '发布中...' : status === 'published' ? '已发布' : '发布'}
          </button>
        </div>
      </div>
    </div>
  );
}
