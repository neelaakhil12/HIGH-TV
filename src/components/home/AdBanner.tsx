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

// 2. Sidebar: Apollo Hospitals Ad (Replaces Astrology Purple Banner)
export function AstrologyAd() {
  return (
    <div className="w-full h-auto py-3.5 bg-gradient-to-r from-[#0284c7] to-[#0369a1] border border-[#0284c7]/30 rounded-lg flex items-center justify-between px-5 select-none overflow-hidden relative shadow-sm cursor-pointer hover:shadow transition-shadow">
      {/* Left part: medical cross symbol icon */}
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
        </svg>
      </div>

      {/* Right part: text details */}
      <div className="flex-1 text-right flex flex-col justify-center pl-4 z-10">
        <h4 className="text-white font-extrabold text-[15px] font-sans">
          Apollo Hospitals
        </h4>
        <span className="text-amber-350 font-bold text-[10.5px] mt-0.5 font-sans leading-none uppercase">
          24/7 Emergency Care
        </span>
        <span className="text-white/80 font-medium text-[8px] mt-1 font-sans">
          📞 Call 1066 for Ambulance
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
    <div className="w-full h-auto bg-[#0f172a] border border-amber-500/20 rounded-lg flex flex-col gap-3.5 p-4 select-none overflow-hidden relative shadow-md">
      
      {/* Tiny Google Adchoices icon */}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 opacity-20 hover:opacity-100 transition-opacity z-10">
        <svg className="w-2.5 h-2.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>

      {/* Header: Tanishq Logo */}
      <div className="flex items-center gap-1.5 justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-4.5 h-4.5 rounded-full bg-amber-500 text-slate-955 text-[8px] font-black flex items-center justify-center border border-white">
            T
          </div>
          <span className="text-[9px] font-extrabold text-white tracking-widest font-sans">TANISHQ</span>
        </div>
        <div className="bg-[#b45309] text-white text-[5.5px] font-extrabold px-1.5 py-0.5 rounded leading-none uppercase font-sans">
          TATA Enterprise
        </div>
      </div>

      {/* Headline & Body */}
      <div className="text-left leading-tight">
        <h4 className="text-[12.5px] font-black text-amber-400 tracking-wide font-sans">
          The Festival of Gold
        </h4>
        <p className="text-[8px] text-gray-300 mt-1 font-sans leading-relaxed">
          Flat 20% OFF on making charges of Gold and Diamond Jewellery.<br />
          <span className="text-white font-bold">Offer Valid at All Outlets.</span>
        </p>
      </div>

      {/* Center Image: Jewellery Model */}
      <div className="w-full h-[110px] rounded-lg overflow-hidden relative border border-slate-900 bg-slate-950">
        <img
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=120&fit=crop"
          alt="Tanishq Jewellery"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 to-transparent"></div>
        <div className="absolute bottom-1.5 left-2">
          <span className="text-[7px] text-white font-extrabold uppercase font-sans tracking-wide">Pure Gold & Diamonds</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="bg-[#b45309] hover:bg-[#9a4407] text-white text-[7.5px] font-black py-1.5 px-2 rounded-md uppercase tracking-wider text-center leading-normal font-sans cursor-pointer transition-colors">
        Explore Collection • Visit Store
      </div>

      {/* Footer reference location */}
      <div className="text-[6.5px] text-gray-500 font-bold text-center tracking-widest uppercase">
        Tata Product • 916 Hallmark Certified
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
    <div className="w-full h-auto bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#78350f] border border-amber-600/40 rounded-lg flex flex-col select-none overflow-hidden relative shadow-md">
      
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300" />

      {/* Adchoices */}
      <div className="absolute top-2.5 right-2 opacity-25 hover:opacity-100 transition-opacity z-10">
        <svg className="w-2.5 h-2.5 text-amber-200" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Logo row */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-sm border border-amber-300">
            <svg className="w-4 h-4 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93C9.33 17.79 7 14.5 7 11V7.18L12 5z"/>
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-black text-amber-200 tracking-widest font-sans uppercase">Manappuram</span>
            <div className="text-[7px] text-amber-300/80 font-bold font-sans tracking-wide uppercase leading-none">Gold Loan</div>
          </div>
          <div className="ml-auto bg-amber-400/20 text-amber-200 text-[5.5px] font-black px-1.5 py-0.5 rounded border border-amber-400/30 leading-none uppercase">
            SPONSORED
          </div>
        </div>

        {/* Headline */}
        <div className="text-left">
          <h4 className="text-[14px] font-black text-amber-300 leading-tight font-sans tracking-tight">
            బంగారు రుణం
          </h4>
          <p
            className="text-[9px] text-amber-100/90 font-bold font-sans mt-0.5 leading-relaxed telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            30 నిమిషాల్లో నగదు పొందండి — కనిష్ట వడ్డీ రేటుతో!
          </p>
        </div>

        {/* Image */}
        <div className="w-full h-[100px] rounded-lg overflow-hidden relative border border-amber-800/60 bg-amber-950">
          <img
            src="https://images.unsplash.com/photo-1610375228911-c4abdd9c17cc?w=300&h=100&fit=crop"
            alt="Gold Jewellery"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#78350f]/70 to-transparent" />
          <div className="absolute bottom-1.5 left-2.5">
            <span className="text-[7px] text-amber-200 font-extrabold font-sans uppercase tracking-wider">916 Hallmark Gold Accepted</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          {[
            { label: 'Rate', value: '0.79%' },
            { label: 'Time', value: '30 Min' },
            { label: 'LTV', value: 'Up to 75%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-black/25 rounded px-1 py-1.5 border border-amber-700/30">
              <div className="text-[9.5px] font-black text-amber-300 font-sans leading-none">{stat.value}</div>
              <div className="text-[6.5px] text-amber-200/70 font-bold font-sans mt-0.5 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="w-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-[9px] py-2 rounded-lg uppercase tracking-wider font-sans transition-colors shadow-md cursor-pointer">
          Apply Now — Free Doorstep Service
        </button>

        {/* Phone */}
        <div className="text-center text-[7px] text-amber-300/70 font-bold font-sans">
          📞 1800-4250-5555 • Toll Free 24/7
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
    </div>
  );
}

// 6. Left Column Bottom: Sri Chaitanya Coaching Ad (tall banner)
export function CoachingAd() {
  return (
    <div className="w-full h-auto bg-gradient-to-br from-[#0c1445] via-[#1a237e] to-[#0c1445] border border-blue-800/40 rounded-xl overflow-hidden select-none shadow-md relative">
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

      {/* Sponsored badge */}
      <div className="absolute top-2.5 left-3 bg-black/40 text-amber-300 text-[6px] font-black px-1.5 py-0.5 rounded leading-none uppercase">
        SPONSORED
      </div>

      {/* Hero image */}
      <div className="w-full h-[130px] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=130&fit=crop"
          alt="Sri Chaitanya Students"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1445] via-[#0c1445]/50 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-black text-blue-950 border-2 border-white/30 flex-shrink-0">
              SC
            </div>
            <div>
              <div className="text-white font-black text-[13px] font-sans tracking-wide leading-none">Sri Chaitanya</div>
              <div className="text-amber-300 font-bold text-[8px] font-sans tracking-widest uppercase">Educational Institutions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Headline */}
        <div>
          <h4
            className="text-[15px] font-black text-amber-300 leading-snug font-sans"
          >
            IIT · NEET · JEE
          </h4>
          <p
            className="text-[10px] text-blue-100 font-bold mt-1 telugu-text leading-relaxed"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            టాప్ ర్యాంకుల కోసం శ్రీ చైతన్యలో చేరండి — 35+ సంవత్సరాల అనుభవం
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: '35+', label: 'Years' },
            { val: '5L+', label: 'Alumni' },
            { val: '98%', label: 'Success' },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-lg py-2 text-center border border-white/10">
              <div className="text-[12px] font-black text-amber-300 font-sans">{s.val}</div>
              <div className="text-[7px] text-blue-200 font-bold font-sans uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div className="flex flex-wrap gap-1.5">
          {['IIT-JEE', 'NEET', 'EAMCET', 'Olympiad', 'Foundation'].map((c) => (
            <span key={c} className="bg-blue-900/60 border border-blue-700/50 text-blue-100 text-[8px] font-bold px-2 py-0.5 rounded-full font-sans">
              {c}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button className="w-full bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-[10px] py-2.5 rounded-lg uppercase tracking-wider font-sans transition-colors shadow cursor-pointer">
          Enroll Now — Free Counselling
        </button>

        {/* Phone */}
        <div className="text-center text-[7.5px] text-blue-300/80 font-bold font-sans">
          📞 1800-599-2233 • Hyderabad | Vijayawada | Warangal
        </div>
      </div>

      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
    </div>
  );
}

interface AdBannerProps {
  position?: 'leaderboard' | 'sidebar' | 'rectangle' | 'holiday' | 'astrology' | 'skyscraper-left' | 'skyscraper-right' | 'gold-loan' | 'coaching';
}

export default function AdBanner({ position = 'leaderboard' }: AdBannerProps) {
  if (position === 'leaderboard') {
    return null;
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

  if (position === 'gold-loan') {
    return <GoldLoanAd />;
  }

  if (position === 'rectangle') {
    return (
      <div className="w-full h-auto min-h-[120px] py-4 bg-gradient-to-r from-[#4c0519] to-[#881337] border border-rose-900 rounded-lg flex items-center justify-between p-4 select-none relative overflow-hidden text-left shadow-sm group hover:border-rose-800 transition-colors">
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
    );
  }

  // default / leaderboard: Serene City Horizontal Leaderboard Ad
  return (
    <div className="w-full h-auto min-h-[90px] py-2.5 bg-gradient-to-r from-[#022c22] via-[#047857] to-[#022c22] border border-emerald-800 rounded-lg flex items-center justify-between px-5 select-none my-2 relative overflow-hidden group shadow-sm">
      
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
  );
}
