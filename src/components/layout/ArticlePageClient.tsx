'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BackButton from '@/components/layout/BackButton';
import ShareButton from '@/components/layout/ShareButton';
import DistrictNewsTabs from '@/components/layout/DistrictNewsTabs';
import AdBanner from '@/components/home/AdBanner';
import PollWidget from '@/components/home/PollWidget';
import { Home, ChevronRight, Clock, Calendar, ThumbsUp, TrendingUp, ArrowRight } from 'lucide-react';
import { tgDistricts, apDistricts, formatAuthorName } from '@/lib/mockData';

function FallbackImage({ src, alt, className = '', fill, width, height, ...props }: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  [key: string]: any;
}) {
  const [imgSrc, setImgSrc] = useState('/logo.png');

  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
    };
    img.onerror = () => {
      setImgSrc('/logo.png');
    };
  }, [src]);

  const isContain = className.includes('object-contain');

  if (fill) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={{ position: 'absolute', top: 0, left: 0, objectFit: isContain ? 'contain' : 'cover', width: '100%', height: '100%' }}
        {...props}
      />
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      style={{ display: 'block', ...(isContain ? { objectFit: 'contain' } : {}), ...props.style }}
      {...props}
    />
  );
}

function getCategoryLinkInfo(article: any, englishCategories: Record<string, string>) {
  const slug = article?.categorySlug || 'national';
  
  const categoryMap: Record<string, { label: string; href: string }> = {
    'latest': { label: 'Breaking News', href: '/category/latest' },
    'breaking': { label: 'Breaking News', href: '/category/latest' },
    'health': { label: 'Health News', href: '/category/health' },
    'national': { label: 'India News', href: '/category/national' },
    'india': { label: 'India News', href: '/category/national' },
    'politics': { label: 'Politics News', href: '/category/politics' },
    'entertainment': { label: 'Entertainment News', href: '/category/entertainment' },
    'sports': { label: 'Sports News', href: '/category/sports' },
    'technology': { label: 'Technology News', href: '/category/technology' },
    'business': { label: 'Business News', href: '/category/business' },
    'telangana': { label: 'Telangana News', href: '/category/telangana' },
    'andhra-pradesh': { label: 'Andhra Pradesh News', href: '/category/andhra-pradesh' },
    'international': { label: 'International News', href: '/category/international' },
    'doctors-corner': { label: "Doctor's Corner News", href: '/category/doctors-corner' },
    'viral': { label: 'Viral News', href: '/category/viral' },
    'viral-stories': { label: 'Viral News', href: '/category/viral' },
    'lifestyle': { label: 'Lifestyle News', href: '/category/lifestyle' },
    'women': { label: 'Women News', href: '/category/women' },
    'webstories': { label: 'Web Stories', href: '/category/webstories' },
    'photos': { label: 'Photo Gallery', href: '/category/photos' },
    'shorts': { label: 'Shorts News', href: '/category/shorts' },
    'sampadakiyam': { label: 'Editorial News', href: '/category/sampadakiyam' },
    'editorial': { label: 'Editorial News', href: '/category/sampadakiyam' },
    'adyathmikam': { label: 'Devotional News', href: '/category/adyathmikam' },
    'devotional': { label: 'Devotional News', href: '/category/adyathmikam' },
    'antharmadanam': { label: 'Opinion News', href: '/category/antharmadanam' },
    'rasipalalu': { label: 'Astrology News', href: '/category/rasipalalu' },
    'vidya': { label: 'Education News', href: '/category/vidya' },
    'admissions': { label: 'Admissions News', href: '/category/admissions' },
    'current-affairs': { label: 'Current Affairs News', href: '/category/current-affairs' },
    'upadi': { label: 'Employment News', href: '/category/upadi' },
    'notification': { label: 'Notification News', href: '/category/notification' },
    'citizen-reporter': { label: 'Citizen Reporter News', href: '/category/citizen-reporter' },
    'weather': { label: 'Weather News', href: '/category/weather' },
    'live-updates': { label: 'Live Updates', href: '/category/live-updates' },
    'uma-insights': { label: 'ఉమా ఇన్‌సైట్స', href: '/category/uma-insights' },
    'satya-bytes': { label: 'Satya Bytes', href: '/category/satya-bytes' }
  };

  if (categoryMap[slug]) {
    return categoryMap[slug];
  }

  const engName = englishCategories?.[slug] || article?.category || slug;
  const cleanEng = /[^\x00-\x7F]/.test(engName) 
    ? slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : engName;
    
  const label = cleanEng.toLowerCase().includes('news') ? cleanEng : `${cleanEng} News`;
  return {
    label,
    href: `/category/${slug}`
  };
}

function MobileArticleTopAd({ categorySlug }: { categorySlug: string }) {
  const [ads, setAds] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const categoryKey = `mobile-ad-article-top-${categorySlug}`;
    const globalKey = `mobile-ad-article-top-global`;
    
    Promise.all([
      fetch(`/api/articles?category=${categoryKey}&t=${Date.now()}`).then(res => res.ok ? res.json() : []),
      fetch(`/api/articles?category=${globalKey}&t=${Date.now()}`).then(res => res.ok ? res.json() : [])
    ])
      .then(([catAds, globAds]) => {
        const activeCat = Array.isArray(catAds) ? catAds.filter(ad => ad.category === 'active' && ad.image) : [];
        const activeGlob = Array.isArray(globAds) ? globAds.filter(ad => ad.category === 'active' && ad.image) : [];
        const combined = activeCat.length > 0 ? activeCat : activeGlob;
        setAds(combined);
      })
      .catch(err => console.error("Error loading article top ads:", err));
  }, [categorySlug]);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % ads.length);
    }, 2000); // 2 seconds per ad
    return () => clearInterval(interval);
  }, [ads]);

  if (ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  return (
    <div className="md:hidden mb-3 w-full max-w-[360px] mx-auto text-left">
      <div className="bg-gray-100 text-[9px] text-gray-400 font-bold text-center py-0.5 uppercase tracking-wider rounded-t border-t border-x border-gray-200">
        Advertisement
      </div>
      <a
        href={currentAd.body || '#'}
        target={currentAd.body ? '_blank' : '_self'}
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!currentAd.body) e.preventDefault();
        }}
        className="block bg-slate-50 border-b border-x border-gray-200 rounded-b overflow-hidden shadow-sm relative"
      >
        <img
          src={currentAd.image}
          alt={currentAd.title}
          className="w-full h-auto block object-cover"
        />
        <div className="absolute top-1.5 left-2 bg-black/50 text-[#ffb3d1] text-[6.5px] font-black px-1.5 py-0.5 rounded leading-none uppercase tracking-wider font-sans z-10 font-bold">
          Sponsor
        </div>
      </a>
    </div>
  );
}

function MobileArticleFooter({
  categorySlug,
  displayTrending,
  displayLatest,
  apNewsList,
  tgNewsList
}: {
  categorySlug: string;
  displayTrending: any[];
  displayLatest: any[];
  apNewsList: any[];
  tgNewsList: any[];
}) {
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    const categoryKey = `mobile-ad-article-bottom-${categorySlug}`;
    const globalKey = `mobile-ad-article-bottom-global`;

    Promise.all([
      fetch(`/api/articles?category=${categoryKey}&t=${Date.now()}`).then(res => res.ok ? res.json() : []),
      fetch(`/api/articles?category=${globalKey}&t=${Date.now()}`).then(res => res.ok ? res.json() : [])
    ])
      .then(([catAds, globAds]) => {
        const activeCat = Array.isArray(catAds) ? catAds.filter(ad => ad.category === 'active' && ad.image) : [];
        const activeGlob = Array.isArray(globAds) ? globAds.filter(ad => ad.category === 'active' && ad.image) : [];
        const combined = activeCat.length > 0 ? activeCat : activeGlob;
        setAds(combined);
      })
      .catch(err => console.error("Error loading article bottom ads:", err));
  }, [categorySlug]);

  return (
    <div className="md:hidden w-full flex flex-col gap-6 mt-6 pt-6 border-t border-gray-150 text-left">
      {/* 1. Trending News */}
      {displayTrending && displayTrending.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 bg-[#025390] text-white px-4 py-3">
            <TrendingUp size={16} />
            <span className="font-black text-[16px] telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              ట్రెండింగ్ వార్తలు
            </span>
          </div>
          <ul className="divide-y divide-gray-100">
            {displayTrending.slice(0, 8).map((item) => (
              <li key={item.id}>
                <Link
                  href={`/news/${item.slug}`}
                  className="flex items-start gap-3 px-4 py-3.5 hover:bg-blue-50/50 transition-colors group"
                >
                  <span className="w-2 h-2 bg-[#025390] mt-2 flex-shrink-0 rounded-[1px]"></span>
                  <p
                    className="flex-1 min-w-0 text-[14.5px] font-semibold text-gray-700 group-hover:text-[#025390] line-clamp-2 telugu-text pl-0.5"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: '1.7' }}
                  >
                    {item.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 2. Breaking News */}
      {displayLatest && displayLatest.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-[#e60000] text-white px-4 py-3">
            <span className="font-black text-[16px] telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              బ్రేకింగ్ న్యూస్
            </span>
          </div>
          <ul className="divide-y divide-gray-100">
            {displayLatest.slice(0, 8).map((item) => (
              <li key={item.id}>
                <Link
                  href={`/news/${item.slug}`}
                  className="flex items-start gap-3 px-4 py-3.5 hover:bg-red-50/50 transition-colors group"
                >
                  <span className="w-2 h-2 bg-[#e60000] mt-2 flex-shrink-0 rounded-[1px]"></span>
                  <p
                    className="flex-1 min-w-0 text-[14.5px] font-semibold text-gray-700 group-hover:text-[#e60000] line-clamp-2 telugu-text pl-0.5"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: '1.7' }}
                  >
                    {item.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Telangana & Andhra Pradesh Jilla Varthalu (District News) */}
      <div className="bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
        <DistrictNewsTabs apNews={apNewsList} tgNews={tgNewsList} />
      </div>

      {/* 5. Continuous bottom ads */}
      {ads.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center font-sans">ADVERTISEMENT</span>
          {ads.map((ad) => (
            <a
              key={ad.id}
              href={ad.body || '#'}
              target={ad.body ? '_blank' : '_self'}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!ad.body) e.preventDefault();
              }}
              className="w-full overflow-hidden rounded-xl border border-slate-200/80 hover:shadow transition-shadow duration-200 block bg-slate-50"
            >
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-auto object-cover block"
              />
            </a>
          ))}
        </div>
      )}

      {/* 4. Polls Section (At the absolute end) */}
      <div className="w-full">
        <PollWidget scope="article" />
      </div>
    </div>
  );
}

interface ArticlePageClientProps {
  article: any;
  reporter: any;
  trendingNews: any[];
  latestNews: any[];
  apDistrictNews: any[];
  tgDistrictNews: any[];
  otherNews: any[];
  englishCategories: Record<string, string>;
}

export default function ArticlePageClient({
  article: initialArticle,
  reporter: initialReporter,
  trendingNews,
  latestNews,
  apDistrictNews,
  tgDistrictNews,
  otherNews,
  englishCategories
}: ArticlePageClientProps) {
  const [article, setArticle] = useState(initialArticle);
  const [reporter, setReporter] = useState(initialReporter);
  const searchParams = useSearchParams();
  const isCompact = searchParams?.get('compact') === '1';
  const [isExpanded, setIsExpanded] = useState(!isCompact);
  const [inlineImage, setInlineImage] = useState<string | null>(null);
  const [inlineCaption, setInlineCaption] = useState<string>('యోగ ఆసనాలు వేస్తున్న మోదీ..');
  // Initialize as false — localStorage check runs in useEffect after hydration to avoid mismatch
  const [inlinePromosEnabled, setInlinePromosEnabled] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [tagFilteredArticles, setTagFilteredArticles] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoadingTagNews, setIsLoadingTagNews] = useState(false);

  // English to Telugu Translation State for Satya Bytes articles
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);
  const [translatedBody, setTranslatedBody] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTelugu, setShowTelugu] = useState(false);
  const [showTranslatePopup, setShowTranslatePopup] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);

  const handleTranslate = async () => {
    if (translatedTitle && translatedBody) {
      setShowTranslateModal(true);
      return;
    }
    
    setIsTranslating(true);
    setShowTranslateModal(true); // Open modal to show progress spinner
    
    try {
      // 1. Prepare paragraphs to translate
      const bodyHtml = article.body || '';
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = bodyHtml;
      
      const elementsToTranslate = tempDiv.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote');
      const paragraphs: string[] = [];
      elementsToTranslate.forEach(el => {
        paragraphs.push(el.textContent || '');
      });
      
      // 2. Fetch all translations in one single request to our server API
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: article.title.replace(/<[^>]*>/g, ''),
          description: article.description || '',
          paragraphs
        })
      });
      
      if (!response.ok) throw new Error('Server translation failed');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      // 3. Re-apply translated paragraphs back to the DOM template
      let paragraphIndex = 0;
      elementsToTranslate.forEach(el => {
        const originalText = el.textContent || '';
        if (originalText.trim().length > 0) {
          el.textContent = data.paragraphs[paragraphIndex] || originalText;
        }
        paragraphIndex++;
      });
      
      setTranslatedTitle(data.title);
      setTranslatedDescription(data.description);
      setTranslatedBody(tempDiv.innerHTML);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again.');
      setShowTranslateModal(false);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTagClick = async (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null);
      setTagFilteredArticles([]);
      return;
    }
    setSelectedTag(tagName);
    setIsLoadingTagNews(true);
    try {
      const res = await fetch(`/api/articles?tag=${encodeURIComponent(tagName)}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setTagFilteredArticles(data);
      }
    } catch (e) {
      console.error('Failed to load articles for tag:', e);
    } finally {
      setIsLoadingTagNews(false);
    }
  };

  const [customArticleLeftAds, setCustomArticleLeftAds] = useState<any[]>([]);
  const [customArticleRightAds, setCustomArticleRightAds] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticleAds = async () => {
      try {
        const articleCat = article.categorySlug;
        const leftCat = articleCat ? `sidebar-ad-article-left-${articleCat}` : 'sidebar-ad-article-left';
        const rightCat = articleCat ? `sidebar-ad-article-right-${articleCat}` : 'sidebar-ad-article-right';

        const [leftRes, rightRes, defaultLeftRes, defaultRightRes, bothRes] = await Promise.all([
          fetch(`/api/articles?category=${leftCat}&limit=50&t=` + Date.now()).then(r => r.json()),
          fetch(`/api/articles?category=${rightCat}&limit=50&t=` + Date.now()).then(r => r.json()),
          articleCat ? fetch('/api/articles?category=sidebar-ad-article-left&limit=50&t=' + Date.now()).then(r => r.json()) : Promise.resolve([]),
          articleCat ? fetch('/api/articles?category=sidebar-ad-article-right&limit=50&t=' + Date.now()).then(r => r.json()) : Promise.resolve([]),
          fetch('/api/articles?category=sidebar-ad-both&limit=50&t=' + Date.now()).then(r => r.json())
        ]);

        const activeLeft = Array.isArray(leftRes) ? leftRes.filter((ad: any) => ad.category === 'active') : [];
        const activeRight = Array.isArray(rightRes) ? rightRes.filter((ad: any) => ad.category === 'active') : [];
        const activeBoth = Array.isArray(bothRes) ? bothRes.filter((ad: any) => ad.category === 'active') : [];
        const activeDefaultLeft = Array.isArray(defaultLeftRes) ? defaultLeftRes.filter((ad: any) => ad.category === 'active') : [];
        const activeDefaultRight = Array.isArray(defaultRightRes) ? defaultRightRes.filter((ad: any) => ad.category === 'active') : [];

        const finalLeft = activeLeft.length > 0 ? [...activeLeft, ...activeBoth] : [...activeDefaultLeft, ...activeBoth];
        const finalRight = activeRight.length > 0 ? [...activeRight, ...activeBoth] : [...activeDefaultRight, ...activeBoth];

        setCustomArticleLeftAds(finalLeft);
        setCustomArticleRightAds(finalRight);
      } catch (err) {
        console.error("Error loading article sidebar ads:", err);
      }
    };
    fetchArticleAds();
  }, [article.categorySlug]);

  const [apNewsList, setApNewsList] = useState<any[]>(apDistrictNews);
  const [tgNewsList, setTgNewsList] = useState<any[]>(tgDistrictNews);

  const [mediaLibrary, setMediaLibrary] = useState<Record<string, string>>({});
  useEffect(() => {
    // District news pins now loaded from DB settings API in the sidebar pins effect below
  }, [apDistrictNews, tgDistrictNews]);

  const resolveMediaPlaceholders = (htmlContent: string) => {
    if (!htmlContent) return '';
    let resolved = htmlContent;

    // 1. Replace any old-style localStorage placeholder paths with actual base64 (if available)
    Object.entries(mediaLibrary).forEach(([url, base64]) => {
      resolved = resolved.split(url).join(base64);
    });

    // 2. For any remaining unresolved /uploaded-media/ placeholder paths (broken images
    //    saved before the base64-direct fix), replace with a subtle notice instead of
    //    showing the wrong image or a broken icon.
    resolved = resolved.replace(
      /<img[^>]*src="\/uploaded-media\/[^"]+"[^>]*\/?>/gi,
      '<span style="display:block;padding:12px 16px;margin:12px 0;background:#fef9c3;border:1px dashed #ca8a04;border-radius:8px;font-size:12px;color:#92400e;font-family:sans-serif;">⚠️ Image not available – please re-save this article in the admin panel to restore the image.</span>'
    );

    // 3. Strip inline styling properties that break readability and layout
    resolved = resolved
      .replace(/font-family\s*:\s*[^;"]+;?/gi, '')
      .replace(/white-space\s*:\s*[^;"]+;?/gi, '')
      .replace(/line-height\s*:\s*[^;"]+;?/gi, '');

    // 4. Translate admin class names to inline styles so images render correctly
    resolved = resolved
      .replace(/class="inline-img-full"/g,
        'style="width:100%;height:auto;margin:16px 0;display:block"')
      .replace(/class="inline-img-medium"/g,
        'style="width:60%;height:auto;margin:16px auto;display:block"')
      .replace(/class="inline-vid-full"/g,
        'style="width:100%;height:auto;margin:16px 0;display:block"');

    // 5. Ensure all inline <img> tags without explicit width styling get max-width:100%
    //    so they never overflow the article column
    resolved = resolved.replace(
      /<img(?![^>]*style[^>]*max-width)([^>]*)(src="data:[^"]+"|src="https?:[^"]+")([^>]*)>/g,
      (match) => {
        if (match.includes('style=')) {
          // Inject max-width into existing style attribute
          return match.replace(/style="([^"]*)"/, (_, s) =>
            `style="${s};max-width:100%;height:auto;display:block;margin:12px auto"`
          );
        }
        // Add a new style attribute
        return match.replace('<img', '<img style="max-width:100%;height:auto;display:block;margin:12px auto"');
      }
    );

    return resolved;
  };

  useEffect(() => {
    setArticle(initialArticle);
  }, [initialArticle]);

  useEffect(() => {
    const keys = [
      'inline_article_image_enabled',
      'inline_article_image_data',
      'inline_article_image_caption',
      'inline_article_promos_enabled'
    ];

    fetch(`/api/settings?keys=${keys.join(',')}&t=` + Date.now())
      .then(res => res.ok ? res.json() : {})
      .then((dbSettings: any) => {
        const getSetting = (key: string, defaultValue: string | null = null) => {
          if (dbSettings[key] !== undefined && dbSettings[key] !== null) return dbSettings[key];
          return defaultValue;
        };

        const isEnabled = getSetting('inline_article_image_enabled') === 'true';
        if (isEnabled) {
          const savedImage = getSetting('inline_article_image_data');
          const savedCaption = getSetting('inline_article_image_caption');
          if (savedImage) {
            setInlineImage(savedImage);
          }
          if (savedCaption) {
            setInlineCaption(savedCaption);
          }
        } else {
          setInlineImage(null);
        }

        const savedPromos = getSetting('inline_article_promos_enabled');
        setInlinePromosEnabled(savedPromos === 'true');
        setIsMounted(true);
        if (article.categorySlug === 'satya-bytes') {
          setTimeout(() => {
            setShowTranslatePopup(true);
          }, 1500);
        }
      })
      .catch(() => {
        setInlineImage(null);
        setInlinePromosEnabled(false);
        setIsMounted(true);
        if (article.categorySlug === 'satya-bytes') {
          setTimeout(() => {
            setShowTranslatePopup(true);
          }, 1500);
        }
      });
  }, [article.categorySlug]);
  
  const currentCategorySlug = article.categorySlug;
  const categoryLinkInfo = getCategoryLinkInfo(article, englishCategories);

  const [selectedDistrictSlug, setSelectedDistrictSlug] = useState<string>(
    article.districtSlug || ''
  );

  useEffect(() => {
    setSelectedDistrictSlug(article.districtSlug || '');
  }, [article.districtSlug]);

  const [displayTrending, setDisplayTrending] = useState<any[]>([]);
  const [displayLatest, setDisplayLatest] = useState<any[]>([]);

  useEffect(() => {
    const loadPinnedNews = async () => {
      try {
        const settingsRes = await fetch('/api/settings?key=sidebar_category_pins');
        let savedPins = null;
        if (settingsRes.ok) {
          const dict = await settingsRes.json();
          savedPins = dict.sidebar_category_pins;
        }
        if (!savedPins) {
          setDisplayTrending([]);
          setDisplayLatest([]);
          return;
        }
        const parsed = typeof savedPins === 'string' ? JSON.parse(savedPins) : savedPins;
        const catPins = parsed[currentCategorySlug] || { trending: [], breaking: [] };
        // Also check district-specific pins if the article or selection has a districtSlug
        const activeDistrictSlug = selectedDistrictSlug || article.districtSlug;
        const districtCategorySlug = activeDistrictSlug
          ? (currentCategorySlug === 'telangana' ? 'telangana-districts'
            : currentCategorySlug === 'andhra-pradesh' ? 'andhra-pradesh-districts'
            : null)
          : null;
        const districtCatPins = districtCategorySlug ? (parsed[districtCategorySlug] || { trending: [], breaking: [] }) : { trending: [], breaking: [] };
        // Also check the per-district key (district-adilabad etc.)
        const perDistrictKey = activeDistrictSlug ? `district-${activeDistrictSlug}` : null;
        const perDistrictPins = perDistrictKey ? (parsed[perDistrictKey] || { trending: [], breaking: [] }) : { trending: [], breaking: [] };

        // Merge pins: if district is active, only show district pins; otherwise show category pins
        const pinnedTrendingIds: string[] = activeDistrictSlug
          ? [
              ...(perDistrictPins.trending || []).map(String),
              ...(districtCatPins.trending || []).map(String),
            ].filter((id, idx, arr) => arr.indexOf(id) === idx)
          : (catPins.trending || []).map(String);
        const pinnedBreakingIds: string[] = activeDistrictSlug
          ? [
              ...(perDistrictPins.breaking || []).map(String),
              ...(districtCatPins.breaking || []).map(String),
            ].filter((id, idx, arr) => arr.indexOf(id) === idx)
          : (catPins.breaking || []).map(String);

        if (pinnedTrendingIds.length === 0 && pinnedBreakingIds.length === 0) {
          setDisplayTrending([]);
          setDisplayLatest([]);
          return;
        }

        // Fetch details of pinned articles if not already in the prop lists
        const allProps = [...(trendingNews || []), ...(latestNews || []), ...(otherNews || [])];
        const missingIds = new Set<string>();
        pinnedTrendingIds.forEach(id => missingIds.add(id));
        pinnedBreakingIds.forEach(id => missingIds.add(id));

        allProps.forEach((a: any) => {
          if (a) missingIds.delete(String(a.id));
        });

        const fetchedMissing: any[] = [];

        if (missingIds.size > 0) {
          const promises = Array.from(missingIds).map(async (id) => {
            try {
              const res = await fetch(`/api/articles/${id}`);
              if (res.ok) {
                return await res.json();
              }
            } catch (e) {
              console.error("Error loading missing pinned article in client:", e);
            }
            return null;
          });
          const resolved = await Promise.all(promises);
          resolved.forEach(r => {
            if (r) fetchedMissing.push(r);
          });
        }

        const lookupMap = new Map<string, any>();
        [...allProps, ...fetchedMissing].forEach((a: any) => {
          if (a) lookupMap.set(String(a.id), a);
        });

        // Re-construct trending list (excluding current article) - ONLY show pinned articles
        let finalT = pinnedTrendingIds
          .map(id => lookupMap.get(id))
          .filter((a: any) => a && String(a.id) !== String(article.id));

        // Re-construct breaking/latest list (excluding current article) - ONLY show pinned articles
        let finalB = pinnedBreakingIds
          .map(id => lookupMap.get(id))
          .filter((a: any) => a && String(a.id) !== String(article.id));

        // Prevent mingling: filter out district articles from state sidebar and state articles from district sidebar
        if (activeDistrictSlug) {
          finalT = finalT.filter((a: any) => a.districtSlug);
          finalB = finalB.filter((a: any) => a.districtSlug);
        } else if (currentCategorySlug === 'telangana' || currentCategorySlug === 'andhra-pradesh') {
          finalT = finalT.filter((a: any) => !a.districtSlug);
          finalB = finalB.filter((a: any) => !a.districtSlug);
        }

        if (currentCategorySlug !== 'home' && currentCategorySlug !== 'latest' && !activeDistrictSlug) {
          finalT = finalT.filter((a: any) => a.categorySlug === currentCategorySlug);
          finalB = finalB.filter((a: any) => a.categorySlug === currentCategorySlug);
        }

        setDisplayTrending(finalT);
        setDisplayLatest(finalB);
      } catch (err) {
        console.error("Error loading pinned sidebar news in ArticlePageClient", err);
      }
    };

    loadPinnedNews();
  }, [currentCategorySlug, trendingNews, latestNews, otherNews, article.id, selectedDistrictSlug]);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    try {
      const formatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const parts = formatter.formatToParts(d);
      let day = '', month = '', year = '', hour = '', minute = '', dayPeriod = '';
      parts.forEach(p => {
        if (p.type === 'day') day = p.value;
        if (p.type === 'month') month = p.value;
        if (p.type === 'year') year = p.value;
        if (p.type === 'hour') hour = p.value;
        if (p.type === 'minute') minute = p.value;
        if (p.type === 'dayPeriod') dayPeriod = p.value;
      });
      const ampm = dayPeriod ? ` ${dayPeriod.toUpperCase()}` : '';
      return `${day} ${month} ${year} | ${hour}:${minute}${ampm} IST`;
    } catch (e) {
      const day = d.getDate();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      let hoursNum = d.getHours();
      const ampm = hoursNum >= 12 ? ' PM' : ' AM';
      hoursNum = hoursNum % 12;
      hoursNum = hoursNum ? hoursNum : 12; // the hour '0' should be '12'
      const hours = String(hoursNum).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year} | ${hours}:${mins}${ampm} IST`;
    }
  }

  function formatTimeOnly(dateStr: string) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    try {
      const formatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const parts = formatter.formatToParts(d);
      let hour = '', minute = '', dayPeriod = '';
      parts.forEach(p => {
        if (p.type === 'hour') hour = p.value;
        if (p.type === 'minute') minute = p.value;
        if (p.type === 'dayPeriod') dayPeriod = p.value;
      });
      const ampm = dayPeriod ? ` ${dayPeriod.toUpperCase()}` : '';
      return `${hour}:${minute}${ampm}`;
    } catch (e) {
      let hoursNum = d.getHours();
      const ampm = hoursNum >= 12 ? ' PM' : ' AM';
      hoursNum = hoursNum % 12;
      hoursNum = hoursNum ? hoursNum : 12;
      const hours = String(hoursNum).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${mins}${ampm}`;
    }
  }

  // Create suggestion pool excluding current article
  const suggestionPool = [
    ...(displayTrending || []),
    ...(displayLatest || []),
    ...(otherNews || [])
  ].filter(item => item && item.id !== article.id && item.slug !== article.slug);

  const uniqueSuggestions: any[] = [];
  const seenIds = new Set();
  for (const item of suggestionPool) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueSuggestions.push(item);
    }
  }

  // Find matching district if article has districtSlug
  const allDist = [...tgDistricts, ...apDistricts];
  const matchedDistrict = article.districtSlug ? allDist.find(d => d.slug === article.districtSlug) : null;
  const isTelanganaDist = tgDistricts.some(d => d.slug === article.districtSlug);
  const districtStateSlug = isTelanganaDist ? 'telangana' : 'andhra-pradesh';
  const districtStateName = isTelanganaDist ? 'తెలంగాణ' : 'ఆంధ్రప్రదేశ్';

  // Define two distinct layouts based on isExpanded
  if (isExpanded) {
    // ═══ FULL 3-COLUMN LAYOUT "LIKE BEFORE" ═══
    return (
      <main className="max-w-[1050px] mx-auto bg-white shadow-md border-x border-gray-200 px-2.5 py-4 md:px-4">
        {/* Mobile-only Ad — top rotating banner */}
        <MobileArticleTopAd categorySlug={currentCategorySlug} />

        {/* Breadcrumb & Back Button */}

        <div className="flex items-center justify-between gap-4 mb-3 border-b border-gray-100 pb-3 overflow-hidden">
          <div className="flex items-center gap-1 md:gap-2 text-[13px] md:text-[17.5px] text-gray-500 font-sans whitespace-nowrap overflow-x-auto hide-scrollbar">
            <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
              <Home size={14} className="flex-shrink-0" /> Home
            </Link>
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            {matchedDistrict ? (
              <>
                <Link href={`/category/${districtStateSlug}`} className="hover:text-brand-blue transition-colors font-bold flex-shrink-0 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  {districtStateName}
                </Link>
                <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                <Link href={`/district/${districtStateSlug}/${article.districtSlug}`} className="hover:text-brand-blue transition-colors font-bold flex-shrink-0 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  {matchedDistrict.name}
                </Link>
              </>
            ) : (
              <Link href={`/category/${currentCategorySlug}`} className="hover:text-brand-blue transition-colors font-bold flex-shrink-0">
                {englishCategories[currentCategorySlug] || article.category}
              </Link>
            )}
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-400 truncate max-w-[200px] telugu-text flex-shrink-0" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              {article.title?.replace(/<[^>]*>/g, '')}
            </span>
          </div>
          <div className="flex-shrink-0">
            <BackButton />
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[185px_1fr_185px] gap-3">
          
          {/* Left Sidebar */}
          <aside className="hidden lg:flex flex-col gap-3">
            {/* District Selector */}
            {!!article.districtSlug && (
              <div className="bg-white border border-gray-200 rounded p-2.5 flex flex-col gap-2 shadow-xs">
                <label className="text-xs font-bold text-gray-500 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  జిల్లా ఎంచుకోండి:
                </label>
                <select
                  value={selectedDistrictSlug}
                  onChange={(e) => setSelectedDistrictSlug(e.target.value)}
                  className="w-full bg-[#025390] text-white font-bold text-[12px] md:text-[13px] telugu-text px-2 py-1.5 rounded transition-colors cursor-pointer border-none outline-none"
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

            {/* Dynamic Article Sidebar Ads (First 2 ads on top of Trending News) */}
            {customArticleLeftAds.slice(0, 2).map((ad) => (
              <a
                key={ad.id}
                href={ad.body || '#'}
                target={ad.body ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!ad.body) e.preventDefault();
                }}
                className="w-full h-[160px] flex items-center justify-center bg-slate-50/50 overflow-hidden rounded-xl border border-slate-200/80 hover:shadow transition-shadow duration-200 mb-3"
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-contain"
                />
              </a>
            ))}

            {/* Trending News */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="flex items-center gap-2 bg-[#025390] text-white px-3 py-2.5">
                <TrendingUp size={14} />
                <span className="font-black text-base telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  ట్రెండింగ్ వార్తలు
                </span>
              </div>
              <ul className="divide-y divide-gray-100">
                {displayTrending.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="flex items-start gap-3 px-3 py-3.5 hover:bg-blue-50/50 transition-colors group"
                    >
                      <span className="w-2 h-2 bg-[#025390] mt-1.5 flex-shrink-0 rounded-[1px]"></span>
                      <p
                        className="flex-1 min-w-0 text-[14.5px] md:text-[15.5px] font-semibold text-gray-700 group-hover:text-[#025390] line-clamp-2 telugu-text pl-0.5"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: '1.7' }}
                      >
                        {item.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dynamic Article Sidebar Ads (Continuous ads after Trending News) */}
            {customArticleLeftAds.slice(2).map((ad) => (
              <a
                key={ad.id}
                href={ad.body || '#'}
                target={ad.body ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!ad.body) e.preventDefault();
                }}
                className="w-full h-[160px] flex items-center justify-center bg-slate-50/50 overflow-hidden rounded-xl border border-slate-200/80 hover:shadow transition-shadow duration-200 mb-3"
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-contain"
                />
              </a>
            ))}
          </aside>

          {/* Middle: Full Article Content */}
          <article className="bg-white border border-gray-200 rounded overflow-hidden flex-1 min-w-0 w-full max-w-[750px] mx-auto">
            <div className="p-4 md:p-5">
              {(() => {
                const isSeniorReporterCategory = article.categorySlug === 'uma-insights' || article.categorySlug === 'satya-bytes';
                if (isSeniorReporterCategory) {
                  return (
                    <>
                      {/* Headline */}
                      <h1
                        className="main-headline telugu-text text-[#cc0000] mb-5 text-2xl md:text-3.5xl font-extrabold"
                        style={{ fontFamily: article.categorySlug === 'satya-bytes' ? (showTelugu ? 'Noto Sans Telugu, sans-serif' : 'Georgia, serif') : 'Noto Sans Telugu, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: showTelugu && translatedTitle ? translatedTitle : article.title }}
                      />

                      {/* Reporter Profile Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 mb-6 pb-4 border-b border-gray-150 text-left">
                        <div className="flex items-center gap-3.5 w-full sm:w-auto">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
                            {reporter && reporter.image ? (
                              <img src={reporter.image} alt={reporter.name} className="w-full h-full object-cover" />
                            ) : article.image ? (
                              <img src={article.image} alt={article.author} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                                {article.author?.charAt(0) || 'హై'}
                              </div>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="font-extrabold text-gray-900 text-base md:text-lg telugu-text" style={{ fontFamily: article.categorySlug === 'satya-bytes' ? 'Georgia, serif' : 'Noto Sans Telugu, sans-serif' }}>
                              {isSeniorReporterCategory ? article.author : (reporter ? reporter.name.replace(/.* - /, '') : article.author)}
                            </h3>
                            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                              {isSeniorReporterCategory ? (article.category || 'సీనియర్ జర్నలిస్ట్') : (reporter?.role || article.category || 'స్టాఫ్ రిపోర్టర్')}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] text-gray-400 font-sans">
                              <Clock size={10} />
                              <span>Published: {formatDate(article.publishedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2.5 sm:mt-0 sm:ml-auto w-full sm:w-auto flex flex-col items-start sm:items-end gap-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap justify-start sm:justify-end">
                            {isMounted && article.categorySlug === 'satya-bytes' && (
                              <button
                                onClick={handleTranslate}
                                className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 !text-white font-black text-[12px] py-1.5 px-3 rounded-lg transition-all duration-300 shadow-xs cursor-pointer select-none active:scale-[0.98]"
                              >
                                <span>🌐 {showTelugu ? 'Show English' : 'Translate / తెలుగు'}</span>
                              </button>
                            )}
                            {isMounted && isSeniorReporterCategory && (
                              <Link
                                href={
                                  article.categorySlug === 'uma-insights'
                                    ? '/team#journalist-revuru-uma-maheswara-rao'
                                    : '/team#satyapal-menon'
                                }
                                className="inline-flex items-center justify-center gap-1.5 bg-[#025390] hover:bg-[#0b2545] !text-white hover:!text-white !no-underline hover:!no-underline font-black text-[12px] py-1.5 px-3 rounded-lg transition-all duration-300 shadow-xs cursor-pointer select-none active:scale-[0.98]"
                                style={{ color: '#ffffff', textDecoration: 'none' }}
                              >
                                <span>About Writer</span>
                                <ArrowRight size={11} className="stroke-[2.5]" style={{ color: '#ffffff' }} />
                              </Link>
                            )}
                          </div>
                          <ShareButton title={article.title?.replace(/<[^>]*>/g, '')} />
                        </div>
                      </div>

                      {/* Excerpt Shorts Summary */}
                      {article.description && (
                        <p
                          className="block article-summary telugu-text text-gray-800 border-l-4 border-rose-600 pl-4 bg-rose-50/20 py-3 pr-3 rounded-r mb-6 text-[14.5px] md:text-base leading-relaxed font-bold"
                          style={{ fontFamily: article.categorySlug === 'satya-bytes' ? 'Georgia, serif' : 'Noto Sans Telugu, sans-serif' }}
                          dangerouslySetInnerHTML={{ __html: article.description }}
                        />
                      )}

                      {/* Featured Image */}
                      {article.image && (
                        <div className="overflow-hidden mb-6 w-full rounded-2xl border border-gray-100 shadow-xs">
                          <FallbackImage
                            src={article.image}
                            alt={article.title?.replace(/<[^>]*>/g, '')}
                            fill={false}
                            width={1200}
                            height={675}
                            className="w-full h-auto block object-cover max-h-[480px]"
                            style={{ display: 'block', width: '100%', height: 'auto' }}
                          />
                        </div>
                      )}
                    </>
                  );
                }

                return (
                  <>
                    {article.isBreaking && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-red-600 text-white text-[12px] font-black px-2 py-0.5 rounded breaking-badge">
                          🔴 Breaking
                        </span>
                      </div>
                    )}

                    {/* Headline */}
                    <h1
                      className="main-headline telugu-text text-[#cc0000] mb-3"
                      style={{ fontFamily: article.categorySlug === 'satya-bytes' ? (showTelugu ? 'Noto Sans Telugu, sans-serif' : 'Georgia, serif') : 'Noto Sans Telugu, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: showTelugu && translatedTitle ? translatedTitle : article.title }}
                    />

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 text-gray-500 mb-4 pb-3 border-b border-gray-100 font-sans meta-info">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-[#025390] rounded-full flex items-center justify-center">
                          <span className="text-white text-[12px] font-black">హై</span>
                        </div>
                        <Link href={`/reporter/${reporter.slug}`} className="font-bold text-[#025390] hover:text-red-600 transition-colors telugu-text" style={{ fontFamily: article.categorySlug === 'satya-bytes' ? 'Georgia, serif' : 'Mandali, sans-serif' }}>
                          {reporter.name}
                        </Link>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span className="font-semibold">Published: {formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        {isMounted && article.categorySlug === 'satya-bytes' && (
                          <button
                            onClick={handleTranslate}
                            className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 !text-white font-black text-[12px] py-1.5 px-3 rounded-lg transition-all duration-300 shadow-xs cursor-pointer select-none active:scale-[0.98]"
                          >
                            <span>🌐 {showTelugu ? 'Show English' : 'Translate / తెలుగు'}</span>
                          </button>
                        )}
                        <ShareButton title={article.title?.replace(/<[^>]*>/g, '')} />
                      </div>
                    </div>

                    {/* Description summary */}
                    <p
                      className="block article-summary telugu-text text-gray-700 border-l-4 border-[#025390] pl-3 bg-blue-50/40 py-2 pr-3 rounded-r mb-4 text-[14.5px] md:text-base leading-relaxed"
                      style={{ fontFamily: article.categorySlug === 'satya-bytes' ? (showTelugu ? 'Noto Sans Telugu, sans-serif' : 'Georgia, serif') : 'Noto Sans Telugu, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: showTelugu && translatedDescription ? translatedDescription : article.description }}
                    />

                    {/* Hero Image */}
                    <div className="overflow-hidden mb-0 w-full">
                      <FallbackImage
                        src={article.image}
                        alt={article.title?.replace(/<[^>]*>/g, '')}
                        fill={false}
                        width={1200}
                        height={675}
                        className="w-full h-auto block"
                        style={{ display: 'block', width: '100%', height: 'auto' }}
                      />
                    </div>
                    {article.imageCaption && (
                      <div 
                        className="mb-5 px-1 pb-1.5 pt-1 text-[13px] md:text-[14px] font-bold text-gray-600 telugu-text border-b border-gray-100" 
                        style={{ fontFamily: article.categorySlug === 'satya-bytes' ? 'Georgia, serif' : 'Noto Sans Telugu, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: article.imageCaption }}
                      />
                    )}
                    {!article.imageCaption && <div className="mb-4" />}
                  </>
                );
              })()}

              {/* Full Article Body */}
              <div 
                className="telugu-text text-gray-800 article-body" 
                style={{ 
                  fontFamily: article.categorySlug === 'satya-bytes' 
                    ? (showTelugu ? 'Mandali, "Noto Sans Telugu", sans-serif' : 'Poppins, sans-serif') 
                    : 'Mandali, "Noto Sans Telugu", sans-serif', 
                  lineHeight: '1.85' 
                }}
              >
                {(showTelugu && translatedBody ? translatedBody : article.body) ? (
                  (() => {
                    const bodyToParse = showTelugu && translatedBody ? translatedBody : (article.body || '');
                    // Extract inline-image-containers to prevent them from being split/broken by newline parser
                    const placeholders: string[] = [];
                    let normalized = bodyToParse.replace(/(<div\b[^>]*\binline-image-container[\s\S]*?<\/div>\s*<\/div>)/gi, (match: string) => {
                      placeholders.push(match);
                      return `\n__INLINE_IMAGE_CONTAINER_PLACEHOLDER_${placeholders.length - 1}__\n`;
                    });

                    // Normalize other media elements
                    normalized = normalized
                      .replace(/(<img\b[^>]*\/?>)/gi, '\n$1\n')
                      .replace(/(<video\b[\s\S]*?<\/video>)/gi, '\n$1\n')
                      .replace(/(<h[1-6]>[\s\S]*?<\/h[1-6]>)/gi, '\n$1\n');

                    const paras = normalized.split('\n');
                    const elements: any[] = [];
                    let textParaCount = 0;
                    let promoIndex = 0;

                    paras.forEach((para: string, idx: number) => {
                      const trimmed = para.trim();
                      if (trimmed === '') {
                        elements.push(<div key={`empty-${idx}`} style={{ height: '0.7em' }} />);
                        return;
                      }

                      // Check if it is a placeholder for inline image container
                      const placeholderMatch = trimmed.match(/__INLINE_IMAGE_CONTAINER_PLACEHOLDER_(\d+)__/);
                      if (placeholderMatch) {
                        const index = parseInt(placeholderMatch[1], 10);
                        const originalHTML = placeholders[index];
                        elements.push(<div key={`tag-${idx}`} dangerouslySetInnerHTML={{ __html: resolveMediaPlaceholders(originalHTML) }} />);
                        return;
                      }

                      const isTag = /^<(img|video|h[1-6]|ul|ol|li|figure|blockquote|table|br|div)/i.test(trimmed);

                      if (isTag) {
                        elements.push(<div key={`tag-${idx}`} dangerouslySetInnerHTML={{ __html: resolveMediaPlaceholders(trimmed) }} />);
                      } else {
                        // It is a text paragraph
                        elements.push(<p key={`para-${idx}`} style={{ margin: '0 0 0.6em 0' }} dangerouslySetInnerHTML={{ __html: resolveMediaPlaceholders(para) }} />);
                        textParaCount++;

                        // Insert suggestion promo box after every 2 text paragraphs (only after client mount)
                        if (isMounted && inlinePromosEnabled && textParaCount > 0 && textParaCount % 2 === 0) {
                          const suggestion = uniqueSuggestions[promoIndex % uniqueSuggestions.length];
                          if (suggestion) {
                            elements.push(
                              <div key={`promo-${idx}`} className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2.5 bg-red-50/50 border-l-4 border-[#e60000] rounded px-4 py-3 my-4 text-[14px] md:text-[18px] select-none">
                                <span className="text-[#e60000] font-black flex-shrink-0 telugu-text font-bold" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                  ఈ వార్తా చదవండి:
                                </span>
                                <Link href={`/news/${suggestion.slug}`} className="text-[#02599c] font-bold hover:text-[#e60000] hover:underline transition-colors telugu-text leading-snug" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                  {suggestion.title}
                                </Link>
                              </div>
                            );
                            promoIndex++;
                          }
                        }
                      }
                    });
                    return elements;
                  })()
                ) : (
                  <>
                    <p>{article.description} ఈ వార్తకు సంబంధించిన విశేషాలు క్రింద వివరించబడ్డాయి. హై టీవీ డెస్క్ నుండి తాజా సమాచారం ఇక్కడ లభిస్తుంది.</p>
                    <p>అధికారులు తెలిపిన వివరాల ప్రకారం, ఈ నిర్ణయం రాష్ట్ర ప్రజలకు అత్యంత ప్రయోజనకరంగా ఉంటుందని భావిస్తున్నారు. ఈ పరిణామాలు భవిష్యత్తులో మరింత సానుకూలమైన ఫలితాలను ఇస్తాయని నిపుణులు అభిప్రాయపడుతున్నారు.</p>
                  </>
                )}



                {!article.body && (
                  <>
                    {/* ఈ వార్తా చదవండి promo 1 — only renders client-side to avoid hydration mismatch */}
                    {isMounted && inlinePromosEnabled && displayTrending[0] && (
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2.5 bg-red-50/50 border-l-4 border-[#e60000] rounded px-4 py-3 my-4 text-[14px] md:text-[18px]">
                        <span className="text-[#e60000] font-black flex-shrink-0 telugu-text font-bold" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                          ఈ వార్తా చదవండి:
                        </span>
                        <Link href={`/news/${displayTrending[0].slug}`} className="text-[#02599c] font-bold hover:text-[#e60000] hover:underline transition-colors telugu-text leading-snug" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                          {displayTrending[0].title}
                        </Link>
                      </div>
                    )}

                    <p>ఈ అంశంపై స్థానిక ప్రజలు, నిపుణులు వివిధ అభిప్రాయాలు వ్యక్తం చేశారు. కొందరు ఈ నిర్ణయాన్ని స్వాగతిస్తున్నారు, మరికొందరు దీనిపై సందేహాలు వ్యక్తం చేస్తున్నారు.</p>

                    {/* Inline Image Section */}
                    {inlineImage && (
                      <div className="my-5 w-full text-center">
                        <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-black/5">
                          {/* Red slide indicator similar to screenshot */}
                          <div className="absolute top-3 left-3 bg-[#cc0000] text-white text-[11px] font-black px-2 py-0.5 rounded tracking-wide z-10 font-sans">
                            1/1
                          </div>
                          <FallbackImage
                            src={inlineImage}
                            alt={inlineCaption}
                            className="w-full h-auto object-contain block max-h-[500px] mx-auto"
                          />
                        </div>
                        {inlineCaption && (
                          <div className="mt-2 text-center text-[13.5px] font-bold text-gray-700 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                            {inlineCaption}
                          </div>
                        )}
                      </div>
                    )}

                    <p>హై టీవీ ఈ అంశాన్ని నిరంతరం ట్రాక్ చేస్తూ తాజా అప్‌డేట్‌లను అందిస్తుంది. మరిన్ని వివరాలకు మా వెబ్‌సైట్‌ను అనుసరించండి.</p>

                    {/* ఈ వార్తా చదవండి promo 2 — only renders client-side to avoid hydration mismatch */}
                    {isMounted && inlinePromosEnabled && displayTrending[1] && (
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2.5 bg-red-50/50 border-l-4 border-[#e60000] rounded px-4 py-3 my-4 text-[14px] md:text-[18px]">
                        <span className="text-[#e60000] font-black flex-shrink-0 telugu-text font-bold" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                          ఈ వార్తా చదవండి:
                        </span>
                        <Link href={`/news/${displayTrending[1].slug}`} className="text-[#02599c] font-bold hover:text-[#e60000] hover:underline transition-colors telugu-text leading-snug" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                          {displayTrending[1].title}
                        </Link>
                      </div>
                    )}
                  </>
                )}





                {/* Read latest & Follow us strip */}
                <div className="border-t border-gray-100 pt-5 mt-6 space-y-2.5 text-gray-800 font-sans text-[15px] select-none leading-normal">
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 bg-[#e60000] text-white rounded-[3px] w-4.5 h-4.5 flex items-center justify-center mt-1 select-none">
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span>
                      Read latest{' '}
                      <Link href={categoryLinkInfo.href} className="text-[#e60000] font-bold hover:underline">
                        {categoryLinkInfo.label}
                      </Link>{' '}
                      and{' '}
                      <Link href="/" className="text-[#e60000] font-bold hover:underline">
                        Telugu News
                      </Link>
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 bg-[#e60000] text-white rounded-[3px] w-4.5 h-4.5 flex items-center justify-center mt-1 select-none">
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span>
                      Follow us on{' '}
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#e60000] font-bold hover:underline">
                        Facebook
                      </a>
                      ,{' '}
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#e60000] font-bold hover:underline">
                        Twitter
                      </a>{' '}
                      &{' '}
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#e60000] font-bold hover:underline">
                        Instagram
                      </a>
                      .
                    </span>
                  </div>
                </div>

                {/* Updated Date/Time Box */}
                <div className="border-t border-gray-100 pt-4 mt-4 text-xs font-bold text-gray-500 font-sans select-none text-left">
                  <span className="text-gray-400">Updated:</span> {formatDate(article.updatedAt || article.publishedAt)}
                </div>

                {/* Tags Block Section */}
                {article.tags && article.tags.length > 0 && (
                  <div className="border-t border-gray-100 pt-5 mt-6 text-left">
                    <div className="bg-[#002040] text-white p-4 rounded-xl flex flex-col md:flex-row md:items-center gap-3 select-none">
                      <span className="font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 flex-shrink-0">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 8.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75z"/>
                        </svg>
                        Tags:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((t: any, idx: number) => {
                          const isSelected = selectedTag === t.name;
                          if (t.linkedArticleSlug) {
                            return (
                              <Link
                                key={idx}
                                href={`/news/${t.linkedArticleSlug}`}
                                className="text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer shadow-sm bg-white text-[#002040] border-transparent hover:bg-slate-100"
                              >
                                #{t.name}
                              </Link>
                            );
                          }
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleTagClick(t.name)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer shadow-sm ${
                                isSelected
                                  ? 'bg-[#e60000] text-white border-[#e60000] scale-105'
                                  : 'bg-white text-[#002040] border-transparent hover:bg-slate-100'
                              }`}
                            >
                              #{t.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dynamic Tag filtered news list directly below */}
                    {selectedTag && (
                      <div className="mt-6 bg-slate-50 border border-slate-200/60 rounded-xl p-4 md:p-5 shadow-inner">
                        <h3 className="font-black text-[#002040] text-base md:text-lg mb-4 telugu-text flex items-center justify-between">
                          <span>#{selectedTag} కి సంబంధించిన వార్తలు</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTag(null);
                              setTagFilteredArticles([]);
                            }}
                            className="text-[10px] bg-slate-200 hover:bg-rose-500 hover:text-white px-2.5 py-1 rounded transition-colors text-slate-500 cursor-pointer"
                          >
                            Close [✕]
                          </button>
                        </h3>

                        {isLoadingTagNews ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002040]" />
                          </div>
                        ) : tagFilteredArticles.length === 0 ? (
                          <p className="text-xs text-slate-500 py-4 telugu-text text-center">ఈ ట్యాగ్‌తో మరిన్ని వార్తలు లేవు.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {tagFilteredArticles.map((item: any) => (
                              <Link
                                key={item.id}
                                href={`/news/${item.slug}`}
                                className="flex gap-3 hover:bg-white p-2 rounded-xl border border-transparent hover:border-slate-200 transition-all bg-white/45 shadow-sm group"
                              >
                                <div className="w-[80px] h-[55px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-150 relative flex items-center justify-center">
                                  <FallbackImage
                                    src={item.image}
                                    alt={item.title?.replace(/<[^>]*>/g, '')}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="flex flex-col justify-between min-w-0">
                                  <h4 className="text-[13px] font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#e60000] transition-colors telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                    {item.title?.replace(/<[^>]*>/g, '')}
                                  </h4>
                                  <span className="text-[9px] font-bold text-slate-400 font-sans">{formatDate(item.publishedAt)}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>



              {/* Bottom Section: మరిన్ని వార్తలు చదవండి (Read More News) */}
              <div className="mt-8 pt-5 border-t border-gray-150 text-left">
                <h2
                  className="font-black text-[#cc0000] text-[18px] md:text-[22px] mb-3.5 telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  మరిన్ని వార్తలు చదవండి
                </h2>
                {/* Bordered box containing other news items */}
                <div className="border border-gray-250 rounded-xl p-2 md:p-4 bg-white shadow-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                    {otherNews.slice(0, 6).map((item) => (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="flex gap-3 hover:bg-blue-50/30 p-1 md:p-1.5 rounded-lg transition-colors group"
                      >
                        <div className="w-[75px] h-[50px] md:w-[90px] md:h-[60px] flex-shrink-0 overflow-hidden rounded-md bg-gray-50 border border-gray-150 relative flex items-center justify-center">
                          <FallbackImage
                            src={item.image}
                            alt={item.title}
                            fill
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col justify-start pl-1">
                          <p
                            className="text-[13.5px] sm:text-[14.5px] md:text-[16.5px] font-bold text-gray-800 group-hover:text-[#02599c] transition-colors leading-relaxed telugu-text line-clamp-4 md:line-clamp-3 pb-1 pl-1"
                            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                          >
                            {item.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile-only Sidebar components (Trending, Breaking, District News, Poll, Ads) */}
              <MobileArticleFooter
                categorySlug={currentCategorySlug}
                displayTrending={displayTrending}
                displayLatest={displayLatest}
                apNewsList={apNewsList}
                tgNewsList={tgNewsList}
              />
            </div>
          </article>

          {/* Right Sidebar */}
          <aside className="hidden lg:flex flex-col gap-3">
            {/* District Selector */}
            {!!article.districtSlug && (
              <div className="bg-white border border-gray-200 rounded p-2.5 flex flex-col gap-2 shadow-xs">
                <label className="text-xs font-bold text-gray-500 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  జిల్లా ఎంచుకోండి:
                </label>
                <select
                  value={selectedDistrictSlug}
                  onChange={(e) => setSelectedDistrictSlug(e.target.value)}
                  className="w-full bg-[#cc0000] text-white font-bold text-[12px] md:text-[13px] telugu-text px-2 py-1.5 rounded transition-colors cursor-pointer border-none outline-none"
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

            {/* Dynamic Article Sidebar Ads (First 2 ads on top of Breaking News) */}
            {customArticleRightAds.slice(0, 2).map((ad) => (
              <a
                key={ad.id}
                href={ad.body || '#'}
                target={ad.body ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!ad.body) e.preventDefault();
                }}
                className="w-full h-[160px] flex items-center justify-center bg-slate-50/50 overflow-hidden rounded-xl border border-slate-200/80 hover:shadow transition-shadow duration-200 mb-3"
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-contain"
                />
              </a>
            ))}

            {/* Latest News */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="bg-[#e60000] text-white px-3 py-2.5">
                <span className="font-black text-base telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  బ్రేకింగ్ న్యూస్
                </span>
              </div>
              <ul className="divide-y divide-gray-100">
                {displayLatest.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="flex items-start gap-3 px-3 py-3.5 hover:bg-red-50/50 transition-colors group"
                    >
                      <span className="w-2 h-2 bg-[#e60000] mt-1.5 flex-shrink-0 rounded-[1px]"></span>
                      <p
                        className="flex-1 min-w-0 text-[14.5px] md:text-[15.5px] font-semibold text-gray-700 group-hover:text-[#e60000] line-clamp-2 telugu-text pl-0.5"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: '1.7' }}
                      >
                        {item.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dynamic Article Sidebar Ads (Next 2 ads between Breaking News and Jilla Varthalu) */}
            {customArticleRightAds.slice(2, 4).map((ad) => (
              <a
                key={ad.id}
                href={ad.body || '#'}
                target={ad.body ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!ad.body) e.preventDefault();
                }}
                className="w-full h-[160px] flex items-center justify-center bg-slate-50/50 overflow-hidden rounded-xl border border-slate-200/80 hover:shadow transition-shadow duration-200 mb-3"
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-contain"
                />
              </a>
            ))}

            {/* district news */}
            <DistrictNewsTabs apNews={apNewsList} tgNews={tgNewsList} />

            {/* Dynamic Article Sidebar Ads (Next 2 ads between Jilla Varthalu and Polls) */}
            {customArticleRightAds.slice(4, 6).map((ad) => (
              <a
                key={ad.id}
                href={ad.body || '#'}
                target={ad.body ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!ad.body) e.preventDefault();
                }}
                className="w-full h-[160px] flex items-center justify-center bg-slate-50/50 overflow-hidden rounded-xl border border-slate-200/80 hover:shadow transition-shadow duration-200 mb-3"
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-contain"
                />
              </a>
            ))}

            {/* Article Page Poll Widget */}
            <div className="mt-3">
              <PollWidget scope="article" />
            </div>

            {/* Dynamic Article Sidebar Ads (Remaining ads after Polls continuously) */}
            {customArticleRightAds.slice(6).map((ad) => (
              <a
                key={ad.id}
                href={ad.body || '#'}
                target={ad.body ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!ad.body) e.preventDefault();
                }}
                className="w-full h-[160px] flex items-center justify-center bg-slate-50/50 overflow-hidden rounded-xl border border-slate-200/80 hover:shadow transition-shadow duration-200 mb-3"
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-contain"
                />
              </a>
            ))}
          </aside>

        </div>
      </main>
    );
  }

  // ═══ COMPACT LAYOUT (DEFAULT VIEW) ═══
  return (
    <main className="max-w-[1050px] mx-auto bg-white shadow-md border-x border-gray-200 px-2.5 py-4 md:px-4">
      {/* Mobile-only Ad — top rotating banner */}
      <MobileArticleTopAd categorySlug={currentCategorySlug} />

      {/* Breadcrumb & Back Button */}
      <div className="flex items-center justify-between gap-4 mb-4 border-b border-gray-100 pb-3 overflow-hidden">
        <div className="flex items-center gap-1 md:gap-2 text-[13px] md:text-[17.5px] text-gray-500 font-sans whitespace-nowrap overflow-x-auto hide-scrollbar">
          <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
            <Home size={14} className="flex-shrink-0" /> Home
          </Link>
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
          {matchedDistrict ? (
            <>
              <Link href={`/category/${districtStateSlug}`} className="hover:text-brand-blue transition-colors font-bold flex-shrink-0 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                {districtStateName}
              </Link>
              <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
              <Link href={`/district/${districtStateSlug}/${article.districtSlug}`} className="hover:text-brand-blue transition-colors font-bold flex-shrink-0 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                {matchedDistrict.name}
              </Link>
            </>
          ) : (
            <Link href={`/category/${currentCategorySlug}`} className="hover:text-brand-blue transition-colors font-bold flex-shrink-0">
              {englishCategories[currentCategorySlug] || article.category}
            </Link>
          )}
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-400 truncate max-w-[200px] telugu-text flex-shrink-0" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            {article.title?.replace(/<[^>]*>/g, '')}
          </span>
        </div>
        <div className="flex-shrink-0">
          <BackButton />
        </div>
      </div>

      {/* Main Article Details Section (2-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2 pb-4 border-b border-gray-100 items-start">
        
        {/* Left Column: Hero Image & Ad */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-3">
          <div className="overflow-hidden w-full">
            <FallbackImage
              src={article.image}
              alt={article.title?.replace(/<[^>]*>/g, '')}
              fill={false}
              width={900}
              height={600}
              className="w-full h-auto block"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </div>
          {article.imageCaption && (
            <div 
              className="px-1 pb-1.5 pt-1 text-[13px] md:text-[14px] font-bold text-gray-600 telugu-text border-b border-gray-100" 
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              dangerouslySetInnerHTML={{ __html: article.imageCaption }}
            />
          )}

        </div>

        {/* Right Column: Metadata, Red Title, Limited Description, Button */}
        <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-start">
          
          {/* Meta Row: Date/Time */}
          <div className="flex items-center gap-1.5 text-gray-500 font-sans meta-info mb-2.5">
            <Calendar size={14} className="text-[#02599c]" />
            <span className="font-semibold">{formatDate(article.publishedAt)}</span>
          </div>

          {/* Red Headline */}
          <h1
            className="main-headline telugu-text text-[#cc0000] mb-3.5"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: article.title }}
          />

          {/* Limited Description & Toggled Read Button */}
          <div className="telugu-text space-y-[18px] text-gray-800 article-body" style={{ fontFamily: 'Mandali, "Noto Sans Telugu", sans-serif', lineHeight: '1.85' }}>
            {/* Inline Image Section */}
            {!article.body && inlineImage && (
              <div className="my-5 w-full text-center">
                <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-black/5">
                  {/* Red slide indicator similar to screenshot */}
                  <div className="absolute top-3 left-3 bg-[#cc0000] text-white text-[11px] font-black px-2 py-0.5 rounded tracking-wide z-10 font-sans">
                    1/1
                  </div>
                  <FallbackImage
                    src={inlineImage}
                    alt={inlineCaption}
                    className="w-full h-auto object-contain block max-h-[500px] mx-auto"
                  />
                </div>
                {inlineCaption && (
                  <div className="mt-2 text-center text-[13.5px] font-bold text-gray-700 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    {inlineCaption}
                  </div>
                )}
              </div>
            )}

            <p className="article-summary telugu-text" dangerouslySetInnerHTML={{
              __html: article.body ? article.description : `${article.description} ఈ వార్తకు సంబంధించిన విశేషాలు క్రింద వివరించబడ్డాయి. తాజా సమాచారం ఇక్కడ లభిస్తుంది.`
            }} />
          </div>



          {/* Reporter Info & Share (Compact footer) */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-gray-500 font-sans text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-5.5 h-5.5 bg-[#025390] rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-black">హై</span>
              </div>
              <Link href={`/reporter/${reporter.slug}`} className="font-bold text-[#025390] hover:text-red-600 transition-colors telugu-text" style={{ fontFamily: 'Mandali, sans-serif' }}>
                {reporter.name}
              </Link>
            </div>
            <ShareButton title={article.title?.replace(/<[^>]*>/g, '')} />
          </div>

          {/* "పూర్తిగా చదవండి" button under reporter/share */}
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#cc0000] hover:bg-[#e60000] text-white font-black text-[15px] md:text-[16px] px-6 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer select-none telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              పూర్తిగా చదవండి
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Section: మరిన్ని వార్తలు చదవండి (Read More News) */}
      <div className="mt-6 text-left">
        <h2
          className="font-black text-[#cc0000] text-[20px] md:text-[24px] mb-3.5 telugu-text"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          మరిన్ని వార్తలు చదవండి
        </h2>

        {/* Bordered box containing other news items */}
        <div className="border border-gray-250 rounded-xl p-2 md:p-4 bg-white shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {otherNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="flex gap-3 hover:bg-blue-50/30 p-1 md:p-1.5 rounded-lg transition-colors group"
              >
                <div className="w-[75px] h-[50px] md:w-[90px] md:h-[60px] flex-shrink-0 overflow-hidden rounded-md bg-gray-50 border border-gray-150 relative flex items-center justify-center">
                  <FallbackImage
                    src={item.image}
                    alt={item.title}
                    fill
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1 flex flex-col justify-start pl-1">
                  <p
                    className="text-[13.5px] sm:text-[14.5px] md:text-[16.5px] font-bold text-gray-800 group-hover:text-[#02599c] transition-colors leading-relaxed telugu-text line-clamp-4 md:line-clamp-3 pb-1 pl-1"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-only Sidebar components (Trending, Breaking, District News, Poll, Ads) */}
      <MobileArticleFooter
        categorySlug={currentCategorySlug}
        displayTrending={displayTrending}
        displayLatest={displayLatest}
        apNewsList={apNewsList}
        tgNewsList={tgNewsList}
      />

      {/* English to Telugu Translate Popup Alert (slides in on bottom-right) */}
      {isMounted && article.categorySlug === 'satya-bytes' && showTranslatePopup && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-[330px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-slate-100 p-4 flex flex-col gap-3 font-sans animate-fade-in text-left">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 animate-pulse">
                <span className="text-sm font-bold">🌐</span>
              </div>
              <div className="text-left">
                <h4 className="text-sm font-black text-slate-800">English to Telugu translation</h4>
                <p className="text-[11px] text-gray-400">Read this Satya Bytes article in Telugu</p>
              </div>
            </div>
            <button 
              onClick={() => setShowTranslatePopup(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold w-6 h-6 rounded-full hover:bg-slate-50 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-[12px] text-slate-600 leading-normal pl-0.5 text-left">
            You can translate the full article content to Telugu instantly using our automated reader.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => {
                setShowTranslatePopup(false);
                handleTranslate();
              }}
              className="flex-1 bg-[#cc0000] hover:bg-[#b00000] text-white font-black text-[12px] py-2 px-3 rounded-lg shadow-sm active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Translate / తెలుగు అనువాదం
            </button>
            <button
              onClick={() => setShowTranslatePopup(false)}
              className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-55 rounded-lg text-[12px] font-bold transition-all duration-200 cursor-pointer"
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* Translation Progress & Full-Screen Reading Modal */}
      {isMounted && showTranslateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-slate-50 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden font-sans transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 text-left">
                <span className="text-xl">🌐</span>
                <div>
                  <h3 className="text-base font-black text-slate-800">English to Telugu Translation</h3>
                  <p className="text-[11px] text-gray-400">Powered by Google Neural Translation API</p>
                </div>
              </div>
              <button
                onClick={() => setShowTranslateModal(false)}
                className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 select-text text-left">
              {isTranslating ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-700">Translating article content...</p>
                    <p className="text-xs text-slate-400 mt-1">Applying neural linguistic translation for natural reading</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Translated Title */}
                  <h2 
                    className="text-2xl md:text-3xl font-black text-red-600 telugu-text leading-snug"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: translatedTitle || '' }}
                  />

                  {/* Translated Content */}
                  <div 
                    className="telugu-text text-slate-700 text-sm md:text-base leading-relaxed space-y-4 article-body"
                    style={{ fontFamily: 'Mandali, "Noto Sans Telugu", sans-serif', lineHeight: '1.85' }}
                    dangerouslySetInnerHTML={{ __html: translatedBody || '' }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!isTranslating && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => {
                    setShowTelugu(!showTelugu);
                    setShowTranslateModal(false);
                  }}
                  className="bg-[#cc0000] hover:bg-[#b00000] text-white font-black text-xs md:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer text-center"
                >
                  {showTelugu ? 'Show English on Main Page' : 'Apply Telugu to Main Page / పేజీలో చదవండి'}
                </button>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setShowTelugu(!showTelugu);
                    }}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs md:text-sm py-2.5 px-4 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    {showTelugu ? 'View English Text' : 'View Telugu Text'}
                  </button>
                  <button
                    onClick={() => setShowTranslateModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs md:text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
