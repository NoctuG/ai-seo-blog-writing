'use client';

import { SEOScore } from '@/types';

interface SEOScoreCardProps {
  score: SEOScore;
}

export default function SEOScoreCard({ score }: SEOScoreCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 0.8) return 'text-green-600';
    if (value >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (value: number) => {
    if (value >= 0.8) return '优秀';
    if (value >= 0.6) return '良好';
    return '需改进';
  };

  const formatScore = (value: number) => Math.round(value * 100);

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">SEO评分</h2>

      {/* Overall Score */}
      <div className="mb-8 text-center">
        <div className={`text-6xl font-bold ${getScoreColor(score.overall)}`}>
          {formatScore(score.overall)}
        </div>
        <div className="text-gray-600 mt-2">综合评分</div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <ScoreItem
          label="关键词优化"
          score={score.keywordOptimization}
          color={getScoreColor(score.keywordOptimization)}
        />
        <ScoreItem
          label="内容质量"
          score={score.contentQuality}
          color={getScoreColor(score.contentQuality)}
        />
        <ScoreItem
          label="技术SEO"
          score={score.technicalSEO}
          color={getScoreColor(score.technicalSEO)}
        />
        <ScoreItem
          label="用户体验"
          score={score.userExperience}
          color={getScoreColor(score.userExperience)}
        />
      </div>

      {/* E-E-A-T Score */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-semibold mb-3">E-E-A-T 评分</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-gray-600">经验 (Experience)</div>
            <div className="font-semibold">{formatScore(score.details.eatScore.experience)}%</div>
          </div>
          <div>
            <div className="text-gray-600">专业 (Expertise)</div>
            <div className="font-semibold">{formatScore(score.details.eatScore.expertise)}%</div>
          </div>
          <div>
            <div className="text-gray-600">权威 (Authority)</div>
            <div className="font-semibold">{formatScore(score.details.eatScore.authority)}%</div>
          </div>
          <div>
            <div className="text-gray-600">可信 (Trust)</div>
            <div className="font-semibold">{formatScore(score.details.eatScore.trustworthiness)}%</div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-semibold mb-3">详细信息</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">可读性评分</span>
            <span className="font-semibold">
              {formatScore(score.details.readabilityScore)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">内部链接</span>
            <span className="font-semibold">{score.details.internalLinks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">外部链接</span>
            <span className="font-semibold">{score.details.externalLinks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">图片优化</span>
            <span className="font-semibold">
              {formatScore(score.details.imageOptimization)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreItem({ label, score, color }: { label: string; score: number; color: string }) {
  const percentage = Math.round(score * 100);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className={`text-sm font-semibold ${color}`}>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            score >= 0.8 ? 'bg-green-600' : score >= 0.6 ? 'bg-yellow-600' : 'bg-red-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
