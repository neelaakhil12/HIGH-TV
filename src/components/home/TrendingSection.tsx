'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import { featuredNews, getMergedArticles } from '@/lib/mockData';

export default function TrendingSection({ dbArticles }: { dbArticles?: any[] }) {
  const [trending, setTrending] = useState<any[]>([]);

  useEffect(() => {
    try {
      let mergedAll = featuredNews;
      if (dbArticles && Array.isArray(dbArticles)) {
        const dbIds = new Set(dbArticles.map(a => a.id));
        const filteredStatic = featuredNews.filter(a => !dbIds.has(a.id));
        mergedAll = [...dbArticles, ...filteredStatic];
      } else {
        mergedAll = getMergedArticles(featuredNews);
      }
      const customTrending = mergedAll.filter((n: any) => n.isTrending);
      setTrending(customTrending.slice(0, 5));
    } catch (e) {
      console.error('Error loading custom trending articles', e);
    }
  }, [dbArticles]);

  const activeTrending = trending.length > 0 ? trending : featuredNews.filter((n) => n.isTrending).slice(0, 5);

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-orange-500" />
            <h2
              className="text-xl md:text-2xl font-black text-orange-500 pl-1 leading-normal telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              ట్రెండింగ్ వార్తలు
            </h2>
          </div>
        </div>
        <Link href="/category/trending" className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:gap-2 transition-all">
          అన్నీ చూడండి <ArrowRight size={14} />
        </Link>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Large Featured Trending Card */}
        {activeTrending[0] && (
          <div className="news-card relative rounded-xl overflow-hidden shadow-lg lg:row-span-2 h-[230px] md:h-[360px]">
            <div className="img-zoom-container absolute inset-0">
              <Image
                src={activeTrending[0].image}
                alt={activeTrending[0].title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            </div>
            {/* Trending badge */}
            <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3">
              <span className="flex items-center gap-1 bg-orange-500 text-white font-black text-xs md:text-sm px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
                <Flame size={11} /> 1 ట్రెండింగ్
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
 
              <Link href={`/news/${activeTrending[0].slug}`}>
                <h3
                  className="secondary-headline text-white hover:text-orange-200 transition-colors telugu-text pl-2.5 pb-1 font-black"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {activeTrending[0].title}
                </h3>
              </Link>
 
            </div>
          </div>
        )}
 
        {/* Small trending cards */}
        <div className="space-y-3">
          {activeTrending.slice(1, 5).map((article, index) => (
            <article
              key={article.id}
              className="news-card flex gap-3 bg-white rounded-lg border border-gray-100 p-3 overflow-hidden relative"
            >
              {/* Large number */}
              <div className="absolute right-2 top-0 trending-number">
                {index + 2}
              </div>
              <div className="img-zoom-container flex-shrink-0 rounded-lg overflow-hidden w-24 h-16 bg-slate-50 border border-gray-150">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={96}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 relative z-10">
 
                <Link href={`/news/${article.slug}`}>
                  <p
                    className="secondary-headline font-bold text-gray-800 hover:text-brand-blue transition-colors line-clamp-2 telugu-text pl-2.5 pb-1"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    {article.title}
                  </p>
                </Link>
 
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
