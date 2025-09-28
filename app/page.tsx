'use client';

import { useChatContext } from '@/app/context/chat-context';
import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Thinking from './components/Thinking';
import Banner from './components/Banner';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChatContext();
  const [showThinking, setShowThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle thinking component delay
  useEffect(() => {
    if (status === 'submitted') {
      // Start the delay timer
      thinkingTimeoutRef.current = setTimeout(() => {
        setShowThinking(true);
      }, 1000); // 1000ms delay
    } else {
      // Clear the timer and hide thinking component
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
        thinkingTimeoutRef.current = null;
      }
      setShowThinking(false);
    }

    // Cleanup on unmount
    return () => {
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
      }
    };
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };


  return (
    <div className="flex min-h-screen bg-white">
      {/* SVG Filter for paper texture */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="roughpaper">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" result="noise" numOctaves="5" />
            <feDiffuseLighting in="noise" lighting-color="#fff" surfaceScale="0.7">
              <feDistantLight azimuth="45" elevation="80" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MobileNav onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex-1 md:pl-80 flex flex-col h-screen overflow-hidden pt-16 md:pt-0 relative">
        {/* Paper texture background layer */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'url(#roughpaper)' }}
        />
        
        {/* Messages container with scrolling */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto relative z-10"
        >
          <div className="max-w-4xl mx-auto px-6 py-8">
            {!hasMessages ? (
              <div className="h-full flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="p-8 flex items-center justify-center mb-4 mx-auto">
                    <img src="/typewriter.svg" alt="" />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">Welcome to Carro GPT</h2>
                  <p className="mt-2 text-gray-600 text-center max-w-md mx-auto">
                    Start a conversation by typing a message below. I'm here to help you with any questions you might have regarding UX copywriting.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-4 rounded-lg ${
                        m.role === 'user' 
                          ? 'bg-[#0D234B] text-white' 
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {m.parts.map((part: any, index: any) => {
                          // Handle different types of message parts
                          if ('text' in part) {
                            return <span key={index}>{part.text}</span>;
                          } else if ((part as any).type === 'dynamic-tool') {
                            // Handle tool call parts
                            return (
                              <div key={index} className="text-sm text-gray-500">
                                [Tool call: {part.toolName}]
                              </div>
                            );
                          }
                          // Fallback for any other part types
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Thinking component - shows only after 500ms delay if still submitted */}
                <Thinking isVisible={showThinking} />
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 mb-4 md:mb-16 relative z-10">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="max-w-4xl mx-auto">
              <Banner
                title="Hey you, sexy!"
                description="This is an early concept. Reloading the page will clear your chat history."
                storageKey="banner:welcome:v1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-6 py-4 border border-gray-300 rounded-full transition-all duration-200 ease-in-out outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#0D234B] focus-visible:ring-offset-0"
                disabled={status === 'submitted' || status === 'streaming'}
              />
              <button
                type="submit"
                className="bg-[#0D234B] hover:bg-[#0D234B]/90 text-white p-3 rounded-full transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D234B] focus-visible:ring-offset-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
                disabled={status === 'submitted' || status === 'streaming'}
              >
                <svg width="24" height="25" viewBox="0 0 24 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path fillRule="evenodd" clipRule="evenodd" d="M21 12.3677C21.0008 12.757 20.7756 13.1114 20.4229 13.276L5.42286 20.276C5.01109 20.4682 4.52152 20.3585 4.23102 20.0091C3.94052 19.6597 3.92212 19.1583 4.18624 18.7886L8.77107 12.3698L7.31124 10.326C6.99023 9.87662 7.09432 9.25207 7.54374 8.93106C7.99315 8.61006 8.6177 8.71415 8.93871 9.16356L10.8137 11.7886C11.0621 12.1363 11.0621 12.6033 10.8137 12.951L8.02568 16.8543L17.6245 12.3748L6.58092 7.27777C6.07946 7.04633 5.86058 6.4522 6.09201 5.95075C6.32345 5.4493 6.91758 5.23041 7.41903 5.46185L20.419 11.4618C20.7725 11.625 20.9991 11.9784 21 12.3677ZM4.99996 4.36981C5.55224 4.3698 5.99996 4.8175 5.99997 5.36979L5.99997 5.37979C5.99998 5.93207 5.55228 6.3798 4.99999 6.37981C4.44771 6.37982 3.99998 5.93211 3.99997 5.37982L3.99997 5.36982C3.99996 4.81754 4.44767 4.36982 4.99996 4.36981Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}