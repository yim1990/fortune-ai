import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '여우도령 정통사주 - AI와 전통이 만나는 새로운 사주 서비스',
  description: '전통 사주를 AI 기술과 웹툰 형식으로 재해석하여, 20-30대 여성이 쉽고 재미있게 자신의 운세를 이해할 수 있도록 돕는 온라인 서비스입니다.',
  keywords: ['사주', '운세', 'AI', '웹툰', '여우도령', '정통사주', '사주팔자', '만세력'],
  authors: [{ name: '여우도령 정통사주' }],
  creator: '여우도령 정통사주',
  publisher: '여우도령 정통사주',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fortune-ai.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '여우도령 정통사주 - AI와 전통이 만나는 새로운 사주 서비스',
    description: '전통 사주를 AI 기술과 웹툰 형식으로 재해석하여, 20-30대 여성이 쉽고 재미있게 자신의 운세를 이해할 수 있도록 돕는 온라인 서비스입니다.',
    url: 'https://fortune-ai.com',
    siteName: '여우도령 정통사주',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: '여우도령 정통사주',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '여우도령 정통사주 - AI와 전통이 만나는 새로운 사주 서비스',
    description: '전통 사주를 AI 기술과 웹툰 형식으로 재해석하여, 20-30대 여성이 쉽고 재미있게 자신의 운세를 이해할 수 있도록 돕는 온라인 서비스입니다.',
    images: ['/android-chrome-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/site.webmanifest',
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-white text-gray-900 antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
