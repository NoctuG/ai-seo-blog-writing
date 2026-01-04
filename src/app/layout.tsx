import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import config from '@/lib/config';
import ThemeRegistry from '@/components/ThemeRegistry';
import NavigationBar from '@/components/NavigationBar';

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
        <ThemeRegistry>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavigationBar />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <footer style={{
              borderTop: '1px solid #e0e0e0',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#fafafa',
            }}>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                &copy; {new Date().getFullYear()} {config.site.name}. All rights reserved.
              </p>
              <p style={{ margin: '8px 0 0', color: '#888', fontSize: '12px' }}>
                AI驱动的SEO博客生成系统
              </p>
            </footer>
          </div>
        </ThemeRegistry>
      </body>
    </html>
  );
}
