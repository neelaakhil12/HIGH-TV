'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Pause, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import Link from 'next/link';

import { storiesData } from '@/lib/webstoriesData';

export default function WebStoriesSection() {
  const [activeStories, setActiveStories] = useState<any[]>(storiesData);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [typedText, setTypedText] = useState('');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const SLIDE_DURATION = 4000; // 4 seconds per slide

  // Load custom stories on mount
  useEffect(() => {
    fetch('/api/settings?key=custom_web_stories&t=' + Date.now())
      .then(res => res.ok ? res.json() : {})
      .then((data: any) => {
        const storiesVal = data.custom_web_stories || null;
        if (storiesVal) {
          const parsed = JSON.parse(storiesVal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setActiveStories([...parsed, ...storiesData]);
            return;
          }
        }
        setActiveStories(storiesData);
      })
      .catch(() => {
        setActiveStories(storiesData);
      });
  }, []);

  // Typewriter effect triggered on slide index or story changes
  useEffect(() => {
    if (activeStoryIndex === null) {
      setTypedText('');
      return;
    }
    const fullText = activeStories[activeStoryIndex].slides[currentSlideIndex].text;
    setTypedText('');
    
    let currentIdx = 0;
    const intervalTime = 30; // 30ms per character
    
    const charInterval = setInterval(() => {
      if (currentIdx < fullText.length) {
        currentIdx++;
        setTypedText(fullText.slice(0, currentIdx));
      } else {
        clearInterval(charInterval);
      }
    }, intervalTime);

    return () => {
      clearInterval(charInterval);
    };
  }, [activeStoryIndex, currentSlideIndex, activeStories]);

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

  // Outlined Text Styles matching Telugu fonts
  const getTextStyle = (style: 'red-white' | 'white-black') => {
    if (style === 'red-white') {
      return {
        color: '#e60000',
        textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 0px 2px 0 #fff, 0px -2px 0 #fff, 2px 0px 0 #fff, -2px 0px 0 #fff',
        fontFamily: 'Noto Sans Telugu, sans-serif',
      };
    }
    return {
      color: '#ffffff',
      textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0px 2px 0 #000, 0px -2px 0 #000, 2px 0px 0 #000, -2px 0px 0 #000',
      fontFamily: 'Noto Sans Telugu, sans-serif',
    };
  };

  // Open modal player
  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    setCurrentSlideIndex(0);
    setProgress(0);
    setIsPaused(false);
  };

  // Close modal player
  const handleCloseStory = () => {
    setActiveStoryIndex(null);
  };

  // Navigate back/forward within slides
  const handlePrevSlide = () => {
    if (activeStoryIndex === null) return;
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setProgress(0);
    } else {
      // If first slide, go to previous story
      if (activeStoryIndex > 0) {
        setActiveStoryIndex(activeStoryIndex - 1);
        setCurrentSlideIndex(activeStories[activeStoryIndex - 1].slides.length - 1);
        setProgress(0);
      }
    }
  };

  const handleNextSlide = () => {
    if (activeStoryIndex === null) return;
    const currentStory = activeStories[activeStoryIndex];
    if (currentSlideIndex < currentStory.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setProgress(0);
    } else {
      // If last slide, go to next story or close if last story (limit to 3 featured stories on home screen)
      const maxIndex = Math.min(2, activeStories.length - 1);
      if (activeStoryIndex < maxIndex) {
        setActiveStoryIndex(activeStoryIndex + 1);
        setCurrentSlideIndex(0);
        setProgress(0);
      } else {
        handleCloseStory();
      }
    }
  };

  // Progress Bar timer logic
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const intervalTime = 40; // update progress every 40ms
    const step = (intervalTime / SLIDE_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current!);
          handleNextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [activeStoryIndex, currentSlideIndex, isPaused, activeStories]);

  // Lock body scroll when stories player modal is open
  useEffect(() => {
    if (activeStoryIndex !== null) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('stories-active');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('stories-active');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('stories-active');
    };
  }, [activeStoryIndex]);

  const activeStory = activeStoryIndex !== null ? activeStories[activeStoryIndex] : null;



  return (
    <div className="mb-6 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-150 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-[#02599c] rounded-full"></div>
          <h3 className="font-black text-[#02599c] text-[16px] md:text-[18px] telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            వెబ్ స్టోరీస్
          </h3>
        </div>
        <Link 
          href="/category/webstories" 
          className="text-sm md:text-[15px] font-extrabold text-[#02599c] hover:text-[#e60000] transition-colors flex items-center gap-1 telugu-text" 
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          మరిన్ని చూడండి <ChevronRight size={14} />
        </Link>
      </div>

      {/* Grid of Web Stories (3 Columns) */}
      <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible gap-4 pb-2 md:pb-0 snap-x snap-mandatory scroll-smooth hide-scrollbar">
        {activeStories.slice(0, 3).map((story, idx) => (
          <div key={story.id} className="flex-shrink-0 w-[140px] md:w-auto snap-start flex flex-col group cursor-pointer" onClick={() => handleOpenStory(idx)}>
            {/* Story Card Image */}
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 flex items-center justify-center">
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              />
              {/* Stack overlay icon indicating story */}
              <div className="absolute bottom-2.5 right-2.5 bg-black/40 text-white rounded p-1 backdrop-blur-xs flex items-center justify-center">
                <Layers size={13} className="stroke-[2.5]" />
              </div>
              {/* Image text overlay */}
              <div className="absolute top-[15%] left-0 right-0 px-5 md:px-6 text-center">
                <span
                  className="text-[18px] md:text-[22px] font-black leading-relaxed block break-words pl-2.5"
                  style={getTextStyle(story.coverStyle)}
                >
                  {story.coverTitle}
                </span>
              </div>
            </div>
            {/* Bottom Title Text */}
            <div className="mt-2 text-left py-1 pl-3.5 pr-2">
              <h4
                className="text-[0.92rem] md:text-[1.02rem] font-black text-gray-855 group-hover:text-[#02599c] leading-relaxed md:leading-[2.15] pb-2 telugu-text line-clamp-4 md:line-clamp-2 pl-2.5"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {story.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp Status Modal Player */}
      {mounted && typeof window !== 'undefined' && activeStory && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-xs p-0 md:p-4 animate-fade-in"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          onClick={handleCloseStory}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes storyPanelPop {
              0% {
                opacity: 0;
                transform: translateY(20%);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-story-panel-pop {
              animation: storyPanelPop 0.3s ease-out forwards;
            }
          `}} />
          {/* Main Story Container */}
          <div
            className="relative w-full h-[100dvh] md:h-auto md:max-w-sm md:aspect-[9/16] rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
            style={{ backgroundColor: '#0a0a0a' }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Slide Image */}
            <img
              src={activeStory.slides[currentSlideIndex].image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Black-to-transparent gradient shadow mask for readability (top header only) */}
            <div 
              className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10" 
              style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 100%)' }}
            />

            {/* Top Bar Container */}
            <div className="absolute top-0 inset-x-0 z-30 flex flex-col gap-2 p-3">
              {/* Progress Lines */}
              <div className="flex gap-1.5 w-full">
                {activeStory.slides.map((_: any, i: number) => {
                  let barWidth = '0%';
                  if (i < currentSlideIndex) barWidth = '100%';
                  if (i === currentSlideIndex) barWidth = `${progress}%`;

                  return (
                    <div key={i} className="h-1 flex-1 bg-white/35 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-[40ms] ease-linear rounded-full"
                        style={{ width: barWidth }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Header Info */}
              <div className="flex items-center justify-between mt-1 text-white">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="హై టీవీ" className="h-6 w-auto object-contain" />
                  <div className="h-3 w-[1px] bg-white/40" />
                  <span className="text-[10px] font-bold tracking-wider opacity-85 uppercase font-sans">hightv.in</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Play/Pause Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPaused(!isPaused);
                    }}
                    className="p-1 text-white hover:text-gray-300 transition-colors cursor-pointer"
                    aria-label={isPaused ? "Play" : "Pause"}
                  >
                    {isPaused ? <Play size={16} fill="white" /> : <Pause size={16} fill="white" />}
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={handleCloseStory}
                    className="p-1 text-white hover:text-gray-300 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X size={18} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Curved dome background for text overlay */}
            <div 
              className="absolute bottom-0 left-1/2 w-[140%] aspect-square rounded-full bg-black/70 z-20 pointer-events-none"
              style={{ transform: 'translate(-50%, 55%)' }}
            />

            {/* Slide Text Panel (White text matching the reference) */}
            <div 
              className="absolute inset-x-0 bottom-0 w-full pt-48 pb-14 px-6 z-20 pointer-events-none flex flex-col justify-end items-center text-center animate-story-panel-pop"
            >
              <h3
                className="text-[16px] sm:text-[18px] md:text-[20px] font-bold leading-relaxed text-white telugu-text max-w-xs md:max-w-md mx-auto"
                style={{
                  fontFamily: 'Noto Sans Telugu, sans-serif',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                {typedText}
              </h3>
            </div>

            {/* Left / Right Hidden Touch Overlay for Navigation */}
            <div className="absolute inset-0 z-10 flex">
              <div
                className="w-1/3 h-full cursor-w-resize"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevSlide();
                }}
              />
              <div
                className="w-2/3 h-full cursor-e-resize"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
              />
            </div>

            {/* Desktop Left/Right Navigation Arrows */}
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevSlide();
                }}
                disabled={activeStoryIndex === 0 && currentSlideIndex === 0}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer pointer-events-auto disabled:opacity-0 disabled:cursor-not-allowed"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer pointer-events-auto"
                aria-label="Next Slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
