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
  body?: string | null;
  description?: string | null;
}

function getArticleHref(art: any) {
  if (!art) return '#';
  if (art.slug && art.slug.startsWith('editorial-img-') && art.body) {
    const cleanSlug = art.body.replace('[LINKED_ARTICLE_SLUG]:', '').trim();
    return `/news/${cleanSlug}`;
  }
  return `/news/${art.slug}`;
}

function getLinkedArticle(imgArt: Article, allArticles: Article[]) {
  if (!imgArt.body) return null;
  const match = imgArt.body.match(/\[LINKED_ARTICLE_SLUG\]:\s*(.+)/);
  if (!match) return null;
  const targetSlug = match[1].trim();
  return allArticles.find(a => a.slug === targetSlug);
}

function EditorialSection({ title, articles, categorySlug }: { title: string; articles: Article[]; categorySlug: string }) {
  // Separate image link articles and normal articles
  const imageLinkArticles = articles.filter(a => a.slug?.startsWith('editorial-img-'));
  const normalArticles = articles.filter(a => !a.slug?.startsWith('editorial-img-'));

  const usedNormalIds = new Set<string>();
  const rows: { imgArt: Article; linkedArt: Article | null }[] = [];

  if (imageLinkArticles.length > 0) {
    imageLinkArticles.forEach(imgArt => {
      // Find the linked article
      let linkedArt = getLinkedArticle(imgArt, normalArticles);
      if (linkedArt) {
        usedNormalIds.add(linkedArt.id);
      } else {
        // Fallback: take the first unused normal article
        linkedArt = normalArticles.find(a => !usedNormalIds.has(a.id)) || null;
        if (linkedArt) usedNormalIds.add(linkedArt.id);
      }
      rows.push({ imgArt, linkedArt });
    });
  }

  const fallbackRows: { imgArt: Article | null; linkedArts: Article[] } = { imgArt: null, linkedArts: [] };
  if (imageLinkArticles.length === 0 && normalArticles.length > 0) {
    const mainArt = normalArticles[0];
    const rightArts = normalArticles.slice(1, 3);
    fallbackRows.imgArt = mainArt;
    fallbackRows.linkedArts = rightArts;
    
    usedNormalIds.add(mainArt.id);
    rightArts.forEach(a => usedNormalIds.add(a.id));
  }

  const remainingArticles = normalArticles.filter(a => !usedNormalIds.has(a.id));

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

      {/* 1. Custom Image-Link Rows */}
      {rows.map(({ imgArt, linkedArt }) => (
        <div key={imgArt.id} className="grid grid-cols-1 md:grid-cols-10 gap-5 mb-6 items-center">
          {/* Left Big Image */}
          <div className="md:col-span-6 w-full">
            <Link href={linkedArt ? getArticleHref(linkedArt) : '#'} className="relative block aspect-[16/10] w-full rounded-lg overflow-hidden group border border-gray-150 shadow-3xs bg-black/5">
              <img
                src={imgArt.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"}
                alt={linkedArt ? linkedArt.title.replace(/<[^>]*>/g, '').trim() : ''}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
              />
              {linkedArt && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-5 pointer-events-none">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-white hover:text-red-400 transition-colors leading-snug telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    {linkedArt.title ? linkedArt.title.replace(/<[^>]*>/g, '').trim() : ''}
                  </h3>
                </div>
              )}
            </Link>
          </div>

          {/* Right Linked Article Card */}
          <div className="md:col-span-4 w-full">
            {linkedArt ? (
              (() => {
                const cleanTitle = linkedArt.title ? linkedArt.title.replace(/<[^>]*>/g, '').trim() : '';
                const cleanDesc = linkedArt.description ? linkedArt.description.replace(/<[^>]*>/g, '').trim() : '';
                return (
                  <div className="flex gap-4 items-start group bg-white hover:bg-slate-50/50 p-2.5 rounded-xl border border-transparent hover:border-slate-100 transition-all">
                    <Link href={getArticleHref(linkedArt)} className="w-20 h-14 sm:w-24 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-gray-150 block shadow-3xs relative">
                      <img
                        src={linkedArt.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"}
                        alt={cleanTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </Link>
                    <div className="flex-1 text-left min-w-0">
                      <Link href={getArticleHref(linkedArt)}>
                        <h4 className="text-[15px] sm:text-[16px] md:text-[17.5px] font-black text-[#02599c] hover:text-red-650 hover:underline leading-snug telugu-text line-clamp-2" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                          {cleanTitle}
                        </h4>
                      </Link>
                      {cleanDesc && (
                        <p className="text-xs sm:text-[13px] text-gray-500 font-medium line-clamp-2 mt-1 leading-relaxed telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                          {cleanDesc}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-xl">
                No linked article.
              </div>
            )}
          </div>
        </div>
      ))}

      {/* 2. Fallback Grid (when no custom Image Link articles exist) */}
      {fallbackRows.imgArt && (
        <div className="grid grid-cols-1 md:grid-cols-10 gap-5 mb-5">
          {/* Left Big Featured Article */}
          <div className="md:col-span-6 w-full">
            <Link href={getArticleHref(fallbackRows.imgArt)} className="relative block aspect-[16/10] w-full rounded-lg overflow-hidden group border border-gray-150 shadow-3xs bg-black/5">
              <img
                src={fallbackRows.imgArt.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"}
                alt={fallbackRows.imgArt.title ? fallbackRows.imgArt.title.replace(/<[^>]*>/g, '').trim() : ''}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-5 pointer-events-none">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-white hover:text-red-400 transition-colors leading-snug telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  {fallbackRows.imgArt.title ? fallbackRows.imgArt.title.replace(/<[^>]*>/g, '').trim() : ''}
                </h3>
              </div>
            </Link>
          </div>

          {/* Right Stacked Featured Articles */}
          <div className="md:col-span-4 flex flex-col gap-4 w-full">
            {fallbackRows.linkedArts.map((art) => {
              const cleanTitle = art.title ? art.title.replace(/<[^>]*>/g, '').trim() : '';
              const cleanDesc = art.description ? art.description.replace(/<[^>]*>/g, '').trim() : '';
              return (
                <div key={art.id} className="flex gap-4 items-start group bg-white hover:bg-slate-50/50 p-2.5 rounded-xl border border-transparent hover:border-slate-100 transition-all">
                  <Link href={getArticleHref(art)} className="w-20 h-14 sm:w-24 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-gray-150 block shadow-3xs relative">
                    <img
                      src={art.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"}
                      alt={cleanTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </Link>
                  <div className="flex-1 text-left min-w-0">
                    <Link href={getArticleHref(art)}>
                      <h4 className="text-[15px] sm:text-[16px] md:text-[17.5px] font-black text-[#02599c] hover:text-red-650 hover:underline leading-snug telugu-text line-clamp-2" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                        {cleanTitle}
                      </h4>
                    </Link>
                    {cleanDesc && (
                      <p className="text-xs sm:text-[13px] text-gray-500 font-medium line-clamp-2 mt-1 leading-relaxed telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                        {cleanDesc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Bottom Grid for remaining unused articles */}
      {remainingArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-gray-100 mt-5">
          {remainingArticles.map((art) => {
            const cleanTitle = art.title ? art.title.replace(/<[^>]*>/g, '').trim() : '';
            const cleanDesc = art.description ? art.description.replace(/<[^>]*>/g, '').trim() : '';
            
            return (
              <div key={art.id} className="flex gap-4 items-start group bg-white hover:bg-slate-50/50 p-2.5 rounded-xl border border-transparent hover:border-slate-100 transition-all">
                <Link href={getArticleHref(art)} className="w-32 h-20 sm:w-36 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-gray-150 block shadow-3xs relative">
                  <img
                    src={art.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"}
                    alt={cleanTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </Link>
                <div className="flex-1 text-left min-w-0">
                  <Link href={getArticleHref(art)}>
                    <h4 className="text-[15px] sm:text-[16px] md:text-[17px] font-black text-[#02599c] hover:text-red-650 hover:underline leading-snug telugu-text line-clamp-2" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                      {cleanTitle}
                    </h4>
                  </Link>
                  {cleanDesc && (
                    <p className="text-[11px] sm:text-xs text-gray-500 font-medium line-clamp-2 mt-1.5 leading-relaxed telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                      {cleanDesc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EditorialPageClient({ allArticles }: { allArticles: Article[] }) {
  const [sections, setSections] = React.useState<{ id: string; title: string; slug: string }[]>([
    { id: 'sec-editorial', title: 'ఎడిటోరియల్', slug: 'sampadakiyam' },
    { id: 'sec-gitanjali', title: 'గీతాంజలి', slug: 'adyathmikam' },
    { id: 'sec-kothapaluku', title: 'కొత్త పలుకు', slug: 'antharmadanam' },
  ]);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('editorial_sections_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        const migrated = parsed.map((s: any) => {
          if (s.slug === 'sampadakiyam' && s.title === 'సంపాదకీయం') {
            return { ...s, title: 'ఎడిటోరియల్' };
          }
          return s;
        });
        setSections(migrated);
        localStorage.setItem('editorial_sections_config', JSON.stringify(migrated));
      }
    } catch (e) {
      console.error('Error loading dynamic editorial sections config:', e);
    }
  }, []);

  // Helper to filter articles by category (only explicitly added articles show here)
  const getSectionArticles = (categorySlug: string) => {
    return allArticles
      .filter(art => art.categorySlug === categorySlug)
      .slice(0, 14);
  };

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
          {sections.map((sec) => {
            const secArticles = getSectionArticles(sec.slug);
            if (secArticles.length === 0 && sections.length > 1) {
              // If there are no articles in this section, and it's not the only section, we can skip it
              return null;
            }
            // Ensure the main editorial page section is always displayed in Telugu as 'ఎడిటోరియల్'
            const displayTitle = sec.slug === 'sampadakiyam' ? 'ఎడిటోరియల్' : sec.title;
            return (
              <EditorialSection 
                key={sec.id}
                title={displayTitle} 
                articles={secArticles} 
                categorySlug={sec.slug} 
              />
            );
          })}
        </div>

        {/* Right Sidebar Column */}
        <div className="w-full lg:col-span-3">
          <RightSidebar categorySlug="sampadakiyam" />
        </div>
      </div>
    </main>
  );
}
