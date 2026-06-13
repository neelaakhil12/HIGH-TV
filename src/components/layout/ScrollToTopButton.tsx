'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={goTop}
      title="పైకి వెళ్ళండి"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#025390] hover:bg-[#013d6b] text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
    >
      <ArrowUp size={20} />
    </button>
  );
}
