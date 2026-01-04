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
          <div className="flex gap-4 justify-center">
            <Link
              href="/generate"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              开始生成文章
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

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-gray-600 mb-6">
            支持Claude和OpenAI，轻量化部署，完全免费使用
          </p>
          <Link
            href="/generate"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            立即开始
          </Link>
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
