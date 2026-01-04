'use client';

import { useState } from 'react';

interface ArticleGenerationConfig {
  // Core Settings
  topic: string;
  articleType: string;
  aiModel: string;
  numberOfArticles: number;
  postDate: string;
  targetCountry: string;
  targetLanguage: string;

  // Brand Voice
  tone: string;
  brandVoiceCustom?: string;

  // Details to Include
  customDetails: string;

  // Media Hub
  imageCount: number;
  imageSize: string;
  imageStyle: string;
  videoInclude: boolean;

  // SEO
  keywords: string[];
  focusKeyword?: string;

  // Structure
  introductionBrief: string;
  conclusion: string;
  h2Topics: string[];
  h3Topics: string[];
  listsInclude: boolean;

  // Internal Linking
  internalLinks: string[];

  // External Linking
  externalLinkType: string;
  externalLinkNotes: string;

  // Connect to Web
  searchDepth: string;

  // Syndication
  twitterPost: boolean;
  linkedinPost: boolean;
  facebookPost: boolean;
  emailNewsletter: boolean;
  pinterestPin: boolean;
}

export default function AdvancedArticleGenerator() {
  const [activeSection, setActiveSection] = useState<string>('core');
  const [config, setConfig] = useState<ArticleGenerationConfig>({
    topic: '',
    articleType: 'blog-post',
    aiModel: 'claude',
    numberOfArticles: 1,
    postDate: new Date().toISOString().split('T')[0],
    targetCountry: 'China',
    targetLanguage: 'zh-CN',
    tone: 'professional',
    customDetails: '',
    imageCount: 3,
    imageSize: '1920x1080',
    imageStyle: 'professional',
    videoInclude: false,
    keywords: [],
    h2Topics: [],
    h3Topics: [],
    listsInclude: true,
    introductionBrief: '',
    conclusion: '',
    internalLinks: [],
    externalLinkType: 'auto',
    externalLinkNotes: '',
    searchDepth: 'medium',
    twitterPost: false,
    linkedinPost: false,
    facebookPost: false,
    emailNewsletter: false,
    pinterestPin: false,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const updateConfig = (field: string, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error('生成失败');

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Navigation */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="font-semibold mb-4">设置</h3>
            <nav className="space-y-1">
              {[
                { id: 'core', label: '核心设置', icon: '⚙️' },
                { id: 'brand', label: '品牌声音', icon: '🎯' },
                { id: 'details', label: '详细信息', icon: '📝' },
                { id: 'media', label: '媒体中心', icon: '🖼️' },
                { id: 'seo', label: 'SEO优化', icon: '🔍' },
                { id: 'structure', label: '文章结构', icon: '📋' },
                { id: 'linking', label: '链接设置', icon: '🔗' },
                { id: 'web', label: '联网搜索', icon: '🌐' },
                { id: 'syndication', label: '社交发布', icon: '📢' },
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Core Settings */}
          {activeSection === 'core' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">核心设置</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    文章主题 *
                  </label>
                  <input
                    type="text"
                    value={config.topic}
                    onChange={(e) => updateConfig('topic', e.target.value)}
                    className="input"
                    placeholder="输入您的文章主题"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      文章类型
                    </label>
                    <select
                      value={config.articleType}
                      onChange={(e) => updateConfig('articleType', e.target.value)}
                      className="input"
                    >
                      <option value="blog-post">博客文章</option>
                      <option value="how-to">教程指南</option>
                      <option value="listicle">列表文章</option>
                      <option value="comparison">对比评测</option>
                      <option value="review">产品评测</option>
                      <option value="news">新闻报道</option>
                      <option value="case-study">案例研究</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      AI模型
                    </label>
                    <select
                      value={config.aiModel}
                      onChange={(e) => updateConfig('aiModel', e.target.value)}
                      className="input"
                    >
                      <option value="claude">Claude 3.5 Sonnet</option>
                      <option value="openai">GPT-4 Turbo</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      文章数量
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={config.numberOfArticles}
                      onChange={(e) => updateConfig('numberOfArticles', parseInt(e.target.value))}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      发布日期
                    </label>
                    <input
                      type="date"
                      value={config.postDate}
                      onChange={(e) => updateConfig('postDate', e.target.value)}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      目标国家
                    </label>
                    <select
                      value={config.targetCountry}
                      onChange={(e) => updateConfig('targetCountry', e.target.value)}
                      className="input"
                    >
                      <option value="China">中国</option>
                      <option value="United States">美国</option>
                      <option value="United Kingdom">英国</option>
                      <option value="Japan">日本</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    目标语言
                  </label>
                  <select
                    value={config.targetLanguage}
                    onChange={(e) => updateConfig('targetLanguage', e.target.value)}
                    className="input"
                  >
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">英语（美国）</option>
                    <option value="ja-JP">日语</option>
                    <option value="ko-KR">韩语</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Brand Voice */}
          {activeSection === 'brand' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">品牌声音</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    语言风格
                  </label>
                  <select
                    value={config.tone}
                    onChange={(e) => updateConfig('tone', e.target.value)}
                    className="input"
                  >
                    <option value="professional">专业正式</option>
                    <option value="casual">轻松随意</option>
                    <option value="friendly">友好亲切</option>
                    <option value="technical">技术性强</option>
                    <option value="conversational">对话式</option>
                    <option value="authoritative">权威性</option>
                    <option value="enthusiastic">热情洋溢</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    自定义品牌声音（可选）
                  </label>
                  <textarea
                    value={config.brandVoiceCustom || ''}
                    onChange={(e) => updateConfig('brandVoiceCustom', e.target.value)}
                    className="textarea"
                    placeholder="描述您品牌独特的语言风格和特点..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    例如："我们的品牌注重数据驱动的见解，使用简洁的语言，避免行业术语"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Details to Include */}
          {activeSection === 'details' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">包含的详细信息</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    额外信息
                  </label>
                  <textarea
                    value={config.customDetails}
                    onChange={(e) => updateConfig('customDetails', e.target.value)}
                    className="textarea"
                    placeholder="添加任何您希望在文章中包含的特定信息、事实或观点..."
                    rows={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    例如：最新统计数据、产品特性、公司里程碑等
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Media Hub */}
          {activeSection === 'media' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">媒体中心</h2>

              <div className="space-y-6">
                {/* Images */}
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <span className="mr-2">📸</span> 图片设置
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        图片数量
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={config.imageCount}
                        onChange={(e) => updateConfig('imageCount', parseInt(e.target.value))}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        图片尺寸
                      </label>
                      <select
                        value={config.imageSize}
                        onChange={(e) => updateConfig('imageSize', e.target.value)}
                        className="input"
                      >
                        <option value="1920x1080">1920×1080 (标准)</option>
                        <option value="1200x630">1200×630 (社交)</option>
                        <option value="800x600">800×600 (缩略图)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        图片风格
                      </label>
                      <select
                        value={config.imageStyle}
                        onChange={(e) => updateConfig('imageStyle', e.target.value)}
                        className="input"
                      >
                        <option value="professional">专业商务</option>
                        <option value="modern">现代简约</option>
                        <option value="creative">创意艺术</option>
                        <option value="minimal">极简主义</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Video */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <span className="mr-2">🎥</span> 视频设置
                  </h3>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.videoInclude}
                      onChange={(e) => updateConfig('videoInclude', e.target.checked)}
                    />
                    <span>在文章中包含视频建议</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SEO */}
          {activeSection === 'seo' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">SEO优化</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    目标关键词 *
                  </label>
                  <KeywordInput
                    keywords={config.keywords}
                    onChange={(keywords) => updateConfig('keywords', keywords)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    建议添加3-5个相关关键词以获得最佳SEO效果
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    焦点关键词（可选）
                  </label>
                  <input
                    type="text"
                    value={config.focusKeyword || ''}
                    onChange={(e) => updateConfig('focusKeyword', e.target.value)}
                    className="input"
                    placeholder="主要优化的关键词"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">💡 SEO建议</h3>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• 使用长尾关键词提高排名机会</li>
                    <li>• 关键词密度保持在0.5%-2.5%之间</li>
                    <li>• 在标题和前100字中包含主关键词</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Structure */}
          {activeSection === 'structure' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">文章结构</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    引言简介
                  </label>
                  <textarea
                    value={config.introductionBrief}
                    onChange={(e) => updateConfig('introductionBrief', e.target.value)}
                    className="textarea"
                    placeholder="描述文章开头应该包含什么内容..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    主要章节（H2）
                  </label>
                  <TopicInput
                    topics={config.h2Topics}
                    onChange={(topics) => updateConfig('h2Topics', topics)}
                    placeholder="添加主要章节标题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    子章节（H3）
                  </label>
                  <TopicInput
                    topics={config.h3Topics}
                    onChange={(topics) => updateConfig('h3Topics', topics)}
                    placeholder="添加子章节标题"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.listsInclude}
                      onChange={(e) => updateConfig('listsInclude', e.target.checked)}
                    />
                    <span>包含列表和要点</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    结论总结
                  </label>
                  <textarea
                    value={config.conclusion}
                    onChange={(e) => updateConfig('conclusion', e.target.value)}
                    className="textarea"
                    placeholder="描述文章结尾应该总结什么..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Linking */}
          {activeSection === 'linking' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">链接设置</h2>

              <div className="space-y-6">
                {/* Internal Links */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold mb-3">内部链接</h3>
                  <LinkInput
                    links={config.internalLinks}
                    onChange={(links) => updateConfig('internalLinks', links)}
                    placeholder="添加站内文章URL"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    建议添加2-5个相关内部链接以提升SEO
                  </p>
                </div>

                {/* External Links */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-3">外部链接</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        链接类型
                      </label>
                      <select
                        value={config.externalLinkType}
                        onChange={(e) => updateConfig('externalLinkType', e.target.value)}
                        className="input"
                      >
                        <option value="auto">自动添加权威来源</option>
                        <option value="manual">手动指定</option>
                        <option value="none">不添加外部链接</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        备注说明
                      </label>
                      <textarea
                        value={config.externalLinkNotes}
                        onChange={(e) => updateConfig('externalLinkNotes', e.target.value)}
                        className="textarea"
                        placeholder="指定希望引用的外部来源类型..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connect to Web */}
          {activeSection === 'web' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">联网搜索</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    搜索深度
                  </label>
                  <select
                    value={config.searchDepth}
                    onChange={(e) => updateConfig('searchDepth', e.target.value)}
                    className="input"
                  >
                    <option value="light">轻度 - 快速概览</option>
                    <option value="medium">中度 - 平衡速度与深度</option>
                    <option value="deep">深度 - 全面研究</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    深度搜索会获取更多最新信息，但生成时间会更长
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold mb-2">🌐 实时信息获取</h3>
                  <p className="text-sm text-gray-700">
                    AI将从网络搜索最新信息、统计数据和趋势，确保文章内容准确且及时。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Syndication */}
          {activeSection === 'syndication' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">社交媒体发布</h2>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  选择要同步发布的社交媒体平台
                </p>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.twitterPost}
                      onChange={(e) => updateConfig('twitterPost', e.target.checked)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-blue-400">🐦</span>
                      <span className="font-medium">Twitter / X</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.linkedinPost}
                      onChange={(e) => updateConfig('linkedinPost', e.target.checked)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-blue-600">💼</span>
                      <span className="font-medium">LinkedIn</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.facebookPost}
                      onChange={(e) => updateConfig('facebookPost', e.target.checked)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-blue-700">👥</span>
                      <span className="font-medium">Facebook</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.emailNewsletter}
                      onChange={(e) => updateConfig('emailNewsletter', e.target.checked)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span>📧</span>
                      <span className="font-medium">Email Newsletter</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.pinterestPin}
                      onChange={(e) => updateConfig('pinterestPin', e.target.checked)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-red-600">📌</span>
                      <span className="font-medium">Pinterest</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">准备就绪？</h3>
                <p className="text-sm text-gray-600 mt-1">
                  点击生成按钮创建您的高质量SEO文章
                </p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading || !config.topic || config.keywords.length === 0}
                className="btn btn-primary px-8 py-3 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="spinner"></span>
                    生成中...
                  </span>
                ) : (
                  '🚀 生成文章'
                )}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="card bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold mb-3 text-green-800">
                ✅ 文章生成成功！
              </h3>
              <div className="space-y-2 text-sm">
                <p>文章ID: {result.article?.id}</p>
                <p>SEO评分: {Math.round((result.article?.seoScore?.overall || 0) * 100)}%</p>
              </div>
              <a
                href={`/articles/${result.article?.slug}`}
                className="btn btn-primary mt-4"
              >
                查看文章
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function KeywordInput({ keywords, onChange }: { keywords: string[], onChange: (keywords: string[]) => void }) {
  const [input, setInput] = useState('');

  const addKeyword = () => {
    if (input.trim() && !keywords.includes(input.trim())) {
      onChange([...keywords, input.trim()]);
      setInput('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
          className="input flex-1"
          placeholder="输入关键词后按回车"
        />
        <button type="button" onClick={addKeyword} className="btn btn-secondary">
          添加
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span key={keyword} className="badge badge-blue flex items-center gap-1">
            {keyword}
            <button
              type="button"
              onClick={() => onChange(keywords.filter(k => k !== keyword))}
              className="ml-1 hover:text-red-600"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function TopicInput({ topics, onChange, placeholder }: { topics: string[], onChange: (topics: string[]) => void, placeholder: string }) {
  const [input, setInput] = useState('');

  const addTopic = () => {
    if (input.trim()) {
      onChange([...topics, input.trim()]);
      setInput('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
          className="input flex-1"
          placeholder={placeholder}
        />
        <button type="button" onClick={addTopic} className="btn btn-secondary">
          添加
        </button>
      </div>
      <div className="space-y-1">
        {topics.map((topic, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="flex-1">{topic}</span>
            <button
              type="button"
              onClick={() => onChange(topics.filter((_, i) => i !== index))}
              className="text-red-600 hover:text-red-700"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkInput({ links, onChange, placeholder }: { links: string[], onChange: (links: string[]) => void, placeholder: string }) {
  const [input, setInput] = useState('');

  const addLink = () => {
    if (input.trim()) {
      onChange([...links, input.trim()]);
      setInput('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
          className="input flex-1"
          placeholder={placeholder}
        />
        <button type="button" onClick={addLink} className="btn btn-secondary">
          添加
        </button>
      </div>
      <div className="space-y-1">
        {links.map((link, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
            <span className="flex-1 text-sm text-blue-600 truncate">{link}</span>
            <button
              type="button"
              onClick={() => onChange(links.filter((_, i) => i !== index))}
              className="text-red-600 hover:text-red-700"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
