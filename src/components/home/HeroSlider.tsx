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
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="relative bg-gray-900 overflow-hidden h-[180px] md:h-[280px] lg:h-[340px]">
      {/* Background Image */}
      <div className="absolute inset-0 img-zoom-container">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
        <div key={current} className="slide-fade-in max-w-2xl text-left">
          {/* Category + Breaking badge */}
          <div className="flex items-center gap-1.5 mb-1.5 md:mb-2">
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
          </div>

          {/* Headline */}
          <h1
            className="text-white text-xs md:text-xl lg:text-2xl font-black leading-tight mb-1.5 md:mb-2 telugu-text drop-shadow-lg line-clamp-2 md:line-clamp-none"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {slide.title}
          </h1>

          {/* Description — hidden on mobile/tablet */}
          <p
            className="text-gray-200 text-xs leading-relaxed mb-2.5 telugu-text hidden lg:block"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {slide.description}
          </p>

          {/* Meta + Read More */}
          <div className="flex items-center gap-2.5">
            <Link
              href={`/news/${slide.slug}`}
              className="bg-[#66000c] text-white font-bold px-2.5 md:px-4 py-1 md:py-2 rounded-md hover:bg-[#4d0009] transition-colors text-[10px] md:text-xs telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              పూర్తి వార్త చదవండి →
            </Link>
            <div className="flex items-center gap-1 text-gray-300 text-[9px] md:text-[11px]">
              <Clock size={10} />
              <span>{formatTimeAgo(slide.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 backdrop-blur-xs text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10"
        aria-label="Previous"
      >
        <ChevronLeft size={15} />
      </button>
      <button
        onClick={next}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 backdrop-blur-xs text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10"
        aria-label="Next"
      >
        <ChevronRight size={15} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current ? 'w-6 bg-[#66000c]' : 'w-1.5 bg-white/60 hover:bg-white'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded z-10">
        {current + 1} / {slides.length}
      </div>
    </div>
  );
}
