import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/sections/HeroSection';
import { TopicsSection } from '@/sections/TopicsSection';
import { FeaturesSection } from '@/sections/FeaturesSection';
import { StatsSection } from '@/sections/StatsSection';
import { CTASection } from '@/sections/CTASection';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/notes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/notes');
    }
  };

  return (
    <main className="min-h-screen">
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />
      <TopicsSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
