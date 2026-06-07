'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teluguDate, setTeluguDate] = useState('');
  const [isAPMobileExpanded, setIsAPMobileExpanded] = useState(false);
  const [isTGMobileExpanded, setIsTGMobileExpanded] = useState(false);
  const [isMoreMobileExpanded, setIsMoreMobileExpanded] = useState(false);

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

  return (
    <header className="bg-white sticky top-0 z-40 w-full shadow-sm">

      {/* ── Row: Logo + GoDaddy Ad + Actions Dashboard ──────────────── */}
      <div className="max-w-[1005px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo and Date (Left) */}
          <div className="flex flex-col items-start flex-shrink-0">
            <Link href="/" className="group block">
              <Image
                src="/logo.jpg"
                alt="హై టీవీ"
                width={155}
                height={45}
                priority
                className="h-10 md:h-[45px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>
            {teluguDate && (
              <div
                className="text-[10px] md:text-[11px] font-bold text-gray-700 mt-1 telugu-text tracking-wide select-none"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {teluguDate}
              </div>
            )}
          </div>

          {/* GoDaddy Mock Advertisement (Center — desktop only) */}
          <div className="hidden md:flex flex-1 justify-center max-w-[468px] lg:max-w-[500px] h-[62px] bg-[#111111] rounded border border-gray-800 items-center justify-between px-3 py-1 relative overflow-hidden group mx-4 select-none">
            {/* Adchoices icon */}
            <div className="absolute top-0.5 right-0.5 flex items-center gap-0.5 opacity-50 hover:opacity-100 transition-opacity">
              <svg className="w-2.5 h-2.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <svg className="w-2.5 h-2.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            {/* GoDaddy Brand */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <svg className="w-5.5 h-5.5 text-[#00dfc2]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 82C40.6 82 31.8 77.8 25.8 70.8C18.8 62.8 15 52.4 15 41.5C15 22.5 30.5 7 49.5 7C58.8 7 67.5 10.7 73.8 17.5C75.8 19.5 75.8 22.8 73.8 24.8C71.8 26.8 68.5 26.8 66.5 24.8C62 20 56 17.2 49.5 17.2C36.1 17.2 25.2 28.1 25.2 41.5C25.2 49.2 27.9 56.6 32.8 62.2C37 67.1 43.2 70 49.8 70C51.5 70 53.2 69.8 54.8 69.4C59.3 68.2 63.3 65.5 66.3 61.8C69.3 58.1 71 53.5 71.1 48.7L71.1 42C71.1 38.7 73.8 36 77.1 36C80.4 36 83.1 38.7 83.1 42L83.1 48.7C83 56.9 80 64.7 74.8 70.9C69.6 77.2 62.5 81.3 54.6 82.5C53.1 82.8 51.5 83 50 82Z" fill="currentColor"/>
                <path d="M50.1 82C48.6 82 47.1 81.9 45.6 81.6C37.7 80.4 30.6 76.3 25.4 70C20.2 63.8 17.2 56 17.1 47.8L17.1 42C17.1 38.7 19.8 36 23.1 36C26.4 36 29.1 38.7 29.1 42L29.1 48.7C29.2 53.5 30.9 58.1 33.9 61.8C36.9 65.5 40.9 68.2 45.4 69.4C47 69.8 48.7 70 50.4 70C57 70 63.2 67.1 67.4 62.2C72.3 56.6 75 49.2 75 41.5C75 28.1 64.1 17.2 50.7 17.2C44.2 17.2 38.2 20 33.7 24.8C31.7 26.8 28.4 26.8 26.4 24.8C24.4 22.8 24.4 19.5 26.4 17.5C32.7 10.7 41.4 7 50.7 7C69.7 7 85.2 22.5 85.2 41.5C85.2 52.4 81.4 62.8 74.4 70.8C68.4 77.8 59.6 82 50.1 82Z" fill="currentColor"/>
              </svg>
              <span className="font-extrabold text-[11px] tracking-tight text-white font-sans">GoDaddy</span>
            </div>
            {/* Slogan */}
            <div className="flex-1 px-3 flex flex-col justify-center leading-tight">
              <p className="text-[9px] lg:text-[10px] font-medium text-white/95 font-sans">Build, brand, and</p>
              <p className="text-[9px] lg:text-[10px] font-semibold text-[#00dfc2] font-sans">back your business</p>
              <p className="text-[9px] lg:text-[10px] font-medium text-white/95 font-sans">with GoDaddy.</p>
            </div>
            {/* Mock Preview + Photo */}
            <div className="flex items-center gap-1.5 h-[50px] flex-shrink-0 overflow-hidden pr-1.5">
              <div className="w-[54px] h-[40px] bg-[#1a1a1a] border border-gray-800 rounded p-0.5 flex flex-col justify-between hidden lg:flex">
                <div className="flex items-center gap-0.5 border-b border-gray-900 pb-0.5 scale-75 origin-left">
                  <span className="w-0.5 h-0.5 bg-red-500 rounded-full inline-block"></span>
                  <span className="w-0.5 h-0.5 bg-yellow-500 rounded-full inline-block"></span>
                  <span className="w-0.5 h-0.5 bg-green-500 rounded-full inline-block"></span>
                </div>
                <div className="text-[4px] text-gray-500 font-sans truncate scale-75 origin-left leading-none">AMERICAN POTS...</div>
                <div className="bg-[#00dfc2] h-2.5 rounded-xs flex items-center justify-center scale-90">
                  <span className="text-[3px] text-black font-extrabold font-sans">SHOP NOW</span>
                </div>
              </div>
              <div className="w-[45px] h-[45px] rounded overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=80&h=80&fit=crop"
                  alt="GoDaddy Campaign"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center leading-none text-left hidden lg:flex">
                <span className="text-[5px] text-gray-400 font-medium font-sans">Ricardo de Tomás</span>
                <span className="text-[7px] text-[#00dfc2] font-bold font-sans">9LIVES.ES</span>
              </div>
            </div>
          </div>

          {/* Actions Dashboard (Right — desktop only) */}
          <div className="hidden md:flex flex-col w-[175px] h-[60px] border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs flex-shrink-0">
            <div className="grid grid-cols-2 border-b border-gray-200 h-[36px]">
              <Link href="/category/latest" className="flex flex-col items-center justify-center hover:bg-gray-50 transition-colors py-0.5 border-r border-gray-200 group/dash">
                <svg className="w-4 h-4 text-gray-600 mb-0.5 group-hover/dash:text-[#07559a] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M16 8h2v8h-2z" /><path d="M6 8h6M6 12h6M6 16h6" />
                </svg>
                <span className="text-[8.5px] font-black text-gray-800 font-sans tracking-wide uppercase">Latest</span>
              </Link>
              <Link href="/category/latest?tab=breaking" className="flex flex-col items-center justify-center hover:bg-gray-50 transition-colors py-0.5 group/dash">
                <svg className="w-4 h-4 text-gray-600 mb-0.5 breaking-badge group-hover/dash:text-red-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="text-[8.5px] font-black text-gray-800 font-sans tracking-wide uppercase">Breaking</span>
              </Link>
            </div>
            <Link href="/category/epaper" className="flex items-center justify-center h-[24px] hover:bg-gray-50 transition-colors group/dash">
              <span className="text-[9.5px] font-black text-gray-700 group-hover/dash:text-[#07559a] font-sans tracking-widest uppercase">E-PAPER</span>
            </Link>
          </div>

          {/* Mobile Controls: E-Paper + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/category/epaper"
              className="bg-[#66000c] text-white font-bold p-2 rounded-lg flex items-center justify-center shadow-sm hover:bg-[#4d0009] transition-colors"
              aria-label="E-Paper"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M16 8h2v8h-2z" /><path d="M6 8h6M6 12h6" />
              </svg>
            </Link>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-gray-700 border border-gray-200 hover:border-gray-300 p-2 rounded-lg transition-colors flex items-center justify-center bg-gray-50"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Horizontal Scrollable Nav Strip ───────────────────── */}
      <div className="md:hidden w-full bg-[#07559a] border-t border-[#044a85] shadow-xs select-none">
        <div className="max-w-full overflow-x-auto whitespace-nowrap hide-scrollbar flex items-center h-9 text-[11.5px] font-bold text-white telugu-text">
          {/* Home icon */}
          <Link href="/" className="px-3.5 h-full flex items-center justify-center hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0" aria-label="హోమ్">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L3 11H5V21H10V14H14V21H19V11H21L12 3Z" fill="#ffe600" />
            </svg>
          </Link>
          <Link href="/category/latest"        className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">తాజా వార్తలు</Link>
          <Link href="/category/andhra-pradesh" className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">ఆంధ్రప్రదేశ్</Link>
          <Link href="/category/telangana"      className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">తెలంగాణ</Link>
          <Link href="/category/national"       className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">జాతీయం</Link>
          <Link href="/category/international"  className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">అంతర్జాతీయం</Link>
          <Link href="/category/business"       className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">బిజినెస్</Link>
          <Link href="/category/sports"         className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">క్రీడలు</Link>
          <Link href="/category/entertainment"  className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">సినిమా</Link>
          <Link href="/category/lifestyle"      className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">వసుంధర</Link>
          <Link href="/category/women"          className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">మహిళలు</Link>
          <Link href="/category/lifestyle"      className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">లైఫ్ స్టైల్</Link>
          <Link href="/category/webstories"     className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">వెబ్ స్టోరీస్</Link>
          <Link href="/category/antharmadanam"  className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">అంతర్మథనం</Link>
          <Link href="/category/adyathmikam"    className="px-3.5 h-full flex items-center hover:bg-black/15 border-r border-white/20 flex-shrink-0">ఆధ్యాత్మికం</Link>
          <Link href="/category/sampadakiyam"   className="px-3.5 h-full flex items-center hover:bg-black/15 flex-shrink-0">సంపాదకీయం</Link>
        </div>
      </div>

      {/* ── Desktop Navigation Bar ───────────────────────────────────── */}
      <div className="hidden md:block w-full border-t border-[#044a85] bg-[#07559a] shadow-md select-none">
        <div className="max-w-[1005px] mx-auto">
          <nav className="flex items-center bg-gradient-to-b from-[#0a5ea7] to-[#05457e] h-10 overflow-visible">

            {/* Home icon */}
            <Link href="/" className="px-4.5 h-full flex items-center justify-center hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0" aria-label="హోమ్">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L3 11H5V21H10V14H14V21H19V11H21L12 3Z" fill="#ffe600" />
              </svg>
            </Link>

            <div className="flex-1 flex items-center h-full text-[13px] font-bold text-white telugu-text">

              {/* తాజా వార్తలు */}
              <Link href="/category/latest" className="px-4 h-full flex items-center hover:text-[#FFAC1E] hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                తాజా వార్తలు
              </Link>

              {/* ఆంధ్రప్రదేశ్ Dropdown */}
              <div className="relative group border-r border-white/20 h-full flex-shrink-0">
                <button className="px-4 h-full flex items-center gap-1 hover:text-[#FFAC1E] hover:bg-black/15 transition-colors cursor-pointer" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  ఆంధ్రప్రదేశ్
                  <ChevronDown size={11} className="text-[#ffe600] group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-100 rounded-b-lg shadow-xl p-2.5 w-44 z-50 animate-fade-in border-t-2 border-[#07559a]">
                  <div className="flex flex-col gap-0.5 text-left">
                    <Link href="/category/andhra-pradesh" className="px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>రాష్ట్ర స్థాయి వార్తలు</Link>
                    <Link href="/category/andhra-pradesh?view=districts" className="px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>జిల్లాల వారీగా వార్తలు</Link>
                  </div>
                </div>
              </div>

              {/* తెలంగాణ Dropdown */}
              <div className="relative group border-r border-white/20 h-full flex-shrink-0">
                <button className="px-4 h-full flex items-center gap-1 hover:text-[#FFAC1E] hover:bg-black/15 transition-colors cursor-pointer" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  తెలంగాణ
                  <ChevronDown size={11} className="text-[#ffe600] group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-100 rounded-b-lg shadow-xl p-2.5 w-44 z-50 animate-fade-in border-t-2 border-[#07559a]">
                  <div className="flex flex-col gap-0.5 text-left">
                    <Link href="/category/telangana" className="px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>రాష్ట్ర స్థాయి వార్తలు</Link>
                    <Link href="/category/telangana?view=districts" className="px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>జిల్లాల వారీగా వార్తలు</Link>
                  </div>
                </div>
              </div>

              {/* జాతీయం */}
              <Link href="/category/national" className="px-4 h-full flex items-center hover:text-[#FFAC1E] hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>జాతీయం</Link>

              {/* అంతర్జాతీయం */}
              <Link href="/category/international" className="px-4 h-full flex items-center hover:text-[#FFAC1E] hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>అంతర్జాతీయం</Link>

              {/* బిజినెస్ */}
              <Link href="/category/business" className="px-4 h-full flex items-center hover:text-[#FFAC1E] hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>బిజినెస్</Link>

              {/* క్రీడలు */}
              <Link href="/category/sports" className="px-4 h-full flex items-center hover:text-[#FFAC1E] hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>క్రీడలు</Link>

              {/* సినిమా */}
              <Link href="/category/entertainment" className="px-4 h-full flex items-center hover:text-[#FFAC1E] hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>సినిమా</Link>

              {/* వసుంధర */}
              <Link href="/category/lifestyle" className="px-4 h-full flex items-center hover:text-[#FFAC1E] hover:bg-black/15 transition-colors border-r border-white/20 flex-shrink-0" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వసుంధర</Link>

              {/* ఇంకా... Dropdown */}
              <div className="relative group h-full flex-shrink-0">
                <button className="px-4 h-full flex items-center gap-1 hover:text-[#FFAC1E] hover:bg-black/15 transition-colors cursor-pointer" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  ఇంకా...
                  <ChevronDown size={11} className="text-[#ffe600] group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full right-0 hidden group-hover:block bg-white border border-gray-100 rounded-b-lg shadow-xl p-3 w-80 z-50 animate-fade-in border-t-2 border-[#07559a]">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    <Link href="/category/technology"    className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>టెక్నాలజీ</Link>
                    <Link href="/category/health"        className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఆరోగ్యం</Link>
                    <Link href="/category/rasipalalu"    className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>రాశిఫలాలు</Link>
                    <Link href="/category/viral"         className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వైరల్</Link>
                    <Link href="/category/photos"        className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఆల్బమ్‌లు</Link>
                    <Link href="/category/videos"        className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వీడియోలు</Link>
                    <Link href="/category/women"         className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>మహిళలు</Link>
                    <Link href="/category/lifestyle"     className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>లైఫ్ స్టైల్</Link>
                    <Link href="/category/webstories"    className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వెబ్ స్టోరీస్</Link>
                    <Link href="/category/antharmadanam" className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>అంతర్మథనం</Link>
                    <Link href="/category/adyathmikam"   className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఆధ్యాత్మికం</Link>
                    <Link href="/category/sampadakiyam"  className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#07559a] hover:bg-blue-50 rounded-md transition-colors telugu-text block text-left" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>సంపాదకీయం</Link>
                  </div>
                </div>
              </div>

            </div>
          </nav>
        </div>
      </div>

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
            <div className="bg-[#07559a] text-white rounded-t-2xl max-h-[82vh] overflow-y-auto p-5 shadow-2xl">

              {/* Main categories 2-column grid */}
              <nav className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13.5px] font-bold telugu-text mb-5" style={{ fontFamily: 'Mandali, sans-serif' }}>
                {[
                  { href: '/',                        label: 'హోమ్'           },
                  { href: '/category/andhra-pradesh', label: 'ఆంధ్రప్రదేశ్'  },
                  { href: '/category/telangana',      label: 'తెలంగాణ'        },
                  { href: '/category/latest',         label: 'తాజా వార్తలు'  },
                  { href: '/category/national',       label: 'జాతీయం'         },
                  { href: '/category/international',  label: 'అంతర్జాతీయం'   },
                  { href: '/category/business',       label: 'బిజినెస్'       },
                  { href: '/category/sports',         label: 'క్రీడలు'        },
                  { href: '/category/entertainment',  label: 'సినిమా'         },
                  { href: '/category/technology',     label: 'టెక్నాలజీ'      },
                  { href: '/category/health',         label: 'ఆరోగ్యం'        },
                  { href: '/category/rasipalalu',     label: 'రాశిఫలాలు'      },
                  { href: '/category/viral',          label: 'వైరల్'          },
                  { href: '/category/photos',         label: 'ఆల్బమ్‌లు'      },
                  { href: '/category/videos',         label: 'వీడియోలు'       },
                  { href: '/category/women',          label: 'మహిళలు'         },
                  { href: '/category/lifestyle',      label: 'లైఫ్ స్టైల్'   },
                  { href: '/category/webstories',     label: 'వెబ్ స్టోరీస్' },
                  { href: '/category/antharmadanam',  label: 'అంతర్మథనం'      },
                  { href: '/category/adyathmikam',    label: 'ఆధ్యాత్మికం'    },
                  { href: '/category/sampadakiyam',   label: 'సంపాదకీయం'      },
                  { href: '/category/epaper',         label: 'ఈ-పేపర్'        },
                ].map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center py-1.5 border-b border-white/10 hover:text-[#FFAC1E] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t border-white/20 mb-4" />

              {/* Feature pages 3-column */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-black text-[#ffe600] tracking-widest uppercase" style={{ fontFamily: 'Mandali, sans-serif' }}>
                  ఫీచర్ పేజీలు
                </h3>
                <div className="grid grid-cols-3 gap-x-3 gap-y-3 text-[12px] font-bold telugu-text" style={{ fontFamily: 'Mandali, sans-serif' }}>
                  {[
                    { href: '/category/lifestyle',     label: 'వసుంధర'       },
                    { href: '/category/women',         label: 'మహిళలు'       },
                    { href: '/category/lifestyle',     label: 'లైఫ్ స్టైల్' },
                    { href: '/category/webstories',    label: 'వెబ్ స్టోరీస్'},
                    { href: '/category/antharmadanam', label: 'అంతర్మథనం'    },
                    { href: '/category/adyathmikam',   label: 'ఆధ్యాత్మికం'  },
                  ].map((link, i) => (
                    <Link key={i} href={link.href} onClick={closeMenu} className="hover:text-[#FFAC1E] transition-colors">
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
