'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

const WORDS_PER_MINUTE = 220;
const TITLE_MAX = 60;
const META_MIN = 120;
const META_MAX = 160;

type SidebarTab = 'settings' | 'seo' | 'audit';

type ArticleStatus = 'draft' | 'review' | 'published';

function countWords(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

function classForCount(count: number, min: number, max: number) {
  if (count < min) {
    return 'text-yellow-600';
  }
  if (count > max) {
    return 'text-red-600';
  }
  return 'text-green-600';
}

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('settings');
  const [status, setStatus] = useState<ArticleStatus>('draft');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [schemaType, setSchemaType] = useState('article');
  const [author, setAuthor] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [featuredAlt, setFeaturedAlt] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');

  const wordCount = useMemo(() => countWords(content), [content]);
  const readMinutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  const titleCount = metaTitle.length;
  const metaCount = metaDescription.length;
  const keywordMentions = focusKeyword
    ? (content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length
    : 0;
  const keywordDensity = wordCount > 0 ? ((keywordMentions / wordCount) * 100).toFixed(2) : '0.00';
  const hasH1 = title.trim().length > 0;
  const hasMeta = metaDescription.trim().length > 0;
  const hasImages = /<img|!\[.*\]\(.*\)/.test(content);
  const hasInternalLinks = /\[[^\]]+\]\((\/[^)]+)\)/.test(content);
  const hasExternalLinks = /\[[^\]]+\]\((https?:\/\/[^)]+)\)/.test(content);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              ← 返回
            </Link>
            <span className="text-xs text-slate-400">自动保存</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>字数 {wordCount}</span>
            <span>预计阅读 {readMinutes} 分钟</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              桌面预览
            </button>
            <button className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              移动预览
            </button>
            <button className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              改进
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              发布 / 导出
            </button>
            <button className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              设置
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 xl:grid-cols-[1fr_320px]">
        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <label className="text-xs font-semibold uppercase text-slate-400">H1 标题</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full border-none text-3xl font-semibold text-slate-900 outline-none"
              placeholder="输入文章标题（唯一 H1）"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400">正文内容</label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="h-[520px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 outline-none focus:border-blue-500"
              placeholder="开始写作，支持 Markdown 语法。输入 / 可插入表格、CTA、代码块等。"
            />
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span>关键字密度：{keywordDensity}%</span>
            <span>内链 {hasInternalLinks ? '已添加' : '缺失'}</span>
            <span>外链 {hasExternalLinks ? '已添加' : '缺失'}</span>
            <span>图片 {hasImages ? '已插入' : '未插入'}</span>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600">
            {(
              [
                { key: 'settings', label: '文章设置' },
                { key: 'seo', label: 'SEO配置' },
                { key: 'audit', label: '审计评分' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-3 py-2 transition ${
                  activeTab === tab.key ? 'bg-blue-600 text-white' : 'hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'settings' && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-400">状态</label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as ArticleStatus)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  <option value="draft">草稿</option>
                  <option value="review">待审核</option>
                  <option value="published">已发布</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-400">作者</label>
                <input
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="作者姓名"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-400">发布排期</label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(event) => setPublishDate(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-400">特色图片</label>
                <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
                  拖拽上传或点击选择图片
                </div>
                <input
                  value={featuredAlt}
                  onChange={(event) => setFeaturedAlt(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="图片 Alt 文本 (SEO 必填)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-400">分类与标签</label>
                <input
                  value={categories}
                  onChange={(event) => setCategories(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="分类，例如：内容营销"
                />
                <input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="标签，例如：SEO, AI"
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-400">SERP 预览</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-semibold text-blue-700">
                    {metaTitle || 'SEO 标题预览'}
                  </p>
                  <p className="text-xs text-green-700">https://yourdomain.com/{slug || 'article-slug'}</p>
                  <p className="text-xs text-slate-500">
                    {metaDescription || '在这里显示你的 Meta Description，建议 120-160 字。'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-400">URL Slug</label>
                <input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="article-slug"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase text-slate-400">SEO 标题</label>
                  <span className={`text-xs ${classForCount(titleCount, 30, TITLE_MAX)}`}>
                    {titleCount}/{TITLE_MAX}
                  </span>
                </div>
                <input
                  value={metaTitle}
                  onChange={(event) => setMetaTitle(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="输入 SEO Title"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase text-slate-400">Meta Description</label>
                  <span className={`text-xs ${classForCount(metaCount, META_MIN, META_MAX)}`}>
                    {metaCount}/{META_MAX}
                  </span>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={(event) => setMetaDescription(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  rows={4}
                  placeholder="建议 120-160 字，支持一键生成"
                />
                <button className="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                  一键生成 Meta Description
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-400">核心关键词</label>
                <input
                  value={focusKeyword}
                  onChange={(event) => setFocusKeyword(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="Focus Keyword"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-400">高级选项</label>
                <input
                  value={canonicalUrl}
                  onChange={(event) => setCanonicalUrl(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  placeholder="Canonical URL"
                />
                <select className="w-full rounded-lg border border-slate-200 px-3 py-2">
                  <option>Robots: Index, Follow</option>
                  <option>Robots: Noindex</option>
                  <option>Robots: Nofollow</option>
                </select>
                <select
                  value={schemaType}
                  onChange={(event) => setSchemaType(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  <option value="article">Schema: Article</option>
                  <option value="faq">Schema: FAQ</option>
                  <option value="review">Schema: Review</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400">综合得分</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-slate-900">82</span>
                  <span className="text-xs text-slate-500">/ 100</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">基于 E-E-A-T 的实时评估</p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase text-slate-400">检查清单</p>
                <ChecklistItem label="H1 标题唯一" isOk={hasH1} />
                <ChecklistItem label="Meta Description 已填写" isOk={hasMeta} />
                <ChecklistItem label="包含图片" isOk={hasImages} />
                <ChecklistItem label="包含内链" isOk={hasInternalLinks} />
                <ChecklistItem label="包含外链" isOk={hasExternalLinks} />
                <ChecklistItem label="关键词密度" isOk={Number(keywordDensity) > 0.5} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-slate-400">内容建议</p>
                <ul className="list-disc space-y-1 pl-4 text-xs text-slate-500">
                  <li>建议在首段加入核心关键词。</li>
                  <li>每 300 字插入 1 个相关内链。</li>
                  <li>段落过长时可拆分为列表或小标题。</li>
                </ul>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

function ChecklistItem({ label, isOk }: { label: string; isOk: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2">
      <span className="text-xs text-slate-600">{label}</span>
      <span className={`text-xs font-semibold ${isOk ? 'text-green-600' : 'text-red-500'}`}>
        {isOk ? '✅' : '❌'}
      </span>
    </div>
  );
}
