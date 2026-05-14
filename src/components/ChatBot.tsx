import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, ExternalLink, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { askStockQuestion } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { url: string; title: string }[];
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Capital Prime assistant. Ask me anything about Singapore stocks or market trends.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await askStockQuestion(userMessage);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.text,
        sources: response.sources
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I encountered an error while processing your request. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-28 right-6 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-2xl z-50 flex items-center justify-center border border-primary/20"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 md:w-96 bg-surface-container border border-outline-variant rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-[70vh]"
          >
            {/* Header */}
            <div className="bg-surface-container-high px-4 py-3 flex items-center justify-between border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline text-sm font-bold">Terminal AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-up rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-surface-container-highest rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary-container text-on-primary-container rounded-tr-none' 
                      : 'bg-surface-container-highest text-on-surface rounded-tl-none border border-outline-variant/30'
                  }`}>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-outline-variant/20 space-y-1.5">
                        <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest opacity-50">Sources</p>
                        {msg.sources.map((source, sIdx) => (
                          <a 
                            key={sIdx} 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[11px] text-primary hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate">{source.title || source.url}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-highest p-3 rounded-2xl rounded-tl-none border border-outline-variant/30">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-surface-container-high border-t border-outline-variant">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about DBS, Singtel, REITs..."
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-primary transition-colors text-on-surface placeholder:text-on-surface-variant/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-primary-container text-on-primary-container rounded-lg disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
