'use client';

import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import HeroSlider from '@/components/home/HeroSlider';
import BreakingNewsSection from '@/components/home/BreakingNewsSection';
import TrendingSection from '@/components/home/TrendingSection';
import NewsSection from '@/components/home/NewsSection';
import VideoSection from '@/components/home/VideoSection';
import PhotoGallery from '@/components/home/PhotoGallery';
import AdBanner from '@/components/home/AdBanner';
import TabbedNewsWidget from '@/components/home/TabbedNewsWidget';
import FlashNewsBar from '@/components/home/FlashNewsBar';
import {
  politicsNews,
  entertainmentNews,
  sportsNews,
  technologyNews,
  businessNews,
  healthNews,
  viralNews,
  featuredNews,
  rasipalaluNews,
  districtNews,
} from '@/lib/mockData';
import Image from 'next/image';
import { X } from 'lucide-react';

// Local helper component for Sidebar Breaking Alert
function SidebarBreakingAlert() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="border border-red-200 rounded-md bg-red-50/10 p-3 relative select-none shadow-xs mb-4">
      <button 
        onClick={() => setVisible(false)}
        className="absolute top-1.5 right-1.5 text-red-500 hover:text-red-700 cursor-pointer p-0.5 rounded transition-colors"
        aria-label="Close alert"
      >
        <X size={13} className="stroke-[2.5]" />
      </button>
      <span 
        className="bg-[#fe0000] text-white text-[9.5px] font-black px-1.5 py-0.5 rounded uppercase leading-none inline-block mb-1.5 telugu-text"
        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
      >
        బ్రేకింగ్
      </span>
      <p 
        className="text-[12px] font-bold text-gray-800 leading-normal telugu-text text-left pr-4" 
        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
      >
        మెట్రో విస్తరణను కేంద్రమంత్రి అడ్డుకుంటున్నారు: రేవంత్‌రెడ్డి
      </p>
    </div>
  );
}

// Local helper component for Latest Videos Widget (Replaces SidebarLatestHeadlines)
function SidebarLatestVideos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const videos = [
    {
      id: "HoYsWagMFfE", // Real Jagan PA KNR Video ID
      title: "జగన్ పీఏ కేఎన్ఆర్ ఆస్తుల చిట్టా..",
      thumbnail: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=680&h=382&fit=crop"
    },
    {
      id: "Z-i7W1p0_sM", // Real Weather/Rain Video ID
      title: "తెలంగాణలో రాబోయే 2 రోజుల్లో భారీ వర్షాలు..!!",
      thumbnail: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=680&h=382&fit=crop"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "హైదరాబాద్‌లో కొత్తగా మెట్రో రైల్వే విస్తరణ పనులు ప్రారంభం",
      thumbnail: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=680&h=382&fit=crop"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "తిరుమల కొండపై రికార్డు స్థాయిలో పెరిగిన భక్తుల రద్దీ",
      thumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=680&h=382&fit=crop"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "తెలంగాణ అసెంబ్లీ బడ్జెట్ సమావేశాలు నేటి నుంచి ప్రారంభం",
      thumbnail: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=680&h=382&fit=crop"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "బంగారం ధరలు భారీగా పతనం.. కొనుగోలుదారులకు శుభవార్త",
      thumbnail: "https://images.unsplash.com/photo-1610375228911-c4abdd9c17cc?w=680&h=382&fit=crop"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-xs mb-4 select-none">
      <h3 className="font-extrabold text-gray-900 text-lg mb-3 text-left tracking-tight font-sans">
        High TV Videos
      </h3>
      
      <div className="space-y-4">
        {videos.slice(0, 3).map((vid, idx) => (
          <div 
            key={`${vid.id}-${idx}`} 
            onClick={() => setSelectedVideo(vid.id)}
            className="flex flex-col gap-2 text-left group cursor-pointer pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
          >
            {/* Top: Thumbnail with Play Overlay */}
            <div 
              className="relative w-full aspect-video rounded-md overflow-hidden shadow-xs border border-gray-150 bg-black/5"
            >
              <img 
                src={vid.thumbnail} 
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
              />
              {/* Red play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                <div className="w-10 h-10 bg-red-650 rounded-full flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-4.5 h-4.5 fill-white text-white ml-0.5" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Bottom: Title */}
            <div className="py-0.5">
              <h4 
                className="text-[14.5px] font-black text-gray-800 leading-snug group-hover:text-red-600 transition-colors telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {vid.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Video Play Modal Overlay */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/85 z-[999] flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative bg-black rounded-xl overflow-hidden w-full max-w-2xl aspect-video shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2.5 right-2.5 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 transition-colors z-20 cursor-pointer shadow-md"
              aria-label="Close video player"
            >
              <X size={16} className="stroke-[2.5]" />
            </button>
            
            {/* YouTube IFrame Embed */}
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

// Local helper component for Latest News (తాజా వార్తలు) Widget
function LatestNewsFeed() {
  const latestArticles = [...politicsNews, ...sportsNews, ...businessNews, ...technologyNews]
    .slice(0, 12);

  return (
    <div className="flex flex-col h-full select-none">
      {/* Centered Heading with Red Lines */}
      <div className="flex items-center justify-between border-b border-gray-150 pb-2.5 mb-3">
        <div className="w-full text-center relative">
          <span 
            className="bg-white px-3 text-[#fe0000] font-black text-base z-10 relative telugu-text" 
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            తాజా వార్తలు
          </span>
          <div className="absolute inset-y-1/2 left-0 right-0 border-t border-[#fe0000]/20 -z-0"></div>
        </div>
      </div>
      
      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[440px] hide-scrollbar text-left">
        {latestArticles.map((article) => (
          <Link 
            href={`/news/${article.slug}`} 
            key={article.id} 
            className="flex items-start gap-2 group cursor-pointer"
          >
            <span className="text-gray-400 mt-1 flex-shrink-0 text-[10px]">▪</span>
            <p 
              className="text-[12px] font-bold text-gray-800 leading-normal group-hover:text-[#02599c] transition-colors telugu-text" 
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {article.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  // Filter district news for AP and Telangana tab feeds
  const apNews = districtNews.filter((n) => n.categorySlug === 'andhra-pradesh');
  const tgNews = districtNews.filter((n) => n.categorySlug === 'telangana');
  const editorialNews = politicsNews.slice(0, 5);
  const devotionalNews = rasipalaluNews.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <TopBar />
      <Header />

      {/* Main Newspaper Centered Container */}
      <main className="max-w-[1200px] mx-auto bg-white px-4 py-5 shadow-md border-x border-gray-200 relative overflow-visible">
        
        {/* Flash News Strip */}
        <FlashNewsBar />

        {/* ONE unified 2-column layout — left content | right continuous ad column */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 mt-3">

          {/* ══════════════ LEFT CONTENT COLUMN (70%) ══════════════ */}
          <div className="w-full lg:col-span-7">

            {/* Hero 2-column grid: Slider (col-6) + Videos (col-3) */}
            <div className="grid grid-cols-1 lg:grid-cols-9 gap-4 mb-5 pb-5 border-b border-gray-100">

              {/* Hero Slider column */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                <HeroSlider />

                {/* Regional Shortcut Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href="/category/andhra-pradesh?view=districts"
                    className="bg-[#e60000] hover:bg-[#c80000] text-white font-black py-2 px-1 rounded text-center text-[10px] md:text-[11px] lg:text-xs transition-colors shadow-xs telugu-text flex items-center justify-center"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    ఆంధ్రప్రదేశ్ జిల్లాల వార్తలు
                  </Link>
                  <Link
                    href="/category/telangana?view=districts"
                    className="bg-[#02599c] hover:bg-[#02487e] text-white font-black py-2 px-1 rounded text-center text-[10px] md:text-[11px] lg:text-xs transition-colors shadow-xs telugu-text flex items-center justify-center"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    తెలంగాణ జిల్లాల వార్తలు
                  </Link>
                  <Link
                    href="/category/latest"
                    className="bg-[#5c2d91] hover:bg-[#4a2078] text-white font-black py-2 px-1 rounded text-center text-[10px] md:text-[11px] lg:text-xs transition-colors shadow-xs flex items-center justify-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5 bg-white text-purple-700 rounded-full p-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.92 1 1 5.92 1 12s4.92 11 11.24 11c6.6 0 11-4.606 11-11 0-.743-.08-1.31-.178-1.715H12.24z"/>
                    </svg>
                    <span className="font-sans font-extrabold text-[9px] md:text-[10px]">Select Eenadu Now</span>
                  </Link>
                </div>

                {/* Compact news grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[...featuredNews, ...politicsNews].slice(1, 7).map((article) => (
                    <Link
                      href={`/news/${article.slug}`}
                      key={article.id}
                      className="flex gap-2.5 p-2 bg-gray-50/50 hover:bg-blue-50/45 border border-gray-150 rounded-lg transition-colors group text-left"
                    >
                      <div className="w-[80px] h-[62px] relative overflow-hidden rounded-md flex-shrink-0 border border-gray-100 bg-gray-100">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <h4
                          className="text-[15px] font-black text-gray-700 leading-snug line-clamp-3 group-hover:text-[#02599c] transition-colors telugu-text"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        >
                          {article.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Videos column */}
              <div className="lg:col-span-3 border-l border-gray-100 pl-3">
                <SidebarLatestVideos />
              </div>
            </div>

            {/* Breaking News */}
            <BreakingNewsSection />

            {/* Dynamic Tabbed News Section */}
            <TabbedNewsWidget
              apNews={apNews}
              tgNews={tgNews}
              editorialNews={editorialNews}
              devotionalNews={devotionalNews}
            />

            {/* Editorial Cartoon */}
            <div className="bg-red-50/40 rounded-xl border border-red-100 p-4 mb-8">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-100">
                <div className="w-1.5 h-6 bg-brand-red rounded-full"></div>
                <h3 className="font-black text-brand-red text-base telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  ఇదీ సంగతి (Daily Cartoon)
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-1/2 relative h-48 rounded-lg overflow-hidden border border-gray-100 bg-white p-2 flex items-center justify-center">
                  <Image
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=400&fit=crop"
                    alt="ఇదీ సంగతి కార్టూన్"
                    width={300}
                    height={200}
                    className="h-full w-auto object-contain rounded"
                  />
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <p className="text-gray-700 font-black text-sm md:text-base leading-relaxed telugu-text italic" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    &ldquo;వర్షాలు వస్తే కరెంటు పోతుంది... వర్షాలు రాకపోతే నీళ్లు పోతాయి... రెండింటికీ ప్రజల ప్రాణాలు పోతాయి!&rdquo;
                  </p>
                  <span className="text-xs text-gray-400 mt-2 block font-medium">&mdash; ఈనాడు వ్యంగ్య చిత్రం</span>
                </div>
              </div>
            </div>

            <TrendingSection />

            <NewsSection title="Politics" titleTelugu="రాజకీయాలు" articles={politicsNews} viewAllLink="/category/politics" accentColor="#02599c" layout="featured-left" />
            <NewsSection title="Entertainment" titleTelugu="సినిమా" articles={entertainmentNews} viewAllLink="/category/entertainment" accentColor="#db2777" layout="grid4" />
            <NewsSection title="Sports" titleTelugu="క్రీడలు" articles={sportsNews} viewAllLink="/category/sports" accentColor="#ea580c" layout="featured-left" />

            <AdBanner position="rectangle" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <NewsSection title="Business" titleTelugu="వ్యాపారం" articles={businessNews} viewAllLink="/category/business" accentColor="#15803d" layout="list" />
              <NewsSection title="Technology" titleTelugu="టెక్నాలజీ" articles={technologyNews} viewAllLink="/category/technology" accentColor="#02599c" layout="list" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <NewsSection title="Viral" titleTelugu="వైరల్" articles={viralNews} viewAllLink="/category/viral" accentColor="#dc2626" layout="list" />
              <NewsSection title="Health" titleTelugu="ఆరోగ్యం" articles={healthNews} viewAllLink="/category/health" accentColor="#0891b2" layout="list" />
            </div>

            <NewsSection title="Horoscopes" titleTelugu="రాశిఫలాలు" articles={rasipalaluNews} viewAllLink="/category/rasipalalu" accentColor="#b45309" layout="grid3" />
            <VideoSection />
            <PhotoGallery />
          </div>

          {/* ══════════════ RIGHT AD COLUMN (30%) — continuous, no breaks ══════════════ */}
          <aside className="w-full lg:col-span-3 flex flex-col gap-4">

            {/* Top ads (previously in hero col-span-3) */}
            <SidebarBreakingAlert />
            <AdBanner position="rectangle" />
            <AdBanner position="astrology" />
            <AdBanner position="sidebar" />
            <AdBanner position="gold-loan" />
            <AdBanner position="coaching" />

            {/* Continuation ads */}
            {/* Ad: Zomato */}
            <div className="w-full bg-gradient-to-b from-[#1a0a00] via-[#7d1206] to-[#1a0a00] border border-red-900/40 rounded-xl overflow-hidden select-none shadow-md relative">
              <div className="h-1 w-full bg-gradient-to-r from-red-400 via-orange-300 to-red-400" />
              <div className="absolute top-2.5 left-3 bg-black/40 text-red-300 text-[6px] font-black px-1.5 py-0.5 rounded uppercase leading-none">SPONSORED</div>
              <div className="w-full h-[100px] relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=100&fit=crop" alt="Food" className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#7d1206]/80 to-transparent" />
              </div>
              <div className="p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-[10px] shadow-sm border border-red-300/30 flex-shrink-0">Z</div>
                  <div>
                    <div className="text-white font-black text-[12px] font-sans">Zomato</div>
                    <div className="text-red-200 text-[7px] font-bold font-sans uppercase tracking-wide">Food Delivery</div>
                  </div>
                </div>
                <h4 className="text-[13px] font-black text-red-200 leading-snug font-sans">Order Food<br />in 30 Minutes!</h4>
                <p className="text-[8.5px] text-red-100/80 font-bold font-sans leading-relaxed">Restaurants near you • Free delivery on first order</p>
                <div className="bg-red-500/30 border border-red-500/40 rounded px-2 py-1 text-center text-amber-300 font-black text-[9px] font-sans uppercase">🎉 60% OFF up to ₹120</div>
                <button className="w-full bg-red-500 hover:bg-red-400 text-white font-black text-[9px] py-2 rounded-lg uppercase tracking-wider font-sans transition-colors cursor-pointer shadow">Order Now</button>
                <div className="text-center text-[7px] text-red-300/70 font-bold font-sans">Available on App & Web • 500+ Restaurants</div>
              </div>
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
            </div>

            {/* Ad: Myntra */}
            <div className="w-full bg-gradient-to-b from-[#0d0520] via-[#3b0764] to-[#0d0520] border border-purple-800/40 rounded-xl overflow-hidden select-none shadow-md relative">
              <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-purple-300 to-pink-400" />
              <div className="absolute top-2.5 left-3 bg-black/40 text-pink-300 text-[6px] font-black px-1.5 py-0.5 rounded uppercase leading-none">SPONSORED</div>
              <div className="w-full h-[100px] relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=100&fit=crop" alt="Fashion" className="w-full h-full object-cover opacity-65" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3b0764]/80 to-transparent" />
              </div>
              <div className="p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white font-black text-[10px] shadow-sm border border-pink-300/30 flex-shrink-0">M</div>
                  <div>
                    <div className="text-white font-black text-[12px] font-sans">Myntra</div>
                    <div className="text-pink-200 text-[7px] font-bold font-sans uppercase tracking-wide">Fashion & Lifestyle</div>
                  </div>
                </div>
                <h4 className="text-[13px] font-black text-pink-200 leading-snug font-sans">End of Season<br />Sale is LIVE!</h4>
                <p className="text-[8.5px] text-purple-100/80 font-bold font-sans leading-relaxed">Upto 80% OFF on Top Brands — Levis, H&M, Puma & more</p>
                <div className="grid grid-cols-3 gap-1 text-center">
                  {['80% OFF', '5000+\nBrands', 'Free\nReturn'].map((s) => (
                    <div key={s} className="bg-white/10 rounded px-1 py-1.5 border border-white/10">
                      <div className="text-[8px] font-black text-pink-300 font-sans leading-tight whitespace-pre-line">{s}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-pink-500 hover:bg-pink-400 text-white font-black text-[9px] py-2 rounded-lg uppercase tracking-wider font-sans transition-colors cursor-pointer shadow">Shop Now</button>
                <div className="text-center text-[7px] text-purple-300/70 font-bold font-sans">Download App • Get Extra 10% OFF</div>
              </div>
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-pink-400/50 to-transparent" />
            </div>

            {/* Trending Tags */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-black text-gray-800 text-base mb-3 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ట్రెండింగ్ ట్యాగ్స్</h3>
              <div className="flex flex-wrap gap-2">
                {['రాజకీయాలు', 'ఆంధ్రప్రదేశ్', 'తెలంగాణ', 'క్రికెట్', 'సినిమా', 'AI', 'బడ్జెట్', 'వరదలు', 'IPL', 'మెట్రో', 'వ్యాపారం', 'ఆరోగ్యం'].map((tag) => (
                  <Link key={tag} href={`/search?q=${tag}`} className="text-xs bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-600 px-3 py-1.5 rounded-full transition-colors font-medium telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Follow */}
            <div className="bg-brand-blue rounded-xl p-4 text-white">
              <h3 className="font-black text-lg mb-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>మాతో అనుసంధానం</h3>
              <p className="text-blue-100 text-xs mb-4 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>సోషల్ మీడియాలో ఈనాడును ఫాలో చేయండి</p>
              <div className="space-y-2">
                {[
                  { name: 'Facebook', count: '2.4L' },
                  { name: 'Twitter', count: '85K' },
                  { name: 'YouTube', count: '1.2L' },
                  { name: 'Instagram', count: '67K' },
                ].map((social) => (
                  <a key={social.name} href="#" className="flex items-center justify-between bg-white/15 hover:bg-white/25 transition-colors rounded-lg px-3 py-2">
                    <span className="font-bold text-sm">{social.name}</span>
                    <span className="text-blue-100 text-xs">{social.count} followers</span>
                  </a>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Sticky Bottom Astrology Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 py-2 hidden md:block">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="bg-[#b5009d] text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase">ఈనాడు పంచాంగం</span>
            <span className="text-gray-700 font-medium telugu-text">శ్రీ క్రోధి నామ సంవత్సరం | ఉత్తరాయణం | గ్రీష్మ రుతువు</span>
          </div>
          <div className="flex items-center gap-6 divide-x divide-gray-100 pl-4">
            <div className="pl-4"><span className="text-[#b5009d] font-bold">తిథి:</span> <span className="text-gray-600 telugu-text">ద్వితీయ</span></div>
            <div className="pl-4"><span className="text-[#b5009d] font-bold">నక్షత్రం:</span> <span className="text-gray-600 telugu-text">మృగశిర</span></div>
            <div className="pl-4"><span className="text-[#b5009d] font-bold">రాహుకాలం:</span> <span className="text-gray-600">సాయంత్రం 4:30 - 6:00</span></div>
          </div>
          <Link href="/category/rasipalalu" className="text-brand-blue font-bold hover:underline telugu-text">
            పూర్తి రాశిఫలాలు &raquo;
          </Link>
        </div>
      </div>


      <Footer />
    </div>
  );
}
