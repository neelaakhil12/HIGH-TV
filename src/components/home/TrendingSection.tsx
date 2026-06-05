import Image from 'next/image';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import { featuredNews, formatTimeAgo } from '@/lib/mockData';

export default function TrendingSection() {
  const trending = featuredNews.filter((n) => n.isTrending).slice(0, 5);

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-orange-500" />
            <h2
              className="text-xl md:text-2xl font-black text-orange-500 telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              ట్రెండింగ్ వార్తలు
            </h2>
          </div>
        </div>
        <Link href="/category/trending" className="flex items-center gap-1 text-xs font-semibold text-orange-500 hover:gap-2 transition-all">
          అన్నీ చూడండి <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Large Featured Trending Card */}
        {trending[0] && (
          <div className="news-card relative rounded-xl overflow-hidden shadow-lg lg:row-span-2" style={{ height: '360px' }}>
            <div className="img-zoom-container absolute inset-0">
              <Image
                src={trending[0].image}
                alt={trending[0].title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            </div>
            {/* Trending badge */}
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 bg-orange-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                <Flame size={12} /> #1 ట్రెండింగ్
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="category-pill text-white mb-2 inline-block" style={{ background: trending[0].categoryColor }}>
                {trending[0].category}
              </span>
              <Link href={`/news/${trending[0].slug}`}>
                <h3
                  className="text-white text-lg font-black leading-tight hover:text-orange-200 transition-colors telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {trending[0].title}
                </h3>
              </Link>
              <p className="text-gray-300 text-xs mt-1">{formatTimeAgo(trending[0].publishedAt)}</p>
            </div>
          </div>
        )}

        {/* Small trending cards */}
        <div className="space-y-3">
          {trending.slice(1, 5).map((article, index) => (
            <article
              key={article.id}
              className="news-card flex gap-3 bg-white rounded-lg border border-gray-100 p-3 overflow-hidden relative"
            >
              {/* Large number */}
              <div className="absolute right-2 top-0 trending-number">
                {index + 2}
              </div>
              <div className="img-zoom-container flex-shrink-0 rounded-lg overflow-hidden w-24 h-16">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={96}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 relative z-10">
                <span
                  className="category-pill text-white mb-1 inline-block"
                  style={{ background: article.categoryColor }}
                >
                  {article.category}
                </span>
                <Link href={`/news/${article.slug}`}>
                  <p
                    className="text-sm font-bold text-gray-800 hover:text-[#66000c] transition-colors line-clamp-2 leading-snug telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    {article.title}
                  </p>
                </Link>
                <span className="text-xs text-gray-400 mt-1 block">{formatTimeAgo(article.publishedAt)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
