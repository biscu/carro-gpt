'use client';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';

const CHAT_STORAGE_KEY = 'chat:main-chat';

type ChatContextValue = {
  messages: any[];
  sendMessage: (input: { text: string }) => Promise<void>;
  reset: () => void;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Start with empty messages to ensure server-client consistency
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  
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
    sendMessage,
    reset: () => setMessages([]),
    status,
  }), [messages, sendMessage, setMessages, status]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within a ChatProvider');
  return ctx;
}
