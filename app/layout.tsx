import type { Metadata } from 'next';
import './globals.css';
import { fontSans } from './fonts/fonts';
import { ChatProvider } from '@/app/context/chat-context';

export const metadata: Metadata = {
  title: 'Carro GPT',
  description: 'AI Assistant for Carro',
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
