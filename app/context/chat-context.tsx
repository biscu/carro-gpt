'use client';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';

const CHAT_STORAGE_KEY = 'chat:main-chat';

type ChatError = { type: 'rate_limit' | 'other'; message: string } | null;

type ChatContextValue = {
  messages: any[];
  sendMessage: (input: { text: string }) => Promise<void>;
  reset: () => void;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  error: ChatError;
  clearError: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Start with empty messages to ensure server-client consistency
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [error, setError] = useState<ChatError>(null);
  
  // Load messages from localStorage only on the client side after mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
      const savedMessages = raw ? JSON.parse(raw) : [];
      setInitialMessages(savedMessages);
    } catch {
      // ignore storage errors
    }
  }, []);

  const { messages, sendMessage, setMessages, status } = useChat({
    id: 'main-chat',
    messages: initialMessages,
    onError: (err: any) => {
      const msg = String(err?.message || 'Something went wrong');
      const status = (err as any)?.status ?? (err as any)?.response?.status;
      const isRate = status === 429 || /rate limit|too many requests/i.test(msg) || (err as any)?.code === 'rate_limit_exceeded';
      setError({ type: isRate ? 'rate_limit' : 'other', message: msg });
    },
    onFinish() {
      // Clear previous error on successful response start
      setError(null);
    },
  });

  // Persist to localStorage when messages change
  useEffect(() => {
    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore storage errors
    }
  }, [messages]);

  const value = useMemo<ChatContextValue>(() => ({
    messages,
    sendMessage: async (input) => {
      // clear error when user retries
      setError(null);
      await sendMessage(input);
    },
    reset: () => {
      setMessages([]);
      setError(null);
    },
    status,
    error,
    clearError: () => setError(null),
  }), [messages, sendMessage, setMessages, status, error]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within a ChatProvider');
  return ctx;
}
