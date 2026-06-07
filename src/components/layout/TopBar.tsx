'use client';

import { useEffect, useState } from 'react';

export default function TopBar() {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const trendingItems = [
    'IPL 2026',
    'ఎన్నికల ఫలితాలు',
    'బంగారం ధరలు',
    'తాజా బులెటిన్',
    'సినిమా అప్‌డేట్స్'
  ];

  // Rotate trending topics every 4 seconds with a smooth fade-out/fade-in animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActiveItemIndex((prev) => (prev + 1) % trendingItems.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [trendingItems.length]);

  return (
    <div className="bg-[#07559a] text-white h-11 border-b border-[#05457e] shadow-sm select-none relative z-50">
      <div className="max-w-[1005px] mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Left: Trending Banner */}
        <div className="flex items-center gap-2 overflow-hidden h-full">
          <span className="font-extrabold text-[12px] tracking-wider text-[#ffe600] flex-shrink-0 uppercase font-sans">
            TRENDING
          </span>
          <div className="flex items-center h-full">
            <span 
              className={`text-[12px] font-bold tracking-wide transition-all duration-300 transform ${
                fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
              } inline-block select-none`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {trendingItems[activeItemIndex]}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
