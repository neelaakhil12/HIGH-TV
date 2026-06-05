'use client';

import { useEffect, useState } from 'react';
import { breakingNews } from '@/lib/mockData';
import { User, Sun } from 'lucide-react';

// Inline SVG social icons (Lucide doesn't have brand icons)
const FacebookIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20.06 12 20.06 12 20.06s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function TopBar() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('te-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const dateStr = now.toLocaleDateString('te-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tickerContent = [...breakingNews, ...breakingNews].join('  ●  ');

  return (
    <div className="bg-[#C00000] text-white text-xs">
      {/* Breaking news ticker row */}
      <div className="flex items-center border-b border-red-800">
        <div className="flex-shrink-0 bg-[#8B0000] px-3 py-1.5 flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
          <span className="w-2 h-2 bg-white rounded-full breaking-badge inline-block"></span>
          బ్రేకింగ్
        </div>
        <div className="flex-1 overflow-hidden py-1.5 relative">
          <div className="marquee-inner" style={{ width: 'max-content' }}>
            <span className="px-4 telugu-text">{tickerContent}</span>
            <span className="px-4 telugu-text">{tickerContent}</span>
          </div>
        </div>
      </div>

      {/* Date/Time + Social + Weather row */}
      <div className="max-w-[1400px] mx-auto px-4 py-1.5 flex items-center justify-between">
        {/* Date and Time */}
        <div className="flex items-center gap-3 text-red-100">
          <span className="telugu-text font-medium hidden sm:inline">{currentDate}</span>
          <span className="text-red-300 hidden sm:inline">|</span>
          <span className="font-mono font-semibold">{currentTime}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Weather */}
          <div className="hidden md:flex items-center gap-1 text-red-100">
            <Sun size={12} className="text-yellow-300" />
            <span className="text-xs">హైదరాబాద్: 34°C</span>
          </div>
          <span className="text-red-400 hidden md:block">|</span>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-red-200 transition-colors" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="#" className="hover:text-red-200 transition-colors" aria-label="Twitter">
              <TwitterIcon />
            </a>
            <a href="#" className="hover:text-red-200 transition-colors" aria-label="YouTube">
              <YoutubeIcon />
            </a>
            <a href="#" className="hover:text-red-200 transition-colors" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>

          <span className="text-red-400">|</span>

          {/* Login */}
          <a
            href="/login"
            className="flex items-center gap-1 bg-white text-[#C00000] font-bold px-3 py-0.5 rounded-full text-xs hover:bg-red-50 transition-colors"
          >
            <User size={11} />
            లాగిన్
          </a>
        </div>
      </div>
    </div>
  );
}
