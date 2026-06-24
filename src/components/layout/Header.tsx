'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, X, Search, TrendingUp } from 'lucide-react';
import FlashNewsBar from '@/components/home/FlashNewsBar';

export default function Header() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teluguDate, setTeluguDate] = useState('');
  const [isAPMobileExpanded, setIsAPMobileExpanded] = useState(false);
  const [isTGMobileExpanded, setIsTGMobileExpanded] = useState(false);
  const [isHealthMobileExpanded, setIsHealthMobileExpanded] = useState(false);
  const [isVidyaMobileExpanded, setIsVidyaMobileExpanded] = useState(false);
  const [isUpadiMobileExpanded, setIsUpadiMobileExpanded] = useState(false);
  const [isMoreMobileExpanded, setIsMoreMobileExpanded] = useState(false);

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
    const saved = localStorage.getItem('trending_news_items');
    if (saved) {
      try {
        setTrendingItems(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing trending items", e);
      }
    }
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
          
          {/* MSN Realty Wide Real Estate Ad Banner (Center — desktop only) */}
          <div className="hidden md:flex flex-1 justify-between max-w-[550px] h-[90px] bg-[#111113] border border-neutral-800 rounded overflow-hidden relative group mx-4 select-none px-4 items-center">
            {/* Adchoices icon */}
            <div className="absolute top-0.5 right-0.5 opacity-20 hover:opacity-100 transition-opacity z-10">
              <svg className="w-2.5 h-2.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>

            {/* Left part: Building Image + "55 Floors" */}
            <div className="flex items-center gap-3 h-full flex-shrink-0">
              <div className="w-[70px] h-[70px] relative overflow-hidden rounded border border-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&h=100&fit=crop"
                  alt="MSN Neopolis Tower"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left justify-center leading-none">
                <span className="text-white font-extrabold text-[18px] font-sans">55</span>
                <span className="text-neutral-500 font-bold text-[8px] tracking-widest font-sans uppercase">FLOORS</span>
              </div>
            </div>

            {/* Center part: "ONE OF A KIND" branding */}
            <div className="flex-1 flex flex-col justify-center text-center px-2.5 leading-tight">
              <span className="text-amber-400 font-black text-[13px] font-sans tracking-widest uppercase">ONE OF A KIND</span>
              <span className="text-white font-bold text-[10px] font-sans tracking-wide uppercase mt-0.5">EXPANSIVE 4 BHK RESIDENCES</span>
              <span className="text-neutral-400 font-medium text-[8px] font-sans uppercase mt-0.5">📍 NEOPOLIS, HYDERABAD</span>
            </div>

            {/* Right part: MSN Logo / Phone / SFT */}
            <div className="flex items-center gap-3 flex-shrink-0 border-l border-neutral-800/60 pl-3 h-[60px] text-right">
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-[10px] text-neutral-300 font-bold font-sans">5,250 - 7,460 SFT</span>
                <span className="text-[9.5px] text-amber-400 font-bold font-sans mt-0.5">📞 91426 45645</span>
              </div>
              <div className="flex flex-col justify-center leading-none text-left border-l border-neutral-800/60 pl-2.5">
                <span className="text-[11px] text-amber-500 font-extrabold font-sans">MSN</span>
                <span className="text-[7.5px] text-neutral-400 font-bold font-sans tracking-wider mt-0.5">REALTY</span>
              </div>
            </div>
          </div>

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
          <Link href="/category/technology"     className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/technology')}`}>టెక్నాలజీ</Link>
          <Link href="/category/rasipalalu"     className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/rasipalalu')}`}>శుభఫలాలు</Link>
          <Link href="/category/viral"          className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/viral')}`}>వైరల్</Link>
          <Link href="/category/photos"         className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/photos')}`}>ఆల్బమ్‌లు</Link>
          <Link href="/category/videos"         className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/videos')}`}>వీడియోలు</Link>
          <Link href="/category/women"          className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/women')}`}>ఆమె</Link>
          <Link href="/category/lifestyle"      className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/lifestyle')}`}>లైఫ్ స్టైల్</Link>
          <Link href="/category/webstories"     className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/webstories')}`}>వెబ్ స్టోరీస్</Link>
          <Link href="/category/antharmadanam"  className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/antharmadanam')}`}>వ్యక్తిత్వ వికాసం</Link>
          <Link href="/category/adyathmikam"    className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/adyathmikam')}`}>దైవం</Link>
          <Link href="/category/sampadakiyam"   className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/sampadakiyam')}`}>ఎడిటోరియల్</Link>
          <Link href="/category/epaper"         className={`px-2.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0 ${navCls('/category/epaper')}`}>ఈ-పేపర్</Link>
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
                    <Link onClick={closeAllDropdowns} href="/category/health" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>హెల్త్ వార్తలు</Link>
                    <Link onClick={closeAllDropdowns} href="/category/doctors-corner" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>డాక్టర్స్ కార్నర్</Link>
                  </div>
                </div>
              </div>

              {/* విద్య Dropdown */}
              <div className="relative group border-r border-white/20 h-full flex-shrink-0">
                <button 
                  className={`px-3 h-full flex items-center gap-1 hover:bg-black/15 transition-colors cursor-pointer ${pathname.startsWith('/category/vidya') || pathname.startsWith('/category/admissions') || pathname.startsWith('/category/current-affairs') ? 'text-[#ffb3d1]' : 'text-white'}`} 
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  విద్య
                  <ChevronDown size={11} className="text-[#ffb3d1] transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-100 rounded-b-lg shadow-xl p-2.5 w-52 z-50 animate-fade-in border-t-2 border-[#025390]">
                  <div className="flex flex-col gap-0.5 text-left">
                    <Link onClick={closeAllDropdowns} href="/category/admissions" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>అడ్మిషన్స్</Link>
                    <Link onClick={closeAllDropdowns} href="/category/current-affairs" className="px-2.5 py-1.5 text-[17px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>కరెంట్ అఫైర్స్</Link>
                  </div>
                </div>
              </div>

              {/* ఉపాధి Dropdown */}
              <div className="relative group border-r border-white/20 h-full flex-shrink-0">
                <button 
                  className={`px-3 h-full flex items-center gap-1 hover:bg-black/15 transition-colors cursor-pointer ${pathname.startsWith('/category/upadi') || pathname.startsWith('/category/notification') ? 'text-[#ffb3d1]' : 'text-white'}`} 
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  ఉపాధి
                  <ChevronDown size={11} className="text-[#ffb3d1] transition-transform duration-200 group-hover:rotate-180" />
                </button>
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
                        <Link onClick={closeAllDropdowns} href="/category/entertainment" className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఫిల్మ్</Link>
                        <Link onClick={closeAllDropdowns} href="/category/rasipalalu"    className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>శుభఫలాలు</Link>
                        <Link onClick={closeAllDropdowns} href="/category/viral"         className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వైరల్</Link>
                        <Link onClick={closeAllDropdowns} href="/category/photos"        className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఆల్బమ్‌లు</Link>
                        <Link onClick={closeAllDropdowns} href="/category/videos"        className="px-2 py-1 text-[16px] font-bold text-gray-700 hover:text-[#0b2545] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వీడియోలు</Link>
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
            <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
              <Link href="/search" className="text-gray-500 hover:text-[#0b2545] transition-all duration-200 hover:scale-110 flex items-center justify-center" aria-label="Search">
                <Search size={13.5} className="stroke-[2.5]" />
              </Link>
              <div className="h-3 w-[1px] bg-gray-300" />
              <div className="flex items-center gap-2">
                {/* WhatsApp */}
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#25D366] transition-all duration-200 hover:scale-110 flex items-center justify-center" aria-label="WhatsApp">
                  <svg className="w-[13px] h-[13px] fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.388 2.017 13.916.99(11.313.99c-5.449 0-9.886 4.374-9.89 9.802-.001 1.765.463 3.49 1.345 5.021l-.998 3.645 3.791-.984zm11.387-5.464c-.301-.15-1.78-.879-2.056-.979-.275-.1-.475-.15-.675.15-.199.299-.775.979-.95 1.178-.175.199-.35.224-.651.075-3.007-1.503-4.937-2.89-6.938-6.315-.262-.449.262-.417.75-1.393.15-.3.075-.563-.038-.763-.113-.2-.979-2.357-1.342-3.237-.354-.852-.714-.737-.979-.75-.251-.012-.539-.015-.826-.015-.288 0-.751.108-1.14.53-.388.421-1.48 1.446-1.48 3.529 0 2.082 1.52 4.09 1.733 4.388.213.299 2.996 4.576 7.259 6.419 1.013.438 1.804.7 2.42.897 1.018.324 1.944.279 2.677.17.817-.121 1.78-.727 2.03-1.43.25-.702.25-1.303.175-1.43-.075-.127-.275-.201-.576-.351z"/>
                  </svg>
                </a>
                {/* Telegram */}
                <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#0088cc] transition-all duration-200 hover:scale-110 flex items-center justify-center" aria-label="Telegram">
                  <svg className="w-[13px] h-[13px] fill-current" viewBox="0 0 24 24">
                    <path d="M11.944 0C5.347 0 0 5.348 0 11.947c0 6.598 5.347 11.947 11.944 11.947 6.598 0 11.948-5.349 11.948-11.947S18.542 0 11.944 0zm5.89 8.24l-1.974 9.297c-.148.653-.537.813-1.084.507l-3.007-2.213-1.452 1.395c-.161.161-.295.295-.606.295l.216-3.063 5.576-5.038c.242-.216-.053-.337-.375-.121L8.257 12.6l-2.969-.927c-.645-.202-.658-.645.135-.955l11.603-4.473c.537-.202 1.007.121.808 1.995z"/>
                  </svg>
                </a>
                {/* Twitter */}
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#0f1419] transition-all duration-200 hover:scale-110 flex items-center justify-center" aria-label="Twitter">
                  <svg className="w-[12px] h-[12px] fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1877F2] transition-all duration-200 hover:scale-110 flex items-center justify-center" aria-label="Facebook">
                  <svg className="w-[13px] h-[13px] fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#E1306C] transition-all duration-200 hover:scale-110 flex items-center justify-center" aria-label="Instagram">
                  <svg className="w-[13px] h-[13px] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              </div>
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
                  { href: '/category/technology',     label: 'టెక్నాలజీ'      },
                  { href: '/category/rasipalalu',     label: 'శుభఫలాలు'      },
                  { href: '/category/viral',          label: 'వైరల్'          },
                  { href: '/category/photos',         label: 'ఆల్బమ్‌లు'      },
                  { href: '/category/videos',         label: 'వీడియోలు'       },
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
            హెల్త్ వార్తలు
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
