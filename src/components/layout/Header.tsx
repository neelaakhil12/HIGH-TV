'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, X, Search, TrendingUp } from 'lucide-react';
import FlashNewsBar from '@/components/home/FlashNewsBar';

export default function Header() {
  const rawPathname = usePathname();
  const pathname = rawPathname || '';
  const isHome = pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teluguDate, setTeluguDate] = useState('');
  const [isAPMobileExpanded, setIsAPMobileExpanded] = useState(false);
  const [isTGMobileExpanded, setIsTGMobileExpanded] = useState(false);
  const [isHealthMobileExpanded, setIsHealthMobileExpanded] = useState(false);
  const [isVidyaMobileExpanded, setIsVidyaMobileExpanded] = useState(false);
  const [isUpadiMobileExpanded, setIsUpadiMobileExpanded] = useState(false);
  const [isMoreMobileExpanded, setIsMoreMobileExpanded] = useState(false);
  const [headerAds, setHeaderAds] = useState<{id: string; title: string; image: string; body: string | null}[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adFade, setAdFade] = useState(true);

  useEffect(() => {
    fetch('/api/articles?category=header-ad&limit=20&t=' + Date.now())
      .then(r => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data
            .filter(ad => ad.categorySlug === 'header-ad' && ad.category === 'active')
            .map(ad => ({ id: ad.id, title: ad.title, image: ad.image, body: ad.body }));
          setHeaderAds(active);
        }
      })
      .catch(() => {});
  }, []);

  // Rotate header ads every 2 seconds with fade transition
  useEffect(() => {
    if (headerAds.length <= 1) return;
    const interval = setInterval(() => {
      setAdFade(false);
      setTimeout(() => {
        setCurrentAdIndex(prev => (prev + 1) % headerAds.length);
        setAdFade(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, [headerAds.length]);

  useEffect(() => {
    setIsTGMobileExpanded(false);
    setIsAPMobileExpanded(false);
    setIsHealthMobileExpanded(false);
    setIsVidyaMobileExpanded(false);
    setIsUpadiMobileExpanded(false);

    if (pathname.startsWith('/category/telangana')) {
      setIsTGMobileExpanded(true);
    } else if (pathname.startsWith('/category/andhra-pradesh')) {
      setIsAPMobileExpanded(true);
    } else if (pathname.startsWith('/category/health') || pathname.startsWith('/category/doctors-corner')) {
      setIsHealthMobileExpanded(true);
    } else if (pathname.startsWith('/category/admissions') || pathname.startsWith('/category/current-affairs') || pathname.startsWith('/category/vidya')) {
      setIsVidyaMobileExpanded(true);
    } else if (pathname.startsWith('/category/notification') || pathname.startsWith('/category/upadi')) {
      setIsUpadiMobileExpanded(true);
    }
  }, [pathname]);

  const [trendingIndex, setTrendingIndex] = useState(0);
  const [trendingFade, setTrendingFade] = useState(true);

  // States for desktop dropdowns (to support touch screens in desktop mode)
  const [isAPDropdownOpen, setIsAPDropdownOpen] = useState(false);
  const [isTGDropdownOpen, setIsTGDropdownOpen] = useState(false);
  const [isHealthDropdownOpen, setIsHealthDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  const closeAllDropdowns = () => {
    setIsAPDropdownOpen(false);
    setIsTGDropdownOpen(false);
    setIsMoreDropdownOpen(false);
    setIsHealthDropdownOpen(false);
  };

  const handleAPClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAPDropdownOpen(!isAPDropdownOpen);
    setIsTGDropdownOpen(false);
    setIsMoreDropdownOpen(false);
    setIsHealthDropdownOpen(false);
  };

  const handleTGClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTGDropdownOpen(!isTGDropdownOpen);
    setIsAPDropdownOpen(false);
    setIsMoreDropdownOpen(false);
    setIsHealthDropdownOpen(false);
  };

  const handleHealthClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHealthDropdownOpen(!isHealthDropdownOpen);
    setIsAPDropdownOpen(false);
    setIsTGDropdownOpen(false);
    setIsMoreDropdownOpen(false);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
    setIsAPDropdownOpen(false);
    setIsTGDropdownOpen(false);
    setIsHealthDropdownOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = () => {
      closeAllDropdowns();
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    fetch('/api/deleted-articles?t=' + Date.now())
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.deletedIds)) {
          localStorage.setItem('db_deleted_news_articles', JSON.stringify(data.deletedIds));
        }
      })
      .catch(err => console.error('Error fetching deleted articles list:', err));
  }, []);

  const [trendingItems, setTrendingItems] = useState([
    { text: "ఎన్నికల ఫలితాలు", link: "/search?q=ఎన్నికల ఫలితాలు" },
    { text: "ఆంధ్రప్రదేశ్‌లో భారీ వర్షాలు", link: "/search?q=వర్షాలు" },
    { text: "హైదరాబాద్ మెట్రో విస్తరణ", link: "/search?q=మెట్రో" },
    { text: "బంగారం ధరలు నేటి అప్‌డేట్స్", link: "/search?q=బంగారం" },
    { text: "టీమిండియా వన్డే సిరీస్ విజయం", link: "/search?q=క్రికెట్" },
    { text: "నేటి రాశిఫలాలు", link: "/search?q=రాశిఫలాలు" },
    { text: "వెబ్ స్టోరీస్ గ్యాలరీ", link: "/category/webstories" }
  ]);

  useEffect(() => {
    // Fetch from database API first
    fetch('/api/trending-news?t=' + Date.now())
      .then(res => res.ok ? res.json() : [])
      .then(dbTrending => {
        if (Array.isArray(dbTrending) && dbTrending.length > 0) {
          setTrendingItems(dbTrending.map((item: any) => ({ text: item.text, link: item.link })));
        }
      })
      .catch(err => {
        console.error("Error loading trending items from DB:", err);
      });
  }, []);

  // Randomize trending headline on mount and rotate it periodically
  useEffect(() => {
    if (trendingItems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * trendingItems.length);
    setTrendingIndex(randomIndex);

    const timer = setInterval(() => {
      setTrendingFade(false);
      setTimeout(() => {
        setTrendingIndex((prevIndex) => (prevIndex + 1) % trendingItems.length);
        setTrendingFade(true);
      }, 300); // fade out duration
    }, 4000); // cycle every 4 seconds

    return () => clearInterval(timer);
  }, [trendingItems.length]);

  // Set Telugu date on mount to avoid server-side hydration mismatches
  useEffect(() => {
    const days = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
    const months = [
      'జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్',
      'జూలై', 'ఆగస్టు', 'సెప్టెంబరు', 'అక్టోబరు', 'నవంబరు', 'డిసెంబరు'
    ];
    const now = new Date();
    setTeluguDate(`${days[now.getDay()]}, ${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  // Returns baby-pink text class when the link is the active page
  const navCls = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))
      ? 'text-[#ffb3d1]'
      : 'text-white hover:text-[#ffb3d1]';

  return (
    <header className="bg-white sticky top-0 z-40 w-full shadow-sm">

      {/* ── Row: Logo + GoDaddy Ad + Actions Dashboard ──────────────── */}
      <div className="max-w-[1050px] mx-auto px-4 py-2 md:py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo and Date (Left) */}
          <div className="flex flex-col items-start flex-shrink-0">
            <Link href="/" className="group block">
              <img
                src="/logo.png"
                alt="హై టీవీ"
                width="220"
                height="65"
                className="h-10 md:h-[65px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>
            {teluguDate && (
              <div
                className="text-[11px] md:text-[14px] font-bold text-gray-700 mt-0.5 telugu-text tracking-wide select-none"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {teluguDate}
              </div>
            )}
          </div>
          
          {/* Header Ad Banner (Center — desktop only) — rotating slideshow managed via Admin Panel */}
          {headerAds.length > 0 && (() => {
            const ad = headerAds[currentAdIndex];
            return (
              <a
                key={ad.id}
                href={ad.body || '#'}
                target={ad.body ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={(e) => { if (!ad.body) e.preventDefault(); }}
                className="hidden md:flex flex-1 justify-center max-w-[550px] h-[90px] overflow-hidden relative group mx-4 select-none items-center cursor-pointer rounded"
                style={{
                  opacity: adFade ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              >
                <img
                  src={ad.image}
                  alt={ad.title || 'Header Advertisement'}
                  className="w-full h-full object-contain rounded"
                />
                {/* Dot indicators (only show if multiple ads) */}
                {headerAds.length > 1 && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                    {headerAds.map((_, i) => (
                      <span
                        key={i}
                        className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          i === currentAdIndex ? 'bg-white scale-125' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </a>
            );
          })()}

          {/* Actions Dashboard (Right — desktop only) */}
          <div className="hidden md:flex items-center justify-center flex-shrink-0">
            <Link 
              href="/category/epaper" 
              className="flex flex-col items-center gap-1 group cursor-pointer select-none"
            >
              <img
                src="/epaper-logo.png"
                alt="ఈ-పేపర్ లోగో"
                className="h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-102 rounded"
              />
              <span className="text-[12px] font-black text-gray-800 group-hover:text-[#02599c] font-sans tracking-widest uppercase transition-colors mt-0.5">
                E-PAPER
              </span>
            </Link>
          </div>

          {/* Mobile Controls: E-Paper */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/category/epaper"
              className="transition-transform duration-200 hover:scale-105"
              aria-label="E-Paper"
            >
              <img
                src="/image-copy.png"
                alt="స్వరం లోగో"
                className="h-11 w-auto object-contain rounded shadow-xs"
              />
            </Link>
          </div>

        </div>
      </div>

      {/* ── Mobile Horizontal Scrollable Nav Strip ───────────────────── */}
      <div className="md:hidden w-full bg-[#025390] border-t border-[#013d6e] shadow-xs select-none">
        <div className="max-w-full overflow-x-auto whitespace-nowrap hide-scrollbar flex items-center h-8 text-[14px] font-extrabold text-white telugu-text">
          {/* Home icon */}
          <Link href="/" className="group px-2.5 h-full flex items-center justify-center hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0" aria-label="హోమ్">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L3 11H5V21H10V14H14V21H19V11H21L12 3Z" fill="currentColor" className={`transition-colors ${isHome ? 'text-[#ffb3d1]' : 'text-white group-hover:text-[#ffb3d1]'}`} />
            </svg>
          </Link>
          <Link href="/category/latest"        className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/latest')}`}>బ్రేకింగ్ న్యూస్</Link>
          <button 
            onClick={() => {
              setIsTGMobileExpanded(!isTGMobileExpanded);
              setIsAPMobileExpanded(false);
            }}
            className={`px-2.5 h-full flex items-center gap-0.5 hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${pathname.startsWith('/category/telangana') ? 'text-[#ffb3d1]' : 'text-white'}`}
          >
            తెలంగాణ
            <ChevronDown size={11} className={`text-[#ffb3d1] transition-transform duration-200 ${isTGMobileExpanded ? 'rotate-180' : ''}`} />
          </button>
          <button 
            onClick={() => {
              setIsAPMobileExpanded(!isAPMobileExpanded);
              setIsTGMobileExpanded(false);
            }}
            className={`px-2.5 h-full flex items-center gap-0.5 hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${pathname.startsWith('/category/andhra-pradesh') ? 'text-[#ffb3d1]' : 'text-white'}`}
          >
            ఆంధ్రప్రదేశ్
            <ChevronDown size={11} className={`text-[#ffb3d1] transition-transform duration-200 ${isAPMobileExpanded ? 'rotate-180' : ''}`} />
          </button>
          <Link href="/category/national"       className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/national')}`}>నేషనల్</Link>
          <Link href="/category/international"  className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/international')}`}>వరల్డ్</Link>
          <Link href="/category/business"       className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/business')}`}>బిజినెస్</Link>
          <button 
            onClick={() => {
              setIsHealthMobileExpanded(!isHealthMobileExpanded);
              setIsTGMobileExpanded(false);
              setIsAPMobileExpanded(false);
            }}
            className={`px-2.5 h-full flex items-center gap-0.5 hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${pathname.startsWith('/category/health') || pathname.startsWith('/category/doctors-corner') ? 'text-[#ffb3d1]' : 'text-white'}`}
          >
            హెల్త్
            <ChevronDown size={11} className={`text-[#ffb3d1] transition-transform duration-200 ${isHealthMobileExpanded ? 'rotate-180' : ''}`} />
          </button>
          <button 
            onClick={() => {
              setIsVidyaMobileExpanded(!isVidyaMobileExpanded);
              setIsTGMobileExpanded(false);
              setIsAPMobileExpanded(false);
              setIsHealthMobileExpanded(false);
              setIsUpadiMobileExpanded(false);
            }}
            className={`px-2.5 h-full flex items-center gap-0.5 hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${pathname.startsWith('/category/admissions') || pathname.startsWith('/category/current-affairs') || pathname.startsWith('/category/vidya') ? 'text-[#ffb3d1]' : 'text-white'}`}
          >
            విద్య
            <ChevronDown size={11} className={`text-[#ffb3d1] transition-transform duration-200 ${isVidyaMobileExpanded ? 'rotate-180' : ''}`} />
          </button>
          <button 
            onClick={() => {
              setIsUpadiMobileExpanded(!isUpadiMobileExpanded);
              setIsTGMobileExpanded(false);
              setIsAPMobileExpanded(false);
              setIsHealthMobileExpanded(false);
              setIsVidyaMobileExpanded(false);
            }}
            className={`px-2.5 h-full flex items-center gap-0.5 hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${pathname.startsWith('/category/notification') || pathname.startsWith('/category/upadi') ? 'text-[#ffb3d1]' : 'text-white'}`}
          >
            ఉపాధి
            <ChevronDown size={11} className={`text-[#ffb3d1] transition-transform duration-200 ${isUpadiMobileExpanded ? 'rotate-180' : ''}`} />
          </button>
          <Link href="/category/politics"        className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/politics')}`}>పాలిటిక్స్</Link>
          <Link href="/category/sports"         className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/sports')}`}>స్పోర్ట్స్</Link>
          <Link href="/category/entertainment"  className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/entertainment')}`}>ఫిల్మ్</Link>
          <Link href="/category/uma-insights"   className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/uma-insights')}`}>ఉమా ఇన్‌సైట్స</Link>
          <Link href="/category/satya-bytes"    className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/satya-bytes')}`}>Satya Bytes</Link>
          <Link href="/category/technology"     className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/technology')}`}>టెక్నాలజీ</Link>
          <Link href="/category/viral"          className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/viral')}`}>వైరల్</Link>
          <Link href="/category/photos"         className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/photos')}`}>ఫోటో గ్యాలరీ</Link>
          <Link href="/category/women"          className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/women')}`}>ఆమె</Link>
          <Link href="/category/lifestyle"      className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/lifestyle')}`}>లైఫ్ స్టైల్</Link>
          <Link href="/category/webstories"     className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/webstories')}`}>వెబ్ స్టోరీస్</Link>
          <Link href="/category/antharmadanam"  className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/antharmadanam')}`}>వ్యక్తిత్వ వికాసం</Link>
          <Link href="/category/adyathmikam"    className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/adyathmikam')}`}>దైవం</Link>
          <Link href="/category/sampadakiyam"   className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/sampadakiyam')}`}>ఎడిటోరియల్</Link>
          <Link href="/category/epaper"         className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/epaper')}`}>ఈ-పేపర్</Link>
          <Link href="/weather"                  className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/weather')}`}>వెదర్</Link>
          <Link href="/category/citizen-reporter" className={`px-2.5 h-full flex items-center hover:bg-black/15 flex-shrink-0 ${navCls('/category/citizen-reporter')}`}>సిటిజన్ రిపోర్టర్</Link>
        </div>
      </div>

      <Suspense fallback={null}>
        <MobileSubNav
          isTGMobileExpanded={isTGMobileExpanded}
          isAPMobileExpanded={isAPMobileExpanded}
          isHealthMobileExpanded={isHealthMobileExpanded}
          isVidyaMobileExpanded={isVidyaMobileExpanded}
          isUpadiMobileExpanded={isUpadiMobileExpanded}
          pathname={pathname}
        />
      </Suspense>

      {/* ── Desktop Navigation Bar ───────────────────────────────────── */}
      <div className="hidden md:block w-full border-t border-[#013d6e] bg-[#025390] shadow-md select-none">
        <div className="max-w-[1050px] mx-auto">
          <nav className="flex items-center bg-gradient-to-b from-[#0269b3] to-[#025390] h-10 overflow-visible">

            {/* Home icon */}
            <Link href="/" className="group px-4.5 h-full flex items-center justify-center hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0" aria-label="హోమ్">
              <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L3 11H5V21H10V14H14V21H19V11H21L12 3Z" fill="currentColor" className={`transition-colors ${isHome ? 'text-[#ffb3d1]' : 'text-white group-hover:text-[#ffb3d1]'}`} />
              </svg>
            </Link>

            <div className="flex-1 flex items-center h-full text-[18px] font-extrabold text-white telugu-text">

              {/* బ్రేకింగ్ న్యూస్ */}
              <Link href="/category/latest" className={`px-3 h-full flex items-center hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0 ${navCls('/category/latest')}`} style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                బ్రేకింగ్ న్యూస్
              </Link>

              {/* తెలంగాణ Dropdown */}
              <div className="relative group border-r border-white/20 h-full flex-shrink-0">
                <button 
                  onClick={handleTGClick}
                  className={`px-3 h-full flex items-center gap-1 hover:bg-black/15 transition-colors cursor-pointer ${navCls('/category/telangana')}`} 
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  తెలంగాణ
                  <ChevronDown size={11} className={`text-[#ffb3d1] transition-transform duration-200 ${isTGDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                </button>
                <div className={`absolute top-full left-0 ${isTGDropdownOpen ? 'block' : 'hidden'} group-hover:block bg-white border border-gray-100 rounded-b-lg shadow-xl p-2.5 w-52 z-50 animate-fade-in border-t-2 border-[#025390]`}>
                  <div className="flex flex-col gap-0.5 text-left">
                    <Link onClick={closeAllDropdowns} href="/category/telangana" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>రాష్ట్ర స్థాయి వార్తలు</Link>
                    <Link onClick={closeAllDropdowns} href="/category/telangana?view=districts" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>జిల్లాల వారీగా వార్తలు</Link>
                  </div>
                </div>
              </div>

              {/* ఆంధ్రప్రదేశ్ Dropdown */}
              <div className="relative group border-r border-white/20 h-full flex-shrink-0">
                <button 
                  onClick={handleAPClick}
                  className={`px-3 h-full flex items-center gap-1 hover:bg-black/15 transition-colors cursor-pointer ${navCls('/category/andhra-pradesh')}`} 
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  ఆంధ్రప్రదేశ్
                  <ChevronDown size={11} className={`text-[#ffb3d1] transition-transform duration-200 ${isAPDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                </button>
                <div className={`absolute top-full left-0 ${isAPDropdownOpen ? 'block' : 'hidden'} group-hover:block bg-white border border-gray-100 rounded-b-lg shadow-xl p-2.5 w-52 z-50 animate-fade-in border-t-2 border-[#025390]`}>
                  <div className="flex flex-col gap-0.5 text-left">
                    <Link onClick={closeAllDropdowns} href="/category/andhra-pradesh" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>రాష్ట్ర స్థాయి వార్తలు</Link>
                    <Link onClick={closeAllDropdowns} href="/category/andhra-pradesh?view=districts" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>జిల్లాల వారీగా వార్తలు</Link>
                  </div>
                </div>
              </div>

              {/* నేషనల్ */}
              <Link href="/category/national" className={`px-3 h-full flex items-center hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0 ${navCls('/category/national')}`} style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>నేషనల్</Link>

              {/* ఇంటర్నేషనల్ */}
              <Link href="/category/international" className={`px-3 h-full flex items-center hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0 ${navCls('/category/international')}`} style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వరల్డ్</Link>

              {/* బిజినెస్ */}
              <Link href="/category/business" className={`px-3 h-full flex items-center hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0 ${navCls('/category/business')}`} style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>బిజినెస్</Link>

              {/* హెల్త్ Dropdown */}
              <div className="relative group border-r border-white/20 h-full flex-shrink-0">
                <button 
                  onClick={handleHealthClick}
                  className={`px-3 h-full flex items-center gap-1 hover:bg-black/15 transition-colors cursor-pointer ${pathname.startsWith('/category/health') || pathname.startsWith('/category/doctors-corner') ? 'text-[#ffb3d1]' : 'text-white'}`} 
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  హెల్త్
                  <ChevronDown size={11} className={`text-[#ffb3d1] transition-transform duration-200 ${isHealthDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                </button>
                <div className={`absolute top-full left-0 ${isHealthDropdownOpen ? 'block' : 'hidden'} group-hover:block bg-white border border-gray-100 rounded-b-lg shadow-xl p-2.5 w-52 z-50 animate-fade-in border-t-2 border-[#025390]`}>
                  <div className="flex flex-col gap-0.5 text-left">
                    <Link onClick={closeAllDropdowns} href="/category/health" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>హెల్త్</Link>
                    <Link onClick={closeAllDropdowns} href="/category/doctors-corner" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>డాక్టర్స్ కార్నర్</Link>
                  </div>
                </div>
              </div>

              {/* ఫిల్మ్ */}
              <Link 
                href="/category/entertainment" 
                className={`px-3 h-full flex items-center hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0 ${navCls('/category/entertainment')}`} 
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                ఫిల్మ్
              </Link>

              {/* విద్య Dropdown */}
              <div className="relative group border-r border-white/20 h-full flex-shrink-0">
                <Link 
                  href="/category/vidya"
                  className={`px-3 h-full flex items-center gap-1 hover:bg-black/15 transition-colors cursor-pointer ${pathname.startsWith('/category/vidya') || pathname.startsWith('/category/admissions') || pathname.startsWith('/category/current-affairs') ? 'text-[#ffb3d1]' : 'text-white'}`} 
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  విద్య
                  <ChevronDown size={11} className="text-[#ffb3d1] transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-100 rounded-b-lg shadow-xl p-2.5 w-52 z-50 animate-fade-in border-t-2 border-[#025390]">
                  <div className="flex flex-col gap-0.5 text-left">
                    <Link onClick={closeAllDropdowns} href="/category/admissions" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>అడ్మిషన్స్</Link>
                    <Link onClick={closeAllDropdowns} href="/category/current-affairs" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>కరెంట్ అఫైర్స్</Link>
                  </div>
                </div>
              </div>

              {/* ఉపాధి Dropdown */}
              <div className="relative group border-r border-white/20 h-full flex-shrink-0">
                <Link 
                  href="/category/upadi"
                  className={`px-3 h-full flex items-center gap-1 hover:bg-black/15 transition-colors cursor-pointer ${pathname.startsWith('/category/upadi') || pathname.startsWith('/category/notification') ? 'text-[#ffb3d1]' : 'text-white'}`} 
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  ఉపాధి
                  <ChevronDown size={11} className="text-[#ffb3d1] transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-100 rounded-b-lg shadow-xl p-2.5 w-52 z-50 animate-fade-in border-t-2 border-[#025390]">
                  <div className="flex flex-col gap-0.5 text-left">
                    <Link onClick={closeAllDropdowns} href="/category/notification" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>నోటిఫికేషన్స్</Link>
                  </div>
                </div>
              </div>

              {/* ఇంకా... Dropdown */}
              <div className="relative group h-full flex-shrink-0">
                <button 
                  onClick={handleMoreClick}
                  className="px-3 h-full flex items-center gap-1 hover:text-[#ffb3d1] hover:bg-black/15 transition-colors cursor-pointer" 
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  ఇంకా...
                  <ChevronDown size={11} className={`text-[#ffb3d1] transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                </button>
                <div className={`absolute top-full right-0 ${isMoreDropdownOpen ? 'block' : 'hidden'} group-hover:block bg-white border border-gray-100 rounded-b-xl shadow-xl p-4 w-[320px] z-50 animate-fade-in border-t-2 border-[#025390]`}>
                  <div className="flex flex-col gap-3 text-left">
                    <div>
                      <h4 className="text-[12px] font-extrabold text-gray-400 mb-2 uppercase tracking-wider font-sans">ఇతర విభాగాలు</h4>
                      <div className="grid grid-cols-2 gap-y-0.5 gap-x-2">
                        <Link onClick={closeAllDropdowns} href="/category/politics"      className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>పాలిటిక్స్</Link>
                        <Link onClick={closeAllDropdowns} href="/category/technology"    className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>టెక్నాలజీ</Link>
                        <Link onClick={closeAllDropdowns} href="/category/sports"        className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>స్పోర్ట్స్</Link>
                        <Link onClick={closeAllDropdowns} href="/category/rasipalalu"    className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>శుభఫలాలు</Link>
                        <Link onClick={closeAllDropdowns} href="/category/viral"         className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వైరల్</Link>
                        <Link onClick={closeAllDropdowns} href="/category/photos"        className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఫోటో గ్యాలరీ</Link>
                        <Link onClick={closeAllDropdowns} href="/category/shorts"        className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>షార్ట్స్</Link>
                        <Link onClick={closeAllDropdowns} href="/category/women"         className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఆమె</Link>
                        <Link onClick={closeAllDropdowns} href="/category/lifestyle"     className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>లైఫ్ స్టైల్</Link>
                        <Link onClick={closeAllDropdowns} href="/category/webstories"    className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వెబ్ స్టోరీస్</Link>
                        <Link onClick={closeAllDropdowns} href="/category/antharmadanam" className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వ్యక్తిత్వ వికాసం</Link>
                        <Link onClick={closeAllDropdowns} href="/category/adyathmikam"   className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>దైవం</Link>
                        <Link onClick={closeAllDropdowns} href="/category/sampadakiyam"  className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఎడిటోరియల్</Link>
                        <Link onClick={closeAllDropdowns} href="/category/citizen-reporter" className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>సిటిజన్ రిపోర్టర్</Link>
                        <Link onClick={closeAllDropdowns} href="/team" className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>మా టీమ్</Link>
                        <Link onClick={closeAllDropdowns} href="/weather" className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వెదర్</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </nav>
        </div>
      </div>

      {/* ── Sub-Header Trending & Social Strip ────────────────────────── */}
      {isHome && (
        <div className="w-full bg-[#f8fafc] border-b border-gray-200 shadow-3xs select-none py-1.5 md:py-2 z-35 relative">
          <div className="max-w-[1050px] mx-auto px-4 flex items-center justify-between">
            
            {/* Left: Trending Label + Election Results */}
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="font-extrabold text-[12px] md:text-[15px] tracking-wider text-[#02599c] uppercase font-sans flex items-center gap-1.5 flex-shrink-0">
                <TrendingUp className="stroke-[2.5] animate-pulse w-3.5 h-3.5 md:w-4 md:h-4" />
                TRENDING :
              </span>
              <Link 
                href={trendingItems[trendingIndex]?.link || '#'}
                className={`text-[14px] md:text-[16.5px] font-black text-gray-800 hover:text-[#0b2545] transition-all duration-300 telugu-text truncate block pl-1.5 ${
                  trendingFade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                }`}
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: '1.6' }}
              >
                {trendingItems[trendingIndex]?.text || ''}
              </Link>
            </div>

            {/* Right: Search & Social Icons */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <Link 
                href="/category/uma-insights" 
                className="bg-red-50 hover:bg-red-100/80 text-red-700 text-[13.5px] font-extrabold px-3 py-1.5 rounded-xl border border-red-500/40 transition-all shadow-3xs hover:scale-[1.02] telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                ఉమా ఇన్‌సైట్స
              </Link>
              <Link 
                href="/category/satya-bytes" 
                className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 text-[13.5px] font-extrabold px-3 py-1.5 rounded-xl border border-emerald-500/40 transition-all shadow-3xs hover:scale-[1.02] telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                Satya Bytes
              </Link>
            </div>
            
          </div>
        </div>
      )}

      {/* Mobile-only Flash News Bar (rendered directly under Trending strip) */}
      {isHome && (
        <div className="block md:hidden bg-[#f8fafc] px-2.5 pb-1.5 pt-0 border-b border-gray-200">
          <FlashNewsBar isMobileHeader={true} />
        </div>
      )}

      {/* ── Mobile Bottom Sheet Drawer ───────────────────────────────── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden flex items-end">

          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 animate-fade-overlay" onClick={closeMenu} />

          {/* Slide-up panel */}
          <div className="relative w-full animate-slide-up">

            {/* Floating close button */}
            <div className="flex justify-center mb-[-1px]">
              <button
                onClick={closeMenu}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={20} className="text-gray-800 stroke-[2.5]" />
              </button>
            </div>

            {/* Panel body */}
            <div className="bg-[#025390] text-white rounded-t-2xl max-h-[82vh] overflow-y-auto p-5 shadow-2xl">

              {/* Main categories 2-column grid */}
              <nav className="grid grid-cols-2 gap-x-6 gap-y-3 text-[18px] font-extrabold telugu-text mb-5" style={{ fontFamily: 'Mandali, sans-serif' }}>
                {[
                  { href: '/',                        label: 'హోమ్'           },
                  { href: '/category/latest',         label: 'బ్రేకింగ్ న్యూస్' },
                  { href: '/category/telangana',      label: 'తెలంగాణ'        },
                  { href: '/category/andhra-pradesh', label: 'ఆంధ్రప్రదేశ్'  },
                  { href: '/category/epaper',         label: 'ఈ-పేపర్'        },
                  { href: '/category/national',       label: 'నేషనల్'         },
                  { href: '/category/international',  label: 'వరల్డ్'   },
                  { href: '/category/business',       label: 'బిజినెస్'       },
                  { href: '/category/health',         label: 'హెల్త్'          },
                  { href: '/category/doctors-corner', label: 'డాక్టర్స్ కార్నర్' },
                  { href: '/category/politics',       label: 'పాలిటిక్స్'      },
                  { href: '/category/sports',         label: 'స్పోర్ట్స్'       },
                  { href: '/category/entertainment',  label: 'ఫిల్మ్'         },
                  { href: '/category/uma-insights',   label: 'ఉమా ఇన్‌సైట్స'   },
                  { href: '/category/satya-bytes',    label: 'Satya Bytes'    },
                  { href: '/category/technology',     label: 'టెక్నాలజీ'      },
                  { href: '/category/rasipalalu',     label: 'శుభఫలాలు'      },
                  { href: '/category/viral',          label: 'వైరల్'          },
                  { href: '/category/photos',         label: 'ఫోటో గ్యాలరీ'      },
                  { href: '/category/shorts',         label: 'షార్ట్స్'       },
                  { href: '/category/women',          label: 'ఆమె'           },
                  { href: '/category/lifestyle',      label: 'లైఫ్ స్టైల్'   },
                  { href: '/category/webstories',     label: 'వెబ్ స్టోరీస్' },
                  { href: '/category/antharmadanam',  label: 'వ్యక్తిత్వ వికాసం' },
                  { href: '/category/adyathmikam',    label: 'దైవం'           },
                  { href: '/category/sampadakiyam',   label: 'ఎడిటోరియల్'      },
                  { href: '/category/admissions',     label: 'అడ్మిషన్స్'       },
                  { href: '/category/current-affairs', label: 'కరెంట్ అఫైర్స్'  },
                  { href: '/category/notification',   label: 'నోటిఫికేషన్స్'   },
                  { href: '/category/citizen-reporter', label: 'సిటిజన్ రిపోర్టర్' },
                  { href: '/team',                    label: 'మా టీమ్'        },
                  { href: '/weather',                 label: 'వెదర్'       },
                ].map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center py-1.5 border-b border-white/10 hover:text-[#ffb3d1] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t border-white/20 mb-4" />

              {/* Feature pages 3-column */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-black text-[#ffb3d1] tracking-widest uppercase" style={{ fontFamily: 'Mandali, sans-serif' }}>
                  ఫీచర్ పేజీలు
                </h3>
                <div className="grid grid-cols-3 gap-x-3 gap-y-3 text-[16px] font-extrabold telugu-text" style={{ fontFamily: 'Mandali, sans-serif' }}>
                  {[
                    { href: '/category/women',         label: 'ఆమె'          },
                    { href: '/category/lifestyle',     label: 'లైఫ్ స్టైల్' },
                    { href: '/category/webstories',    label: 'వెబ్ స్టోరీస్'},
                    { href: '/category/antharmadanam', label: 'వ్యక్తిత్వ వికాసం' },
                    { href: '/category/adyathmikam',   label: 'దైవం'         },
                  ].map((link, i) => (
                    <Link key={i} href={link.href} onClick={closeMenu} className="hover:text-[#ffb3d1] transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </header>
  );
}

// Sub-component to wrap search params in a suspense boundary
function MobileSubNav({
  isTGMobileExpanded,
  isAPMobileExpanded,
  isHealthMobileExpanded,
  isVidyaMobileExpanded,
  isUpadiMobileExpanded,
  pathname,
}: {
  isTGMobileExpanded: boolean;
  isAPMobileExpanded: boolean;
  isHealthMobileExpanded: boolean;
  isVidyaMobileExpanded: boolean;
  isUpadiMobileExpanded: boolean;
  pathname: string;
}) {
  const searchParams = useSearchParams();
  const viewParam = searchParams ? searchParams.get('view') : null;

  return (
    <>
      {/* Mobile Sub-pages strip for Telangana */}
      {isTGMobileExpanded && (
        <div className="md:hidden w-full bg-[#013d6e] border-t border-[#012f5c] text-[13.5px] font-extrabold text-white telugu-text flex items-center justify-around py-2 shadow-xs">
          <Link 
            href="/category/telangana" 
            className={`hover:text-[#ffb3d1] transition-colors ${pathname === '/category/telangana' && viewParam !== 'districts' ? 'text-[#ffb3d1]' : 'text-white/90'}`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            రాష్ట్ర స్థాయి వార్తలు
          </Link>
          <div className="h-4 w-[1px] bg-white/20" />
          <Link 
            href="/category/telangana?view=districts" 
            className={`hover:text-[#ffb3d1] transition-colors ${pathname === '/category/telangana' && viewParam === 'districts' ? 'text-[#ffb3d1]' : 'text-white/90'}`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            జిల్లాల వారీగా వార్తలు
          </Link>
        </div>
      )}

      {/* Mobile Sub-pages strip for Andhra Pradesh */}
      {isAPMobileExpanded && (
        <div className="md:hidden w-full bg-[#013d6e] border-t border-[#012f5c] text-[13.5px] font-extrabold text-white telugu-text flex items-center justify-around py-2 shadow-xs">
          <Link 
            href="/category/andhra-pradesh" 
            className={`hover:text-[#ffb3d1] transition-colors ${pathname === '/category/andhra-pradesh' && viewParam !== 'districts' ? 'text-[#ffb3d1]' : 'text-white/90'}`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            రాష్ట్ర స్థాయి వార్తలు
          </Link>
          <div className="h-4 w-[1px] bg-white/20" />
          <Link 
            href="/category/andhra-pradesh?view=districts" 
            className={`hover:text-[#ffb3d1] transition-colors ${pathname === '/category/andhra-pradesh' && viewParam === 'districts' ? 'text-[#ffb3d1]' : 'text-white/90'}`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            జిల్లాల వారీగా వార్తలు
          </Link>
        </div>
      )}

      {/* Mobile Sub-pages strip for Health */}
      {isHealthMobileExpanded && (
        <div className="md:hidden w-full bg-[#013d6e] border-t border-[#012f5c] text-[13.5px] font-extrabold text-white telugu-text flex items-center justify-around py-2 shadow-xs">
          <Link 
            href="/category/health" 
            className={`hover:text-[#ffb3d1] transition-colors ${pathname === '/category/health' ? 'text-[#ffb3d1]' : 'text-white/90'}`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            హెల్త్
          </Link>
          <div className="h-4 w-[1px] bg-white/20" />
          <Link 
            href="/category/doctors-corner" 
            className={`hover:text-[#ffb3d1] transition-colors ${pathname === '/category/doctors-corner' ? 'text-[#ffb3d1]' : 'text-white/90'}`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            డాక్టర్స్ కార్నర్
          </Link>
        </div>
      )}

      {/* Mobile Sub-pages strip for Vidya */}
      {isVidyaMobileExpanded && (
        <div className="md:hidden w-full bg-[#013d6e] border-t border-[#012f5c] text-[13.5px] font-extrabold text-white telugu-text flex items-center justify-around py-2 shadow-xs">
          <Link 
            href="/category/vidya" 
            className={`hover:text-[#ffb3d1] transition-colors ${pathname === '/category/vidya' ? 'text-[#ffb3d1]' : 'text-white/90'}`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            విద్య
          </Link>
          <div className="h-4 w-[1px] bg-white/20" />
          <Link 
            href="/category/admissions" 
            className={`hover:text-[#ffb3d1] transition-colors ${pathname === '/category/admissions' ? 'text-[#ffb3d1]' : 'text-white/90'}`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            అడ్మిషన్స్
          </Link>
          <div className="h-4 w-[1px] bg-white/20" />
          <Link 
            href="/category/current-affairs" 
            className={`hover:text-[#ffb3d1] transition-colors ${pathname === '/category/current-affairs' ? 'text-[#ffb3d1]' : 'text-white/90'}`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            కరెంట్ అఫైర్స్
          </Link>
        </div>
      )}

      {/* Mobile Sub-pages strip for Upadi */}
      {isUpadiMobileExpanded && (
        <div className="md:hidden w-full bg-[#013d6e] border-t border-[#012f5c] text-[13.5px] font-extrabold text-white telugu-text flex items-center justify-around py-2 shadow-xs">
          <Link 
            href="/category/upadi" 
            className={`hover:text-[#ffb3d1] transition-colors ${pathname === '/category/upadi' ? 'text-[#ffb3d1]' : 'text-white/90'}`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            ఉపాధి
          </Link>
          <div className="h-4 w-[1px] bg-white/20" />
          <Link 
            href="/category/notification" 
            className={`hover:text-[#ffb3d1] transition-colors ${pathname === '/category/notification' ? 'text-[#ffb3d1]' : 'text-white/90'}`}
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            నోటిఫికేషన్స్
          </Link>
        </div>
      )}
    </>
  );
}
