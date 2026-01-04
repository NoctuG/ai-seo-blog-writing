import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            轻松生成高质量文章
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI驱动的内容生成，自动SEO优化，让您的博客脱颖而出
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/generate"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              快速生成
            </Link>
            <Link
              href="/generate-advanced"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              ⚡ 高级生成器
            </Link>
            <Link
              href="/articles"
              className="px-8 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors font-semibold"
            >
              查看示例
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon="🤖"
            title="AI驱动的内容生成"
            description="输入关键词，AI自动分析搜索意图并生成高质量文章"
          />
          <FeatureCard
            icon="📊"
            title="自动SERP分析"
            description="了解用户搜索意图，获取与目标受众共鸣的内容推荐"
          />
          <FeatureCard
            icon="🔍"
            title="SEO优化"
            description="自动关键词嵌入、链接插入、元标签生成等全方位SEO优化"
          />
          <FeatureCard
            icon="📈"
            title="热门话题发现"
            description="识别并利用当前趋势，创建相关且引人入胜的内容"
          />
          <FeatureCard
            icon="✅"
            title="质量评分"
            description="基于Google E-E-A-T原则评估文章质量和可信度"
          />
          <FeatureCard
            icon="📱"
            title="移动优化"
            description="响应式设计，PWA支持，确保完美的移动体验"
          />
        </section>

        {/* Generator Options */}
        <section className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="card hover:shadow-xl transition-shadow border-2 border-blue-200">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-2xl font-bold mb-3">快速生成</h3>
            <p className="text-gray-600 mb-4">
              简洁的界面，几步操作即可生成文章。适合快速创作需求。
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✓ 简单易用</li>
              <li>✓ 快速生成</li>
              <li>✓ 自动SEO优化</li>
            </ul>
            <Link
              href="/generate"
              className="btn btn-primary w-full"
            >
              使用快速生成
            </Link>
          </div>

          <div className="card hover:shadow-xl transition-shadow border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-2xl font-bold mb-3">高级生成器</h3>
            <p className="text-gray-600 mb-4">
              9大设置模块，100+可调参数。完全掌控文章的每个细节。
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✓ 精细化控制</li>
              <li>✓ 品牌声音定制</li>
              <li>✓ 社交媒体同步</li>
              <li>✓ 媒体中心集成</li>
            </ul>
            <Link
              href="/generate-advanced"
              className="btn w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              使用高级生成器
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-gray-600 mb-6">
            支持Claude和OpenAI，轻量化部署，完全免费使用
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/generate"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              快速开始
            </Link>
            <Link
              href="/generate-advanced"
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
            >
              高级设置
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
