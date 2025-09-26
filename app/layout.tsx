import type { Metadata } from 'next';
import './globals.css';
import { fontSans } from './fonts/fonts';
import { ChatProvider } from '@/app/context/chat-context';

export const metadata: Metadata = {
  title: 'Carro GPT',
  description: 'AI Assistant for Carro',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://carro-gpt.example.com'),
  openGraph: {
    title: 'Carro GPT',
    description: 'AI assistant helps with UX copywriting by providing style-consistent suggestions',
    url: '/',
    siteName: 'Carro GPT',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Carro GPT – AI assistant helps with UX copywriting by providing style-consistent suggestions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carro GPT',
    description: 'AI assistant helps with UX copywriting by providing style-consistent suggestions',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans} bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100`}>
        <ChatProvider>
          {children}
        </ChatProvider>
      </body>
    </html>
  );
}
