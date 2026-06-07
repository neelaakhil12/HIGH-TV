'use client';

// 1. Left Column: Cartoon Holiday Banner ("సెలవుల్లో సరదాగా!")
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

// 2. Sidebar: Astrology Purple Banner ("జాతక ఫలం")
export function AstrologyAd() {
  return (
    <div className="w-full h-[105px] bg-gradient-to-r from-[#201847] to-[#4c1d95] border border-[#5b21b6]/35 rounded-lg flex items-center justify-between px-5 py-2 select-none overflow-hidden relative shadow-sm cursor-pointer hover:shadow transition-shadow">
      {/* Left side: Astrology chart diagram representation */}
      <div className="w-14 h-14 rounded-full border border-[#fcd34d]/40 flex items-center justify-center opacity-70 relative flex-shrink-0">
        <div className="absolute inset-1 rounded-full border border-dashed border-[#fcd34d]/20"></div>
        <svg className="w-8 h-8 text-[#fcd34d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="5" y1="19" x2="19" y2="5" />
        </svg>
      </div>

      {/* Right side: text details */}
      <div className="flex-1 text-right flex flex-col justify-center pl-4">
        <h4 
          className="telugu-text text-xl md:text-2xl font-black text-[#ffd700] tracking-wide" 
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          జాతక ఫలం
        </h4>
        <p 
          className="telugu-text text-[11px] text-white/90 font-bold mt-0.5" 
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          అడగండి ప్రశ్న
        </p>
      </div>
      
      {/* Ad choices icon in top right */}
      <div className="absolute top-1 right-1 opacity-30">
        <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>
    </div>
  );
}

// 3. Sidebar: Sathyabama University Admissions Banner
export function SathyabamaAd() {
  return (
    <div className="w-full h-[280px] bg-[#0c1424] border border-amber-500/20 rounded-lg flex flex-col justify-between p-3.5 select-none overflow-hidden relative shadow-md">
      
      {/* Tiny Google Adchoices icon */}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 opacity-40 hover:opacity-100 transition-opacity z-10">
        <svg className="w-2.5 h-2.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>

      {/* Header: Sathyabama Logo & Accredited info */}
      <div className="flex items-center gap-1.5 justify-between">
        <div className="flex items-center gap-1">
          <div className="w-4.5 h-4.5 rounded-full bg-green-600 text-white text-[6.5px] font-black flex items-center justify-center border border-white">
            S
          </div>
          <span className="text-[7.5px] font-black text-white tracking-wider font-sans">SATHYABAMA</span>
        </div>
        <div className="bg-[#a3e635] text-black text-[5.5px] font-extrabold px-1 py-0.5 rounded leading-none">
          A++ NAAC
        </div>
      </div>

      {/* Headline & Body */}
      <div className="mt-1 text-left">
        <h4 className="text-[12px] font-black text-amber-400 leading-tight tracking-wide font-sans">
          Empowering Minds.
        </h4>
        <h4 className="text-[12px] font-black text-white leading-none tracking-wide font-sans">
          Enriching Futures.
        </h4>
        <p className="text-[7.5px] text-gray-400 mt-1.5 font-sans leading-relaxed">
          For Admissions, Contact:<br />
          <span className="text-white font-bold">+91 99400 58263 | 99401 68007</span>
        </p>
      </div>

      {/* Center Image/Graphics of Students */}
      <div className="h-[105px] w-full rounded bg-gray-900 overflow-hidden relative border border-gray-800 my-1.5">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=250&h=110&fit=crop"
          alt="Sathyabama Campus"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-1 left-1.5">
          <span className="text-[6.5px] text-white font-extrabold uppercase font-sans tracking-wide">ADMISSIONS OPEN 2026-27</span>
        </div>
      </div>

      {/* Admissions details & disciplines */}
      <div className="bg-[#b91c1c] text-white text-[6px] font-extrabold py-1.5 px-2 rounded-md uppercase tracking-wider text-center leading-normal font-sans">
        ENGINEERING | ARCHITECTURE | MANAGEMENT | ARTS & SCIENCE | LAW
      </div>

      {/* Footer reference location */}
      <div className="text-[6.5px] text-gray-500 font-bold text-center tracking-widest mt-0.5">
        CHENNAI • SRIPERUMBUDUR
      </div>

    </div>
  );
}

interface AdBannerProps {
  position?: 'leaderboard' | 'sidebar' | 'rectangle' | 'holiday' | 'astrology';
}

export default function AdBanner({ position = 'leaderboard' }: AdBannerProps) {
  if (position === 'holiday') {
    return null;
  }

  if (position === 'astrology') {
    return <AstrologyAd />;
  }

  if (position === 'sidebar') {
    return <SathyabamaAd />;
  }

  if (position === 'rectangle') {
    return (
      <div className="w-full h-[65px] bg-[#111111] border border-gray-800 rounded-md flex items-center justify-center p-3 select-none">
        <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
          వ్యాపార ప్రకటన (Leaderboard Ad)
        </span>
      </div>
    );
  }

  // default / leaderboard
  return (
    <div className="w-full h-[80px] bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center p-3 select-none my-2">
      <span 
        className="text-[10px] uppercase font-bold text-gray-400 tracking-wider telugu-text" 
        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
      >
        వ్యాపార ప్రకటన (Leaderboard Ad)
      </span>
    </div>
  );
}
