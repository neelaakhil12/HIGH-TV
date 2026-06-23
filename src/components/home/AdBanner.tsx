'use client';

import { useState, useEffect } from 'react';

export function HolidayBanner() {
  return (
    <div className="w-full h-[65px] bg-gradient-to-r from-[#ffe4e6] via-[#fffbeb] to-[#e0f2fe] border border-[#fbcfe8] rounded-md flex items-center justify-between px-4 md:px-6 py-1 select-none overflow-hidden relative shadow-xs">
      {/* Cartoon elements floating */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <svg className="w-8 h-8 text-yellow-500 animate-spin-slow" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="flex items-center gap-1">
          <span className="text-lg">🏃</span>
          <span className="text-lg">🤸</span>
          <span className="text-lg">🎈</span>
        </div>
      </div>
      
      {/* Center text: "సెలవుల్లో సరదాగా!" */}
      <div className="text-center flex-1 mx-2">
        <h4 
          className="telugu-text text-base md:text-2xl font-black text-[#15803d] tracking-wide select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]" 
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          సెలవుల్లో సరదాగా!
        </h4>
      </div>

      {/* Right cartoon elements */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <span className="text-lg">🌳</span>
        <span className="text-lg">🐦</span>
        <span className="text-lg">🏡</span>
      </div>
    </div>
  );
}

// 2. Sidebar: Apollo Hospitals Ad (Replaces Astrology Purple Banner)
export function AstrologyAd() {
  return (
    <div className="w-[170px] h-[135px] md:w-full md:h-auto py-2 md:py-3.5 bg-gradient-to-r from-[#0284c7] to-[#0369a1] border border-[#0284c7]/30 rounded-none md:rounded-lg flex flex-col justify-center gap-1.5 md:flex-row md:items-center md:justify-between md:gap-0 p-2 md:px-5 select-none overflow-hidden relative shadow-sm cursor-pointer hover:shadow transition-shadow mx-auto">
      {/* Top/Left part: medical cross symbol icon */}
      <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1 md:mt-0">
        <svg className="w-4 h-4 md:w-6 md:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
        </svg>
      </div>

      {/* Bottom/Right part: text details */}
      <div className="flex-1 text-center md:text-right flex flex-col justify-center mt-1 md:mt-0 z-10 leading-tight">
        <h4 className="text-white font-extrabold text-[11px] md:text-[15px] font-sans">
          Apollo Hospitals
        </h4>
        <span className="text-amber-350 font-bold text-[8px] md:text-[10.5px] mt-0.5 font-sans uppercase">
          24/7 Emergency
        </span>
        <span className="text-white/80 font-medium text-[6.5px] md:text-[8px] mt-1 font-sans">
          📞 Call 1066
        </span>
      </div>
      
      {/* Ad choices icon in top right */}
      <div className="absolute top-1.5 right-1.5 opacity-20">
        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>
    </div>
  );
}

// 3. Sidebar: Tanishq Jewellery Ad (Replaces Sathyabama Admissions Banner)
export function SathyabamaAd() {
  return (
    <div className="w-full max-w-[280px] md:max-w-none md:w-full bg-[#0f172a] border border-amber-500/20 rounded-lg flex flex-col justify-between p-2.5 md:p-3 select-none overflow-hidden relative shadow-md mx-auto">
      
      {/* Tiny Google Adchoices icon */}
      <div className="absolute top-1 right-1 opacity-20 hover:opacity-100 transition-opacity z-10">
        <svg className="w-2 h-2 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>

      {/* Header: Tanishq Logo */}
      <div className="flex items-center justify-between flex-shrink-0 mb-1.5 md:mb-2">
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-amber-500 text-slate-955 text-[6.5px] md:text-[7px] font-black flex items-center justify-center border border-white">
            T
          </div>
          <span className="text-[8px] md:text-[9px] font-extrabold text-white tracking-widest font-sans">TANISHQ</span>
        </div>
        <div className="bg-[#b45309] text-white text-[5.5px] md:text-[6px] font-extrabold px-1.5 py-0.5 rounded leading-none uppercase font-sans">
          TATA Enterprise
        </div>
      </div>

      {/* Headline & Body */}
      <div className="text-left leading-none flex-shrink-0 mb-1.5 md:mb-2">
        <h4 className="text-[11.5px] md:text-[13px] font-black text-amber-400 tracking-wide font-sans">
          The Festival of Gold
        </h4>
        <p className="text-[9px] md:text-[10px] text-gray-300 mt-0.5 font-sans leading-tight">
          Flat 20% OFF on Jewellery
        </p>
      </div>

      {/* Center Image: Jewellery Model */}
      <div className="w-full h-[120px] md:h-[110px] rounded-md overflow-hidden relative border border-slate-900 bg-slate-950 flex-shrink-0">
        <img
          src="/tanishq-ad.png"
          alt="Tanishq Jewellery"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 to-transparent"></div>
        <div className="absolute bottom-1 left-1.5">
          <span className="text-[7.5px] md:text-[8px] text-white font-extrabold uppercase font-sans tracking-wide">Pure Gold</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-2 md:mt-2.5 bg-[#b45309] hover:bg-[#9a4407] text-white text-[10px] md:text-[11px] font-black py-1 md:py-1.5 px-3 rounded uppercase tracking-wider text-center leading-normal font-sans cursor-pointer transition-colors flex-shrink-0">
        Explore
      </div>

    </div>
  );
}

// 4. Skyscraper Left & Right: Serene City Skyscraper Ad
export function GoogleAdSkyscraperPlaceholder() {
  return (
    <div className="w-[120px] h-[300px] bg-gradient-to-b from-[#022c22] to-[#047857] border border-emerald-700/50 rounded-lg flex flex-col justify-between p-2.5 relative select-none overflow-hidden text-center shadow-md">
      
      {/* Sponsored indicator */}
      <div className="absolute top-1 left-1.5 bg-black/40 text-[#a3e635] text-[5.5px] font-black px-1 py-0.5 rounded leading-none">
        SPONSORED
      </div>

      {/* Title */}
      <div className="mt-3">
        <h4 className="text-[11px] font-black text-amber-400 tracking-wide font-sans leading-none uppercase">
          Serene City
        </h4>
        <p className="text-[7.5px] text-emerald-100 font-bold font-sans mt-0.5 uppercase tracking-wider">
          Luxury Villas
        </p>
      </div>

      {/* Image */}
      <div className="h-[90px] w-full rounded overflow-hidden relative border border-emerald-950/80 my-1 bg-emerald-950">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=120&h=90&fit=crop"
          alt="Serene City Villa"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"></div>
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span className="text-[6px] text-white font-extrabold uppercase font-sans tracking-wide">KOKAPET, HYD</span>
        </div>
      </div>

      {/* Details list */}
      <div className="text-[6.5px] text-emerald-100/90 font-sans space-y-0.5 leading-tight text-center">
        <div>• Gated Community</div>
        <div>• Premium Amenities</div>
        <div>• 10 Min to Gachibowli</div>
      </div>

      {/* CTA Button */}
      <div className="mb-0.5">
        <button className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[7.5px] py-1 px-1.5 rounded leading-none transition-colors uppercase font-sans tracking-wider">
          Book Now
        </button>
      </div>

    </div>
  );
}

// 5. Sidebar: Manappuram Gold Loan Ad
export function GoldLoanAd() {
  return (
    <div className="w-full md:w-full bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#78350f] border border-amber-600/40 rounded-lg flex flex-col justify-between gap-3 p-3 md:p-4 select-none overflow-hidden relative shadow-md mx-auto aspect-square md:aspect-auto">
      
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 absolute top-0 left-0" />

      {/* Adchoices */}
      <div className="absolute top-1.5 right-1.5 opacity-25 hover:opacity-100 transition-opacity z-10">
        <svg className="w-2.5 h-2.5 text-amber-200" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>

      {/* Logo row */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-sm border border-amber-300">
          <svg className="w-4 h-4 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93C9.33 17.79 7 14.5 7 11V7.18L12 5z"/>
          </svg>
        </div>
        <div>
          <span className="text-[11px] font-black text-amber-200 tracking-widest font-sans uppercase">Manappuram</span>
          <div className="text-[8px] text-amber-300/80 font-bold font-sans tracking-wide uppercase leading-none">Gold Loan</div>
        </div>
        <div className="ml-auto bg-amber-400/20 text-amber-200 text-[6px] font-black px-1.5 py-0.5 rounded border border-amber-400/30 leading-none uppercase">
          SPONSORED
        </div>
      </div>

      {/* Headline */}
      <div className="text-left leading-none flex-shrink-0">
        <h4 className="text-[14px] font-black text-amber-300 leading-tight font-sans tracking-tight">బంగారు రుణం</h4>
        <p className="text-[10px] text-amber-100/90 font-bold font-sans mt-0.5 leading-relaxed telugu-text"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          30 నిమిషాల్లో నగదు పొందండి — కనిష్ట వడ్డీ రేటుతో!
        </p>
      </div>

      {/* Image */}
      <div className="w-full flex-1 rounded-md overflow-hidden relative border border-amber-800/60 bg-amber-950">
        <img src="/manappuram-ad.png" alt="Gold Jewellery" className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#78350f]/70 to-transparent" />
        <div className="absolute bottom-1 left-1.5">
          <span className="text-[8px] text-amber-200 font-extrabold font-sans uppercase tracking-wider">916 Gold Accepted</span>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-[11px] py-2 rounded uppercase tracking-wider font-sans transition-colors shadow-md cursor-pointer flex-shrink-0">
        Apply Now — Free Doorstep Service
      </button>

      <div className="text-center text-[8px] text-amber-300/70 font-bold font-sans">
        📞 1800-4250-5555 • Toll Free 24/7
      </div>
    </div>
  );
}

// 6. Left Column Bottom: Sri Chaitanya Coaching Ad (tall banner)
export function CoachingAd() {
  return (
    <div className="w-full md:w-full bg-gradient-to-br from-[#0c1445] via-[#1a237e] to-[#0c1445] border border-blue-800/40 rounded-lg flex flex-col justify-between gap-3 p-3 md:p-4 select-none overflow-hidden relative shadow-md mx-auto aspect-square md:aspect-auto">
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 absolute top-0 left-0" />

      {/* Sponsored badge */}
      <div className="absolute top-2 left-3 bg-black/40 text-amber-300 text-[6px] font-black px-1.5 py-0.5 rounded leading-none uppercase z-10">
        SPONSORED
      </div>

      {/* Logo row */}
      <div className="flex items-center gap-2 flex-shrink-0 z-10 mt-1">
        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-black text-blue-950 border border-white/20 flex-shrink-0">
          SC
        </div>
        <div>
          <div className="text-white font-black text-[13px] font-sans tracking-wide leading-none">Sri Chaitanya</div>
          <div className="text-amber-300 font-bold text-[8px] font-sans tracking-widest uppercase leading-none mt-0.5">Institutions</div>
        </div>
      </div>

      {/* Headline */}
      <div className="text-left leading-none flex-shrink-0">
        <h4 className="text-[15px] font-black text-amber-300 font-sans">IIT · NEET · JEE</h4>
        <p className="text-[10px] text-blue-100 font-bold mt-0.5 leading-relaxed telugu-text"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          టాప్ ర్యాంకుల కోసం శ్రీ చైతన్యలో చేరండి
        </p>
      </div>

      {/* Hero image */}
      <div className="w-full flex-1 rounded-lg overflow-hidden relative border border-blue-950 bg-blue-950">
        <img src="/chaitanya-ad.png" alt="Sri Chaitanya Students" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1445]/80 to-transparent" />
      </div>

      {/* CTA */}
      <button className="w-full bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-[11px] py-2 rounded-lg uppercase tracking-wider font-sans transition-colors shadow cursor-pointer flex-shrink-0">
        Enroll Now — Free Counselling
      </button>

      <div className="text-center text-[8px] text-blue-300/80 font-bold font-sans">
        📞 1800-599-2233 • Hyderabad | Vijayawada | Warangal
      </div>
    </div>
  );
}

interface AdBannerProps {
  position?: 'leaderboard' | 'sidebar' | 'rectangle' | 'holiday' | 'astrology' | 'skyscraper-left' | 'skyscraper-right' | 'gold-loan' | 'coaching' | 'avasa-estates' | 'lalitha-jewellery' | 'jiofiber' | 'ramraj' | 'sbi' | 'oneplus' | 'hdfc' | 'iphone' | 'pharmeasy' | 'dummy';
}

export default function AdBanner({ position = 'leaderboard' }: AdBannerProps) {
  const [customAd, setCustomAd] = useState<{ image: string; link: string } | null>(null);

  useEffect(() => {
    const handleResolveAd = () => {
      try {
        const parsedAds = JSON.parse(localStorage.getItem('custom_ads_config') || '{}');
        const isMobile = window.innerWidth < 768;
        
        let prefix = '';
        const path = window.location.pathname;
        const catMatch = path.match(/\/category\/([a-zA-Z0-9_-]+)/);
        const distMatch = path.match(/\/district\/[a-zA-Z0-9_-]+\/([a-zA-Z0-9_-]+)/);
        
        if (catMatch && catMatch[1]) {
          prefix = catMatch[1];
        } else if (distMatch && distMatch[1]) {
          prefix = distMatch[1];
        }

        let configKey = '';
        if (isMobile) {
          if (prefix) {
            const specMobileKey = `${prefix}_mobile_${position}`;
            if (parsedAds[specMobileKey] && parsedAds[specMobileKey].enabled && parsedAds[specMobileKey].image) {
              configKey = specMobileKey;
            } else {
              configKey = `mobile_${position}`;
            }
          } else {
            configKey = `mobile_${position}`;
          }
          
          if (!parsedAds[configKey] || !parsedAds[configKey].enabled || !parsedAds[configKey].image) {
            if (prefix) {
              const specKey = `${prefix}_${position}`;
              if (parsedAds[specKey] && parsedAds[specKey].enabled && parsedAds[specKey].image) {
                configKey = specKey;
              } else {
                configKey = position;
              }
            } else {
              configKey = position;
            }
          }
        } else {
          if (prefix) {
            const specKey = `${prefix}_${position}`;
            if (parsedAds[specKey] && parsedAds[specKey].enabled && parsedAds[specKey].image) {
              configKey = specKey;
            } else {
              configKey = position;
            }
          } else {
            configKey = position;
          }
        }

        const activeAd = parsedAds[configKey];
        if (activeAd && activeAd.enabled && activeAd.image) {
          setCustomAd({ image: activeAd.image, link: activeAd.link || '#' });
        } else {
          setCustomAd(null);
        }
      } catch (e) {
        setCustomAd(null);
      }
    };

    handleResolveAd();
    window.addEventListener('resize', handleResolveAd);
    return () => window.removeEventListener('resize', handleResolveAd);
  }, [position]);

  if (customAd) {
    const isLeaderboard = position === 'leaderboard';
    const isSidebar = position === 'sidebar';
    
    return (
      <div className={`w-full flex flex-col items-center select-none ${isLeaderboard ? 'mt-1 mb-1 md:my-3' : 'my-3'}`}>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
        <a 
          href={customAd.link} 
          target={customAd.link === '#' ? '_self' : '_blank'}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (customAd.link === '#') e.preventDefault();
          }}
          className={`relative block overflow-hidden rounded-lg border border-slate-200/20 bg-slate-900 shadow-md group hover:border-[#02599c]/50 transition-colors w-full ${
            isLeaderboard 
              ? 'h-auto min-h-[90px] max-h-[120px]' 
              : isSidebar 
                ? 'aspect-square md:aspect-auto md:min-h-[220px]' 
                : 'min-h-[120px] max-h-[160px]'
          }`}
        >
          {/* Ad label */}
          <div className="absolute top-1.5 left-2 bg-black/50 text-[#ffb3d1] text-[6.5px] font-black px-1.5 py-0.5 rounded leading-none uppercase tracking-wider font-sans z-10">
            Sponsor
          </div>
          
          <img 
            src={customAd.image} 
            alt="Advertisement" 
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
          />

          {/* Adchoices badge */}
          <div className="absolute top-1.5 right-1.5 opacity-35 z-10">
            <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
        </a>
      </div>
    );
  }

  if (position === 'leaderboard') {
    return (
      <div className="w-full flex flex-col items-center mt-1 mb-1 md:my-3 select-none">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-sans md:hidden">ADVERTISEMENT</span>
        <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[85px] py-2 bg-[#111113] border-y border-neutral-850 md:border md:rounded-lg flex items-center justify-between px-2 sm:px-3 md:px-4 relative overflow-hidden group shadow-sm">
          {/* Adchoices icon */}
          <div className="absolute top-1 right-1 opacity-20 hover:opacity-100 transition-opacity z-10">
            <svg className="w-2.5 h-2.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>

          {/* Left part: Building Image + "55 Floors" */}
          <div className="flex items-center gap-2.5 h-full flex-shrink-0">
            <div className="w-[45px] h-[45px] md:w-[70px] md:h-[70px] relative overflow-hidden rounded border border-neutral-800">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&h=100&fit=crop"
                alt="MSN Neopolis Tower"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left justify-center leading-none">
              <span className="text-white font-extrabold text-[15px] md:text-[18px] font-sans">55</span>
              <span className="text-neutral-500 font-bold text-[7px] md:text-[8px] tracking-widest font-sans uppercase">FLOORS</span>
            </div>
          </div>

          {/* Center part: "ONE OF A KIND" branding (hide on small screens, show on sm and up) */}
          <div className="hidden sm:flex flex-1 flex-col justify-center text-center px-2 leading-tight">
            <span className="text-amber-400 font-black text-[11px] md:text-[13px] font-sans tracking-widest uppercase">ONE OF A KIND</span>
            <span className="text-white font-bold text-[8.5px] md:text-[10px] font-sans tracking-wide uppercase mt-0.5">EXPANSIVE 4 BHK RESIDENCES</span>
            <span className="text-neutral-400 font-medium text-[7.5px] md:text-[8px] font-sans uppercase mt-0.5">📍 NEOPOLIS, HYDERABAD</span>
          </div>

          {/* Mobile-specific center text (visible only on small screen under sm) */}
          <div className="flex sm:hidden flex-1 flex-col justify-center text-left px-3 leading-tight">
            <span className="text-amber-400 font-black text-[10px] font-sans tracking-wider uppercase">MSN REALTY</span>
            <span className="text-white font-extrabold text-[8.5px] font-sans uppercase mt-0.5">EXPANSIVE 4 BHK</span>
            <span className="text-neutral-400 font-medium text-[7.5px] font-sans uppercase mt-0.5">📍 NEOPOLIS, HYD</span>
          </div>

          {/* Right part: MSN Logo / Phone / SFT */}
          <div className="flex items-center gap-1.5 md:gap-3 flex-shrink min-w-0 border-l border-neutral-800/60 pl-1.5 md:pl-3 h-[45px] md:h-[60px] text-right">
            <div className="flex flex-col justify-center leading-tight">
              <span className="hidden min-[360px]:block text-[8.5px] md:text-[10px] text-neutral-300 font-bold font-sans">5250 - 7460 SFT</span>
              <span className="text-[8px] md:text-[9.5px] text-amber-400 font-bold font-sans mt-0.5 whitespace-nowrap">📞 91426 45645</span>
            </div>
            <div className="hidden min-[380px]:flex flex-col justify-center leading-none text-left border-l border-neutral-800/60 pl-2">
              <span className="text-[10px] md:text-[11px] text-amber-500 font-extrabold font-sans">MSN</span>
              <span className="text-[6.5px] md:text-[7.5px] text-neutral-400 font-bold font-sans tracking-wider mt-0.5">REALTY</span>
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (position === 'holiday') {
    return null;
  }

  if (position === 'astrology') {
    return <AstrologyAd />;
  }

  if (position === 'sidebar') {
    return <SathyabamaAd />;
  }

  if (position === 'skyscraper-left' || position === 'skyscraper-right') {
    return <GoogleAdSkyscraperPlaceholder />;
  }

  if (position === 'coaching') {
    return <CoachingAd />;
  }

  if (position === 'avasa-estates') {
    return <AvasaEstatesAd />;
  }

  if (position === 'jiofiber') {
    return <JioFiberAd />;
  }

  if (position === 'ramraj') {
    return <RamrajAd />;
  }

  if (position === 'sbi') {
    return <SbiAd />;
  }

  if (position === 'oneplus') {
    return <OnePlusAd />;
  }

  if (position === 'hdfc') {
    return <HdfcAd />;
  }

  if (position === 'iphone') {
    return <IphoneAd />;
  }

  if (position === 'pharmeasy') {
    return <PharmEasyAd />;
  }

  if (position === 'dummy') {
    return <DummyAdBox />;
  }

  if (position === 'lalitha-jewellery') {
    return <LalithaJewelleryAd />;
  }

  if (position === 'gold-loan') {
    return <GoldLoanAd />;
  }

  if (position === 'rectangle') {
    return (
      <div className="w-full flex flex-col items-center my-3 select-none">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
        <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[120px] py-4 bg-gradient-to-r from-[#4c0519] to-[#881337] border-y border-rose-900 md:border md:rounded-lg flex items-center justify-between p-3 md:p-4 relative overflow-hidden text-left shadow-sm group hover:border-rose-800 transition-colors">
          {/* Ad label */}
          <div className="absolute top-1.5 left-2 bg-black/40 text-rose-300 text-[6.5px] font-black px-1 py-0.5 rounded leading-none">
            SPONSORED
          </div>
          
          {/* Left side: text */}
          <div className="flex-1 flex flex-col justify-center pr-3 z-10">
            <span className="text-amber-300 font-black text-[13.5px] leading-snug tracking-tight font-sans uppercase">
              CMR Shopping Mall
            </span>
            <span 
              className="text-white font-bold text-[10.5px] leading-normal mt-0.5 telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              పట్టు చీరల ప్రత్యేక సేకరణ!
            </span>
            <span className="text-rose-200/80 font-medium text-[8px] mt-1 font-sans">
              Wedding Silks & Fancy Sarees Collection
            </span>
          </div>

          {/* Right side: Image thumbnail */}
          <div className="w-14 h-14 rounded-lg overflow-hidden border border-rose-950 flex-shrink-0 z-10 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&h=100&fit=crop"
              alt="Silk Sarees"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Adchoices badge */}
          <div className="absolute top-1.5 right-1.5 opacity-20">
            <svg className="w-2.5 h-2.5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // default / leaderboard: Serene City Horizontal Leaderboard Ad
  return (
    <div className="w-full flex flex-col items-center my-3 select-none">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[90px] py-2.5 bg-gradient-to-r from-[#022c22] via-[#047857] to-[#022c22] border-y border-emerald-800 md:border md:rounded-lg flex items-center justify-between px-5 relative overflow-hidden group shadow-sm">
        
        {/* Sponsored Badge */}
        <div className="absolute top-1 left-2 bg-black/40 text-[#a3e635] text-[5.5px] font-black px-1.5 py-0.5 rounded leading-none">
          SPONSORED
        </div>

        {/* Left: Brand details */}
        <div className="flex flex-col text-left justify-center pl-1">
          <h4 className="text-amber-400 font-black text-[13px] font-sans tracking-widest uppercase leading-none">
            SERENE CITY
          </h4>
          <p className="text-white font-extrabold text-[9px] font-sans tracking-wide mt-1 uppercase">
            Luxury Gated Villas
          </p>
        </div>

        {/* Center: Hero Message */}
        <div className="hidden md:flex flex-col justify-center text-center px-4 leading-tight border-l border-r border-emerald-850/60 h-[50px] mx-4 flex-1">
          <span className="text-white font-extrabold text-[10.5px] font-sans tracking-wider uppercase">
            Exquisite 4 & 5 BHK Residences
          </span>
          <span className="text-emerald-100 font-bold text-[8.5px] font-sans tracking-wide mt-1 uppercase">
            📍 Kokapet, Hyderabad • 10 Min to Gachibowli
          </span>
        </div>

        {/* Right: Booking / Price / CTA */}
        <div className="flex items-center gap-4 flex-shrink-0 text-right pr-1">
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-[10px] text-emerald-100 font-bold font-sans">Villas from ₹4.5 Cr*</span>
            <span className="text-[9px] text-amber-400 font-black font-sans mt-0.5">📞 1800-123-4567</span>
          </div>
          <div>
            <button className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[9px] py-2 px-3 rounded-lg leading-none transition-colors uppercase font-sans tracking-wider shadow-md">
              Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AvasaEstatesAd() {
  return (
    <div className="w-full flex flex-col items-center my-3 select-none">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[120px] py-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-y border-slate-800 md:border md:rounded-lg flex items-center justify-between p-4 relative overflow-hidden text-left shadow-sm group hover:border-slate-700 transition-colors">
        {/* Ad label */}
        <div className="absolute top-1.5 left-2 bg-black/40 text-amber-400 text-[6.5px] font-black px-1 py-0.5 rounded leading-none">
          SPONSORED
        </div>
        
        {/* Left side: text */}
        <div className="flex-1 flex flex-col justify-center pr-3 z-10">
          <span className="text-amber-400 font-black text-[13.5px] leading-snug tracking-tight font-sans uppercase">
            Avasa Estates
          </span>
          <span 
            className="text-white font-bold text-[10.5px] leading-normal mt-0.5 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            హైదరాబాద్‌లో లగ్జరీ అపార్ట్‌మెంట్స్!
          </span>
          <span className="text-slate-300 font-medium text-[8px] mt-1 font-sans">
            Premium 3 & 4 BHK Apartments • Kokapet
          </span>
        </div>

        {/* Right side: Image thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-950 flex-shrink-0 z-10 shadow-md">
          <img
            src="/avasa-ad.png"
            alt="Avasa Estates"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Adchoices badge */}
        <div className="absolute top-1.5 right-1.5 opacity-20">
          <svg className="w-2.5 h-2.5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function LalithaJewelleryAd() {
  return (
    <div className="w-full flex flex-col items-center my-3 select-none">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[120px] py-4 bg-gradient-to-r from-[#5c0632] to-[#800c48] border-y border-pink-900 md:border md:rounded-lg flex items-center justify-between p-4 relative overflow-hidden text-left shadow-sm group hover:border-pink-850 transition-colors">
        {/* Ad label */}
        <div className="absolute top-1.5 left-2 bg-black/40 text-rose-300 text-[6.5px] font-black px-1 py-0.5 rounded leading-none">
          SPONSORED
        </div>
        
        {/* Left side: text */}
        <div className="flex-1 flex flex-col justify-center pr-3 z-10">
          <span className="text-amber-300 font-black text-[13.5px] leading-snug tracking-tight font-sans uppercase">
            Lalitha Jewellery
          </span>
          <span 
            className="text-white font-bold text-[10.5px] leading-normal mt-0.5 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            బంగారు, వజ్రాభరణాల అద్భుతమైన కలెక్షన్!
          </span>
          <span className="text-pink-100/90 font-medium text-[8px] mt-1 font-sans">
            Special Gold & Diamond Jewellery Sale • Low Wastage
          </span>
        </div>

        {/* Right side: Image thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-pink-950 flex-shrink-0 z-10 shadow-md">
          <img
            src="/lalitha-ad.png"
            alt="Lalitha Jewellery"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Adchoices badge */}
        <div className="absolute top-1.5 right-1.5 opacity-20">
          <svg className="w-2.5 h-2.5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function JioFiberAd() {
  return (
    <div className="w-full flex flex-col items-center my-3 select-none">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[120px] py-4 bg-gradient-to-r from-[#0c4a6e] to-[#0284c7] border-y border-[#0284c7]/50 md:border md:rounded-lg flex items-center justify-between p-4 relative overflow-hidden text-left shadow-sm group hover:border-[#0284c7]/75 transition-colors">
        {/* Ad label */}
        <div className="absolute top-1.5 left-2 bg-black/40 text-blue-200 text-[6.5px] font-black px-1 py-0.5 rounded leading-none">
          SPONSORED
        </div>
        
        {/* Left side: text */}
        <div className="flex-1 flex flex-col justify-center pr-3 z-10">
          <span className="text-yellow-300 font-black text-[13.5px] leading-snug tracking-tight font-sans uppercase">
            JioFiber
          </span>
          <span 
            className="text-white font-bold text-[10.5px] leading-normal mt-0.5 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            అల్ట్రా-ఫాస్ట్ ఇంటర్నెట్ కనెక్షన్!
          </span>
          <span className="text-blue-100 font-medium text-[8px] mt-1 font-sans">
            Unlimited Data @ 100 Mbps starting from ₹399/mo
          </span>
        </div>

        {/* Right side: Image thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-sky-950 flex-shrink-0 z-10 shadow-md">
          <img
            src="/jiofiber-ad.png"
            alt="JioFiber"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Adchoices badge */}
        <div className="absolute top-1.5 right-1.5 opacity-20">
          <svg className="w-2.5 h-2.5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function RamrajAd() {
  return (
    <div className="w-full flex flex-col items-center my-3 select-none">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[120px] py-4 bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] border-y border-slate-300 md:border md:rounded-lg flex items-center justify-between p-4 relative overflow-hidden text-left shadow-sm group hover:border-slate-400 transition-colors">
        {/* Ad label */}
        <div className="absolute top-1.5 left-2 bg-black/10 text-slate-700 text-[6.5px] font-black px-1 py-0.5 rounded leading-none">
          SPONSORED
        </div>
        
        {/* Left side: text */}
        <div className="flex-1 flex flex-col justify-center pr-3 z-10">
          <span className="text-[#1e3a8a] font-black text-[13.5px] leading-snug tracking-tight font-sans uppercase">
            Ramraj Cottons
          </span>
          <span 
            className="text-slate-800 font-bold text-[10.5px] leading-normal mt-0.5 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            సాంప్రదాయ పట్టు పంచెలు & తెల్లటి షర్టులు!
          </span>
          <span className="text-slate-500 font-medium text-[8px] mt-1 font-sans">
            Premium Pure Cotton Dhotis & White Shirts Collection
          </span>
        </div>

        {/* Right side: Image thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 z-10 shadow-md bg-white">
          <img
            src="/ramraj-ad.png"
            alt="Ramraj Cottons"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Adchoices badge */}
        <div className="absolute top-1.5 right-1.5 opacity-20">
          <svg className="w-2.5 h-2.5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function SbiAd() {
  return (
    <div className="w-full flex flex-col items-center my-3 select-none">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[120px] py-4 bg-gradient-to-r from-[#0369a1] to-[#0284c7] border-y border-sky-900 md:border md:rounded-lg flex items-center justify-between p-4 relative overflow-hidden text-left shadow-sm group hover:border-sky-850 transition-colors">
        {/* Ad label */}
        <div className="absolute top-1.5 left-2 bg-black/40 text-rose-300 text-[6.5px] font-black px-1 py-0.5 rounded leading-none">
          SPONSORED
        </div>
        
        {/* Left side: text */}
        <div className="flex-1 flex flex-col justify-center pr-3 z-10">
          <span className="text-amber-300 font-black text-[13.5px] leading-snug tracking-tight font-sans uppercase">
            SBI Home Loans
          </span>
          <span 
            className="text-white font-bold text-[10.5px] leading-normal mt-0.5 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            "మీ కలల ఇల్లు ఇప్పుడు నిజం — అతి తక్కువ వడ్డీతో!"
          </span>
          <span className="text-sky-100/90 font-medium text-[8px] mt-1 font-sans">
            Home Loans starting from 8.40% p.a. • Zero Processing Fees
          </span>
        </div>

        {/* Right side: Image thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-sky-950 flex-shrink-0 z-10 shadow-md">
          <img
            src="/sbi-ad.png"
            alt="SBI Home Loan"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Adchoices badge */}
        <div className="absolute top-1.5 right-1.5 opacity-20">
          <svg className="w-2.5 h-2.5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function OnePlusAd() {
  return (
    <div className="w-full flex flex-col items-center my-3 select-none">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[120px] py-4 bg-gradient-to-r from-[#18181b] to-[#27272a] border-y border-zinc-800 md:border md:rounded-lg flex items-center justify-between p-4 relative overflow-hidden text-left shadow-sm group hover:border-zinc-700 transition-colors">
        {/* Ad label */}
        <div className="absolute top-1.5 left-2 bg-black/40 text-amber-400 text-[6.5px] font-black px-1 py-0.5 rounded leading-none">
          SPONSORED
        </div>
        
        {/* Left side: text */}
        <div className="flex-1 flex flex-col justify-center pr-3 z-10">
          <span className="text-[#ea580c] font-black text-[13.5px] leading-snug tracking-tight font-sans uppercase">
            OnePlus 12
          </span>
          <span 
            className="text-white font-bold text-[10.5px] leading-normal mt-0.5 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            "ఫ్లాగ్‌షిప్ స్మార్ట్‌ఫోన్ — సరికొత్త ఫీచర్లతో!"
          </span>
          <span className="text-zinc-300 font-medium text-[8px] mt-1 font-sans">
            Snapdragon 8 Gen 3 • 50MP Hasselblad Camera • 5400mAh Battery
          </span>
        </div>

        {/* Right side: Image thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-zinc-950 flex-shrink-0 z-10 shadow-md">
          <img
            src="/oneplus-ad.png"
            alt="OnePlus 12"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Adchoices badge */}
        <div className="absolute top-1.5 right-1.5 opacity-20">
          <svg className="w-2.5 h-2.5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function HdfcAd() {
  return (
    <div className="w-full flex flex-col items-center my-3 select-none">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[120px] py-4 bg-gradient-to-r from-[#004c8f] to-[#002e5c] border-y border-blue-900 md:border md:rounded-lg flex items-center justify-between p-4 relative overflow-hidden text-left shadow-sm group hover:border-blue-800 transition-colors">
        {/* Ad label */}
        <div className="absolute top-1.5 left-2 bg-black/40 text-blue-200 text-[6.5px] font-black px-1 py-0.5 rounded leading-none">
          SPONSORED
        </div>
        
        {/* Left side: text */}
        <div className="flex-1 flex flex-col justify-center pr-3 z-10">
          <span className="text-amber-300 font-black text-[13.5px] leading-snug tracking-tight font-sans uppercase">
            HDFC Business Loans
          </span>
          <span 
            className="text-white font-bold text-[10.5px] leading-normal mt-0.5 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            "మీ వ్యాపార విస్తరణకు సులువైన లోన్స్ — శీఘ్ర మంజూరు!"
          </span>
          <span className="text-blue-100 font-medium text-[8px] mt-1 font-sans">
            Collateral-free loans up to ₹75 Lakhs • Quick Disbursal • Minimal Paperwork
          </span>
        </div>

        {/* Right side: Image thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-blue-950 flex-shrink-0 z-10 shadow-md">
          <img
            src="/hdfc-ad.png"
            alt="HDFC Business Loan"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Adchoices badge */}
        <div className="absolute top-1.5 right-1.5 opacity-20">
          <svg className="w-2.5 h-2.5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function IphoneAd() {
  return (
    <div className="w-full flex flex-col items-center my-3 select-none">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[120px] py-4 bg-gradient-to-r from-[#1c1917] to-[#0c0a09] border-y border-stone-800 md:border md:rounded-lg flex items-center justify-between p-4 relative overflow-hidden text-left shadow-sm group hover:border-stone-700 transition-colors">
        {/* Ad label */}
        <div className="absolute top-1.5 left-2 bg-black/40 text-amber-400 text-[6.5px] font-black px-1 py-0.5 rounded leading-none">
          SPONSORED
        </div>
        
        {/* Left side: text */}
        <div className="flex-1 flex flex-col justify-center pr-3 z-10">
          <span className="text-[#a8a29e] font-black text-[13.5px] leading-snug tracking-tight font-sans uppercase">
            iPhone 15 Pro
          </span>
          <span 
            className="text-white font-bold text-[10.5px] leading-normal mt-0.5 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            "అల్టిమేట్ టైటానియం డిజైన్ — అద్భుతమైన ఆఫర్లతో!"
          </span>
          <span className="text-stone-300 font-medium text-[8px] mt-1 font-sans">
            A17 Pro chip • Pro Camera System with 5x Telephoto • Apple Intelligence
          </span>
        </div>

        {/* Right side: Image thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-stone-950 flex-shrink-0 z-10 shadow-md">
          <img
            src="/iphone-ad.png"
            alt="iPhone 15 Pro"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Adchoices badge */}
        <div className="absolute top-1.5 right-1.5 opacity-20">
          <svg className="w-2.5 h-2.5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function PharmEasyAd() {
  return (
    <div className="w-full flex flex-col items-center my-3 select-none">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans md:hidden">ADVERTISEMENT</span>
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-auto min-h-[120px] py-4 bg-gradient-to-r from-[#0f766e] to-[#115e59] border-y border-teal-850 md:border md:rounded-lg flex items-center justify-between p-4 relative overflow-hidden text-left shadow-sm group hover:border-teal-700 transition-colors">
        {/* Ad label */}
        <div className="absolute top-1.5 left-2 bg-black/40 text-teal-200 text-[6.5px] font-black px-1 py-0.5 rounded leading-none">
          SPONSORED
        </div>
        
        {/* Left side: text */}
        <div className="flex-1 flex flex-col justify-center pr-3 z-10">
          <span className="text-yellow-300 font-black text-[13.5px] leading-snug tracking-tight font-sans uppercase">
            PharmEasy
          </span>
          <span 
            className="text-white font-bold text-[10.5px] leading-normal mt-0.5 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            "ఆన్‌లైన్ మెడిసిన్స్ — 20% వరకు నికర తగ్గింపు!"
          </span>
          <span className="text-teal-100 font-medium text-[8px] mt-1 font-sans">
            Flat 20% OFF on medicines • Medicine Delivery at home • Express 4-Hour Delivery
          </span>
        </div>

        {/* Right side: Image thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-teal-950 flex-shrink-0 z-10 shadow-md">
          <img
            src="/pharmeasy-ad.png"
            alt="PharmEasy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Adchoices badge */}
        <div className="absolute top-1.5 right-1.5 opacity-20">
          <svg className="w-2.5 h-2.5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function DummyAdBox() {
  return (
    <div className="w-full flex flex-col items-center my-3 select-none">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-sans md:hidden">ADVERTISEMENT</span>
      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 h-[100px] bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200 md:border md:rounded-lg flex flex-col items-center justify-center relative overflow-hidden text-center shadow-xs">
        <div className="text-gray-400 font-black text-[13px] tracking-wider uppercase font-sans">
          SPONSORED AD
        </div>
        <div className="text-gray-300 text-[10px] mt-1 font-sans">
          Ad placement options available
        </div>
        
        {/* Tiny AdChoices icon */}
        <div className="absolute top-1.5 right-1.5 opacity-15">
          <svg className="w-2.5 h-2.5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
