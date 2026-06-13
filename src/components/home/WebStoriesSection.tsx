'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import Link from 'next/link';

interface StorySlide {
  image: string;
  text: string;
  textStyle: 'red-white' | 'white-black';
}

interface WebStory {
  id: string;
  title: string;
  coverImage: string;
  coverTitle: string;
  coverStyle: 'red-white' | 'white-black';
  slides: StorySlide[];
}

const storiesData: WebStory[] = [
  {
    id: 'story-1',
    title: 'ఫ్రిజ్‌లో ఆహారం.. సరిగానే నిల్వ చేస్తున్నారా?',
    coverImage: '/fridge_story.png',
    coverTitle: 'ఫ్రిజ్‌లో ఆహారం.. సరిగానే నిల్వ చేస్తున్నారా?',
    coverStyle: 'red-white',
    slides: [
      {
        image: '/fridge_story.png',
        text: 'ఫ్రిజ్‌లో ఆహారం.. సరిగానే నిల్వ చేస్తున్నారా?',
        textStyle: 'red-white',
      },
      {
        image: '/fridge_story.png',
        text: 'పాలు, పాల పదార్థాలను ఎక్కువ సేపు బయట ఉంచకూడదు',
        textStyle: 'red-white',
      },
      {
        image: '/fridge_story.png',
        text: 'మిగిలిపోయిన ఆహారాన్ని మూత ఉన్న పాత్రల్లోనే భద్రపరచాలి',
        textStyle: 'red-white',
      },
      {
        image: '/fridge_story.png',
        text: 'వారానికి ఒకసారి ఫ్రిజ్‌ను పూర్తిగా శుభ్రం చేయడం అవసరం',
        textStyle: 'red-white',
      },
    ],
  },
  {
    id: 'story-2',
    title: 'బాలకృష్ణ అంటే పాజిటివిటీ.. భోళా శంకరుడు',
    coverImage: '/balayya_story.png',
    coverTitle: 'భోళా బాలయ్య..',
    coverStyle: 'white-black',
    slides: [
      {
        image: '/balayya_story.png',
        text: 'భోళా బాలయ్య.. హృదయపూర్వక పుట్టినరోజు శుభాకాంక్షలు!',
        textStyle: 'white-black',
      },
      {
        image: '/balayya_story.png',
        text: 'నటసింహం కెరీర్‌లో ఎన్నో అద్భుతమైన మైలురాళ్లు',
        textStyle: 'white-black',
      },
      {
        image: '/balayya_story.png',
        text: 'బాక్సాఫీస్ వద్ద రికార్డులను తిరగరాసే సత్తా బాలయ్య సొంతం',
        textStyle: 'white-black',
      },
      {
        image: '/balayya_story.png',
        text: 'అభిమానుల సంక్షేమం కోసం నిత్యం తపించే సహృదయుడు',
        textStyle: 'white-black',
      },
    ],
  },
  {
    id: 'story-3',
    title: 'పిల్లలలో రక్తం తక్కువగా ఉందా.. ఇలా చేయండి!',
    coverImage: '/child_health_story.png',
    coverTitle: 'పిల్లల్లో రక్తం తక్కువగా ఉందా?',
    coverStyle: 'red-white',
    slides: [
      {
        image: '/child_health_story.png',
        text: 'పిల్లల్లో రక్తం తక్కువగా ఉందా? నిర్లక్ష్యం చేయకండి!',
        textStyle: 'red-white',
      },
      {
        image: '/child_health_story.png',
        text: 'రోజువారీ డైట్‌లో దానిమ్మ పండ్లు, ఖర్జూరం చేర్చండి',
        textStyle: 'red-white',
      },
      {
        image: '/child_health_story.png',
        text: 'ఆకుకూరలు ముఖ్యంగా తోటకూర, పాలకూర తినిపించాలి',
        textStyle: 'red-white',
      },
      {
        image: '/child_health_story.png',
        text: 'వైద్యుల సలహా మేరకు ఐరన్ సిరప్ వాడటం మంచిది',
        textStyle: 'red-white',
      },
    ],
  },
];

export default function WebStoriesSection() {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [typedText, setTypedText] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const SLIDE_DURATION = 4000; // 4 seconds per slide

  // Typewriter effect triggered on slide index or story changes
  useEffect(() => {
    if (activeStoryIndex === null) {
      setTypedText('');
      return;
    }
    const fullText = storiesData[activeStoryIndex].slides[currentSlideIndex].text;
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
  }, [activeStoryIndex, currentSlideIndex]);

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
        setCurrentSlideIndex(storiesData[activeStoryIndex - 1].slides.length - 1);
        setProgress(0);
      }
    }
  };

  const handleNextSlide = () => {
    if (activeStoryIndex === null) return;
    const currentStory = storiesData[activeStoryIndex];
    if (currentSlideIndex < currentStory.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setProgress(0);
    } else {
      // If last slide, go to next story or close if last story
      if (activeStoryIndex < storiesData.length - 1) {
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
  }, [activeStoryIndex, currentSlideIndex, isPaused]);

  // Lock body scroll when stories player modal is open
  useEffect(() => {
    if (activeStoryIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeStoryIndex]);

  const activeStory = activeStoryIndex !== null ? storiesData[activeStoryIndex] : null;

  // Dynamic Circle sizing calculations based on slide text length
  const currentText = activeStory?.slides[currentSlideIndex]?.text || '';
  const textLength = currentText.length;
  const circleSize = Math.max(460, Math.min(560, 420 + textLength * 2));
  const bottomOffset = -circleSize * 0.26;
  const ptPadding = Math.round(circleSize * 0.06);

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
          className="text-xs md:text-sm font-extrabold text-[#02599c] hover:text-[#e60000] transition-colors flex items-center gap-1 telugu-text" 
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          మరిన్ని చూడండి <ChevronRight size={14} />
        </Link>
      </div>

      {/* Grid of Web Stories (3 Columns) */}
      <div className="grid grid-cols-3 gap-4">
        {storiesData.map((story, idx) => (
          <div key={story.id} className="flex flex-col group cursor-pointer" onClick={() => handleOpenStory(idx)}>
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
              <div className="absolute top-[15%] left-0 right-0 px-3 text-center">
                <span
                  className="text-[14px] md:text-[17px] font-black leading-tight block break-words"
                  style={getTextStyle(story.coverStyle)}
                >
                  {story.coverTitle}
                </span>
              </div>
            </div>
            {/* Bottom Title Text */}
            <div className="mt-2 text-left">
              <h4
                className="text-[12.5px] font-black text-gray-800 group-hover:text-[#02599c] leading-snug line-clamp-2 telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {story.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp Status Modal Player */}
      {activeStory && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-xs p-4 animate-fade-in"
          onClick={handleCloseStory}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes storyCirclePop {
              0% {
                opacity: 0;
                transform: translate(-50%, 250px) scale(0.9);
              }
              70% {
                opacity: 1;
                transform: translate(-50%, -12px) scale(1.02);
              }
              100% {
                opacity: 1;
                transform: translate(-50%, 0) scale(1);
              }
            }
            .animate-story-circle-pop {
              animation: storyCirclePop 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
          `}} />
          {/* Main Story Container */}
          <div
            className="relative w-full max-w-sm aspect-[9/16] bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
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
            {/* Black-to-transparent gradient shadow mask for readability */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent pointer-events-none z-10" />

            {/* Top Bar Container */}
            <div className="absolute top-0 inset-x-0 z-30 flex flex-col gap-2 p-3">
              {/* Progress Lines */}
              <div className="flex gap-1.5 w-full">
                {activeStory.slides.map((_, i) => {
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
                  <img src="/logo.png" alt="హై టీవీ" className="h-5 w-auto object-contain brightness-0 invert" />
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

            {/* Slide Circle Text Overlay (Centered dome at the bottom, clips into a curved bottom block, sizes dynamically) */}
            <div 
              style={{
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                bottom: `${bottomOffset}px`,
                paddingTop: `${ptPadding}px`,
              }}
              className="absolute left-1/2 rounded-full bg-black/65 backdrop-blur-xs shadow-2xl z-20 pointer-events-none flex flex-col justify-start items-center px-6 text-center animate-story-circle-pop border border-white/10 transition-all duration-500 ease-in-out"
            >
              <h3
                className="text-[20px] md:text-[22px] font-black leading-relaxed text-white telugu-text max-w-[270px] mx-auto"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
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

            {/* Bottom Space Footer indicator */}
            <div className="absolute bottom-4 inset-x-0 text-center z-20 pointer-events-none">
              <span className="text-[10px] font-black tracking-widest uppercase text-white/50 font-sans">
                Slide {currentSlideIndex + 1} of {activeStory.slides.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
