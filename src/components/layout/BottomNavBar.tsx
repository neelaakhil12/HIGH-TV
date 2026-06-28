'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu as MenuIcon, Newspaper, Search, X, Heart } from 'lucide-react';

export default function BottomNavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close the drawer when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = [
    { label: 'హోమ్', href: '/' },
    { label: 'బ్రేకింగ్ న్యూస్', href: '/category/latest' },
    { label: 'లైవ్ అప్‌డేట్స్', href: '/category/live-updates' },
    { label: 'తెలంగాణ', href: '/category/telangana' },
    { label: 'ఆంధ్రప్రదేశ్', href: '/category/andhra-pradesh' },
    { label: 'ఈ-పేపర్', href: '/category/epaper' },
    { label: 'నేషనల్', href: '/category/national' },
    { label: 'వరల్డ్', href: '/category/international' },
    { label: 'బిజినెస్', href: '/category/business' },
    { label: 'హెల్త్', href: '/category/health' },
    { label: 'స్పోర్ట్స్', href: '/category/sports' },
    { label: 'ఫిల్మ్', href: '/category/entertainment' },
    { label: 'టెక్నాలజీ', href: '/category/technology' },
    { label: 'శుభఫలాలు', href: '/category/rasipalalu' },
    { label: 'వైరల్', href: '/category/viral' },
    { label: 'ఫోటో గ్యాలరీ', href: '/category/photos' },
    { label: 'షార్ట్స్', href: '/category/shorts' },
    { label: 'ఆమె', href: '/category/women' },
    { label: 'లైఫ్ స్టైల్', href: '/category/lifestyle' },
    { label: 'వెబ్ స్టోరీస్', href: '/category/webstories' },
    { label: 'వ్యక్తిత్వ వికాసం', href: '/category/antharmadanam' },
    { label: 'దైవం', href: '/category/adyathmikam' },
    { label: 'ఎడిటోరియల్', href: '/category/sampadakiyam' },
    { label: 'అడ్మిషన్స్', href: '/category/admissions' },
    { label: 'కరెంట్ అఫైర్స్', href: '/category/current-affairs' },
    { label: 'నోటిఫికేషన్స్', href: '/category/notification' },
    { label: 'సిటిజన్ రిపోర్టర్', href: '/category/citizen-reporter' },
    { label: 'మా టీమ్', href: '/team' },
    { label: 'వెదర్', href: '/weather' },
  ];

  const isEPaperActive = pathname?.startsWith('/category/epaper') || false;
  const isHealthActive = pathname?.startsWith('/category/health') || pathname?.startsWith('/category/doctors-corner') || false;
  const isSearchActive = pathname === '/search';

  return (
    <>
      {/* ── Bottom Sheet Drawer overlay for "Menu" ──────────────────── */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[105] transition-opacity duration-300 ease-out" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div 
        className={`fixed bottom-0 left-0 right-0 z-[110] bg-white rounded-t-3xl border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] max-h-[85vh] flex flex-col transition-transform duration-300 ease-out pb-safe md:hidden ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle decoration */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3 flex-shrink-0" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 pb-3 border-b border-gray-100 flex-shrink-0">
          <h3 
            className="text-lg font-black text-gray-800 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            మెనూ (Menu)
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-850 hover:bg-gray-150 transition-colors"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Drawer Scrollable Content Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-3 gap-2">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center justify-center text-center py-3 px-0.5 rounded-xl text-[10.5px] sm:text-xs font-bold transition-all border leading-tight telugu-text cursor-pointer select-none active:scale-[0.97] ${
                    isActive
                      ? 'bg-[#ffb3d1] border-transparent text-[#025390] font-black shadow-xs'
                      : 'bg-[#025390] border-transparent text-white hover:bg-[#0269b3]'
                  }`}
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Padding offset for the persistent bottom navbar */}
        <div className="h-14 flex-shrink-0" />
      </div>

      {/* ── Persistent Bottom Navigation Bar ─────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[120] bg-[#025390] border-t border-[#013d6e] shadow-[0_-2px_10px_rgba(0,0,0,0.15)] h-14 flex items-center justify-around px-2 pb-safe">
        {/* Menu Tab */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors cursor-pointer select-none ${
            isOpen 
              ? 'text-[#ffb3d1] font-black' 
              : 'text-white/80 hover:text-white font-semibold'
          }`}
        >
          <MenuIcon 
            size={20} 
            className={`transition-transform duration-200 ${isOpen ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'}`} 
          />
          <span 
            className="text-[9.5px] mt-0.5 telugu-text tracking-tight leading-none truncate w-full"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            మెనూ
          </span>
        </button>

        {/* E-Paper Tab */}
        <Link
          href="/category/epaper"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors cursor-pointer select-none ${
            isEPaperActive 
              ? 'text-[#ffb3d1] font-black' 
              : 'text-white/80 hover:text-white font-semibold'
          }`}
        >
          <Newspaper 
            size={20} 
            className={`transition-transform duration-200 ${isEPaperActive ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'}`} 
          />
          <span 
            className="text-[9.5px] mt-0.5 telugu-text tracking-tight leading-none truncate w-full"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            ఈ-పేపర్
          </span>
        </Link>

        {/* Health Tab */}
        <Link
          href="/category/health"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors cursor-pointer select-none ${
            isHealthActive 
              ? 'text-[#ffb3d1] font-black' 
              : 'text-white/80 hover:text-white font-semibold'
          }`}
        >
          <Heart 
            size={20} 
            className={`transition-transform duration-200 ${isHealthActive ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'}`} 
          />
          <span 
            className="text-[9.5px] mt-0.5 telugu-text tracking-tight leading-none text-center"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            హెల్త్
          </span>
        </Link>

        {/* Search Tab */}
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors cursor-pointer select-none ${
            isSearchActive 
              ? 'text-[#ffb3d1] font-black' 
              : 'text-white/80 hover:text-white font-semibold'
          }`}
        >
          <Search 
            size={20} 
            className={`transition-transform duration-200 ${isSearchActive ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'}`} 
          />
          <span 
            className="text-[9.5px] mt-0.5 telugu-text tracking-tight leading-none truncate w-full"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            శోధన
          </span>
        </Link>
      </div>
    </>
  );
}
