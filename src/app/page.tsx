'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import HeroSlider from '@/components/home/HeroSlider';
import BreakingNewsSection from '@/components/home/BreakingNewsSection';
import WebStoriesSection from '@/components/home/WebStoriesSection';
import RightSidebar from '@/components/layout/RightSidebar';
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
  getMergedArticles,
} from '@/lib/mockData';
import Image from 'next/image';
import { X } from 'lucide-react';


function SidebarLatestVideos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<{ id: string; title: string; thumbnail: string }[]>([
    {
      id: "p_kI2pXWkAc",
      title: "దేవర పార్ట్-1 అఫీషియల్ ట్రైలర్ - జూనియర్ ఎన్టీఆర్, కొరటాల శివ",
      thumbnail: ""
    },
    {
      id: "1kVkYOS9I18",
      title: "పుష్ప-2 ది రూల్ అఫీషియల్ టీజర్ - అల్లు అర్జున్, సుకుమార్",
      thumbnail: ""
    },
    {
      id: "q6h3C_s8sSw",
      title: "గేమ్ చేంజర్ అఫీషియల్ సాంగ్ - రామ్ చరణ్, శంకర్",
      thumbnail: ""
    }
  ]);

  useEffect(() => {
    fetch('/api/latest-videos?t=' + Date.now())
      .then(res => res.ok ? res.json() : [])
      .then(dbVideos => {
        if (Array.isArray(dbVideos) && dbVideos.length > 0) {
          setVideos(dbVideos);
        }
      })
      .catch(err => {
        console.error("Error fetching latest videos:", err);
      });
  }, []);

  const getYoutubeId = (urlOrId: string) => {
    if (!urlOrId) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : urlOrId.trim();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 md:p-4 shadow-xs mb-1 md:mb-4 select-none">
      <h3 className="font-black text-[#fe0000] md:text-gray-900 text-[16px] md:text-[18px] mb-3 text-left pl-1 leading-normal telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
        హై టీవీ వీడియోస్
      </h3>
      
      <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-3.5 md:gap-0 md:space-y-4 pb-2 md:pb-0 snap-x snap-mandatory scroll-smooth hide-scrollbar">
        {videos.slice(0, 3).map((vid, idx) => {
          const ytId = getYoutubeId(vid.id);
          return (
            <div 
              key={`${vid.id}-${idx}`} 
              onClick={() => setSelectedVideo(ytId)}
              className="flex-shrink-0 w-[180px] md:w-full snap-start flex flex-col gap-2 text-left group cursor-pointer pb-0 md:pb-4 border-b-0 md:border-b border-gray-100 last:border-b-0 last:pb-0"
            >
              {/* Top: Thumbnail with Play Overlay */}
              <div 
                className="relative w-full aspect-video rounded-md overflow-hidden shadow-xs border border-gray-150 bg-black/5"
              >
                <img 
                  src={vid.thumbnail || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} 
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                />
                {/* Red play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-red-650 rounded-full flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 fill-white text-white ml-0.5" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Bottom: Title */}
              <div className="py-1.5 px-1">
                <h4 
                  className="text-[15px] md:text-[17px] font-black text-gray-800 leading-relaxed group-hover:text-red-600 transition-colors telugu-text line-clamp-2"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {vid.title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* E-Paper Promo Link */}
      <div className="hidden md:flex mt-5 pt-4 border-t border-gray-100 flex-col items-center">
        <Link
          href="/category/epaper"
          className="flex flex-col items-center group cursor-pointer select-none"
        >
          <img
            src="/epaper-logo.png"
            alt="ఈ-పేపర్ లోగో"
            className="h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-102 rounded"
          />
          <span className="text-[13px] font-black text-gray-800 group-hover:text-red-600 font-sans tracking-widest uppercase mt-1.5 transition-colors">
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

// Local helper component for Latest News (బ్రేకింగ్ న్యూస్) Widget
function LatestNewsFeed() {
  const [latestArticles, setLatestArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/articles?limit=500&t=' + Date.now())
      .then(res => res.json())
      .then(dbArticles => {
        if (!Array.isArray(dbArticles)) return;
        
        const mappedArticles = dbArticles.map((art: any) => ({
          ...art,
          content: art.body || '',
        }));

        const getMergedList = (staticList: any[], categorySlug?: string) => {
          const dbFiltered = mappedArticles.filter(art => {
            if (categorySlug) {
              return art.categorySlug === categorySlug || (categorySlug === 'latest' && art.isBreaking);
            }
            return true;
          });
          const dbIds = new Set(dbFiltered.map(a => a.id));
          const filteredStatic = staticList.filter(a => !dbIds.has(a.id));
          return [...dbFiltered, ...filteredStatic];
        };

        const mergedP = getMergedList(politicsNews, 'politics');
        const mergedS = getMergedList(sportsNews, 'sports');
        const mergedB = getMergedList(businessNews, 'business');
        const mergedT = getMergedList(technologyNews, 'technology');
        
        const all = [...mergedP, ...mergedS, ...mergedB, ...mergedT]
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, 12);
        setLatestArticles(all);
      })
      .catch(e => {
        console.error('Error in LatestNewsFeed:', e);
      });
  }, []);

  return (
    <div className="flex flex-col h-full select-none">
      {/* Centered Heading with Red Lines */}
      <div className="flex items-center justify-between border-b border-gray-150 pb-2.5 mb-3">
        <div className="w-full text-center relative">
          <span 
            className="bg-white px-3 text-[#fe0000] font-black text-base z-10 relative telugu-text" 
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            బ్రేకింగ్ న్యూస్
          </span>
          <div className="absolute inset-y-1/2 left-0 right-0 border-t border-[#fe0000]/20 -z-0"></div>
        </div>
      </div>
      
      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[440px] hide-scrollbar text-left">
        {latestArticles.map((article, idx) => (
          <Link 
            href={`/news/${article.slug}`} 
            key={`${article.id}-${idx}`} 
            className="flex items-start gap-2 group cursor-pointer"
          >
            <span className="text-gray-400 mt-1 flex-shrink-0 text-[10px]">▪</span>
            <p 
              className="flex-1 min-w-0 text-[14px] font-bold text-gray-800 leading-normal group-hover:text-[#02599c] transition-colors telugu-text" 
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              dangerouslySetInnerHTML={{ __html: article.title }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [politicsList, setPoliticsList] = useState(politicsNews);
  const [sportsList, setSportsList] = useState(sportsNews);
  const [entertainmentList, setEntertainmentList] = useState(entertainmentNews);
  const [businessList, setBusinessList] = useState(businessNews);
  const [technologyList, setTechnologyList] = useState(technologyNews);
  const [viralList, setViralList] = useState(viralNews);
  const [healthList, setHealthList] = useState(healthNews);
  const [featuredList, setFeaturedList] = useState(featuredNews);
  const [rasipalaluList, setRasipalaluList] = useState(rasipalaluNews);
  const [districtList, setDistrictList] = useState(districtNews);
  const [adyathmikamList, setAdyathmikamList] = useState(adyathmikamNews);
  const [dbArticles, setDbArticles] = useState<any[]>([]);
  const [dbShorts, setDbShorts] = useState<any[]>([]);

  const homepageShorts = useMemo(() => {
    return dbShorts;
  }, [dbShorts]);

  const homepagePhotos = useMemo(() => {
    return dbArticles.filter(art => art.categorySlug === 'photos');
  }, [dbArticles]);

  const [trendingList, setTrendingList] = useState<any[]>(featuredNews.filter((n) => n.isTrending));
  const [activeRegionalFeed, setActiveRegionalFeed] = useState<'default' | 'tg' | 'ap'>('default');

  useEffect(() => {
    // 1. Fetch main news feed (excluding body, limit 150)
    fetch('/api/articles?limit=150&excludeBody=true&t=' + Date.now())
      .then(res => res.json())
      .then(dbArticlesData => {
        if (!Array.isArray(dbArticlesData)) return;
        
        const mappedArticles = dbArticlesData.map((art: any) => ({
          ...art,
          content: art.body || '',
        }));

        setDbArticles(mappedArticles);

        const getMergedList = (staticList: any[], categorySlug?: string) => {
          const dbFiltered = mappedArticles.filter(art => {
            if (categorySlug) {
              return art.categorySlug === categorySlug || (categorySlug === 'latest' && art.isBreaking);
            }
            return true;
          });
          const dbIds = new Set(dbFiltered.map(a => a.id));
          const filteredStatic = staticList.filter(a => !dbIds.has(a.id));
          return [...dbFiltered, ...filteredStatic];
        };

        setPoliticsList(getMergedList(politicsNews, 'politics'));
        setSportsList(getMergedList(sportsNews, 'sports'));
        setEntertainmentList(getMergedList(entertainmentNews, 'entertainment'));
        setBusinessList(getMergedList(businessNews, 'business'));
        setTechnologyList(getMergedList(technologyNews, 'technology'));
        setViralList(getMergedList(viralNews, 'viral'));
        setHealthList(getMergedList(healthNews, 'health'));
        setRasipalaluList(getMergedList(rasipalaluNews, 'rasipalalu'));
        setAdyathmikamList(getMergedList(adyathmikamNews, 'adyathmikam'));
        setDistrictList(getMergedList(districtNews));

        const mergedAll = getMergedList(featuredNews);
        const customFeatured = mergedAll.filter((art: any) => art.isBreaking || art.isFeatured || art.categorySlug === 'featured');
        const featuredToPrepend = customFeatured.length > 0 ? customFeatured : mergedAll.slice(0, 3);
        const featuredIds = new Set(featuredToPrepend.map((a: any) => a.id));
        const filteredFeaturedStatic = featuredNews.filter((art) => !featuredIds.has(art.id));
        setFeaturedList([...featuredToPrepend, ...filteredFeaturedStatic]);

        // Compute and set trendingList
        const customTrending = mergedAll.filter((art: any) => art.isTrending);
        setTrendingList(customTrending);
      })
      .catch(e => {
        console.error('Error loading custom articles on homepage', e);
      });

    // 2. Fetch shorts separately (includes body to play videos)
    fetch('/api/articles?category=shorts&limit=10&t=' + Date.now())
      .then(res => res.json())
      .then(dbShortsData => {
        if (Array.isArray(dbShortsData)) {
          setDbShorts(dbShortsData);
        }
      })
      .catch(e => {
        console.error('Error loading shorts on homepage', e);
      });
  }, []);

  // Filter district news for AP and Telangana tab feeds, sorted by newest first
  const apDistrictNews = districtList
    .filter((n) => n.categorySlug === 'andhra-pradesh' && n.districtSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const tgDistrictNews = districtList
    .filter((n) => n.categorySlug === 'telangana' && n.districtSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  let apStateNews = districtList
    .filter((n) => n.categorySlug === 'andhra-pradesh' && !n.districtSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  let tgStateNews = districtList
    .filter((n) => n.categorySlug === 'telangana' && !n.districtSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const adyathmikamFeed = adyathmikamList.slice(0, 5);
  const businessFeed = businessList.slice(0, 5);

  // Deduplicate featured & politics articles to prevent React duplicate key warnings in the compact grid
  const uniqueCompactArticles: any[] = [];
  const seenIds = new Set<string>();
  [...featuredList, ...politicsList].forEach((art) => {
    if (art && art.id && !seenIds.has(art.id)) {
      uniqueCompactArticles.push(art);
      seenIds.add(art.id);
    }
  });

  // Determine which list to display in the compact news grid (6 slots limit)
  let regionalArticlesList = [...apDistrictNews, ...tgDistrictNews]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);
  if (activeRegionalFeed === 'tg') {
    regionalArticlesList = tgDistrictNews.slice(0, 6);
  } else if (activeRegionalFeed === 'ap') {
    regionalArticlesList = apDistrictNews.slice(0, 6);
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <Header />

      {/* Main Newspaper Centered Container */}
      <main className="max-w-[1050px] mx-auto bg-white px-4 pt-1 md:pt-5 pb-5 shadow-md border-x border-gray-200 relative overflow-visible">
        
        {/* Flash News Strip */}
        <div className="hidden md:block">
          <FlashNewsBar />
        </div>

        {/* ONE unified 2-column layout — left content | right continuous ad column */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 mt-1 md:mt-3">

          {/* ══════════════ LEFT CONTENT COLUMN (70%) ══════════════ */}
          <div className="w-full lg:col-span-7">

            {/* Mobile Leaderboard Ad (between Flash News and HeroSlider) */}
            <div className="block md:hidden mb-1">
              <AdBanner position="leaderboard" />
            </div>

            {/* Hero 2-column grid: Slider (col-7) + Videos (col-3) */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mb-1.5 pb-2 md:mb-5 md:pb-5 border-b border-gray-100">

              {/* Hero Slider column */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <HeroSlider dbArticles={dbArticles} />

                {/* Regional Shortcut Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveRegionalFeed(activeRegionalFeed === 'tg' ? 'default' : 'tg')}
                    className={`font-black py-2 px-1 rounded text-center text-[12px] md:text-[13px] lg:text-sm transition-colors shadow-xs telugu-text flex items-center justify-center cursor-pointer select-none ${
                      activeRegionalFeed === 'tg'
                        ? 'bg-white text-[#16a34a] border-2 border-[#16a34a]'
                        : 'bg-[#16a34a] text-white hover:bg-[#15803d]'
                    }`}
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    తెలంగాణ జిల్లాల వార్తలు
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRegionalFeed(activeRegionalFeed === 'ap' ? 'default' : 'ap')}
                    className={`font-black py-2 px-1 rounded text-center text-[12px] md:text-[13px] lg:text-sm transition-colors shadow-xs telugu-text flex items-center justify-center cursor-pointer select-none ${
                      activeRegionalFeed === 'ap'
                        ? 'bg-white text-[#ea580c] border-2 border-[#ea580c]'
                        : 'bg-[#ea580c] text-white hover:bg-[#c2410c]'
                    }`}
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    ఆంధ్రప్రదేశ్ జిల్లాల వార్తలు
                  </button>
                  <Link
                    href="/category/live-updates"
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
                  {regionalArticlesList.map((article) => (
                    <Link
                      href={`/news/${article.slug}`}
                      key={article.id}
                      className="flex gap-2.5 p-2 bg-gray-50/50 hover:bg-blue-50/45 border border-gray-150 rounded-lg transition-colors group text-left"
                    >
                      <div className="w-[80px] h-[62px] relative overflow-hidden rounded-md flex-shrink-0 border border-gray-150 bg-slate-50">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0 py-1 px-1">
                        <h4
                          className="text-[16.5px] font-black text-gray-700 leading-relaxed line-clamp-3 group-hover:text-[#02599c] transition-colors telugu-text pl-2.5"
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

            {/* Mobile Ads Block 1 — single full-width ad */}
            <div className="lg:hidden flex justify-center mt-1.5 mb-4">
              <div className="w-full">
                <AdBanner position="sidebar" />
              </div>
            </div>

            {/* Breaking News */}
            <BreakingNewsSection dbArticles={dbArticles} />

            <AdBanner position="rectangle" />

            {/* Web Stories Section */}
            <WebStoriesSection />

            {/* Mobile-only Ad (Avasa Estates) */}
            <div className="lg:hidden">
              <AdBanner position="avasa-estates" />
            </div>

            {/* Dynamic Tabbed News Section */}
            <TabbedNewsWidget
              apNews={apStateNews}
              tgNews={tgStateNews}
              adyathmikamNews={adyathmikamFeed}
              businessNews={businessFeed}
            />

            {/* Mobile Ad Block 2 — single full-width square */}
            <div className="lg:hidden mt-2 mb-3.5">
              <AdBanner position="gold-loan" />
            </div>

            <WeatherWidget />

            <NewsSection title="Trending" titleTelugu="ట్రెండింగ్ వార్తలు" articles={trendingList} viewAllLink="/category/trending" accentColor="#ea580c" layout="featured-left" />

            {/* Mobile-only Ad (Lalitha Jewellery) */}
            <div className="lg:hidden">
              <AdBanner position="lalitha-jewellery" />
            </div>

            <NewsSection title="పాలిటిక్స్" titleTelugu="పాలిటిక్స్" articles={politicsList} viewAllLink="/category/politics" accentColor="#02599c" layout="featured-left" />

            {/* Mobile-only Ad (JioFiber) */}
            <div className="lg:hidden">
              <AdBanner position="jiofiber" />
            </div>
            <NewsSection title="Entertainment" titleTelugu="ఫిల్మ్" articles={entertainmentList} viewAllLink="/category/entertainment" accentColor="#db2777" layout="featured-left" />

            {/* Mobile-only Ad (Ramraj Cottons) */}
            <div className="lg:hidden">
              <AdBanner position="ramraj" />
            </div>
            <NewsSection title="Sports" titleTelugu="స్పోర్ట్స్" articles={sportsList} viewAllLink="/category/sports" accentColor="#ea580c" layout="featured-left" />


            {/* Mobile-only single full-width Ad */}
            <div className="lg:hidden flex justify-center mt-2 mb-3.5">
              <div className="w-full">
                <AdBanner position="sidebar" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <NewsSection title="Business" titleTelugu="బిజినెస్" articles={businessList} viewAllLink="/category/business" accentColor="#15803d" layout="list" />
                {/* Mobile-only Ad (SBI Home Loans) */}
                <div className="lg:hidden">
                  <AdBanner position="sbi" />
                </div>
              </div>
              <div>
                <NewsSection title="Technology" titleTelugu="టెక్నాలజీ" articles={technologyList} viewAllLink="/category/technology" accentColor="#02599c" layout="list" />
                {/* Mobile-only Ad (OnePlus 12) */}
                <div className="lg:hidden">
                  <AdBanner position="oneplus" />
                </div>
              </div>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <NewsSection title="Viral" titleTelugu="వైరల్" articles={viralList} viewAllLink="/category/viral" accentColor="#dc2626" layout="list" />
                {/* Mobile-only Ad (HDFC) */}
                <div className="lg:hidden">
                  <AdBanner position="hdfc" />
                </div>
              </div>
              <div>
                <NewsSection title="Health" titleTelugu="హెల్త్" articles={healthList} viewAllLink="/category/health" accentColor="#0891b2" layout="list" />
                {/* Mobile-only Ad (PharmEasy) */}
                <div className="lg:hidden">
                  <AdBanner position="pharmeasy" />
                </div>
              </div>
            </div>



            <VideoSection videos={homepageShorts} />
            {/* Mobile-only Dummy Ad Box */}
            <div className="lg:hidden">
              <AdBanner position="dummy" />
            </div>

            <PhotoGallery photos={homepagePhotos} />
            {/* Mobile-only Dummy Ad Box */}
            <div className="lg:hidden">
              <AdBanner position="dummy" />
            </div>
          </div>

          {/* ══════════════ RIGHT AD COLUMN (30%) — continuous, no breaks ══════════════ */}
          <RightSidebar />
        </div>
      </main>


      <Footer />
    </div>
  );
}
