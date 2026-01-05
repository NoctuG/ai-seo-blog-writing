import type { Metadata } from 'next';
import './globals.css';
import config from '@/lib/config';
import ThemeRegistry from '@/components/ThemeRegistry';
import LayoutContent from '@/components/LayoutContent';

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
      <body>
        <ThemeRegistry>
          <LayoutContent>{children}</LayoutContent>
        </ThemeRegistry>
      </body>
    </html>
  );
}
