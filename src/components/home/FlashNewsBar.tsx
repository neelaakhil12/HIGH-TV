'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FlashNewsBar({ isMobileHeader = false }: { isMobileHeader?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [cycleTime, setCycleTime] = useState(5000);

  const flashNewsItems = [
    {
      text: "ముంబై ఎయిర్‌పోర్ట్‌లో భారీగా బంగారం పట్టివేత",
      link: "/search?q=బంగారం"
    },
    {
      text: "నేడు ఏపీ కేబినెట్‌ కీలక భేటీ.. పలు కీలక నిర్ణయాలు తీసుకునే అవకాశం",
      link: "/search?q=ఏపీ కేబినెట్‌"
    },
    {
      text: "తెలంగాణలో రాబోయే రెండు రోజుల్లో భారీ వర్షాలు కురిసే అవకాశం",
      link: "/search?q=వర్షాలు"
    },
    {
      text: "భారత క్రికెట్ జట్టు సంచలన విజయం.. సిరీస్ సొంతం చేసుకున్న టీమిండియా",
      link: "/search?q=క్రికెట్"
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        setCycleTime(12000); // 12 seconds on mobile to allow complete scroll animation
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashNewsItems.length);
        setFade(true);
      }, 300); // fade duration
    }, cycleTime);

    return () => clearInterval(timer);
  }, [flashNewsItems.length, cycleTime]);

  return (
    <div className={`w-full bg-white border border-gray-200 rounded-xl md:rounded-none md:border-x-0 md:border-y py-1 md:py-3 px-2.5 md:px-4 flex items-center select-none shadow-3xs md:shadow-none ${isMobileHeader ? 'mb-0' : 'mb-5'}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marqueeScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @media (max-width: 767px) {
          .animate-marquee-mobile {
            display: inline-block;
            padding-left: 100%;
            animation: marqueeScroll 12s linear infinite;
            white-space: nowrap !important;
          }
        }
      `}} />
      
      {/* Red FLASH NEWS / LIVE UPDATES Label */}
      <span className="font-extrabold text-[#fe0000] text-[10px] md:text-[16px] tracking-wider flex-shrink-0 uppercase font-sans">
        <span className="md:hidden">FLASH NEWS</span>
        <span className="hidden md:inline">Flash News</span>
      </span>
      
      {/* Vertical divider */}
      <div className="h-4 md:h-6 w-[1px] bg-gray-200 mx-2 md:mx-4 flex-shrink-0"></div>
      
      {/* Content wrapper */}
      <div className="flex-1 flex items-center min-h-[1.5rem] md:min-h-[2.5rem] overflow-hidden">
        <div 
          className={`flex items-center md:items-start gap-1.5 md:gap-2.5 w-full md:transition-all md:duration-300 ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 md:-translate-y-1'
          }`}
        >
          {/* Pulsing Live indicator */}
          <span className="relative flex h-2 w-2 ml-0.5 mr-0.5 md:mt-1.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          
          {/* Headline Link */}
          <div className="flex-1 overflow-hidden relative flex items-center">
            <Link 
              key={currentIndex}
              href={flashNewsItems[currentIndex].link}
              className="text-[12.5px] md:text-[16px] font-bold text-gray-800 hover:text-brand-blue transition-colors telugu-text text-left pr-4 pl-0.5 cursor-pointer block animate-marquee-mobile"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: '1.8' }}
            >
              {flashNewsItems[currentIndex].text}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
