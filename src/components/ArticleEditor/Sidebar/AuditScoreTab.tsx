'use client';

import { SEOChecklist, SEOChecklistItem } from '@/types';

interface AuditScoreTabProps {
  checklist: SEOChecklist;
  overallScore: number;
  eatScore?: {
    experience: number;
    expertise: number;
    authority: number;
    trustworthiness: number;
  };
}

export default function AuditScoreTab({ checklist, overallScore, eatScore }: AuditScoreTabProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Panel */}
      <div className={`p-6 rounded-xl text-center ${getScoreBackground(overallScore)}`}>
        <div className="text-sm font-medium text-gray-700 mb-2">综合得分</div>
        <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
          {overallScore}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {overallScore >= 80 ? '优秀' : overallScore >= 60 ? '良好' : '需改进'}
        </div>
      </div>

      {/* E-E-A-T Score */}
      {eatScore && (
        <div>
          <h3 className="font-semibold mb-3">E-E-A-T 评分</h3>
          <div className="space-y-3">
            <ScoreBar label="经验 (Experience)" score={eatScore.experience} />
            <ScoreBar label="专业 (Expertise)" score={eatScore.expertise} />
            <ScoreBar label="权威 (Authority)" score={eatScore.authority} />
            <ScoreBar label="可信 (Trust)" score={eatScore.trustworthiness} />
          </div>
        </div>
      )}

      {/* SEO Checklist */}
      <div>
        <h3 className="font-semibold mb-3">SEO检查清单</h3>
        <div className="space-y-2">
          {Object.values(checklist).map((item) => (
            <ChecklistItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Content Suggestions */}
      <div>
        <h3 className="font-semibold mb-3">优化建议</h3>
        <div className="space-y-2">
          {Object.values(checklist)
            .filter(item => item.status !== 'pass')
            .map((item) => (
              <div key={item.id} className="p-3 bg-blue-50 rounded-lg text-sm">
                <div className="font-medium text-blue-900 mb-1">
                  {item.label}
                </div>
                <div className="text-blue-700">
                  {item.message || '需要改进'}
                </div>
              </div>
            ))}

          {Object.values(checklist).every(item => item.status === 'pass') && (
            <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700">
              🎉 太棒了！文章已通过所有SEO检查。
            </div>
          )}
        </div>
      </div>

      {/* AI Improve Hint */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-lg">✨</span>
          <div className="text-sm">
            <div className="font-medium text-purple-900 mb-1">
              AI辅助优化
            </div>
            <div className="text-purple-700 mb-2">
              点击顶部"改进"按钮，让AI帮您优化文章质量和SEO表现。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ item }: { item: SEOChecklistItem }) {
  const icons = {
    pass: '✅',
    warning: '⚠️',
    fail: '❌',
  };

  const colors = {
    pass: 'text-green-700 bg-green-50',
    warning: 'text-yellow-700 bg-yellow-50',
    fail: 'text-red-700 bg-red-50',
  };

  return (
    <div className={`p-3 rounded-lg ${colors[item.status]}`}>
      <div className="flex items-start gap-2">
        <span className="text-lg">{icons[item.status]}</span>
        <div className="flex-1">
          <div className="font-medium text-sm">{item.label}</div>
          {item.message && (
            <div className="text-xs mt-1 opacity-80">{item.message}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const percentage = Math.round(score * 100);
  const color = percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
