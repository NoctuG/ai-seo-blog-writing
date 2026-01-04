import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import config from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: config.site.name,
    template: `%s | ${config.site.name}`,
  },
  description: config.site.description,
  keywords: ['AI', 'SEO', 'blog', 'content generation', '博客生成', 'AI写作'],
  authors: [{ name: config.site.author }],
  creator: config.site.author,
  metadataBase: new URL(config.site.url),
  openGraph: {
    type: 'website',
    locale: config.site.language,
    url: config.site.url,
    title: config.site.name,
    description: config.site.description,
    siteName: config.site.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: config.site.name,
    description: config.site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={config.site.language}>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{config.site.name}</h1>
                <div className="flex gap-4">
                  <a href="/" className="hover:text-blue-600">首页</a>
                  <a href="/generate" className="hover:text-blue-600">生成文章</a>
                  <a href="/articles" className="hover:text-blue-600">文章列表</a>
                  <a href="/tools" className="hover:text-blue-600">SEO工具</a>
                </div>
              </div>
            </nav>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="border-t mt-auto">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
              <p>&copy; {new Date().getFullYear()} {config.site.name}. All rights reserved.</p>
              <p className="mt-2">AI驱动的SEO博客生成系统</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
