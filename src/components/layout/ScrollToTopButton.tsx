'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, Share2 } from 'lucide-react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Scroll visibility toggle for Back-to-Top button
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sharePage = async () => {
    const shareData = {
      title: document.title,
      text: 'Check out this on HIGH TV:',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing page:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('లింక్ విజయవంతంగా కాపీ చేయబడింది! (Link copied successfully!)');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  return (
    <>
      {/* Floating Share Button (Always Visible) */}
      <button
        onClick={sharePage}
        title="పేజీని షేర్ చేయండి"
        className="fixed bottom-[116px] md:bottom-[60px] right-3 md:right-6 z-50 w-9 h-9 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
      >
        <Share2 size={16} />
      </button>

      {/* Back to Top Button (Visible only after scrolling) */}
      {visible && (
        <button
          onClick={goTop}
          title="పైకి వెళ్ళండి"
          className="fixed bottom-[72px] md:bottom-4 right-3 md:right-6 z-50 w-9 h-9 bg-[#025390] hover:bg-[#013d6b] text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
        >
          <ArrowUp size={16} />
        </button>
      )}
    </>
  );
}
