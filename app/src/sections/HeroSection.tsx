import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import campusStudentsImg from '@/assets/campus-students.jpg';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

export function HeroSection({ searchQuery, onSearchChange, onSearch }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const parallaxElements = heroRef.current.querySelectorAll('.parallax');
      parallaxElements.forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.speed || '0.5');
        (el as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6 animate-fade-in">
              <BookOpen className="w-4 h-4" />
              <span>For Accounting Students</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 animate-slide-up stagger-1">
              Master{' '}
              <span className="text-gradient">Accounting</span>{' '}
              with CampusConnect
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up stagger-2">
              Your comprehensive learning platform for accounting principles, financial statements, 
              and exam preparation. Access notes, practice questions, and AI assistance anytime.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto lg:mx-0 animate-slide-up stagger-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
                  <Search className="w-5 h-5 text-gray-400 ml-4" />
                  <Input
                    type="text"
                    placeholder="Search accounting topics..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 placeholder:text-gray-400 py-6"
                  />
                  <Button
                    type="submit"
                    className="mr-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 justify-center lg:justify-start animate-slide-up stagger-4">
              <Link to="/notes">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-hover px-8"
                >
                  Explore Notes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/ask-ai">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 px-8"
                >
                  Ask AI Assistant
                </Button>
              </Link>
            </div>

            {/* Stats Preview */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-10 animate-slide-up stagger-5">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-900">10+</p>
                <p className="text-sm text-gray-500">Topics</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-900">50+</p>
                <p className="text-sm text-gray-500">Notes</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-900">24/7</p>
                <p className="text-sm text-gray-500">AI Help</p>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative lg:h-[600px] flex items-center justify-center parallax" data-speed="0.1">
            <div className="relative w-full max-w-lg">
              {/* Decorative Elements */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-orange-400/20 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-400/20 rounded-full blur-xl" />
              
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent z-10" />
                <img
                  src={campusStudentsImg}
                  alt="Campus Students"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Study Notes</p>
                    <p className="text-sm text-gray-500">Available Now</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white" />
                    <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white" />
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">+1k Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
