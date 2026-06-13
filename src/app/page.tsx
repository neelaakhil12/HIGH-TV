'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import HeroSlider from '@/components/home/HeroSlider';
import BreakingNewsSection from '@/components/home/BreakingNewsSection';
import WebStoriesSection from '@/components/home/WebStoriesSection';
import RightSidebar from '@/components/layout/RightSidebar';
import TrendingSection from '@/components/home/TrendingSection';
import NewsSection from '@/components/home/NewsSection';
import VideoSection from '@/components/home/VideoSection';
import PhotoGallery from '@/components/home/PhotoGallery';
import AdBanner from '@/components/home/AdBanner';
import TabbedNewsWidget from '@/components/home/TabbedNewsWidget';
import FlashNewsBar from '@/components/home/FlashNewsBar';
import WeatherWidget from '@/components/home/WeatherWidget';
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
  adyathmikamNews,
} from '@/lib/mockData';
import Image from 'next/image';
import { X } from 'lucide-react';


// Local helper component for Latest Videos Widget (Replaces SidebarLatestHeadlines)
function SidebarLatestVideos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const videos = [
    {
      id: "p_kI2pXWkAc",
      title: "దేవర పార్ట్-1 అఫీషియల్ ట్రైలర్ - జూనియర్ ఎన్టీఆర్, కొరటాల శివ",
      thumbnail: "/hightv_breaking.png"
    },
    {
      id: "1kVkYOS9I18",
      title: "పుష్ప-2 ది రూల్ అఫీషియల్ టీజర్ - అల్లు అర్జున్, సుకుమార్",
      thumbnail: "/hightv_breaking.png"
    },
    {
      id: "q6h3C_s8sSw",
      title: "గేమ్ చేంజర్ అఫీషియల్ సాంగ్ - రామ్ చరణ్, శంకర్",
      thumbnail: "/hightv_breaking.png"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-xs mb-4 select-none">
      <h3 className="font-black text-gray-900 text-[16px] md:text-[18px] mb-3 text-left tracking-tight telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
        హై టీవీ వీడియోలు
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
                className="text-[15px] font-black text-gray-800 leading-snug group-hover:text-red-600 transition-colors telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {vid.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* E-Paper Promo Link */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col items-center">
        <Link
          href="/category/epaper"
          className="flex flex-col items-center group w-full"
        >
          {/* Logo container */}
          <div className="w-full max-w-[200px] h-[64px] bg-white hover:bg-gray-50/50 border border-gray-150 rounded-lg flex items-center justify-center p-2.5 transition-colors shadow-2xs">
            <img
              src="/epaper-logo.png"
              alt="ఈ-పేపర్ లోగో"
              className="h-10 w-auto object-contain"
            />
          </div>
          <span className="text-[13px] font-black text-gray-800 group-hover:text-red-600 font-sans tracking-widest uppercase mt-2">
            E-PAPER
          </span>
        </Link>
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
              className="text-[14px] font-bold text-gray-800 leading-normal group-hover:text-[#02599c] transition-colors telugu-text" 
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
  const adyathmikamFeed = adyathmikamNews.slice(0, 5);
  const businessFeed = businessNews.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <Header />

      {/* Main Newspaper Centered Container */}
      <main className="max-w-[1050px] mx-auto bg-white px-4 py-5 shadow-md border-x border-gray-200 relative overflow-visible">
        
        {/* Flash News Strip */}
        <FlashNewsBar />

        {/* ONE unified 2-column layout — left content | right continuous ad column */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 mt-3">

          {/* ══════════════ LEFT CONTENT COLUMN (70%) ══════════════ */}
          <div className="w-full lg:col-span-7">

            {/* Hero 2-column grid: Slider (col-7) + Videos (col-3) */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mb-5 pb-5 border-b border-gray-100">

              {/* Hero Slider column */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <HeroSlider />

                {/* Regional Shortcut Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href="/category/telangana?view=districts"
                    className="bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-2 px-1 rounded text-center text-[12px] md:text-[13px] lg:text-sm transition-colors shadow-xs telugu-text flex items-center justify-center"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    తెలంగాణ జిల్లాల వార్తలు
                  </Link>
                  <Link
                    href="/category/andhra-pradesh?view=districts"
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-black py-2 px-1 rounded text-center text-[12px] md:text-[13px] lg:text-sm transition-colors shadow-xs telugu-text flex items-center justify-center"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    ఆంధ్రప్రదేశ్ జిల్లాల వార్తలు
                  </Link>
                  <Link
                    href="/category/latest"
                    className="bg-[#5c2d91] hover:bg-[#4a2078] text-white font-black py-2 px-1 rounded text-center text-[12px] md:text-[13px] lg:text-sm transition-colors shadow-xs flex items-center justify-center gap-2 telugu-text cursor-pointer"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span>లైవ్ అప్‌డేట్స్</span>
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
                          className="text-[16.5px] font-black text-gray-700 leading-snug line-clamp-3 group-hover:text-[#02599c] transition-colors telugu-text"
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

            {/* Web Stories Section */}
            <WebStoriesSection />

            {/* Dynamic Tabbed News Section */}
            <TabbedNewsWidget
              apNews={apNews}
              tgNews={tgNews}
              adyathmikamNews={adyathmikamFeed}
              businessNews={businessFeed}
            />

            <WeatherWidget />

            <TrendingSection />

            <NewsSection title="Politics" titleTelugu="రాజకీయాలు" articles={politicsNews} viewAllLink="/category/politics" accentColor="#02599c" layout="featured-left" />
            <NewsSection title="Entertainment" titleTelugu="సినిమా" articles={entertainmentNews} viewAllLink="/category/entertainment" accentColor="#db2777" layout="featured-left" />
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
          <RightSidebar />
        </div>
      </main>


      <Footer />
    </div>
  );
}
