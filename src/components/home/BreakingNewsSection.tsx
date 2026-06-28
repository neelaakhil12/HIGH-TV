'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import {
  politicsNews,
  entertainmentNews,
  sportsNews,
  technologyNews,
  businessNews,
  formatTimeAgo,
  getMergedArticles,
} from '@/lib/mockData';

export default function BreakingNewsSection({ dbArticles }: { dbArticles?: any[] }) {
  const [breakingList, setBreakingList] = useState<any[]>([]);
  const [latestList, setLatestList] = useState<any[]>([]);

  useEffect(() => {
    try {
      if (dbArticles && Array.isArray(dbArticles)) {
        // Get all breaking articles from DB, sorted newest first
        const dbBreaking = dbArticles
          .filter(n => n.isBreaking)
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

        setBreakingList(dbBreaking);
      } else {
        setBreakingList([]);
      }
    } catch (e) {
      console.error('Error loading custom articles in BreakingNewsSection', e);
    }
  }, [dbArticles]);

  const defaultLatest = [
    ...politicsNews,
    ...entertainmentNews,
    ...sportsNews,
    ...technologyNews,
    ...businessNews
  ].slice(0, 6);

  const displayArticles = breakingList.length > 0 ? breakingList.slice(0, 6) : defaultLatest;

  return (
    <section className="mb-5">
      <div className="bg-brand-blue rounded-t-xl px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <AlertCircle size={16} className="breaking-badge" />
          <h2 className="text-base font-black telugu-text tracking-wide" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            బ్రేకింగ్ న్యూస్
          </h2>
          <span className="ml-1.5 bg-brand-red text-white text-[12px] font-black px-1.5 py-0.5 rounded-full breaking-badge">LIVE</span>
        </div>
        <Link href="/category/latest" className="flex items-center gap-1 text-blue-100 text-sm font-semibold hover:text-white transition-colors">
          అన్నీ <ArrowRight size={11} />
        </Link>
      </div>
      <div className="bg-white rounded-b-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-gray-100">
          {[0, 1, 2].map((rowIndex) => {
            const leftArticle = displayArticles[rowIndex * 2];
            const rightArticle = displayArticles[rowIndex * 2 + 1];
            if (!leftArticle && !rightArticle) return null;

            return (
              <div key={rowIndex} className="flex flex-col md:contents divide-y md:divide-y-0">
                {leftArticle && (
                  <Link
                    href={`/news/${leftArticle.slug}`}
                    className={`flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 transition-colors group md:border-r border-gray-100 ${
                      rowIndex < 2 ? 'md:border-b' : ''
                    }`}
                  >
                    <div className="w-16 h-11 flex-shrink-0 overflow-hidden bg-gray-100 border border-gray-150 relative">
                      <img
                        src={leftArticle.image}
                        alt={leftArticle.title?.replace(/<[^>]*>/g, '')}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      {leftArticle.isBreaking && (
                        <span className="inline-block bg-brand-red text-white text-[10px] font-black px-1.5 py-0.5 rounded mb-1 breaking-badge">🔴 BREAKING</span>
                      )}
                      <span className="secondary-headline headline-hover block telugu-text line-clamp-2 pl-1.5 pb-0.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }} dangerouslySetInnerHTML={{ __html: leftArticle.title }} />
                    </div>
                  </Link>
                )}
                {rightArticle && (
                  <Link
                    href={`/news/${rightArticle.slug}`}
                    className={`flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 transition-colors group ${
                      rowIndex < 2 ? 'md:border-b' : ''
                    }`}
                  >
                    <div className="w-16 h-11 flex-shrink-0 overflow-hidden bg-gray-100 border border-gray-150 relative">
                      <img
                        src={rightArticle.image}
                        alt={rightArticle.title?.replace(/<[^>]*>/g, '')}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      {rightArticle.isBreaking && (
                        <span className="inline-block bg-brand-red text-white text-[10px] font-black px-1.5 py-0.5 rounded mb-1 breaking-badge">🔴 BREAKING</span>
                      )}
                      <span className="secondary-headline headline-hover block telugu-text line-clamp-2 pl-1.5 pb-0.5" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }} dangerouslySetInnerHTML={{ __html: rightArticle.title }} />
                    </div>
                  </Link>
                )}
                {/* Fallback empty cell if left exists but right doesn't (to preserve grid layout) */}
                {leftArticle && !rightArticle && (
                  <div className={`hidden md:block ${rowIndex < 2 ? 'md:border-b' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
