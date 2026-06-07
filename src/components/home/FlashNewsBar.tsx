'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FlashNewsBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

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
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashNewsItems.length);
        setFade(true);
      }, 300); // fade duration
    }, 5000); // cycle every 5 seconds

    return () => clearInterval(timer);
  }, [flashNewsItems.length]);

  return (
    <div className="w-full bg-white border-y border-gray-200 py-2 px-3 flex items-center mb-5 select-none">
      {/* Red Flash News Label */}
      <span className="font-extrabold text-[#fe0000] text-sm md:text-base tracking-wide flex-shrink-0">
        Flash News
      </span>
      
      {/* Vertical divider */}
      <div className="h-4.5 w-[1px] bg-gray-300 mx-3 flex-shrink-0"></div>
      
      {/* Content wrapper */}
      <div className="flex-1 flex items-center overflow-hidden h-6">
        <div 
          className={`flex items-center gap-2.5 transition-all duration-300 ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
        >
          {/* Pulsing Live indicator */}
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          
          {/* Headline Link */}
          <Link 
            href={flashNewsItems[currentIndex].link}
            className="text-[13px] md:text-sm font-bold text-gray-800 hover:text-brand-blue transition-colors line-clamp-1 telugu-text text-left pr-4 cursor-pointer"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {flashNewsItems[currentIndex].text}
          </Link>
        </div>
      </div>
    </div>
  );
}
