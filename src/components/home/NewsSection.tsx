import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewsCard from '@/components/cards/NewsCard';
import { NewsArticle } from '@/lib/mockData';

interface NewsSectionProps {
  title: string;
  titleTelugu: string;
  articles: NewsArticle[];
  viewAllLink: string;
  accentColor?: string;
  layout?: 'grid3' | 'grid4' | 'featured-left' | 'list';
}

export default function NewsSection({
  title,
  titleTelugu,
  articles,
  viewAllLink,
  accentColor = '#02599c',
  layout = 'grid3',
}: NewsSectionProps) {
  if (layout === 'featured-left') {
    return (
      <section className="mb-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full" style={{ background: accentColor }}></div>
            <h2
              className="text-xl md:text-2xl font-black text-gray-800 telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif', color: accentColor }}
            >
              {titleTelugu}
            </h2>
          </div>
          <Link
            href={viewAllLink}
            className="flex items-center gap-1 text-xs font-semibold hover:gap-2 transition-all"
            style={{ color: accentColor }}
          >
            అన్నీ చూడండి <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.slice(0, 4).map((article) => (
            <NewsCard key={article.id} article={article} variant="horizontal" />
          ))}
        </div>
      </section>
    );
  }

  if (layout === 'list') {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full" style={{ background: accentColor }}></div>
            <h2
              className="text-lg font-black text-gray-800 telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif', color: accentColor }}
            >
              {titleTelugu}
            </h2>
          </div>
          <Link href={viewAllLink} className="text-xs font-semibold flex items-center gap-1" style={{ color: accentColor }}>
            అన్నీ <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-0">
          {articles.slice(0, 5).map((article) => (
            <NewsCard key={article.id} article={article} variant="mini" />
          ))}
        </div>
      </section>
    );
  }

  if (layout === 'grid4') {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full" style={{ background: accentColor }}></div>
            <h2
              className="text-xl md:text-2xl font-black telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif', color: accentColor }}
            >
              {titleTelugu}
            </h2>
          </div>
          <Link href={viewAllLink} className="flex items-center gap-1 text-xs font-semibold hover:gap-2 transition-all" style={{ color: accentColor }}>
            అన్నీ చూడండి <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.slice(0, 4).map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    );
  }

  // Default grid3
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full" style={{ background: accentColor }}></div>
          <h2
            className="text-xl md:text-2xl font-black telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif', color: accentColor }}
          >
            {titleTelugu}
          </h2>
        </div>
        <Link href={viewAllLink} className="flex items-center gap-1 text-xs font-semibold hover:gap-2 transition-all" style={{ color: accentColor }}>
          అన్నీ చూడండి <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.slice(0, 3).map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
