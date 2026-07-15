'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/home/AdBanner';
import PollWidget from '@/components/home/PollWidget';
import { politicsNews, featuredNews, getMergedArticles, tgDistricts, apDistricts } from '@/lib/mockData';

// Categories where sidebar shows ALL mixed news (not filtered by category)
const MIXED_CATEGORIES = new Set(['latest', 'home', '']);

interface RightSidebarProps {
  categorySlug?: string; // If provided and not in MIXED_CATEGORIES, shows filtered news
}

export default function RightSidebar({ categorySlug }: RightSidebarProps) {
  const [trendingList, setTrendingList] = useState<any[]>([]);
  const [breakingList, setBreakingList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customSidebarAds, setCustomSidebarAds] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategoryAds = async () => {
      try {
        const adCat = categorySlug ? `sidebar-ad-category-${categorySlug}` : 'sidebar-ad-category';
        const [catRes, defaultRes, bothRes] = await Promise.all([
          fetch(`/api/articles?category=${adCat}&limit=50&t=` + Date.now()).then(r => r.json()),
          categorySlug ? fetch('/api/articles?category=sidebar-ad-category&limit=50&t=' + Date.now()).then(r => r.json()) : Promise.resolve([]),
          fetch('/api/articles?category=sidebar-ad-both&limit=50&t=' + Date.now()).then(r => r.json())
        ]);
        
        let combined = [];
        const activeCatAds = Array.isArray(catRes) ? catRes.filter((ad: any) => ad.category === 'active') : [];
        const activeBothAds = Array.isArray(bothRes) ? bothRes.filter((ad: any) => ad.category === 'active') : [];
        const activeDefaultAds = Array.isArray(defaultRes) ? defaultRes.filter((ad: any) => ad.category === 'active') : [];
        
        if (activeCatAds.length > 0) {
          combined = [...activeCatAds, ...activeBothAds];
        } else {
          combined = [...activeDefaultAds, ...activeBothAds];
        }
        
        setCustomSidebarAds(combined);
      } catch (err) {
        console.error("Error loading category sidebar ads:", err);
      }
    };
    fetchCategoryAds();
  }, [categorySlug]);

  const initialDistrict = categorySlug?.startsWith('district-') ? categorySlug.replace('district-', '') : '';
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);

  useEffect(() => {
    const init = categorySlug?.startsWith('district-') ? categorySlug.replace('district-', '') : '';
    setSelectedDistrict(init);
  }, [categorySlug]);

  const currentDistrictSlug = selectedDistrict || (categorySlug?.startsWith('district-') ? categorySlug.replace('district-', '') : '');
  const activeCat = currentDistrictSlug ? `district-${currentDistrictSlug}` : (categorySlug || 'home');
  const filterByCategory = activeCat !== 'home' && activeCat !== 'latest' && activeCat !== 'photos' && activeCat !== 'webstories' && activeCat !== 'shorts';

  // For district-specific slugs (district-adilabad, district-hyderabad, etc.) derive the real API category
  const isDistrictSlug = activeCat.startsWith('district-');
  const districtSlugValue = isDistrictSlug ? activeCat.replace('district-', '') : '';
  const apiCat = activeCat === 'telangana-districts' ? 'telangana'
    : activeCat === 'andhra-pradesh-districts' ? 'andhra-pradesh'
    : isDistrictSlug
    ? (tgDistricts.some(d => d.slug === districtSlugValue) ? 'telangana' : 'andhra-pradesh')
    : activeCat;

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();

    const fetchCategoryNews = async () => {
      try {
        const isHomeInherited = apiCat === 'home' || apiCat === 'latest' || apiCat === 'photos' || apiCat === 'webstories' || apiCat === 'shorts';
        let trendUrl = `/api/articles?category=${apiCat}&limit=12`;
        if (isHomeInherited) {
          trendUrl = `/api/articles?category=trending&limit=15`;
        }

        const [trendRes, breakRes, settingsRes] = await Promise.all([
          fetch(trendUrl, { signal: controller.signal }),
          fetch(`/api/articles?category=latest&limit=15`, { signal: controller.signal }),
          fetch(`/api/settings?key=sidebar_category_pins`, { signal: controller.signal }),
        ]);

        if (!trendRes.ok || !breakRes.ok) throw new Error('Fetch failed');

        const [allCatArticles, allBreaking, settingsData] = await Promise.all([
          trendRes.json(),
          breakRes.json(),
          settingsRes.ok ? settingsRes.json() : ({} as any),
        ]);

        // Filter breaking news to this category
        const catBreaking = apiCat === 'home' || apiCat === 'latest'
          ? allBreaking
          : allBreaking.filter((a: any) => a.categorySlug === apiCat);

        // Load custom sidebar configuration pins strictly from the database settings
        let pinnedTrendingIds: string[] = [];
        let pinnedBreakingIds: string[] = [];
        try {
          const savedPins = settingsData.sidebar_category_pins;
          if (savedPins) {
            const parsed = typeof savedPins === 'string' ? JSON.parse(savedPins) : savedPins;
            // Read from activeCat (e.g. telangana-districts) and also base slug (e.g. telangana)
            const isDistrict = activeCat.startsWith('district-') || activeCat.endsWith('-districts');
            const isHomeInherited = activeCat === 'photos' || activeCat === 'webstories' || activeCat === 'shorts';
            const lookupCat = isHomeInherited ? 'home' : activeCat;
            const lookupApiCat = isHomeInherited ? 'home' : apiCat;
            const catPins = parsed[lookupCat] || { trending: [], breaking: [] };
            const basePins = (lookupCat !== lookupApiCat && !isDistrict) ? (parsed[lookupApiCat] || { trending: [], breaking: [] }) : { trending: [], breaking: [] };
            // Merge and deduplicate
            pinnedTrendingIds = [
              ...(catPins.trending || []).map(String),
              ...(basePins.trending || []).map(String),
            ].filter((id, idx, arr) => arr.indexOf(id) === idx);
            pinnedBreakingIds = [
              ...(catPins.breaking || []).map(String),
              ...(basePins.breaking || []).map(String),
            ].filter((id, idx, arr) => arr.indexOf(id) === idx);
          }
        } catch (err) {
          console.error("Error reading sidebar_category_pins in sidebar", err);
        }

        // Fetch any missing pinned articles by ID from /api/articles/[id]
        const missingIds = new Set<string>();
        pinnedTrendingIds.forEach(id => missingIds.add(id));
        pinnedBreakingIds.forEach(id => missingIds.add(id));
        
        // Remove IDs that are already present in allCatArticles or allBreaking
        const existingArticles = [...allCatArticles, ...allBreaking];
        existingArticles.forEach((a: any) => {
          missingIds.delete(String(a.id));
        });

        // Fetch remaining missing articles in parallel
        const missingArticlesList: any[] = [];

        if (missingIds.size > 0) {
          const fetchPromises = Array.from(missingIds).map(async (id) => {
            try {
              const res = await fetch(`/api/articles/${id}`, { signal: controller.signal });
              if (res.ok) {
                const fetched = await res.json();
                return fetched;
              }
            } catch (err) {
              console.error(`Error fetching pinned article ${id}`, err);
            }
            return null;
          });
          const fetchedMissing = await Promise.all(fetchPromises);
          fetchedMissing.forEach(a => {
            if (a) missingArticlesList.push(a);
          });
        }
        
        // Combine them all
        const lookupMap = new Map<string, any>();
        [...allCatArticles, ...allBreaking, ...missingArticlesList].forEach((a: any) => {
          lookupMap.set(String(a.id), a);
        });

        // Resolve trending list: ONLY show pinned articles
        let finalTrending = pinnedTrendingIds.map(id => lookupMap.get(id)).filter(Boolean);

        // Resolve breaking list: ONLY show pinned articles
        let finalBreaking = pinnedBreakingIds.map(id => lookupMap.get(id)).filter(Boolean);

        // Prevent mingling: filter out district articles from state sidebar and state articles from district sidebar
        const isDistrictView = activeCat.startsWith('district-') || activeCat.endsWith('-districts');
        if (isDistrictView) {
          finalTrending = finalTrending.filter((a: any) => a.districtSlug);
          finalBreaking = finalBreaking.filter((a: any) => a.districtSlug);
        } else if (apiCat === 'telangana' || apiCat === 'andhra-pradesh') {
          finalTrending = finalTrending.filter((a: any) => !a.districtSlug);
          finalBreaking = finalBreaking.filter((a: any) => !a.districtSlug);
        }

        const skipCategoryFiltering = apiCat === 'home' || apiCat === 'latest' || apiCat === 'photos' || apiCat === 'webstories' || apiCat === 'shorts';
        if (!skipCategoryFiltering && !isDistrictView) {
          finalTrending = finalTrending.filter((a: any) => a.categorySlug === apiCat);
          finalBreaking = finalBreaking.filter((a: any) => a.categorySlug === apiCat);
        }

        setTrendingList(finalTrending);
        setBreakingList(finalBreaking);
      } catch (e: any) {
        if (e.name === 'AbortError') return;
        console.error('Error loading category news in RightSidebar', e);
        setTrendingList([]);
        setBreakingList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryNews();
    return () => controller.abort();
  }, [categorySlug, activeCat]);

  const activeTrending = trendingList;

  // Category display name for sidebar headers
  const categoryDisplayNames: Record<string, string> = {
    'home': 'హోమ్',
    'latest': 'బ్రేకింగ్',
    'telangana': 'తెలంగాణ',
    'andhra-pradesh': 'ఆంధ్రప్రదేశ్',
    'national': 'జాతీయ',
    'international': 'వరల్డ్',
    'business': 'బిజినెస్',
    'politics': 'పాలిటిక్స్',
    'sports': 'స్పోర్ట్స్',
    'entertainment': 'ఫిల్మ్',
    'technology': 'టెక్నాలజీ',
    'health': 'ఆరోగ్యం',
    'viral': 'వైరల్',
    'women': 'ఆమె',
    'lifestyle': 'లైఫ్‌స్టైల్',
    'vidya': 'విద్య',
    'upadi': 'ఉపాధి',
    'telangana-districts': 'తెలంగాణ జిల్లాలు',
    'andhra-pradesh-districts': 'ఆంధ్రప్రదేశ్ జిల్లాలు',
    'weather': 'వాతావరణం',
  };
  const currentDistrictObj = tgDistricts.find(d => d.slug === currentDistrictSlug) || apDistricts.find(d => d.slug === currentDistrictSlug);
  const catLabel = currentDistrictObj 
    ? currentDistrictObj.name 
    : (filterByCategory ? (categoryDisplayNames[activeCat] || activeCat) : null);

  const showDistrictSelector = categorySlug === 'telangana-districts' || 
                              categorySlug === 'andhra-pradesh-districts' || 
                              categorySlug?.startsWith('district-');

  return (
    <aside className="hidden lg:flex w-full lg:col-span-3 flex-col gap-4 select-none">
      
      {/* District Selector */}
      {showDistrictSelector && (
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-2 shadow-sm text-left">
          <label className="text-xs font-bold text-gray-500 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            జిల్లా ఎంచుకోండి:
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-[#025390] text-white font-bold text-[13px] md:text-[14px] telugu-text px-3 py-2 rounded-lg cursor-pointer border-none outline-none"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            <option value="" className="bg-white text-gray-800">మొత్తం వార్తలు (All)</option>
            <optgroup label="తెలంగాణ జిల్లాలు" className="bg-white text-gray-800 font-bold">
              {tgDistricts.map(d => (
                <option key={d.slug} value={d.slug} className="bg-white text-gray-800 font-medium">{d.name}</option>
              ))}
            </optgroup>
            <optgroup label="ఆంధ్రప్రదేశ్ జిల్లాలు" className="bg-white text-gray-800 font-bold">
              {apDistricts.map(d => (
                <option key={d.slug} value={d.slug} className="bg-white text-gray-800 font-medium">{d.name}</option>
              ))}
            </optgroup>
          </select>
        </div>
      )}

      {/* Ads on top of Trending News (First 2 ads) */}
      {customSidebarAds.slice(0, 2).map((ad) => (
        <a
          key={ad.id}
          href={ad.body || '#'}
          target={ad.body ? '_blank' : '_self'}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!ad.body) e.preventDefault();
          }}
          className="w-full overflow-hidden rounded-xl border border-slate-200/80 hover:shadow transition-shadow duration-200 block"
        >
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-auto object-cover block"
          />
        </a>
      ))}

      {/* 4. Trending News Widget (ట్రెండింగ్ వార్తలు) */}
      {!(categorySlug === 'uma-insights' || categorySlug === 'satya-bytes') && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-left">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
            <div className="w-1.5 h-6 bg-[#e60000] rounded-full"></div>
            <h3 className="font-black text-gray-900 text-[18px] md:text-[20px] pl-1 leading-normal telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              {catLabel ? `${catLabel} ట్రెండింగ్` : 'ట్రెండింగ్ వార్తలు'}
            </h3>
          </div>

          {isLoading ? (
            <div className="space-y-3.5">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 animate-pulse">
                  <div className="w-20 h-14 flex-shrink-0 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3.5">
              {activeTrending.map((article, idx) => {
                const cleanTitle = article.title ? article.title.replace(/<[^>]*>/g, '').trim() : '';
                return (
                  <Link
                    key={`${article.id}-${idx}`}
                    href={`/news/${article.slug}`}
                    className="flex items-start gap-3 pb-3 last:pb-0 last:border-b-0 border-b border-gray-55 group cursor-pointer"
                  >
                    {/* Image thumbnail */}
                    <div className="w-20 h-14 flex-shrink-0 overflow-hidden rounded bg-gray-100 border border-gray-150 relative">
                      <img
                        src={article.image}
                        alt={cleanTitle}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                      />
                    </div>
                    {/* Text */}
                    <div className="min-w-0 flex-1 py-0.5">
                      <h4
                        className="text-[14.5px] md:text-[15.5px] font-bold text-gray-800 group-hover:text-[#02599c] transition-colors leading-relaxed telugu-text line-clamp-2 pl-1.5 pb-0.5"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      >
                        {cleanTitle}
                      </h4>
                      <span className="text-[12px] text-gray-400 mt-0.5 block"></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Ads between Trending News and Polls (Next 2 ads) */}
      {customSidebarAds.slice(2, 4).map((ad) => (
        <a
          key={ad.id}
          href={ad.body || '#'}
          target={ad.body ? '_blank' : '_self'}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!ad.body) e.preventDefault();
          }}
          className="w-full overflow-hidden rounded-xl border border-slate-200/80 hover:shadow transition-shadow duration-200 block"
        >
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-auto object-cover block"
          />
        </a>
      ))}

      {/* Ads after Polls (Remaining ads continuously) */}
      {customSidebarAds.slice(4).map((ad) => (
        <a
          key={ad.id}
          href={ad.body || '#'}
          target={ad.body ? '_blank' : '_self'}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!ad.body) e.preventDefault();
          }}
          className="w-full overflow-hidden rounded-xl border border-slate-200/80 hover:shadow transition-shadow duration-200 block"
        >
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-auto object-cover block"
          />
        </a>
      ))}

      {/* Poll Widget at the end */}
      <PollWidget scope="general" />

    </aside>
  );
}
