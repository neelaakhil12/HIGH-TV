import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el && layout === 'featured-left') {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      window.addEventListener('resize', checkScroll);
      // Trigger a check after images load
      const timer = setTimeout(checkScroll, 500);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        clearTimeout(timer);
      };
    }
  }, [layout, articles]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -scrollRef.current.clientWidth : scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
          <div className="flex items-center gap-2.5">
            <Link
              href={viewAllLink}
              className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
              style={{ color: accentColor }}
            >
              అన్నీ చూడండి <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 2 in a Row Grid (2x2 Layout) */}
        <div className="grid grid-cols-2 gap-4">
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
          <Link href={viewAllLink} className="text-sm font-semibold flex items-center gap-1" style={{ color: accentColor }}>
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
          <Link href={viewAllLink} className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: accentColor }}>
            అన్నీ చూడండి <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-2.5 snap-x hide-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:pb-0">
          {articles.slice(0, 4).map((article) => (
            <NewsCard key={article.id} article={article} className="flex-shrink-0 w-[230px] sm:w-auto snap-start" imageClassName="aspect-[2/1] sm:aspect-video w-full" />
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
        <Link href={viewAllLink} className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: accentColor }}>
          అన్నీ చూడండి <ArrowRight size={14} />
        </Link>
      </div>
      <div className="flex overflow-x-auto gap-4 pb-2.5 snap-x hide-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:pb-0">
        {articles.slice(0, 3).map((article) => (
          <NewsCard key={article.id} article={article} className="flex-shrink-0 w-[230px] sm:w-auto snap-start" imageClassName="aspect-[2/1] sm:aspect-video w-full" />
        ))}
      </div>
    </section>
  );
}
