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

  // ── Mobile: stacked layout (FLASH NEWS label top, headline below) ──────────
  if (isMobileHeader) {
    return (
      <div className={`w-full bg-white border border-gray-200 rounded-xl py-2 px-3 select-none shadow-3xs ${isMobileHeader ? 'mb-0' : 'mb-5'}`}>
        {/* Row 1: FLASH NEWS label + pulsing dot */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-extrabold text-[#fe0000] text-[12.5px] tracking-wider uppercase font-sans">
            FLASH NEWS
          </span>
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </div>

        {/* Row 2: Headline — wraps naturally across lines */}
        <div
          className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
        >
          <Link
            key={currentIndex}
            href={flashNewsItems[currentIndex].link}
            className="text-[14px] font-extrabold text-gray-800 hover:text-[#02599c] transition-colors telugu-text block leading-snug"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: '1.7' }}
          >
            {flashNewsItems[currentIndex].text}
          </Link>
        </div>
      </div>
    );
  }

  // ── Desktop: original horizontal layout ─────────────────────────────────────
  return (
    <div className={`w-full bg-white border border-gray-200 md:border-x-0 md:border-y py-3 px-4 flex items-center select-none ${isMobileHeader ? 'mb-0' : 'mb-5'}`}>
      {/* Flash News Label */}
      <span className="font-extrabold text-[#fe0000] text-[18px] tracking-wider flex-shrink-0 uppercase font-sans">
        Flash News
      </span>

      {/* Vertical divider */}
      <div className="h-6 w-[1px] bg-gray-200 mx-4 flex-shrink-0"></div>

      {/* Content wrapper */}
      <div className="flex-1 flex items-center min-h-[2.5rem] overflow-hidden">
        <div
          className={`flex items-center gap-2.5 w-full transition-all duration-300 ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
        >
          {/* Pulsing Live indicator */}
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>

          {/* Headline Link */}
          <Link
            key={currentIndex}
            href={flashNewsItems[currentIndex].link}
            className="text-[18.5px] font-extrabold text-gray-800 hover:text-[#02599c] transition-colors telugu-text text-left pr-4 pl-0.5 cursor-pointer block"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: '1.4' }}
          >
            {flashNewsItems[currentIndex].text}
          </Link>
        </div>
      </div>
    </div>
  );
}
