import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Notes', href: '/notes' },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <img src={`${import.meta.env.BASE_URL}logo-header.png`} alt="CampusConnect Logo" className="w-10 h-10 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-200" />
              <span className="font-bold text-lg lg:text-xl text-white">
                CampusConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative font-medium transition-colors link-underline ${
                    isActive(link.href)
                      ? 'text-white font-bold'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/ask-ai">
                <Button 
                  className="bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 btn-hover"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
              Ask AI
            </Button>
              </Link>
              <Link to="/admin">
                <Button
                  className="bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
              <Shield className="w-4 h-4 mr-1.5" />
              Admin
            </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="font-bold text-xl text-orange-600">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-xl font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/ask-ai"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Ask AI
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 py-3 px-4 rounded-xl font-medium border-2 border-orange-500 text-orange-600 hover:bg-orange-50 transition-all"
            >
              <Shield className="w-5 h-5" />
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
