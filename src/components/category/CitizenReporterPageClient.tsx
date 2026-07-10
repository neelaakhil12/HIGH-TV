'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Plus, ArrowLeft } from 'lucide-react';
import BackButton from '@/components/layout/BackButton';
import RightSidebar from '@/components/layout/RightSidebar';
import CitizenReporterForm from './CitizenReporterForm';
import CategoryArticlesFeed from './CategoryArticlesFeed';

interface CitizenReporterPageClientProps {
  allArticles: any[];
  category: string;
  districtSlug?: string;
}

export default function CitizenReporterPageClient({
  allArticles,
  category,
  districtSlug,
}: CitizenReporterPageClientProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full text-left">
      {/* Breadcrumb Row with Back Button on the right */}
      <div className="flex items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-3 overflow-hidden">
        <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-[15.5px] text-gray-500 font-sans whitespace-nowrap overflow-x-auto hide-scrollbar">
          <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
            <Home className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" /> Home
          </Link>
          <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-800 font-bold flex-shrink-0">
            Citizen Reporter
          </span>
        </div>
        <div className="flex-shrink-0 pb-0.5">
          <BackButton />
        </div>
      </div>

      {/* Rastra News Page Header Row with toggler button */}
      <div className="mb-6 pb-3 border-b-2 border-[#cc0000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1
          className="text-lg md:text-3xl font-black text-[#cc0000] telugu-text leading-snug"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          {showForm ? 'సిటిజన్ రిపోర్టర్ ఫారమ్' : 'సిటిజన్ రిపోర్టర్ వార్తలు'}
        </h1>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-[0.98] select-none cursor-pointer self-start sm:self-auto hover:scale-[1.01] ${
            showForm 
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200' 
              : 'bg-[#cc0000] hover:bg-[#e60000] text-white'
          }`}
        >
          {showForm ? (
            <>
              <ArrowLeft className="w-4 h-4" />
              <span className="telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>తిరిగి వార్తలకు వెళ్ళండి</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span className="telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వార్తను సమర్పించండి (Submit News)</span>
            </>
          )}
        </button>
      </div>
      
      {/* 70% Left and 30% Right Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 mt-4">
        <div className="w-full lg:col-span-7">
          {showForm ? (
            <CitizenReporterForm />
          ) : (
            <CategoryArticlesFeed 
              initialArticles={allArticles} 
              categorySlug={category} 
              districtSlug={districtSlug}
            />
          )}
        </div>
        {/* Right Sidebar Column (30%) with Ads */}
        <div className="w-full lg:col-span-3">
          <RightSidebar categorySlug={category} />
        </div>
      </div>
    </main>
  );
}
