import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, Bot, Loader2, Home, Plus, Menu, Search, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { aiApi } from '@/services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AskAIPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Call the new AI API that searches both notes and internet
      const response = await aiApi.ask(currentInput);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.success && response.data ? response.data.answer : "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "An error occurred while fetching the answer. Please check your connection.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <main className="fixed inset-0 flex flex-col bg-[#0a0a0a] text-gray-100">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          <span className="text-sm font-medium text-gray-300">New chat</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={startNewChat}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          /* Initial Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in fade-in duration-700">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
              <Bot className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-semibold text-white mb-2">How can I help you?</h2>
            <p className="text-gray-500 text-center max-w-md text-sm">
              Ask me anything about accounting. I'll check your notes first, then search the web if needed.
            </p>
          </div>
        ) : (
          /* Chat Messages */
          <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-blue-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-[#2f2f2f] text-white'
                        : 'text-gray-200'
                    }`}
                  >
                    <div className="whitespace-pre-line text-[15px] leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Searching notes & web...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Bottom Input Area - Fixed */}
      <div className="border-t border-white/5 bg-[#0a0a0a] px-4 py-4 sm:py-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Main Input Box */}
          <div className="relative flex items-end gap-2 bg-[#1a1a1a] border border-white/10 rounded-2xl p-3 focus-within:border-white/20 transition-all shadow-lg hover:border-white/15">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message or hold to speak"
              className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder:text-gray-500 py-2 px-1 resize-none max-h-32 outline-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`rounded-full w-10 h-10 p-0 flex items-center justify-center flex-shrink-0 transition-all ${
                input.trim() 
                  ? 'bg-white text-black hover:bg-gray-200 cursor-pointer' 
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center gap-2 px-1">
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-xs text-gray-400 transition-all">
              <Brain className="w-4 h-4" />
              Think
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-full border border-blue-500/30 text-xs text-blue-400 transition-all">
              <Search className="w-4 h-4" />
              Search
            </button>
            <span className="text-xs text-gray-600 ml-auto">AI responses based on your notes</span>
          </div>
        </div>
      </div>
    </main>
  );
}
