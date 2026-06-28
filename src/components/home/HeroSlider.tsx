'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredNews, getMergedArticles } from '@/lib/mockData';

export default function HeroSlider({ dbArticles }: { dbArticles?: any[] }) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slides, setSlides] = useState<any[]>(featuredNews);

  useEffect(() => {
    try {
      const savedSlides = localStorage.getItem('homepage_banner_slides');
      if (savedSlides) {
        const parsed = JSON.parse(savedSlides);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed.map((item: any, index: number) => ({
            id: `custom-slide-${index}`,
            title: item.title,
            image: item.image,
            link: item.link || '',
            slug: item.link ? '' : `custom-slide-${index}`
          })));
          return;
        }
      }

      let mergedAll = featuredNews;
      if (dbArticles && Array.isArray(dbArticles)) {
        const dbIds = new Set(dbArticles.map(a => a.id));
        const filteredStatic = featuredNews.filter(a => !dbIds.has(a.id));
        mergedAll = [...dbArticles, ...filteredStatic];
      } else {
        mergedAll = getMergedArticles(featuredNews);
      }

      const customFeatured = mergedAll.filter((art: any) => art.isBreaking || art.isFeatured || art.categorySlug === 'featured');
      const featuredToPrepend = customFeatured.length > 0 ? customFeatured : mergedAll.slice(0, 3);
      
      const customIds = new Set(featuredToPrepend.map((a: any) => a.id));
      const filteredStatic = mergedAll.filter((art) => !customIds.has(art.id));
      setSlides([...featuredToPrepend, ...filteredStatic]);
    } catch (e) {
      console.error('Error loading custom slider news', e);
    }
  }, [dbArticles]);

  const next = useCallback(() => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, slides.length]);

  const prev = () => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  if (slides.length === 0) return null;

  const slide = slides[current] || slides[0];
  if (!slide) return null;

  const redirectUrl = slide.link || (slide.slug ? `/news/${slide.slug}` : '#');

  return (
    <div className="bg-white md:border md:border-gray-200 overflow-hidden flex flex-col md:shadow-xs w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 border-y border-gray-150 md:border-y-0">
      {/* Slider Image Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden group">
        <Link href={redirectUrl} className="absolute inset-0 block cursor-pointer">
          {/* Full-fill cover image — no black bars */}
          <img
            src={slide.image}
            alt={slide.title?.replace(/<[^>]*>/g, '')}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Navigation Chevrons (Centered vertically on the image) */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/45 backdrop-blur-xs text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10 shadow-sm opacity-0 group-hover:opacity-100 duration-200"
          aria-label="Previous"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/45 backdrop-blur-xs text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10 shadow-sm opacity-0 group-hover:opacity-100 duration-200"
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </button>

        {/* Slide Counter (Overlaid on image top-right) */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[12px] font-bold px-2 py-0.5 rounded-md z-10 select-none">
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Slide Text Content Container (Placed directly under the image) */}
      <div className="card-padding select-none bg-white">
        <div key={current} className="slide-fade-in">
          {/* News Headline - exactly one line */}
          <Link href={redirectUrl} className="block group">
            <h2
              className="secondary-headline headline-hover telugu-text pl-1 pb-1"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              title={slide.title?.replace(/<[^>]*>/g, '')}
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
