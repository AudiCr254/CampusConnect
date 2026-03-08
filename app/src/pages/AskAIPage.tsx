import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Home, Plus, Search, Brain, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  }, [messages, isLoading]);

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

  const setSuggestedInput = (text: string) => {
    setInput(text);
    if (textareaRef.current) textareaRef.current.focus();
  };

  return (
    <main className="fixed inset-0 flex flex-col bg-[#0a0a0f] text-[#f8fafc] font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] top-[-200px] right-[-200px] rounded-full blur-[80px] opacity-20 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] bottom-[-100px] left-[-100px] rounded-full blur-[80px] opacity-20 animate-pulse delay-1000" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-white/10 bg-[#0a0a0f]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#6366f1] bg-clip-text text-transparent">
            CampusConnect AI
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={startNewChat} className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all">
            <Plus className="w-5 h-5" />
          </button>
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all">
            <Home className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4">
              <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                How can I help you?
              </h2>
              <p className="text-lg text-gray-400 max-w-xl mx-auto">
                Your advanced accounting study companion. Ask about concepts, notes, or general accounting principles.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
              {[
                "What is the accounting equation?",
                "Explain depreciation methods",
                "How to prepare a balance sheet?",
                "Partnership profit sharing",
                "Types of share capital"
              ].map((text, i) => (
                <button
                  key={i}
                  onClick={() => setSuggestedInput(text)}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/10 transition-all backdrop-blur-sm"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages List */
          <ScrollArea className="flex-1 px-6 py-8" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-8">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-5 group animate-in fade-in slide-in-from-left-4 duration-300 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white' 
                      : 'bg-[#12121a] border border-white/10 text-[#6366f1]'
                  }`}>
                    {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`flex-1 px-5 py-4 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
                    message.role === 'user'
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-white rounded-tr-none'
                      : 'bg-[#12121a]/80 border-white/10 text-gray-200 rounded-tl-none'
                  }`}>
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="whitespace-pre-line text-[15px] leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-5 animate-in fade-in duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#12121a] border border-white/10 flex items-center justify-center flex-shrink-0 text-[#6366f1]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-[#12121a]/80 border border-white/10 rounded-2xl rounded-tl-none px-6 py-5 flex items-center gap-3">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    </div>
                    <span className="text-sm text-gray-400 font-medium">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Area */}
      <div className="relative z-20 px-6 pb-10 pt-4 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-[24px] blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
            <div className="relative flex items-end gap-3 bg-[#12121a]/90 border border-white/10 rounded-[22px] p-3 backdrop-blur-xl shadow-2xl">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message or hold to speak..."
                className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder:text-gray-500 py-3 px-4 resize-none max-h-32 outline-none text-[15px]"
                disabled={isLoading}
              />
              <div className="flex items-center gap-2 p-1">
                <button className="p-2.5 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                  <Plus className="w-5 h-5" />
                </button>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`rounded-full w-11 h-11 p-0 flex items-center justify-center transition-all duration-300 shadow-lg ${
                    input.trim() 
                      ? 'bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white hover:scale-105 hover:shadow-indigo-500/40' 
                      : 'bg-white/5 text-gray-600'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-xs text-gray-400 transition-all hover:text-white">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                Think
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-full border border-indigo-500/20 text-xs text-indigo-400 transition-all">
                <Search className="w-3.5 h-3.5" />
                Search
              </button>
            </div>
            <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
              AI can make mistakes. Check important info.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
