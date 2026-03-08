import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Heart } from 'lucide-react';
import audiGodfreyImg from '@/assets/audi-godfrey.jpg';
import audiLogoImg from '@/assets/audi-logo.png';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Notes', href: '/notes' },
  { label: 'Ask AI', href: '/ask-ai' },
];

const topicLinks = [
  { label: 'Introduction to Accounting', href: '/notes?topic=intro' },
  { label: 'Financial Statements', href: '/notes?topic=statements' },
  { label: 'Recording Transactions', href: '/notes?topic=recording' },
  { label: 'Assets & Liabilities', href: '/notes?topic=assets' },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo-header.png" alt="CampusConnect Logo" className="w-10 h-10 rounded-xl" />
              <span className="font-bold text-xl">CampusConnect</span>
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed mb-6">
              Empowering accounting students worldwide with comprehensive learning resources and AI-powered assistance.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/audiaudae"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/gody-audi2"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-blue-200 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:bg-white transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Topics</h3>
            <ul className="space-y-3">
              {topicLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-blue-200 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:bg-white transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creator */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Developer</h3>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-400 ring-2 ring-orange-400/30">
                  <img
                    src={audiGodfreyImg}
                    alt="Audi Godfrey"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">Audi Godfrey</p>
                  <p className="text-blue-200 text-sm">Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-orange-300 text-sm">
                <img
                  src={audiLogoImg}
                  alt="Audi Godfrey Logo"
                  className="w-6 h-6 object-contain"
                />
                <span className="italic">"Rooted, Not Rushed"</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-blue-200 text-sm text-center md:text-left">
              © {new Date().getFullYear()} CampusConnect. All rights reserved.
            </p>
            <p className="text-blue-200 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> by Audi Godfrey
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
