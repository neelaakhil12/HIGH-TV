'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/home/AdBanner';
import { getMergedArticles } from '@/lib/mockData';

interface CategoryArticlesFeedProps {
  initialArticles: any[];
  categorySlug: string;
  districtSlug?: string;
}

export default function CategoryArticlesFeed({
  initialArticles,
  categorySlug,
  districtSlug
}: CategoryArticlesFeedProps) {
  const [articlesList, setArticlesList] = useState<any[]>(initialArticles);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    try {
      const merged = getMergedArticles(initialArticles, categorySlug);
      if (districtSlug) {
        setArticlesList(merged.filter((art: any) => art.districtSlug === districtSlug));
      } else {
        setArticlesList(merged);
      }
      setVisibleCount(6);
    } catch (e) {
      console.error('Error merging custom category articles', e);
      setArticlesList(initialArticles);
      setVisibleCount(6);
    }
  }, [initialArticles, categorySlug, districtSlug]);

  const isLatest = categorySlug === 'latest';
  const headlineClass = isLatest ? 'category-headline' : 'secondary-headline';
  const summaryClass = isLatest ? 'category-summary' : 'news-summary';
  const isHealthGrid = categorySlug === 'doctors-corner' || categorySlug === 'health';

  if (articlesList.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 bg-white border border-gray-150 rounded-xl shadow-xs w-full col-span-2">
        <div className="text-4xl mb-3 text-[#02599c]">📰</div>
        <p className="font-bold text-lg telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
          వార్తలు అందుబాటులో లేవు
        </p>
        <p className="text-sm text-gray-400 mt-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
          త్వరలోనే ఈ విభాగంలో తాజా వార్తలను ప్రచురిస్తాము.
        </p>
      </div>
    );
  }

  return (
    <div className={isHealthGrid ? "grid grid-cols-1 sm:grid-cols-2 gap-5" : "grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-0"}>
      {articlesList.slice(0, visibleCount).map((article, index) => {
        if (isHealthGrid) {
          return (
            <div key={article.id} className="contents">
              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all flex flex-col group mb-1">
                <Link href={`/news/${article.slug}`} className="block relative aspect-video rounded-md overflow-hidden bg-black/5 mb-3">
                  <img
                    src={article.image}
                    alt={article.title?.replace(/<[^>]*>/g, '')}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                  />
                </Link>
                <div className="flex-1 flex flex-col text-left">
                  <Link href={`/news/${article.slug}`}>
                    <h3
                      className="text-base font-bold text-[#02599c] hover:text-[#013f70] hover:underline leading-relaxed telugu-text pb-1"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: article.title }}
                    />
                  </Link>
                  <p
                    className="text-sm text-gray-550 mt-1 line-clamp-3 telugu-text leading-relaxed"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: article.description }}
                  />
                </div>
              </div>
              
              {/* Mobile-only inline ad after the 4th article */}
              {index === 3 && (
                <div className="col-span-1 sm:col-span-2 lg:hidden mt-2 mb-3">
                  <AdBanner position="gold-loan" />
                </div>
              )}
            </div>
          );
        }

        return (
          <div key={article.id} className="contents">
            <Link
              href={isLatest ? `/news/${article.slug}?compact=1` : `/news/${article.slug}`}
              className="flex gap-3 items-start py-3 px-2 border-b border-gray-100 hover:bg-blue-50/40 transition-colors group"
            >
              {/* Thumbnail */}
              <div className="w-[120px] h-[80px] flex-shrink-0 rounded overflow-hidden bg-slate-50 border border-gray-150 relative">
                <img
                  src={article.image}
                  alt={article.title?.replace(/<[^>]*>/g, '')}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`${headlineClass} font-black text-[#02599c] group-hover:text-[#013f70] line-clamp-2 telugu-text pl-2.5`}
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  dangerouslySetInnerHTML={{ __html: article.title }}
                />
                <p
                  className={`${summaryClass} text-gray-500 mt-1 line-clamp-2 telugu-text pl-2.5`}
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  dangerouslySetInnerHTML={{ __html: article.description }}
                />
              </div>
            </Link>

            {/* Mobile-only inline ad after the 4th article */}
            {index === 3 && (
              <div className="col-span-1 sm:col-span-2 lg:hidden mt-2 mb-3 text-center w-full">
                <AdBanner position="gold-loan" />
              </div>
            )}
          </div>
        );
      })}

      {articlesList.length > visibleCount && (
        <div className="col-span-1 sm:col-span-2 text-center mt-8 mb-4 py-2">
          <button
            type="button"
            onClick={() => setVisibleCount(articlesList.length)}
            className="bg-[#02599c] hover:bg-[#013f70] text-white font-bold px-6 py-2.5 rounded-lg transition-colors telugu-text cursor-pointer shadow-sm text-sm sm:text-base"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            మరిన్ని వార్తలు లోడ్ చేయండి
          </button>
        </div>
      )}
    </div>
  );
}
