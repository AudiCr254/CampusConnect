import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  BarChart3, 
  Building2, 
  Users, 
  Building, 
  Factory, 
  Heart, 
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { topicsApi, type Topic } from '@/services/api';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  FileText,
  BarChart3,
  Building2,
  Users,
  Building,
  Factory,
  Heart,
  AlertCircle,
};

// Static topics as fallback
const staticTopics: Topic[] = [
  { id: 1, name: 'Introduction to Accounting', description: 'Learn the fundamentals of accounting, its nature, purpose, and the accounting equation.', color: '#3b82f6', icon: 'BookOpen', note_count: 4, created_at: '' },
  { id: 2, name: 'Recording Transactions', description: 'Master source documents, journals, and the recording process.', color: '#10b981', icon: 'FileText', note_count: 2, created_at: '' },
  { id: 3, name: 'Financial Statements', description: 'Understand income statements, balance sheets, and cash flow statements.', color: '#8b5cf6', icon: 'BarChart3', note_count: 2, created_at: '' },
  { id: 4, name: 'Assets & Liabilities', description: 'Learn about depreciation, property, plant, equipment, and liability management.', color: '#f97316', icon: 'Building2', note_count: 2, created_at: '' },
  { id: 5, name: 'Partnership Accounts', description: 'Study partnership agreements, profit sharing, and partnership financial statements.', color: '#ec4899', icon: 'Users', note_count: 2, created_at: '' },
  { id: 6, name: 'Company Accounts', description: 'Explore share capital, company financial statements, and corporate accounting.', color: '#6366f1', icon: 'Building', note_count: 2, created_at: '' },
  { id: 7, name: 'Manufacturing Accounts', description: 'Learn cost classification, manufacturing accounts, and production costing.', color: '#14b8a6', icon: 'Factory', note_count: 1, created_at: '' },
  { id: 8, name: 'Non-Profit Organizations', description: 'Understand receipts and payments accounts, income and expenditure accounts.', color: '#ef4444', icon: 'Heart', note_count: 1, created_at: '' },
  { id: 9, name: 'Correction of Errors', description: 'Master suspense accounts and different types of accounting errors.', color: '#eab308', icon: 'AlertCircle', note_count: 1, created_at: '' },
];

export function TopicsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [topics, setTopics] = useState<Topic[]>(staticTopics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch topics from API
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await topicsApi.getAll();
        if (response.success && response.data && response.data.length > 0) {
          setTopics(response.data);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
        // Keep using static topics as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className={`text-3xl sm:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Accounting Topics
          </h2>
          <div 
            className={`w-24 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto rounded-full mb-4 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
          />
          <p 
            className={`text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Comprehensive coverage of all accounting principles from basic concepts to advanced financial reporting
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {topics.map((topic, index) => {
            const Icon = iconMap[topic.icon] || BookOpen;
            const rotations = [-1, 0, 1];
            const rotation = rotations[index % 3];
            
            return (
              <Link
                key={topic.id}
                to={`/notes?topic=${topic.id}`}
                className={`group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden card-hover ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${300 + index * 100}ms`,
                  transform: isVisible ? `rotate(${rotation}deg)` : `rotate(${rotation}deg) translateY(48px)`,
                }}
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-6 lg:p-8">
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: topic.color }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {topic.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {topic.note_count || 0} lessons
                    </span>
                    <span className="flex items-center gap-1 text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
