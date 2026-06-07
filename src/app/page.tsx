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
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-xs mb-4 select-none">
      <h3 className="font-extrabold text-gray-900 text-lg mb-4 text-left tracking-tight font-sans">
        High TV Videos
      </h3>
      
      <div className="space-y-4">
        {videos.map((vid) => (
          <div key={vid.id} className="flex flex-col text-left group">
            {/* Thumbnail with Play Overlay */}
            <div 
              onClick={() => setSelectedVideo(vid.id)}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group mb-2 shadow-xs border border-gray-150 bg-black/5"
            >
              <img 
                src={vid.thumbnail} 
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
              />
              {/* Red play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                <div className="w-11 h-11 bg-red-650 rounded-full flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-5 h-5 fill-white text-white ml-0.5" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Title */}
            <h4 
              onClick={() => setSelectedVideo(vid.id)}
              className="text-[12.5px] font-black text-gray-800 leading-snug hover:text-red-600 transition-colors cursor-pointer telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {vid.title}
            </h4>
            
            <div className="border-b border-gray-100 mt-4 last:border-0"></div>
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
      <main className="max-w-[1005px] mx-auto bg-white px-4 py-5 shadow-md border-x border-gray-200">
        
        {/* Flash News Strip */}
        <FlashNewsBar />
        
        {/* Main Content Layout with 68% Left, 30% Right and 2% Gap */}
        <div className="flex flex-col lg:flex-row justify-between gap-[2%]">
          
          {/* Main Area (68%) */}
          <div className="w-full lg:w-[68%] flex-shrink-0">
            
            {/* Hero Slider is placed in the left column matching the screenshot */}
            <HeroSlider />

            {/* Regional Shortcut Buttons Row */}
            <div className="grid grid-cols-3 gap-2 my-4">
              <Link 
                href="/category/andhra-pradesh?view=districts" 
                className="bg-[#e60000] hover:bg-[#c80000] text-white font-black py-2 md:py-2.5 px-1 md:px-2 rounded text-center text-[10px] md:text-[11px] lg:text-xs transition-colors shadow-xs telugu-text flex items-center justify-center"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                ఆంధ్రప్రదేశ్ జిల్లాల వార్తలు
              </Link>
              <Link 
                href="/category/telangana?view=districts" 
                className="bg-[#02599c] hover:bg-[#02487e] text-white font-black py-2 md:py-2.5 px-1 md:px-2 rounded text-center text-[10px] md:text-[11px] lg:text-xs transition-colors shadow-xs telugu-text flex items-center justify-center"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                తెలంగాణ జిల్లాల వార్తలు
              </Link>
              <Link 
                href="/category/latest" 
                className="bg-[#5c2d91] hover:bg-[#4a2078] text-white font-black py-2 md:py-2.5 px-1 md:px-2 rounded text-center text-[10px] md:text-[11px] lg:text-xs transition-colors shadow-xs flex items-center justify-center gap-1 md:gap-1.5"
              >
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5 bg-white text-purple-700 rounded-full p-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.92 1 1 5.92 1 12s4.92 11 11.24 11c6.6 0 11-4.606 11-11 0-.743-.08-1.31-.178-1.715H12.24z"/>
                </svg>
                <span className="font-sans font-extrabold text-[9px] md:text-[11px]">Select Eenadu Now</span>
              </Link>
            </div>


            {/* Breaking News Marquee */}
            <BreakingNewsSection />
            
            {/* Dynamic Tabbed News Section */}
            <TabbedNewsWidget
              apNews={apNews}
              tgNews={tgNews}
              editorialNews={editorialNews}
              devotionalNews={devotionalNews}
            />

            {/* Editorial Cartoon "ఇదీ సంగతి" */}
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

            {/* Trending Section */}
            <TrendingSection />

            {/* Politics */}
            <NewsSection
              title="Politics"
              titleTelugu="రాజకీయాలు"
              articles={politicsNews}
              viewAllLink="/category/politics"
              accentColor="#02599c"
              layout="featured-left"
            />

            {/* Entertainment */}
            <NewsSection
              title="Entertainment"
              titleTelugu="సినిమా"
              articles={entertainmentNews}
              viewAllLink="/category/entertainment"
              accentColor="#db2777"
              layout="grid4"
            />

            {/* Sports */}
            <NewsSection
              title="Sports"
              titleTelugu="క్రీడలు"
              articles={sportsNews}
              viewAllLink="/category/sports"
              accentColor="#ea580c"
              layout="featured-left"
            />

            {/* Mid Ad */}
            <AdBanner position="rectangle" />

            {/* Business + Tech side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <NewsSection
                title="Business"
                titleTelugu="వ్యాపారం"
                articles={businessNews}
                viewAllLink="/category/business"
                accentColor="#15803d"
                layout="list"
              />
              <NewsSection
                title="Technology"
                titleTelugu="టెక్నాలజీ"
                articles={technologyNews}
                viewAllLink="/category/technology"
                accentColor="#02599c"
                layout="list"
              />
            </div>

            {/* Viral + Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <NewsSection
                title="Viral"
                titleTelugu="వైరల్"
                articles={viralNews}
                viewAllLink="/category/viral"
                accentColor="#dc2626"
                layout="list"
              />
              <NewsSection
                title="Health"
                titleTelugu="ఆరోగ్యం"
                articles={healthNews}
                viewAllLink="/category/health"
                accentColor="#0891b2"
                layout="list"
              />
            </div>

            {/* Rasipalalu */}
            <NewsSection
              title="Horoscopes"
              titleTelugu="రాశిఫలాలు"
              articles={rasipalaluNews}
              viewAllLink="/category/rasipalalu"
              accentColor="#b45309"
              layout="grid3"
            />

            {/* Video News */}
            <VideoSection />

            {/* Photo Gallery */}
            <PhotoGallery />
          </div>

          {/* Sidebar Area (30%) */}
          <aside className="w-full lg:w-[30%] flex-shrink-0 space-y-5">
            
            {/* Sidebar Breaking News Alert Box */}
            <SidebarBreakingAlert />

            {/* Sidebar Latest Videos YouTube Widget (Replaces Headlines List) */}
            <SidebarLatestVideos />

            {/* Purple Astrology Banner */}
            <AdBanner position="astrology" />

            {/* Sidebar Ad (Sathyabama University) */}
            <AdBanner position="sidebar" />

            {/* Most Read */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-brand-blue px-4 py-3">
                <h3 className="text-white font-black text-base telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  అత్యధికంగా చదివినవి
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {featuredNews.map((article, index) => (
                  <div key={article.id} className="flex gap-3 p-3 hover:bg-blue-50 transition-colors group">
                    <span className="flex-shrink-0 w-7 h-7 bg-brand-blue text-white text-xs font-black rounded flex items-center justify-center">
                      {index + 1}
                    </span>
                    <Link href={`/news/${article.slug}`} className="flex-1">
                      <p
                        className="text-xs font-semibold text-gray-700 group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      >
                        {article.title}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-black text-gray-800 text-base mb-3 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                ట్రెండింగ్ ట్యాగ్స్
              </h3>
              <div className="flex flex-wrap gap-2">
                {['రాజకీయాలు', 'ఆంధ్రప్రదేశ్', 'తెలంగాణ', 'క్రికెట్', 'సినిమా', 'AI', 'బడ్జెట్', 'వరదలు', 'IPL', 'మెట్రో', 'వ్యాపారం', 'ఆరోగ్యం'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${tag}`}
                    className="text-xs bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-600 px-3 py-1.5 rounded-full transition-colors font-medium telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Follow Box */}
            <div className="bg-brand-blue rounded-xl p-4 text-white">
              <h3 className="font-black text-lg mb-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                మాతో అనుసంధానం
              </h3>
              <p className="text-blue-100 text-xs mb-4 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                సోషల్ మీడియాలో ఈనాడును ఫాలో చేయండి
              </p>
              <div className="space-y-2">
                {[
                  { name: 'Facebook', count: '2.4L', color: '#1877f2' },
                  { name: 'Twitter', count: '85K', color: '#1da1f2' },
                  { name: 'YouTube', count: '1.2L', color: '#ff0000' },
                  { name: 'Instagram', count: '67K', color: '#e1306c' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="flex items-center justify-between bg-white/15 hover:bg-white/25 transition-colors rounded-lg px-3 py-2"
                  >
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
        <div className="max-w-[1005px] mx-auto px-4 flex items-center justify-between text-xs">
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
