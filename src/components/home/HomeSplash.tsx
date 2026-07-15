'use client';

import { useState, useEffect } from 'react';

export default function HomeSplash() {
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  const targetText = 'hightv.in';

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('home_splash_played');
    if (hasPlayed) {
      return;
    }
    setShouldRender(true);

    let index = 0;
    const delayTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setText(targetText.slice(0, index + 1));
        index++;
        if (index >= targetText.length) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('home_splash_played', 'true');
            setTimeout(() => {
              setShouldRender(false);
            }, 500);
          }, 800);
        }
      }, 120);
      return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(delayTimeout);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#e60000] to-[#990000] transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center gap-6 px-4 select-none animate-fade-in">
        <div className="w-28 h-28 md:w-36 md:h-36 bg-white p-3.5 rounded-3xl shadow-xl flex items-center justify-center border-2 border-white/20">
          <img
            src="/logo.png"
            alt="High TV Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="h-10 flex items-center justify-center">
          <h1 className="text-2xl md:text-3.5xl font-black text-white tracking-widest font-mono">
            {text}
          </h1>
        </div>
      </div>
    </div>
  );
}
