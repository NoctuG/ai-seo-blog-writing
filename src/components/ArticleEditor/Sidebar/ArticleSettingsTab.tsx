'use client';

import { Article, ArticleStatus } from '@/types';

interface ArticleSettingsTabProps {
  article: Partial<Article>;
  onUpdate: (updates: Partial<Article>) => void;
}

export default function ArticleSettingsTab({ article, onUpdate }: ArticleSettingsTabProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to storage and get URL
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Management */}
      <div>
        <label className="block text-sm font-medium mb-2">状态</label>
        <select
          value={article.status || 'draft'}
          onChange={(e) => onUpdate({ status: e.target.value as ArticleStatus })}
          className="input"
        >
          <option value="draft">草稿</option>
          <option value="review">待审核</option>
          <option value="published">已发布</option>
        </select>
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium mb-2">作者</label>
        <input
          type="text"
          value={article.author || ''}
          onChange={(e) => onUpdate({ author: e.target.value })}
          className="input"
          placeholder="作者名称"
        />
      </div>

      {/* Publish Date */}
      <div>
        <label className="block text-sm font-medium mb-2">发布日期</label>
        <input
          type="datetime-local"
          value={article.publishDate ? new Date(article.publishDate).toISOString().slice(0, 16) : ''}
          onChange={(e) => onUpdate({ publishDate: new Date(e.target.value).toISOString() })}
          className="input"
        />
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium mb-2">特色图片</label>

        {article.coverImage ? (
          <div className="space-y-2">
            <img
              src={article.coverImage}
              alt="Cover"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => onUpdate({ coverImage: undefined })}
              className="text-sm text-red-600 hover:text-red-700"
            >
              移除图片
            </button>
          </div>
        ) : (
          <label className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm">点击上传图片</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}

        {article.coverImage && (
          <div className="mt-2">
            <label className="block text-xs text-gray-600 mb-1">Alt文本（SEO重要）</label>
            <input
              type="text"
              placeholder="描述图片内容..."
              className="input text-sm"
            />
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">分类</label>
        <select
          value={article.category || ''}
          onChange={(e) => onUpdate({ category: e.target.value })}
          className="input"
        >
          <option value="">选择分类</option>
          <option value="技术">技术</option>
          <option value="营销">营销</option>
          <option value="产品">产品</option>
          <option value="教程">教程</option>
          <option value="新闻">新闻</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">标签</label>
        <input
          type="text"
          value={article.tags?.join(', ') || ''}
          onChange={(e) => onUpdate({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
          className="input"
          placeholder="标签1, 标签2, 标签3"
        />
        <p className="text-xs text-gray-500 mt-1">用逗号分隔多个标签</p>
      </div>
    </div>
  );
}
