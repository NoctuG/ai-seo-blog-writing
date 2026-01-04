import ArticleGenerator from '@/components/ArticleGenerator';

export const metadata = {
  title: '生成文章',
  description: '使用AI快速生成SEO优化的高质量博客文章',
};

export default function GeneratePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">生成新文章</h1>
          <p className="text-gray-600">
            输入主题和关键词，AI将为您生成SEO优化的高质量内容
          </p>
        </div>

        <ArticleGenerator />

        <div className="mt-12 p-6 bg-blue-50 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">💡 使用提示</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• 选择3-5个相关关键词以获得最佳SEO效果</li>
            <li>• 明确目标受众有助于生成更有针对性的内容</li>
            <li>• 中篇文章（1500字）通常最适合SEO排名</li>
            <li>• 生成后可以在编辑器中进一步优化内容</li>
            <li>• AI会自动分析SERP并融入最佳实践</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
