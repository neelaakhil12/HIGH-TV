'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { featuredNews, formatTimeAgo } from '@/lib/mockData';

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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-xs w-full">
      {/* Slider Image Container */}
      <div className="relative w-full aspect-[16/9] bg-neutral-950 overflow-hidden group">
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
              className="max-w-full max-h-full object-contain"
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
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10 select-none">
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Slide Text Content Container (Placed directly under the image) */}
      <div className="p-4 flex-1 flex flex-col justify-between text-left select-none bg-white">
        <div key={current} className="slide-fade-in flex-1">
          {/* Top Row: Badges & Time Info */}
          <div className="flex items-center gap-1.5 mb-2">
            {slide.isBreaking && (
              <span className="bg-[#66000c] text-white text-[9px] md:text-[10px] font-black px-1.5 md:px-2 py-0.5 rounded breaking-badge uppercase tracking-wider">
                🔴 బ్రేకింగ్
              </span>
            )}
            <span
              className="text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded"
              style={{ background: slide.categoryColor }}
            >
              {slide.category}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-[10px] md:text-[11px] ml-auto">
              <Clock size={10} />
              <span>{formatTimeAgo(slide.publishedAt)}</span>
            </div>
          </div>

          {/* News Headline */}
          <Link href={`/news/${slide.slug}`} className="block group mb-2">
            <h2
              className="text-gray-800 text-sm md:text-[17px] lg:text-[19px] font-black leading-snug group-hover:text-[#02599c] transition-colors telugu-text line-clamp-2"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {slide.title}
            </h2>
          </Link>

          {/* News Description */}
          <p
            className="text-gray-500 text-[11px] md:text-xs leading-relaxed telugu-text line-clamp-2 md:line-clamp-3"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {slide.description}
          </p>
        </div>

        {/* Bottom Actions Row: Link & Dots */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <Link
            href={`/news/${slide.slug}`}
            className="text-[#66000c] hover:text-[#4d0009] font-black text-xs flex items-center gap-1 transition-colors telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            పూర్తి వార్త చదవండి →
          </Link>

          {/* Dots Indicator */}
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === current ? 'w-5 bg-[#66000c]' : 'w-1.5 bg-gray-200 hover:bg-gray-350'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
