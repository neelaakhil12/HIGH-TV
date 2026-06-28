'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Film } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  body?: string | null;
  description?: string | null;
}

export default function ShortsPage({ articles = [] }: { articles: Article[] }) {
  const [activeArticleIndex, setActiveArticleIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Responsive layout check for mobile viewport
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to extract media source from the HTML body
  const getMediaSource = (body: string | null | undefined) => {
    if (!body) return null;
    
    // 1. Check for <video> tag
    const videoMatch = body.match(/<video[^>]+src=["']([^"']+)["']/i);
    if (videoMatch) {
      return { type: 'video', src: videoMatch[1] };
    }
    
    // 2. Check for YouTube iframe embed
    const iframeMatch = body.match(/<iframe[^>]+src=["']([^"']+)["']/i);
    if (iframeMatch) {
      let src = iframeMatch[1];
      // Autoplay & mute setup for YouTube embed in a story context
      if (src.includes('youtube.com') || src.includes('youtu.be')) {
        if (src.includes('?')) {
          src += '&autoplay=1&mute=1&controls=1&loop=1';
        } else {
          src += '?autoplay=1&mute=1&controls=1&loop=1';
        }
      }
      return { type: 'youtube', src };
    }
    
    // 3. Check for raw youtube link in text
    const ytMatch = body.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^<\s"'\b]+)/i);
    if (ytMatch) {
      return { type: 'youtube', src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&controls=1&loop=1` };
    }
    
    return null;
  };

  // Lock body scroll when stories player modal is open
  useEffect(() => {
    if (activeArticleIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeArticleIndex]);

  // Open modal player
  const handleOpenShort = (index: number) => {
    setActiveArticleIndex(index);
    setIsPaused(false);
  };

  // Close modal player
  const handleCloseShort = () => {
    setActiveArticleIndex(null);
  };

  // Navigate back/forward
  const handlePrevShort = () => {
    if (activeArticleIndex === null) return;
    if (activeArticleIndex > 0) {
      setActiveArticleIndex(activeArticleIndex - 1);
    }
  };

  const handleNextShort = () => {
    if (activeArticleIndex === null) return;
    if (activeArticleIndex < articles.length - 1) {
      setActiveArticleIndex(activeArticleIndex + 1);
    } else {
      handleCloseShort();
    }
  };

  const activeArticle = activeArticleIndex !== null ? articles[activeArticleIndex] : null;
  const media = activeArticle ? getMediaSource(activeArticle.body) : null;

  // Toggle Video Play/Pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play().catch(err => console.log('Autoplay issue:', err));
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  // Handle keypress navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeArticleIndex === null) return;
      if (e.key === 'Escape') handleCloseShort();
      if (e.key === 'ArrowLeft') handlePrevShort();
      if (e.key === 'ArrowRight') handleNextShort();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArticleIndex]);

  return (
    <div className="select-none">
      {articles.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-bold bg-white rounded-none border border-gray-150 shadow-3xs telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
          ఈ విభాగంలో ఇంకా ఎటువంటి షార్ట్స్ లేవు.
        </div>
      ) : (
        /* Grid of Shorts Cards (2 Columns on Mobile, 4 on Desktop) */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {articles.map((art, idx) => {
            return (
              <div key={art.id} className="flex flex-col group cursor-pointer" onClick={() => handleOpenShort(idx)}>
                {/* Short Card Image */}
                <div className="relative aspect-[9/16] rounded-none overflow-hidden shadow-md border border-gray-150 bg-slate-950 flex items-center justify-center">
                  <img
                    src={art.image || '/hightv_breaking.png'}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 brightness-95"
                  />
                  {/* Film icon overlay indicating Video/Short */}
                  <div className="absolute bottom-3 right-3 bg-[#f43f5e] text-white rounded-full p-2 shadow-md flex items-center justify-center">
                    <Film size={14} className="stroke-[2.5]" />
                  </div>
                  {/* Image title overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent pt-12 pb-4 px-4 text-left">
                    <span
                      className="text-[14px] md:text-[16px] font-black leading-snug text-white line-clamp-3 telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      {art.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Player */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-xs p-0 md:p-4 animate-fade-in"
          onClick={handleCloseShort}
        >
          {/* Main Shorts Container */}
          <div
            className="relative w-full h-full md:h-auto md:max-w-sm md:aspect-[9/16] bg-neutral-950 rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar Navigation & Info */}
            <div className="absolute top-0 inset-x-0 z-30 flex flex-col gap-2 p-3 bg-gradient-to-b from-black/70 to-transparent">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="హై టీవీ" className="h-6 w-auto object-contain" />
                  <div className="h-3 w-[1px] bg-white/40" />
                  <span className="text-[10px] font-bold tracking-wider opacity-85 uppercase font-sans">Shorts</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Close Button */}
                  <button
                    onClick={handleCloseShort}
                    className="p-1 text-white hover:text-gray-300 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X size={20} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Display: Video / Youtube / Fallback Card */}
            <div className="flex-1 w-full h-full flex items-center justify-center relative bg-black">
              {media ? (
                media.type === 'video' ? (
                  <video
                    ref={videoRef}
                    src={media.src}
                    autoPlay
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-contain pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                  />
                ) : (
                  <iframe
                    src={media.src}
                    className="w-full h-full object-contain border-0"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                /* Fallback layout: Cover Image + Text Description block */
                <div className="w-full h-full relative flex flex-col justify-between">
                  <img
                    src={activeArticle.image || '/hightv_breaking.png'}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none brightness-75"
                  />
                  {/* Text bubble block at bottom */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-24 pb-8 px-6 text-center z-20">
                    <h3
                      className="text-[16px] md:text-[18px] font-black leading-relaxed text-white telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      {activeArticle.title}
                    </h3>
                    {activeArticle.description && (
                      <p
                        className="text-xs md:text-sm text-gray-200 mt-2 font-medium telugu-text leading-relaxed line-clamp-3"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      >
                        {activeArticle.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Left/Right Navigation Arrows */}
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevShort();
                }}
                disabled={activeArticleIndex === 0}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer pointer-events-auto disabled:opacity-0 disabled:cursor-not-allowed"
                aria-label="Previous Short"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextShort();
                }}
                disabled={activeArticleIndex === articles.length - 1}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer pointer-events-auto disabled:opacity-0 disabled:cursor-not-allowed"
                aria-label="Next Short"
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
