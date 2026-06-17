'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredNews } from '@/lib/mockData';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slides = featuredNews;

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, slides.length]);

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 2000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="bg-white md:rounded-lg md:border md:border-gray-200 overflow-hidden flex flex-col md:shadow-xs w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 border-y border-gray-150 md:border-y-0">
      {/* Slider Image Container */}
      <div className="relative w-full aspect-[3/2] md:aspect-[16/9] bg-neutral-950 overflow-hidden group">
        <Link href={`/news/${slide.slug}`} className="absolute inset-0 block cursor-pointer">
          {/* Blurred background image */}
          <div className="absolute inset-0 opacity-45 blur-lg scale-105 pointer-events-none">
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          {/* Foreground contain image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover md:max-w-full md:max-h-full md:object-contain"
            />
          </div>
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
      <div className="p-3.5 px-4 md:px-3.5 select-none bg-white">
        <div key={current} className="slide-fade-in">
          {/* News Headline - exactly one line */}
          <Link href={`/news/${slide.slug}`} className="block group">
            <h2
              className="text-gray-800 text-[15.5px] md:text-base font-black leading-snug group-hover:text-[#02599c] transition-colors telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              title={slide.title}
            >
              {slide.title}
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
}
