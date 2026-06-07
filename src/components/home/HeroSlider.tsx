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
    <div className="relative bg-gray-900 overflow-hidden h-[260px] md:h-[380px] lg:h-[480px]">
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
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-10 max-w-[1400px] mx-auto">
        <div key={current} className="slide-fade-in max-w-2xl">
          {/* Category + Breaking badge */}
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            {slide.isBreaking && (
              <span className="bg-[#66000c] text-white text-[10px] md:text-xs font-black px-2 md:px-3 py-0.5 md:py-1 rounded breaking-badge uppercase tracking-wider">
                🔴 బ్రేకింగ్
              </span>
            )}
            <span
              className="text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded"
              style={{ background: slide.categoryColor }}
            >
              {slide.category}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-white text-base md:text-3xl font-black leading-tight mb-2 md:mb-3 telugu-text drop-shadow-lg line-clamp-3 md:line-clamp-none"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {slide.title}
          </h1>

          {/* Description — hidden on mobile */}
          <p
            className="text-gray-200 text-sm md:text-base leading-relaxed mb-4 telugu-text hidden md:block"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {slide.description}
          </p>

          {/* Meta + Read More */}
          <div className="flex items-center gap-3">
            <Link
              href={`/news/${slide.slug}`}
              className="bg-[#66000c] text-white font-bold px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg hover:bg-[#4d0009] transition-colors text-xs md:text-sm telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              పూర్తి వార్త చదవండి →
            </Link>
            <div className="flex items-center gap-1 text-gray-300 text-[10px] md:text-xs">
              <Clock size={11} />
              <span>{formatTimeAgo(slide.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10"
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10"
        aria-label="Next"
      >
        <ChevronRight size={20} />
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
