import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function FloatingAskAI() {
  return (
    <Link
      to="/ask-ai"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Ask AI"
    >
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Ask AI
        <div className="absolute top-full right-6 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>

      {/* Glow ring */}
      <div className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping" />
      
      {/* Button */}
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 animate-pulse-glow">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
    </Link>
  );
}
