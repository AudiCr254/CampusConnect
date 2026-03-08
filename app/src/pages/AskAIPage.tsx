import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles, User, Bot, Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notesApi } from '@/services/api';
import { notes as staticNotes } from '@/data/notes';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AskAIPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your CampusConnect AI assistant. I can help you with accounting concepts, explain topics from your notes, and answer questions about financial statements, recording transactions, depreciation, partnerships, company accounts, and more. What would you like to learn about?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const findRelevantContent = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();
    
    // Try to search from API first
    try {
      const searchRes = await notesApi.search(query);
      if (searchRes.success && searchRes.data && searchRes.data.length > 0) {
        const note = searchRes.data[0];
        return `Based on the ${note.topic_name || 'accounting'} notes:\n\n${note.title}:\n${note.content ? note.content.substring(0, 800) : note.description}${(note.content?.length || 0) > 800 ? '...' : ''}`;
      }
    } catch (error) {
      console.log('API search failed, using fallback');
    }

    // Fallback to static notes
    const relevantNotes = staticNotes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(lowerQuery);
      const contentMatch = note.content.toLowerCase().includes(lowerQuery);
      return titleMatch || contentMatch;
    });

    if (relevantNotes.length > 0) {
      const note = relevantNotes[0];
      return `Based on the accounting notes:\n\n${note.title}:\n${note.content.substring(0, 800)}${note.content.length > 800 ? '...' : ''}`;
    }

    // Default responses for common accounting questions
    if (lowerQuery.includes('accounting equation')) {
      return `The Accounting Equation is the foundation of all accounting:\n\n**Assets = Liabilities + Owner's Equity**\n\nThis equation shows that what a company owns (Assets) is equal to what it owes to creditors (Liabilities) plus what belongs to the owners (Equity). It must always remain in balance after every transaction.`;
    }

    if (lowerQuery.includes('depreciation')) {
      return `**Depreciation** is the systematic allocation of the cost of a tangible asset over its useful life.\n\n**Common Methods:**\n1. **Straight Line:** (Cost - Residual Value) / Useful Life\n2. **Reducing Balance:** Fixed % on reducing book value\n3. **Sum of Years' Digits:** Based on remaining life fraction\n\nDepreciation helps match the cost of using an asset with the revenue it generates.`;
    }

    if (lowerQuery.includes('financial statement')) {
      return `**Financial Statements** include:\n\n1. **Income Statement (Trading & P&L):** Shows revenue, expenses, and profit/loss\n2. **Statement of Financial Position (Balance Sheet):** Shows assets, liabilities, and equity at a point in time\n3. **Cash Flow Statement:** Shows cash inflows and outflows\n\nThese statements provide a complete picture of a business's financial performance and position.`;
    }

    if (lowerQuery.includes('partnership')) {
      return `A **Partnership** is a business owned by two or more persons carrying on business with a view to profit (Partnership Act 1962).\n\n**Key Elements:**\n- Profit sharing ratio\n- Capital contributions\n- Interest on capital and drawings\n- Partner salaries\n- Unlimited liability (for general partners)\n\nPartnership accounts include Appropriation Account to distribute profits.`;
    }

    if (lowerQuery.includes('share') || lowerQuery.includes('company')) {
      return `**Types of Share Capital:**\n\n**Ordinary Shares:**\n- Voting rights\n- Variable dividends\n- Last in liquidation\n\n**Preference Shares:**\n- Fixed dividend\n- No voting rights (usually)\n- Paid before ordinary shares\n\n**Issue Terms:**\n- At Par: Issue price = Nominal value\n- At Premium: Issue price > Nominal value\n- At Discount: Issue price < Nominal value (illegal in Kenya)`;
    }

    return `I don't have specific notes on that topic yet. However, I can help you with:\n\n• Introduction to Accounting\n• Recording Transactions\n• Financial Statements\n• Assets & Liabilities (including Depreciation)\n• Partnership Accounts\n• Company Accounts\n• Manufacturing Accounts\n• Non-Profit Organizations\n• Correction of Errors\n\nTry asking about any of these topics, or browse the Notes section for comprehensive study materials.`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Get AI response
    const response = await findRelevantContent(userMessage.content);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="fixed inset-0 flex flex-col bg-gradient-to-b from-blue-50 to-white pt-16">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CampusConnect AI Assistant</h1>
            <p className="text-xs text-gray-500">Your accounting study companion</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4 sm:px-6 lg:px-8 py-6" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-blue-100'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-2xl rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' 
                      ? 'text-blue-100' 
                      : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-100 bg-white shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about accounting..."
                className="flex-1 bg-gray-50 border-gray-200 rounded-full px-4"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              AI responses are based on CampusConnect accounting notes
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
