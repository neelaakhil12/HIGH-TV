'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, Sun, Moon } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Scroll visibility toggle
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);

    // Initial theme check on mount
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareWhatsApp = () => {
    const shareText = `${document.title} - ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Floating Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        title={isDark ? "కాంతి మోడ్ ఆన్ చేయండి" : "చీకటి మోడ్ ఆన్ చేయండి"}
        className={`fixed bottom-[160px] md:bottom-[104px] right-3 md:right-6 z-50 w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer ${
          isDark 
            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-350' 
            : 'bg-slate-800 text-yellow-300 hover:bg-slate-700'
        }`}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Floating WhatsApp Button */}
      <button
        onClick={shareWhatsApp}
        title="వాట్సాప్‌లో షేర్ చేయండి"
        className="fixed bottom-[116px] md:bottom-[60px] right-3 md:right-6 z-50 w-9 h-9 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
      >
        <WhatsAppIcon />
      </button>

      {/* Back to Top Button */}
      <button
        onClick={goTop}
        title="పైకి వెళ్ళండి"
        className="fixed bottom-[72px] md:bottom-4 right-3 md:right-6 z-50 w-9 h-9 bg-[#025390] hover:bg-[#013d6b] text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
      >
        <ArrowUp size={16} />
      </button>
    </>
  );
}
