import { useEffect, useRef, useState } from 'react';
import { Check, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { features } from '@/data/notes';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  BookOpen,
  HelpCircle,
};

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleFeatures, setVisibleFeatures] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    features.forEach((_, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleFeatures((prev) => new Set([...prev, index]));
          }
        },
        { threshold: 0.2 }
      );

      const element = document.getElementById(`feature-${index}`);
      if (element) {
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose CampusConnect?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to master accounting in one place
          </p>
        </div>

        {/* Features */}
        <div className="space-y-20 lg:space-y-32">
          {features.map((feature, index) => {
            const isVisible = visibleFeatures.has(index);
            const FeatureIcon = iconMap[feature.id === 'ai' ? 'Sparkles' : feature.id === 'practice' ? 'HelpCircle' : 'BookOpen'];
            
            return (
              <div
                key={feature.id}
                id={`feature-${index}`}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  feature.reverse ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div
                  className={`relative ${feature.reverse ? 'lg:order-2' : ''} transition-all duration-700 ${
                    isVisible
                      ? 'opacity-100 translate-x-0'
                      : `opacity-0 ${feature.reverse ? 'translate-x-16' : '-translate-x-16'}`
                  }`}
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                    {/* Decorative blur */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-64 lg:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
                    </div>
                  </div>

                  {/* Floating badge */}
                  <div className={`absolute -bottom-6 ${feature.reverse ? '-left-6' : '-right-6'} bg-white rounded-2xl shadow-xl p-4 animate-float`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FeatureIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{feature.title}</p>
                        <p className="text-sm text-gray-500">Available</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`${feature.reverse ? 'lg:order-1' : ''} transition-all duration-700 delay-200 ${
                    isVisible
                      ? 'opacity-100 translate-x-0'
                      : `opacity-0 ${feature.reverse ? '-translate-x-16' : 'translate-x-16'}`
                  }`}
                >
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Feature Points */}
                  <ul className="space-y-4">
                    {feature.points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className={`flex items-center gap-3 transition-all duration-500 ${
                          isVisible
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-4'
                        }`}
                        style={{ transitionDelay: `${400 + pointIndex * 100}ms` }}
                      >
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
