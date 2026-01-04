'use client';

import { useState } from 'react';
import { Article, SEOChecklist } from '@/types';
import ArticleSettingsTab from './ArticleSettingsTab';
import SEOConfigTab from './SEOConfigTab';
import AuditScoreTab from './AuditScoreTab';

interface EditorSidebarProps {
  article: Partial<Article>;
  checklist: SEOChecklist;
  overallScore: number;
  onUpdateArticle: (updates: Partial<Article>) => void;
}

type TabType = 'settings' | 'seo' | 'audit';

export default function EditorSidebar({
  article,
  checklist,
  overallScore,
  onUpdateArticle,
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('settings');

  const tabs = [
    { id: 'settings' as TabType, label: '文章设置', icon: '⚙️' },
    { id: 'seo' as TabType, label: 'SEO配置', icon: '🔍' },
    { id: 'audit' as TabType, label: '审计与评分', icon: '📊' },
  ];

  return (
    <div className="w-96 border-l bg-white flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{tab.icon}</span>
                <span className="text-xs">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'settings' && (
          <ArticleSettingsTab
            article={article}
            onUpdate={onUpdateArticle}
          />
        )}

        {activeTab === 'seo' && (
          <SEOConfigTab
            article={article}
            onUpdate={onUpdateArticle}
          />
        )}

        {activeTab === 'audit' && (
          <AuditScoreTab
            checklist={checklist}
            overallScore={overallScore}
            eatScore={article.seoScore?.details.eatScore}
          />
        )}
      </div>
    </div>
  );
}
