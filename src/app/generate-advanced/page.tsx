import AdvancedArticleGenerator from '@/components/AdvancedArticleGenerator';

export const metadata = {
  title: '高级文章生成器',
  description: '使用高级设置生成专业的SEO优化博客文章',
};

export default function AdvancedGeneratePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">高级文章生成器</h1>
          <p className="text-gray-600">
            精细化控制每个细节，生成完全符合您需求的专业文章
          </p>
        </div>

        <AdvancedArticleGenerator />

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">快速生成</h3>
            <p className="text-sm text-gray-600">
              平均2-3分钟即可生成高质量文章
            </p>
          </div>

          <div className="card text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">精准定制</h3>
            <p className="text-sm text-gray-600">
              9大设置模块，100+可调参数
            </p>
          </div>

          <div className="card text-center">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-semibold mb-2">SEO优化</h3>
            <p className="text-sm text-gray-600">
              自动优化，平均SEO评分85+
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
