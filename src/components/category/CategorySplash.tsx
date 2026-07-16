'use client';

import { useState, useEffect } from 'react';

interface CategorySplashProps {
  category: string;
}

export default function CategorySplash({ category }: CategorySplashProps) {
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const targetText = category === 'uma-insights' ? 'ఉమా ఇన్‌సైట్స' : 'Satya Bytes';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(targetText.slice(0, index + 1));
      index++;
      if (index >= targetText.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setShouldRender(false);
          }, 500);
        }, 600);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [targetText]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0b2545] to-[#134074] transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="text-center px-4 select-none">
        <h1 className="text-2.5xl sm:text-4xl md:text-6xl lg:text-7.5xl font-black text-white tracking-wider font-sans flex items-center justify-center leading-normal">
          <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-md py-3 px-1">
            {text}
          </span>
        </h1>
        <div className="mt-4 text-xs md:text-sm font-black text-[#ffb3d1] uppercase tracking-widest animate-pulse">
          HIGH TV
        </div>
      </div>
    </div>
  );
}
