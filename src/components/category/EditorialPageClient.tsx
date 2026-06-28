'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import BackButton from '@/components/layout/BackButton';
import RightSidebar from '@/components/layout/RightSidebar';

interface Article {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  categorySlug?: string;
  publishedAt?: any;
}

function EditorialSection({ title, articles, categorySlug }: { title: string; articles: Article[]; categorySlug: string }) {
  const mainArticle = articles[0];
  const rightArticles = articles.slice(1, 3);
  const bottomLeftArticles = articles.slice(3, 6);
  const textOnlyArticles = articles.slice(6, 14);
  const col1 = textOnlyArticles.slice(0, 4);
  const col2 = textOnlyArticles.slice(4, 8);

  return (
    <div className="mb-12 text-left">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-1.5 mb-5 relative">
        <div className="border-b-4 border-[#002f6c] pb-1.5 w-fit">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            {title}
          </h2>
        </div>
        <Link href={`/category/${categorySlug}`} className="text-[#a90000] hover:text-[#7f0000] font-black text-[13px] md:text-[14px] hover:underline flex items-center gap-0.5 select-none transition-colors">
          మరిన్ని చదవండి
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 mb-5">
        {/* Left Big Featured Article */}
        <div className="md:col-span-7 w-full">
          {mainArticle && (
            <Link href={`/news/${mainArticle.slug}`} className="relative block aspect-[16/10] w-full rounded-lg overflow-hidden group border border-gray-150 shadow-3xs bg-black/5">
              <img
                src={mainArticle.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"}
                alt={mainArticle.title}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-5">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white hover:text-red-400 transition-colors leading-snug telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  {mainArticle.title}
                </h3>
              </div>
            </Link>
          )}
        </div>

        {/* Right Stacked Featured Articles */}
        <div className="md:col-span-3 flex flex-col gap-4 w-full justify-between">
          {rightArticles.map((art) => (
            <Link key={art.id} href={`/news/${art.slug}`} className="relative flex-1 aspect-[16/9] md:aspect-auto rounded-lg overflow-hidden group border border-gray-150 shadow-3xs bg-black/5 min-h-[125px]">
              <img
                src={art.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3">
                <h4 className="text-base md:text-lg lg:text-[19px] font-black text-white hover:text-red-400 transition-colors leading-snug telugu-text line-clamp-2 pl-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  {art.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 pt-3 border-t border-gray-100">
        {/* Bottom Left Column - Thumbnail Lists */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {bottomLeftArticles.map((art) => (
            <div key={art.id} className="flex gap-3 items-start group">
              <Link href={`/news/${art.slug}`} className="w-[100px] h-[70px] flex-shrink-0 rounded overflow-hidden bg-slate-50 border border-gray-150 relative block shadow-3xs">
                <img
                  src={art.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"}
                  alt={art.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </Link>
              <div className="flex-1 text-left">
                <Link href={`/news/${art.slug}`}>
                  <h4 className="text-[17.5px] font-black text-[#02599c] hover:text-red-650 hover:underline leading-snug telugu-text line-clamp-2 pl-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    {art.title}
                  </h4>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Right Columns - Bullet Lists */}
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="flex flex-col border-r-0 md:border-r border-gray-100 pr-0 md:pr-4 gap-2">
            {col1.map((art) => (
              <div key={art.id} className="flex items-start gap-1.5 py-2.5 border-b border-dashed border-gray-200 last:border-b-0">
                <span className="text-[#a90000] text-[10px] mt-2 shrink-0">▶</span>
                <Link href={`/news/${art.slug}`}>
                  <h5 className="text-[16px] md:text-[18px] font-black text-gray-800 hover:text-red-650 hover:underline leading-relaxed telugu-text line-clamp-2 pl-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    {art.title}
                  </h5>
                </Link>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-2">
            {col2.map((art) => (
              <div key={art.id} className="flex items-start gap-1.5 py-2.5 border-b border-dashed border-gray-200 last:border-b-0">
                <span className="text-[#a90000] text-[10px] mt-2 shrink-0">▶</span>
                <Link href={`/news/${art.slug}`}>
                  <h5 className="text-[16px] md:text-[18px] font-black text-gray-800 hover:text-red-650 hover:underline leading-relaxed telugu-text line-clamp-2 pl-1.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    {art.title}
                  </h5>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorialPageClient({ allArticles }: { allArticles: Article[] }) {
  // Helper to filter articles by category and fall back to politics/latest if not enough articles are present
  const getSectionArticles = (categorySlug: string) => {
    let sectionList = allArticles.filter(art => art.categorySlug === categorySlug);
    
    // Fallbacks to politics, featured and entertainment to make sure we always have enough content
    if (sectionList.length < 14) {
      const extraList = allArticles.filter(art => art.categorySlug !== categorySlug && art.categorySlug !== 'sampadakiyam' && art.categorySlug !== 'adyathmikam' && art.categorySlug !== 'antharmadanam');
      sectionList = [...sectionList, ...extraList].slice(0, 14);
    } else {
      sectionList = sectionList.slice(0, 14);
    }
    return sectionList;
  };

  const sampadakiyamArticles = getSectionArticles('sampadakiyam');
  const gitanjaliArticles = getSectionArticles('adyathmikam'); // using adyathmikam (devotional/spiritual/literature)
  const kothaPalukuArticles = getSectionArticles('antharmadanam'); // using antharmadanam (opinion/column)

  return (
    <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full">
      {/* Breadcrumb Row */}
      <div className="flex items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-3 overflow-hidden">
        <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-[15.5px] text-gray-500 font-sans whitespace-nowrap overflow-hidden">
          <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
            <Home className="w-3.5 h-3.5 flex-shrink-0" /> Home
          </Link>
          <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-800 font-bold flex-shrink-0">
            Editorial
          </span>
        </div>
        <div className="flex-shrink-0 pb-0.5">
          <BackButton />
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        <div className="w-full lg:col-span-7">
          {/* Section 1: ఎడిటోరియల్ */}
          <EditorialSection 
            title="ఎడిటోరియల్" 
            articles={sampadakiyamArticles} 
            categorySlug="sampadakiyam" 
          />

          {/* Section 2: గీతాంజలి */}
          <EditorialSection 
            title="గీతాంజలి" 
            articles={gitanjaliArticles} 
            categorySlug="adyathmikam" 
          />

          {/* Section 3: కొత్త పలుకు */}
          <EditorialSection 
            title="కొత్త పలుకు" 
            articles={kothaPalukuArticles} 
            categorySlug="antharmadanam" 
          />
        </div>

        {/* Right Sidebar Column */}
        <div className="w-full lg:col-span-3">
          <RightSidebar categorySlug="sampadakiyam" />
        </div>
      </div>
    </main>
  );
}
