'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Article, SEOChecklist } from '@/types';
import { realtimeSEOChecker } from '@/lib/seo/realtime-checker';
import { SEOAnalyzer } from '@/lib/seo/analyzer';
import EditorTopBar from '@/components/ArticleEditor/EditorTopBar';
import RichTextEditor from '@/components/ArticleEditor/RichTextEditor';
import EditorSidebar from '@/components/ArticleEditor/Sidebar/EditorSidebar';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Partial<Article>>({
    id: articleId,
    title: '',
    content: '',
    slug: '',
    description: '',
    keywords: [],
    focusKeyword: '',
    status: 'draft',
    publishDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    metadata: {
      metaTitle: '',
      metaDescription: '',
      robotsIndex: true,
      robotsFollow: true,
    },
  });

  const [checklist, setChecklist] = useState<SEOChecklist | null>(null);
  const [overallScore, setOverallScore] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Load article data
  useEffect(() => {
    if (articleId && articleId !== 'new') {
      loadArticle(articleId);
    }
  }, [articleId]);

  // Real-time SEO check (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (article.title || article.content) {
        performSEOCheck();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [article.title, article.content, article.metadata, article.focusKeyword]);

  // Auto-save (every 30 seconds)
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      if (article.title || article.content) {
        handleSave();
      }
    }, 30000);

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [article]);

  const loadArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/articles/${id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data.article);
      }
    } catch (error) {
      console.error('Failed to load article:', error);
    }
  };

  const performSEOCheck = () => {
    const newChecklist = realtimeSEOChecker.checkArticle(
      article.title || '',
      article.content || '',
      article.metadata?.metaTitle || '',
      article.metadata?.metaDescription || '',
      article.focusKeyword
    );

    setChecklist(newChecklist);

    const passRate = realtimeSEOChecker.calculatePassRate(newChecklist);
    setOverallScore(passRate);

    // Also run full SEO analysis for E-E-A-T score
    if (article.content && article.keywords?.length) {
      const seoAnalyzer = new SEOAnalyzer();
      const seoScore = seoAnalyzer.analyzeArticle(
        article.content,
        article.keywords,
        article.title
      );
      setArticle(prev => ({ ...prev, seoScore }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/articles/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      if (response.ok) {
        setLastSaved(new Date());
        const data = await response.json();
        if (articleId === 'new' && data.article?.id) {
          router.replace(`/editor/${data.article.id}`);
        }
      }
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  };

  const handlePublish = async () => {
    // Check if article meets minimum requirements
    if (!article.title) {
      alert('请添加文章标题');
      return;
    }

    if (!article.content || article.content.length < 300) {
      alert('文章内容过短，建议至少300字');
      return;
    }

    if (!article.metadata?.metaTitle || !article.metadata?.metaDescription) {
      const confirmPublish = confirm(
        'SEO元数据不完整，确定要发布吗？\n\n建议添加：\n- SEO标题\n- 元描述'
      );
      if (!confirmPublish) return;
    }

    try {
      const updatedArticle = {
        ...article,
        status: 'published' as const,
        publishDate: new Date().toISOString(),
      };

      const response = await fetch('/api/articles/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedArticle),
      });

      if (response.ok) {
        setArticle(updatedArticle);
        alert('文章已发布！');
      }
    } catch (error) {
      console.error('Failed to publish article:', error);
      alert('发布失败，请重试');
    }
  };

  const handlePreview = (device: 'desktop' | 'mobile') => {
    // Open preview in new window
    const previewUrl = `/preview/${article.id}?device=${device}`;
    window.open(previewUrl, '_blank');
  };

  const handleImprove = () => {
    // TODO: Implement AI improvement suggestions
    alert('AI优化功能开发中...');
  };

  const updateArticle = (updates: Partial<Article>) => {
    setArticle(prev => ({
      ...prev,
      ...updates,
      lastModified: new Date().toISOString(),
    }));
  };

  const wordCount = article.content
    ? article.content.split(/\s+/).filter(w => w.length > 0).length
    : 0;

  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <EditorTopBar
        articleId={article.id}
        status={article.status || 'draft'}
        wordCount={wordCount}
        readingTime={readingTime}
        lastSaved={lastSaved}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={handlePreview}
        onImprove={handleImprove}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Central Editor */}
        <div className="flex-1 overflow-y-auto bg-white">
          <RichTextEditor
            title={article.title || ''}
            content={article.content || ''}
            onTitleChange={(title) => updateArticle({ title })}
            onContentChange={(content) => updateArticle({ content })}
          />
        </div>

        {/* Right Sidebar */}
        {checklist && (
          <EditorSidebar
            article={article}
            checklist={checklist}
            overallScore={overallScore}
            onUpdateArticle={updateArticle}
          />
        )}
      </div>
    </div>
  );
}
