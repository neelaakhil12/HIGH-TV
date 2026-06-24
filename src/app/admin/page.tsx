'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Trash2, 
  Plus, 
  Video, 
  Megaphone, 
  FileText, 
  Image as ImageIcon, 
  LogOut, 
  Settings, 
  Tv, 
  Info,
  LayoutDashboard,
  Upload,
  Calendar,
  User,
  Eye,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Pencil,
  ArrowLeft,
  Search,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Eraser,
  Type,
  Maximize2,
  Globe,
  Sliders,
  FileCheck,
  TrendingUp
} from 'lucide-react';

import { 
  politicsNews,
  entertainmentNews,
  sportsNews,
  technologyNews,
  businessNews,
  healthNews,
  viralNews,
  rasipalaluNews,
  adyathmikamNews,
  sampadakiyamNews,
  womenNews,
  lifestyleNews,
  districtNews,
  vidyaNews,
  admissionsNews,
  currentAffairsNews,
  upadiNews,
  notificationNews,
  webstoriesNews,
  antharmadanamNews,
  getMergedArticles,
  apDistricts,
  tgDistricts,
  featuredNews,
  videoNews
} from '@/lib/mockData';

// Main 22 Pages/Categories List (excluding subpages)
const MAIN_CATEGORIES_LIST = [
  { slug: 'latest', name: 'బ్రేకింగ్ న్యూస్ (Breaking)' },
  { slug: 'trending', name: 'ట్రెండింగ్ వార్తలు (Trending)' },
  { slug: 'featured', name: 'ముఖ్య వార్తలు (Featured)' },
  { slug: 'politics', name: 'రాజకీయాలు (Politics)' },
  { slug: 'national', name: 'నేషనల్ (National)' },
  { slug: 'international', name: 'వరల్డ్ (World)' },
  { slug: 'business', name: 'బిజినెస్ (Business)' },
  { slug: 'entertainment', name: 'ఫిల్మ్ (Entertainment)' },
  { slug: 'sports', name: 'స్పోర్ట్స్ (Sports)' },
  { slug: 'technology', name: 'టెక్నాలజీ (Technology)' },
  { slug: 'viral', name: 'వైరల్ (Viral)' },
  { slug: 'lifestyle', name: 'లైఫ్ స్టైల్ (Lifestyle)' },
  { slug: 'rasipalalu', name: 'శుభఫలాలు (Astrology)' },
  { slug: 'photos', name: 'ఆల్బమ్‌లు (Photos)' },
  { slug: 'videos', name: 'వీడియోలు (Videos)' },
  { slug: 'webstories', name: 'వెబ్ స్టోరీస్ (Web Stories)' },
  { slug: 'sampadakiyam', name: 'ఎడిటోరియల్ (Editorial)' },
  { slug: 'women', name: 'ఆమె (Women)' },
  { slug: 'antharmadanam', name: 'వ్యక్తిత్వ వికాసం (Opinion)' },
  { slug: 'adyathmikam', name: 'దైవం (Devotional)' },
  { slug: 'citizen-reporter', name: 'సిటిజన్ రిపోర్టర్' },
  { slug: 'team', name: 'మా టీమ్' },
  { slug: 'weather', name: 'వెదర్' },
  { slug: 'epaper', name: 'ఈ-పేపర్' },
];

const SIDEBAR_CATEGORIES = [
  { slug: 'home', name: 'హోమ్ పేజీ (Home Page)' },
  { slug: 'latest', name: 'బ్రేకింగ్ న్యూస్ (Breaking)' },
  { slug: 'telangana', name: 'తెలంగాణ (Telangana)' },
  { slug: 'telangana-districts', name: 'తెలంగాణ జిల్లా వార్తలు' },
  { slug: 'andhra-pradesh', name: 'ఆంధ్రప్రదేశ్ (Andhra Pradesh)' },
  { slug: 'andhra-pradesh-districts', name: 'ఆంధ్రప్రదేశ్ జిల్లా వార్తలు' },
  { slug: 'politics', name: 'రాజకీయాలు (Politics)' },
  { slug: 'national', name: 'నేషనల్ (National)' },
  { slug: 'international', name: 'వరల్డ్ (World)' },
  { slug: 'business', name: 'బిజినెస్ (Business)' },
  { slug: 'sports', name: 'స్పోర్ట్స్ (Sports)' },
  { slug: 'entertainment', name: 'సినిమా (Film)' },
  { slug: 'technology', name: 'టెక్నాలజీ (Technology)' },
  { slug: 'health', name: 'ఆరోగ్యం (Health)' },
  { slug: 'viral', name: 'వైరల్ (Viral)' },
  { slug: 'lifestyle', name: 'లైఫ్ స్టైల్ (Lifestyle)' },
  { slug: 'women', name: 'ఆమె (Women)' },
  { slug: 'adyathmikam', name: 'దైవం (Daivam / Devotional)' },
  { slug: 'vidya', name: 'విద్య (Vidya)' },
  { slug: 'upadi', name: 'ఉపాధి (Upadi)' },
  { slug: 'rasipalalu', name: 'శుభఫలాలు (Astrology)' },
  { slug: 'sampadakiyam', name: 'ఎడిటోరియల్ (Editorial)' },
  { slug: 'antharmadanam', name: 'వ్యక్తిత్వ వికాసం (Opinion)' },
];

const getArticleCategoryName = (art: any) => {
  if (art.districtSlug) {
    const allDist = [...tgDistricts, ...apDistricts];
    const dist = allDist.find(d => d.slug === art.districtSlug);
    const engName = art.districtSlug
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return dist ? `${engName} (${dist.name})` : engName;
  }
  return art.category || art.categorySlug || 'News';
};

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Dashboard navigation tab: 'dashboard', 'news', 'breaking', 'categories', 'overlays', 'epaper'
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // News filtering state (filters News list based on selected category in sidebar)
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Mode inside News Management: 'list', 'add', 'edit'
  const [newsViewMode, setNewsViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [isSavingArticle, setIsSavingArticle] = useState(false);
  
  // General configs states
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Form states (popups, tickers, media)
  const [customNewsList, setCustomNewsList] = useState<any[]>([]);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar category news pins
  const [sidebarCategoryPins, setSidebarCategoryPins] = useState<Record<string, { trending: string[]; breaking: string[] }>>({});
  const [activeSidebarCategory, setActiveSidebarCategory] = useState<string>('home');
  const [activeSidebarDistrict, setActiveSidebarDistrict] = useState<string>(''); // for district sub-selection
  const [sidebarNewsSearch, setSidebarNewsSearch] = useState<string>('');

  // Expandable sections for sidebar groups
  const [expandedSidebar, setExpandedSidebar] = useState<Record<string, boolean>>({
    main: false,
    ap: false,
    telangana: false,
    health: false,
    education: false,
    career: false,
  });

  // Expandable sections for add/edit classification
  const [expandedClassification, setExpandedClassification] = useState<Record<string, boolean>>({
    ap: false,
    telangana: false,
    health: false,
    education: false,
    career: false,
    others: false
  });

  // Form field states
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSlug, setNewsSlug] = useState('');
  const [newsDescription, setNewsDescription] = useState('');
  const [newsAuthor, setNewsAuthor] = useState('హై టీవీ డెస్క్');
  const [newsPublishedDate, setNewsPublishedDate] = useState('');
  const [newsImage, setNewsImage] = useState('');

  // Story placement flag checkboxes
  const [isBreakingChecked, setIsBreakingChecked] = useState(false);
  const [isTrendingChecked, setIsTrendingChecked] = useState(false);
  const [isFeaturedChecked, setIsFeaturedChecked] = useState(false);

  // Homepage slider states
  const [sliderSlidesList, setSliderSlidesList] = useState<any[]>([]);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideImage, setNewSlideImage] = useState('');
  const [newSlideLink, setNewSlideLink] = useState('');
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  // Article-picker for slider: set of article IDs selected to show in the homepage slider
  const [sliderSelectedIds, setSliderSelectedIds] = useState<Set<string>>(new Set());
  const [sliderSearchQuery, setSliderSearchQuery] = useState('');

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // WYSIWYG Editor references
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);

  // Image Resizer overlay state
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [resizerStyle, setResizerStyle] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const resizeDragRef = useRef<{ startX: number; startY: number; startW: number; startH: number; handle: string } | null>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  // General Banners / Ad configs
  const [customAds, setCustomAds] = useState<Record<string, { enabled: boolean; image: string; link: string }>>({});
  const [activeAdSpot, setActiveAdSpot] = useState<'leaderboard' | 'sidebar' | 'rectangle'>('leaderboard');
  const [adSpotEnabled, setAdSpotEnabled] = useState(false);
  const [adSpotImage, setAdSpotImage] = useState('');
  const [adSpotLink, setAdSpotLink] = useState('#');

  // Flash News (Marquee) config
  const [flashNewsList, setFlashNewsList] = useState<{ text: string; link: string }[]>([]);
  const [newNewsText, setNewNewsText] = useState('');
  const [newNewsLink, setNewNewsLink] = useState('');
  const [editingFlashIndex, setEditingFlashIndex] = useState<number | null>(null);
  const [showFlashArticlePicker, setShowFlashArticlePicker] = useState(false);
  const [flashArticleSearch, setFlashArticleSearch] = useState('');

  // Trending News Ticker config
  const [trendingNewsList, setTrendingNewsList] = useState<{ text: string; link: string }[]>([]);
  const [newTrendingText, setNewTrendingText] = useState('');
  const [newTrendingLink, setNewTrendingLink] = useState('');
  const [editingTrendingIndex, setEditingTrendingIndex] = useState<number | null>(null);
  const [showTrendingArticlePicker, setShowTrendingArticlePicker] = useState(false);
  const [trendingArticleSearch, setTrendingArticleSearch] = useState('');

  // Homepage Settings: youtube list
  const [videosList, setVideosList] = useState<{ id: string; title: string; thumbnail: string }[]>([]);

  // Popups config
  const [popupScope, setPopupScope] = useState<'home' | 'article'>('home');
  const [popupEnabled, setPopupEnabled] = useState(true);
  const [popupType, setPopupType] = useState<'ad' | 'poll'>('ad');
  const [adImage, setAdImage] = useState('/popup-ad.png');
  const [adLink, setAdLink] = useState('#');
  const [pollQuestion, setPollQuestion] = useState('కాంగ్రెస్‌లో టీఎన్ఎస్ పార్టీని విలీనం చేస్తారని మీరు భావిస్తున్నారా?');
  const [optYes, setOptYes] = useState('అవును');
  const [optNo, setOptNo] = useState('కాదు');
  const [optUnsure, setOptUnsure] = useState('చెప్పలేం');

  // Inline Image Config
  const [inlineImageEnabled, setInlineImageEnabled] = useState(false);
  const [inlineImageData, setInlineImageData] = useState('');
  const [inlineImageCaption, setInlineImageCaption] = useState('యోగ ఆసనాలు వేస్తున్న మోదీ..');
  
  // Inline Article Promo Config
  const [inlinePromosEnabled, setInlinePromosEnabled] = useState(true);

  // Rich Text Editor Related News Inserter Modal Config
  const [showPromoLinkModal, setShowPromoLinkModal] = useState(false);
  const [promoSearchQuery, setPromoSearchQuery] = useState('');
  const [customPromoTitle, setCustomPromoTitle] = useState('');
  const [customPromoSlug, setCustomPromoSlug] = useState('');
  const savedSelectionRangeRef = useRef<Range | null>(null);
  const [selectedPromoBox, setSelectedPromoBox] = useState<HTMLDivElement | null>(null);
  const [promoBoxStyle, setPromoBoxStyle] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // E-Paper PDF Config
  const [epapersList, setEpapersList] = useState<{ id: string; title: string; date: string; pdfUrl: string }[]>([]);
  const [epaperTitle, setEpaperTitle] = useState('');
  const [epaperDate, setEpaperDate] = useState('');
  const [epaperPdf, setEpaperPdf] = useState('');

  // Authorization Check
  useEffect(() => {
    const authSession = localStorage.getItem('high_tv_admin_session');
    if (authSession !== 'authenticated') {
      router.push('/superadminlogin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Load custom list and configs on load/refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load Custom News Articles from Database API and merge with localStorage custom articles
    fetch('/api/articles?limit=500&t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          try {
            const localCustom = JSON.parse(localStorage.getItem('custom_news_articles') || '[]');
            const localDeleted = new Set(JSON.parse(localStorage.getItem('deleted_news_articles') || '[]'));
            const localModified = JSON.parse(localStorage.getItem('modified_news_articles') || '{}');

            const activeLocal = localCustom
              .filter((art: any) => !localDeleted.has(art.id))
              .map((art: any) => {
                if (localModified[art.id]) {
                  return { ...art, ...localModified[art.id] };
                }
                return art;
              });

            const combined = [...data];
            const seenIds = new Set(data.map((art: any) => art.id));
            const seenSlugs = new Set(data.map((art: any) => art.slug));

            activeLocal.forEach((art: any) => {
              if (!seenIds.has(art.id) && !seenSlugs.has(art.slug)) {
                combined.push(art);
                seenIds.add(art.id);
                seenSlugs.add(art.slug);
              }
            });

            setCustomNewsList(combined);
          } catch (e) {
            console.error('Error merging local custom articles in admin:', e);
            setCustomNewsList(data);
          }
        }
      })
      .catch(err => console.error('Error loading articles in admin:', err));


    // Load Flash news
    try {
      const savedTicker = localStorage.getItem('flash_news_items');
      if (savedTicker) {
        setFlashNewsList(JSON.parse(savedTicker));
      } else {
        const defaults = [
          { text: "ముంబై ఎయిర్‌పోర్ట్‌లో భారీగా బంగారం పట్టివేత", link: "/search?q=బంగారం" },
          { text: "నేడు ఏపీ కేబినెట్‌ కీలక భేటీ.. పలు కీలక నిర్ణయాలు తీసుకునే అవకాశం", link: "/search?q=ఏపీ కేబినెట్‌" },
          { text: "తెలంగాణలో రాబోయే రెండు రోజుల్లో భారీ వర్షాలు కురిసే అవకాశం", link: "/search?q=వర్షాలు" },
          { text: "భారత క్రికెట్ జట్టు సంచలన విజయం.. సిరీస్ సొంతం చేసుకున్న టీమిండియా", link: "/search?q=క్రికెట్" }
        ];
        setFlashNewsList(defaults);
      }
    } catch {
      setFlashNewsList([]);
    }

    // Load Trending news ticker items
    try {
      const savedTrending = localStorage.getItem('trending_news_items');
      if (savedTrending) {
        setTrendingNewsList(JSON.parse(savedTrending));
      } else {
        // These are the same defaults used in Header.tsx
        const trendingDefaults = [
          { text: "ఎన్నికల ఫలితాలు", link: "/search?q=ఎన్నికల ఫలితాలు" },
          { text: "ఆంధ్రప్రదేశ్‌లో భారీ వర్షాలు", link: "/search?q=వర్షాలు" },
          { text: "హైదరాబాద్ మెట్రో విస్తరణ", link: "/search?q=మెట్రో" },
          { text: "బంగారం ధరలు నేటి అప్‌డేట్స్", link: "/search?q=బంగారం" },
          { text: "టీమిండియా వన్డే సిరీస్ విజయం", link: "/search?q=క్రికెట్" },
          { text: "నేటి రాశిఫలాలు", link: "/search?q=రాశిఫలాలు" },
          { text: "వెబ్ స్టోరీస్ గ్యాలరీ", link: "/category/webstories" }
        ];
        setTrendingNewsList(trendingDefaults);
      }
    } catch {
      setTrendingNewsList([]);
    }

    // Load Videos list
    try {
      setVideosList(JSON.parse(localStorage.getItem('latest_videos') || '[]'));
    } catch {
      setVideosList([]);
    }

    // Load Custom Ads
    try {
      const parsedAds = JSON.parse(localStorage.getItem('custom_ads_config') || '{}');
      setCustomAds(parsedAds);
      const activeAd = parsedAds[activeAdSpot] || { enabled: false, image: '', link: '#' };
      setAdSpotEnabled(activeAd.enabled);
      setAdSpotImage(activeAd.image);
      setAdSpotLink(activeAd.link);
    } catch {
      setCustomAds({});
    }

    // Load popups
    const savedEnabled = localStorage.getItem(`promo_popup_${popupScope}_enabled`);
    const savedType = localStorage.getItem(`promo_popup_${popupScope}_type`);
    const savedAdImage = localStorage.getItem(`promo_ad_${popupScope}_image`);
    const savedAdLink = localStorage.getItem(`promo_ad_${popupScope}_link`);
    const savedPollQuestion = localStorage.getItem(`promo_poll_${popupScope}_question`);
    const savedOptYes = localStorage.getItem(`promo_poll_${popupScope}_option_yes`);
    const savedOptNo = localStorage.getItem(`promo_poll_${popupScope}_option_no`);
    const savedOptUnsure = localStorage.getItem(`promo_poll_${popupScope}_option_unsure`);

    setPopupEnabled(savedEnabled === null ? true : savedEnabled === 'true');
    setPopupType((savedType as 'ad' | 'poll') || 'ad');
    setAdImage(savedAdImage || '/popup-ad.png');
    setAdLink(savedAdLink || '#');
    setPollQuestion(savedPollQuestion || 'కాంగ్రెస్‌లో టీఎన్ఎస్ పార్టీని విలీనం చేస్తారని మీరు భావిస్తున్నారా?');
    setOptYes(savedOptYes || 'అవును');
    setOptNo(savedOptNo || 'కాదు');
    setOptUnsure(savedOptUnsure || 'చెప్పలేం');

    // Inline Image
    setInlineImageEnabled(localStorage.getItem('inline_article_image_enabled') === 'true');
    setInlineImageData(localStorage.getItem('inline_article_image_data') || '');
    setInlineImageCaption(localStorage.getItem('inline_article_image_caption') || 'యోగ ఆసనాలు వేస్తున్న మోదీ..');

    // Inline Promos
    const savedInlinePromos = localStorage.getItem('inline_article_promos_enabled');
    setInlinePromosEnabled(savedInlinePromos === null ? true : savedInlinePromos === 'true');

    // E-paper list
    try {
      setEpapersList(JSON.parse(localStorage.getItem('custom_epapers') || '[]'));
    } catch {
      setEpapersList([]);
    }

    // Load Homepage slides
    try {
      const savedSlides = localStorage.getItem('homepage_banner_slides');
      if (savedSlides) {
        setSliderSlidesList(JSON.parse(savedSlides));
      } else {
        const defaults = featuredNews.map(item => ({
          title: item.title,
          image: item.image,
          link: `/news/${item.slug}`
        }));
        setSliderSlidesList(defaults);
      }
      // Load selected slider article IDs
      const savedSliderIds = localStorage.getItem('homepage_slider_article_ids');
      if (savedSliderIds) {
        setSliderSelectedIds(new Set(JSON.parse(savedSliderIds)));
      }
    } catch {
      setSliderSlidesList([]);
    }

    // Load Category Sidebar news pins
    try {
      const savedPins = localStorage.getItem('sidebar_category_pins');
      if (savedPins) {
        setSidebarCategoryPins(JSON.parse(savedPins));
      }
    } catch (e) {
      console.error("Error loading sidebar_category_pins", e);
    }
  }, [isAuthenticated, popupScope, activeAdSpot, refreshCounter]);

  // Clear published date when switching to add mode — it will be set automatically at publish time
  useEffect(() => {
    if (newsViewMode === 'add') {
      setNewsPublishedDate(''); // Will be auto-set to current time when Publish is clicked
      setNewsTitle('');
      setNewsSlug('');
      setNewsDescription('');
      setNewsImage('');
      setEditingArticle(null);
      
      // Auto-check Target Placement based on current sidebar filterCategory
      setIsBreakingChecked(filterCategory === 'latest');
      setIsTrendingChecked(filterCategory === 'trending');
      setIsFeaturedChecked(filterCategory === 'featured');

      // Auto-check filterCategory in classification tree
      if (
        filterCategory !== 'all' && 
        filterCategory !== 'latest' && 
        filterCategory !== 'trending' && 
        filterCategory !== 'featured'
      ) {
        setSelectedCategories([filterCategory]);
      } else {
        setSelectedCategories([]);
      }
      setTimeout(() => {
        if (editorRef.current) editorRef.current.innerHTML = '';
      }, 50);
    }
  }, [newsViewMode, filterCategory]);

  // Auto slug generation — produces English-only slug (strips Telugu/non-ASCII chars)
  useEffect(() => {
    if (newsViewMode === 'add' && newsTitle) {
      const cleanTitle = newsTitle.trim().toLowerCase()
        .replace(/[\u0C00-\u0C7F\u0900-\u097F\u0600-\u06FF]/g, '') // Strip Telugu, Hindi, Arabic scripts
        .replace(/[^a-z0-9\s-]/g, '')  // Keep only English letters, numbers, spaces, hyphens
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/-+/g, '-')            // Collapse multiple hyphens
        .replace(/^-|-$/g, '');         // Trim leading/trailing hyphens
      const suffix = Date.now().toString().slice(-4);
      setNewsSlug(cleanTitle ? `${cleanTitle}-${suffix}` : `article-${suffix}`);
    }
  }, [newsTitle, newsViewMode]);

  // Canvas Image Compression (rescale to max 800px width, 70% quality JPG)
  const handleCompressAndSetImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedBase64);
      };
    };
  };

  // ── Handle featured image upload
  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        setNewsImage(base64);
      });
    }
  };

  // ── WYSIWYG execCommand formatting helpers
  const handleFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFontSize = (size: string) => {
    if (!size) return;
    document.execCommand('fontSize', false, '7');
    const fontElements = editorRef.current?.getElementsByTagName('font');
    if (fontElements) {
      for (let i = fontElements.length - 1; i >= 0; i--) {
        const el = fontElements[i];
        if (el.getAttribute('size') === '7') {
          el.removeAttribute('size');
          el.style.fontSize = size;
        }
      }
    }
    editorRef.current?.focus();
  };

  // ── Inline Media Upload & Reference Insertion
  const handleInlineImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        try {
          const mediaLibrary = JSON.parse(localStorage.getItem('custom_media_library') || '{}');
          const mediaId = `img-${Date.now()}`;
          const mediaPath = `/uploaded-media/${mediaId}.jpg`;
          
          mediaLibrary[mediaPath] = base64;
          localStorage.setItem('custom_media_library', JSON.stringify(mediaLibrary));
          
          // Insert actual HTML image element in editor with raw base64 as src
          const imgHTML = `<img src="${base64}" class="w-full h-auto rounded-xl my-4 block" alt="inline-img" />`;
          insertElementAtCursor(imgHTML);
        } catch {
          alert('Local media library is full! Compress your image or clear browser history.');
        }
      });
    }
  };

  const handleInlineVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Video file is too large! Please select a file smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        try {
          const mediaLibrary = JSON.parse(localStorage.getItem('custom_media_library') || '{}');
          const mediaId = `vid-${Date.now()}`;
          const mediaPath = `/uploaded-media/${mediaId}.mp4`;
          
          mediaLibrary[mediaPath] = reader.result as string;
          localStorage.setItem('custom_media_library', JSON.stringify(mediaLibrary));
          
          // Insert actual video element in editor with raw dataURL as src
          const videoHTML = `<video src="${reader.result as string}" controls class="w-full h-auto rounded-xl my-4 block"></video>`;
          insertElementAtCursor(videoHTML);
        } catch {
          alert('Local media library is full! Please use shorter videos.');
        }
      };
    }
  };

  const insertElementAtCursor = (html: string) => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const div = document.createElement('div');
      div.innerHTML = html;
      const fragment = document.createDocumentFragment();
      let child;
      while ((child = div.firstChild)) {
        fragment.appendChild(child);
      }
      range.insertNode(fragment);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
      }
    }
  };

  const handleOpenPromoModal = () => {
    // Save current range before opening modal
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRangeRef.current = selection.getRangeAt(0).cloneRange();
    } else {
      savedSelectionRangeRef.current = null;
    }
    setPromoSearchQuery('');
    setCustomPromoTitle('');
    setCustomPromoSlug('');
    setShowPromoLinkModal(true);
  };

  const handleInsertPromoLink = (title: string, slug: string) => {
    const cleanSlug = slug.trim().replace(/^\//, ''); // Clean leading slash if any
    const linkUrl = cleanSlug.startsWith('http') ? cleanSlug : `/news/${cleanSlug}`;
    const promoHtml = `<div data-promo-box="true" class="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2.5 bg-red-50/50 border-l-4 border-[#e60000] rounded px-4 py-3 my-4 text-[14px] md:text-[18px] select-none" contenteditable="false" style="border-left: 4px solid #e60000; background-color: rgba(254, 242, 242, 0.5); padding: 12px 16px; margin: 16px 0; border-radius: 4px; display: flex; flex-direction: row; gap: 10px; align-items: flex-start; text-align: left;"><span class="text-[#e60000] font-black flex-shrink-0 telugu-text font-bold" style="font-family: 'Noto Sans Telugu', sans-serif; color: #e60000; font-weight: bold; flex-shrink: 0; white-space: nowrap;">ఈ వార్తా చదవండి:</span><a href="${linkUrl}" class="text-[#02599c] font-bold hover:text-[#e60000] hover:underline transition-colors telugu-text leading-snug" style="font-family: 'Noto Sans Telugu', sans-serif; color: #02599c; font-weight: bold; text-decoration: none; line-height: 1.375;">${title}</a></div>`;

    editorRef.current?.focus();
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      if (savedSelectionRangeRef.current) {
        selection.addRange(savedSelectionRangeRef.current);
      }
    }

    insertElementAtCursor(promoHtml);
    setShowPromoLinkModal(false);
  };

  // ── Image Resizer: calculate and show overlay over clicked image
  const updateResizerPosition = (img: HTMLImageElement) => {
    const wrapper = editorWrapperRef.current;
    if (!wrapper) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    setResizerStyle({
      top: imgRect.top - wrapperRect.top + wrapper.scrollTop,
      left: imgRect.left - wrapperRect.left,
      width: imgRect.width,
      height: imgRect.height,
    });
  };

  const updatePromoBoxPosition = (box: HTMLDivElement) => {
    const wrapper = editorWrapperRef.current;
    if (!wrapper) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    setPromoBoxStyle({
      top: boxRect.top - wrapperRect.top + wrapper.scrollTop,
      left: boxRect.left - wrapperRect.left,
      width: boxRect.width,
      height: boxRect.height,
    });
  };

  const handleEditorImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    // 1. Check if we clicked on or inside a related news promo box
    const promoBox = target.closest('[data-promo-box="true"]') as HTMLDivElement | null;
    if (promoBox) {
      setSelectedPromoBox(promoBox);
      updatePromoBoxPosition(promoBox);
      
      // Clear image selection
      setSelectedImage(null);
      setResizerStyle(null);
      return;
    } else {
      setSelectedPromoBox(null);
      setPromoBoxStyle(null);
    }

    // 2. Original Image Selection
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      setSelectedImage(img);
      updateResizerPosition(img);
    } else {
      // Click outside image — deselect
      setSelectedImage(null);
      setResizerStyle(null);
    }
  };

  const handleResizerMouseDown = (e: React.MouseEvent<HTMLDivElement>, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImage || !resizerStyle) return;
    resizeDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: resizerStyle.width,
      startH: resizerStyle.height,
      handle,
    };
    const onMouseMove = (ev: MouseEvent) => {
      if (!resizeDragRef.current || !selectedImage) return;
      const { startX, startY, startW, startH, handle: h } = resizeDragRef.current;
      let dx = ev.clientX - startX;
      let dy = ev.clientY - startY;
      let newW = startW;
      let newH = startH;
      const aspectRatio = startH / startW;

      if (h === 'se') { newW = Math.max(60, startW + dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 'sw') { newW = Math.max(60, startW - dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 'ne') { newW = Math.max(60, startW + dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 'nw') { newW = Math.max(60, startW - dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 'e') { newW = Math.max(60, startW + dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 'w') { newW = Math.max(60, startW - dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 's') { newH = Math.max(40, startH + dy); newW = Math.round(newH / aspectRatio); }
      else if (h === 'n') { newH = Math.max(40, startH - dy); newW = Math.round(newH / aspectRatio); }

      selectedImage.style.width = `${newW}px`;
      selectedImage.style.height = `${newH}px`;
      updateResizerPosition(selectedImage);
    };
    const onMouseUp = () => {
      resizeDragRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Update resizer when window/editor scrolls
  const handleEditorScroll = () => {
    if (selectedImage) updateResizerPosition(selectedImage);
    if (selectedPromoBox) updatePromoBoxPosition(selectedPromoBox);
  };

  // ── Image Drag-to-Move handler
  const handleImageMoveStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImage) return;

    const img = selectedImage;
    const editor = editorRef.current;
    if (!editor) return;

    // Create ghost element that follows the cursor
    const ghost = document.createElement('div');
    ghost.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:9999',
      'opacity:0.55',
      'border:2px dashed #2563eb',
      'border-radius:6px',
      'background:#dbeafe',
      `width:${img.offsetWidth}px`,
      `height:${img.offsetHeight}px`,
      'transition:none',
    ].join(';');
    const ghostImg = document.createElement('img');
    ghostImg.src = img.src;
    ghostImg.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:4px;display:block;';
    ghost.appendChild(ghostImg);
    document.body.appendChild(ghost);

    // Offset so ghost is centered on cursor
    const offsetX = img.offsetWidth / 2;
    const offsetY = img.offsetHeight / 2;

    const moveGhost = (ev: MouseEvent) => {
      ghost.style.left = `${ev.clientX - offsetX}px`;
      ghost.style.top  = `${ev.clientY - offsetY}px`;
    };
    moveGhost(e.nativeEvent);

    // Show cursor drop indicator inside editor while dragging
    let dropIndicator: HTMLElement | null = null;

    const onMouseMove = (ev: MouseEvent) => {
      moveGhost(ev);

      // Highlight drop position using caret
      if (dropIndicator) { dropIndicator.remove(); dropIndicator = null; }

      const range = (() => {
        if ((document as any).caretRangeFromPoint) {
          return (document as any).caretRangeFromPoint(ev.clientX, ev.clientY) as Range | null;
        }
        if ((document as any).caretPositionFromPoint) {
          const pos = (document as any).caretPositionFromPoint(ev.clientX, ev.clientY);
          if (pos) {
            const r = document.createRange();
            r.setStart(pos.offsetNode, pos.offset);
            r.collapse(true);
            return r;
          }
        }
        return null;
      })();

      if (range && editor.contains(range.startContainer)) {
        dropIndicator = document.createElement('span');
        dropIndicator.style.cssText = 'display:inline-block;width:2px;height:1.2em;background:#2563eb;vertical-align:text-top;animation:none;pointer-events:none;border-radius:1px;';
        range.insertNode(dropIndicator);
      }
    };

    const onMouseUp = (ev: MouseEvent) => {
      ghost.remove();
      if (dropIndicator) { dropIndicator.remove(); dropIndicator = null; }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      // Find drop range in editor
      const range = (() => {
        if ((document as any).caretRangeFromPoint) {
          return (document as any).caretRangeFromPoint(ev.clientX, ev.clientY) as Range | null;
        }
        if ((document as any).caretPositionFromPoint) {
          const pos = (document as any).caretPositionFromPoint(ev.clientX, ev.clientY);
          if (pos) {
            const r = document.createRange();
            r.setStart(pos.offsetNode, pos.offset);
            r.collapse(true);
            return r;
          }
        }
        return null;
      })();

      if (!range || !editor.contains(range.startContainer)) {
        // Dropped outside editor — do nothing
        updateResizerPosition(img);
        return;
      }

      // Don't move if drop target is the image itself
      if (range.startContainer === img || img.contains(range.startContainer)) {
        updateResizerPosition(img);
        return;
      }

      // Remove the image from its current position
      const imgParent = img.parentNode;
      const imgNextSibling = img.nextSibling;
      imgParent?.removeChild(img);

      // Re-insert at drop position
      try {
        range.insertNode(img);
      } catch {
        // Fallback: restore original position
        if (imgParent) {
          if (imgNextSibling) imgParent.insertBefore(img, imgNextSibling);
          else imgParent.appendChild(img);
        }
      }

      // Update selection to new position
      setSelectedImage(img);
      setTimeout(() => updateResizerPosition(img), 30);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Compile full article listings from the live database list
  const allArticles = useMemo(() => {
    return [...customNewsList].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [customNewsList]);


  // Filter articles based on sidebar category filter selection
  const filteredArticles = useMemo(() => {
    let result = allArticles;

    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter((art) => {
        if (filterCategory === 'latest') {
          return art.isBreaking || art.categorySlug === 'latest';
        }
        if (filterCategory === 'trending') {
          return art.isTrending || art.categorySlug === 'trending';
        }
        if (filterCategory === 'featured') {
          return art.isFeatured || art.categorySlug === 'featured';
        }
        if (filterCategory === 'telangana' || filterCategory === 'andhra-pradesh') {
          return art.categorySlug === filterCategory && !art.districtSlug;
        }
        const categoriesToCheck = [art.categorySlug, art.districtSlug].filter(Boolean);
        return categoriesToCheck.includes(filterCategory);
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          (art.description && art.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allArticles, filterCategory, searchQuery]);

  // Quick Action: Toggle flags (isBreaking, isTrending, isFeatured) directly from news list table or edit form
  const toggleArticleFlag = async (articleId: string, flag: 'isBreaking' | 'isTrending' | 'isFeatured') => {
    try {
      const art = customNewsList.find(a => a.id === articleId);
      if (!art) return;
      const updatedValue = !art[flag];
      
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [flag]: updatedValue })
      });
      
      if (response.ok) {
        const updated = await response.json();
        setCustomNewsList(prev => prev.map(a => a.id === articleId ? updated : a));
      } else {
        alert('Failed to update article flag');
      }
    } catch (e) {
      console.error('Error toggling article flag:', e);
    }
  };


  // Custom Banner Slides Configuration helpers
  const handleAddBannerSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideTitle.trim() || !newSlideImage) {
      alert('Slide Title and Image are required!');
      return;
    }
    const newSlide = {
      title: newSlideTitle.trim(),
      image: newSlideImage,
      link: newSlideLink.trim()
    };
    let updated;
    if (editingSlideIndex !== null) {
      updated = [...sliderSlidesList];
      updated[editingSlideIndex] = newSlide;
      setEditingSlideIndex(null);
      alert('Homepage banner slide updated successfully!');
    } else {
      updated = [...sliderSlidesList, newSlide];
      alert('Homepage banner slide added successfully!');
    }
    setSliderSlidesList(updated);
    localStorage.setItem('homepage_banner_slides', JSON.stringify(updated));
    setNewSlideTitle('');
    setNewSlideImage('');
    setNewSlideLink('');
  };

  const startEditingSlide = (index: number) => {
    const slide = sliderSlidesList[index];
    if (slide) {
      setNewSlideTitle(slide.title);
      setNewSlideImage(slide.image);
      setNewSlideLink(slide.link || '');
      setEditingSlideIndex(index);
    }
  };

  const handleDeleteBannerSlide = (index: number) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    const updated = sliderSlidesList.filter((_, idx) => idx !== index);
    setSliderSlidesList(updated);
    localStorage.setItem('homepage_banner_slides', JSON.stringify(updated));
    if (editingSlideIndex === index) {
      setNewSlideTitle('');
      setNewSlideImage('');
      setNewSlideLink('');
      setEditingSlideIndex(null);
    }
  };

  const handleNewSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        setNewSlideImage(base64);
      });
    }
  };

  // Toggle an article in/out of the homepage hero slider
  const toggleSliderArticle = (article: any) => {
    const id = String(article.id);
    setSliderSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      // Persist selected IDs
      localStorage.setItem('homepage_slider_article_ids', JSON.stringify([...next]));
      // Also update sliderSlidesList so HeroSlider picks them up via the existing key
      const allArticlesForSlider = [...customNewsList]; // customNewsList has latest DB articles
      const selectedSlides = [...next].map(sid => {
        const art = allArticlesForSlider.find((a: any) => String(a.id) === sid);
        if (!art) return null;
        return { title: art.title, image: art.image, link: `/news/${art.slug}`, articleId: sid };
      }).filter(Boolean);
      setSliderSlidesList(selectedSlides);
      localStorage.setItem('homepage_banner_slides', JSON.stringify(selectedSlides));
      return next;
    });
  };

  // Toggle sidebar news pin (trending or breaking) for a category
  const toggleSidebarNewsPin = (category: string, type: 'trending' | 'breaking', articleId: any) => {
    const artIdStr = String(articleId);
    setSidebarCategoryPins(prev => {
      const catPins = prev[category] || { trending: [], breaking: [] };
      const currentList = catPins[type] || [];
      let newList;
      if (currentList.includes(artIdStr)) {
        newList = currentList.filter(id => id !== artIdStr);
      } else {
        newList = [...currentList, artIdStr];
      }
      
      const updated = {
        ...prev,
        [category]: {
          ...catPins,
          [type]: newList
        }
      };
      
      localStorage.setItem('sidebar_category_pins', JSON.stringify(updated));
      return updated;
    });
  };


  // Sidebar dynamic navigation list builders
  const toggleSidebarGroup = (group: string) => {
    setExpandedSidebar((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  // Classification check list toggles
  const toggleClassificationGroup = (group: string) => {
    setExpandedClassification((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleCategoryCheckboxChange = (slug: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      } else {
        return [...prev, slug];
      }
    });
  };

  // Submit new news article or edit existing article details
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingArticle) return;
    if (!newsTitle.trim() || !editorRef.current?.innerHTML.trim()) {
      alert('Title and Article Body Content are required!');
      return;
    }

    setIsSavingArticle(true);
    try {

    // Determine category configurations from checked boxes
    let categorySlug = 'politics';
    if (selectedCategories.length === 0) {
      if (filterCategory === 'latest' || filterCategory === 'trending' || filterCategory === 'featured') {
        categorySlug = filterCategory;
      }
    }
    let districtSlug = '';
    
    // Auto-resolve AP/TG district names, or categories
    const isApDist = apDistricts.find(d => selectedCategories.includes(d.slug));
    const isTgDist = tgDistricts.find(d => selectedCategories.includes(d.slug));

    if (isApDist) {
      categorySlug = 'andhra-pradesh';
      districtSlug = isApDist.slug;
    } else if (isTgDist) {
      categorySlug = 'telangana';
      districtSlug = isTgDist.slug;
    } else if (selectedCategories.includes('doctors-corner')) {
      categorySlug = 'doctors-corner';
    } else if (selectedCategories.includes('admissions')) {
      categorySlug = 'admissions';
    } else if (selectedCategories.includes('current-affairs')) {
      categorySlug = 'current-affairs';
    } else if (selectedCategories.includes('notification')) {
      categorySlug = 'notification';
    } else if (selectedCategories.length > 0) {
      categorySlug = selectedCategories[0];
    }

    // Resolve Telugu category name
    const resolvedCat = MAIN_CATEGORIES_LIST.find(c => c.slug === categorySlug)?.name.split(' ')[0] || categorySlug;

    // Save the raw HTML directly — base64 images are stored as-is in the DB
    // (No placeholder conversion: images display reliably without localStorage dependency)
    const cleanBodyHTML = editorRef.current.innerHTML;
    const excerptText = newsDescription.trim() || (editorRef.current ? editorRef.current.innerText.slice(0, 140).trim().replace(/<[^>]*>/g, '') + '...' : '');

    const slugToUse = newsSlug.trim() || (() => {
      const base = newsTitle.trim().toLowerCase()
        .replace(/[\u0C00-\u0C7F\u0900-\u097F\u0600-\u06FF]/g, '') // Strip Telugu/Hindi/Arabic
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return (base || 'article') + '-' + Date.now().toString().slice(-4);
    })();

    const articleData = {
      title: newsTitle.trim(),
      slug: slugToUse,
      categorySlug,
      category: resolvedCat,
      districtSlug,
      author: newsAuthor.trim() || 'హై టీవీ డెస్క్',
      // For new articles: always use the exact current time when Publish is clicked
      // For edited articles: use the existing/manually set date
      publishedAt: newsViewMode === 'add'
        ? new Date().toISOString()
        : new Date(newsPublishedDate || Date.now()).toISOString(),
      description: excerptText,
      body: cleanBodyHTML,
      image: newsImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop',
      isBreaking: isBreakingChecked,
      isTrending: isTrendingChecked,
      isFeatured: isFeaturedChecked
    };

    if (newsViewMode === 'add') {
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });
        if (response.ok) {
          const added = await response.json();
          setCustomNewsList(prev => [added, ...prev]);
          alert('Article published successfully!');
        } else {
          const errData = await response.json().catch(() => ({}));
          alert('Failed to publish article: ' + (errData.error || response.statusText || 'Unknown error'));
        }
      } else if (newsViewMode === 'edit' && editingArticle) {
        // Always update in localStorage first if it's a local article
        let updatedLocally = false;
        try {
          const custom = JSON.parse(localStorage.getItem('custom_news_articles') || '[]');
          const idx = custom.findIndex((art: any) => art.id === editingArticle.id);
          if (idx !== -1) {
            custom[idx] = { ...custom[idx], ...articleData, id: editingArticle.id };
            localStorage.setItem('custom_news_articles', JSON.stringify(custom));
            updatedLocally = true;
          }
          
          // Also update in modified list
          const modified = JSON.parse(localStorage.getItem('modified_news_articles') || '{}');
          modified[editingArticle.id] = { ...modified[editingArticle.id], ...articleData };
          localStorage.setItem('modified_news_articles', JSON.stringify(modified));
        } catch (e) {
          console.error('Error updating article in localStorage:', e);
        }

        try {
          const response = await fetch(`/api/articles/${editingArticle.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articleData)
          });

          if (response.ok) {
            const updated = await response.json();
            setCustomNewsList(prev => prev.map(a => a.id === editingArticle.id ? updated : a));
            alert('Article updated successfully!');
          } else {
            // Database update failed. If it was local-only, try migrating it to the database using POST!
            const custom = JSON.parse(localStorage.getItem('custom_news_articles') || '[]');
            const isLocal = custom.some((art: any) => art.id === editingArticle.id);
            
            if (isLocal) {
              // Try to migrate to the database
              const createResponse = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...articleData, id: editingArticle.id })
              });
              
              if (createResponse.ok) {
                const added = await createResponse.json();
                setCustomNewsList(prev => prev.map(a => a.id === editingArticle.id ? added : a));
                alert('Article updated and saved to database successfully!');
              } else {
                // If migration fails, keep local update
                setCustomNewsList(prev => prev.map(a => a.id === editingArticle.id ? { ...a, ...articleData } : a));
                alert('Article updated locally successfully!');
              }
            } else {
              const errData = await response.json().catch(() => ({}));
              alert('Failed to update article: ' + (errData.details || errData.error || response.statusText));
            }
          }
        } catch (e: any) {
          console.error('Error saving article edit:', e);
          if (updatedLocally) {
            setCustomNewsList(prev => prev.map(a => a.id === editingArticle.id ? { ...a, ...articleData } : a));
            alert('Article updated locally successfully!');
          } else {
            alert('Failed to update article: ' + (e?.message || String(e)));
          }
        }
      }
      setNewsViewMode('list');
      setRefreshCounter(prev => prev + 1);
    } catch (e) {
      console.error('Error saving article:', e);
      alert('Error saving article.');
    } finally {
      setIsSavingArticle(false);
    }
  };

  const startEditing = (art: any) => {
    setEditingArticle(art);
    setNewsTitle(art.title || '');
    setNewsSlug(art.slug || '');
    setNewsDescription(art.description || '');
    setNewsAuthor(art.author || '');
    setNewsPublishedDate(art.publishedAt ? new Date(art.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
    setNewsImage(art.image || '');

    // Resolve checkbox array values
    const activeCheckboxes = [art.categorySlug];
    if (art.districtSlug) activeCheckboxes.push(art.districtSlug);
    setSelectedCategories(activeCheckboxes);

    setIsBreakingChecked(art.isBreaking || false);
    setIsTrendingChecked(art.isTrending || false);
    setIsFeaturedChecked(art.isFeatured || false);

    // Helper to resolve media library URL placeholders to raw base64 for local editor view
    const convertPlaceholdersToBase64 = (htmlContent: string) => {
      if (!htmlContent) return '';
      let resolved = htmlContent;
      try {
        const mediaLibrary = JSON.parse(localStorage.getItem('custom_media_library') || '{}');
        Object.entries(mediaLibrary).forEach(([mediaPath, base64]) => {
          if (typeof base64 === 'string' && base64.startsWith('data:')) {
            resolved = resolved.split(mediaPath).join(base64);
          }
        });
      } catch (e) {
        console.error('Error loading placeholders:', e);
      }
      return resolved;
    };

    setNewsViewMode('edit');
    setTimeout(() => {
      if (editorRef.current) {
        // Resolve any old-style placeholder paths back to base64 for articles that were
        // saved before this fix, then display the body as-is for newer articles
        const rawBody = art.body || art.content || '';
        let displayBody = rawBody;
        try {
          const mediaLibrary = JSON.parse(localStorage.getItem('custom_media_library') || '{}');
          Object.entries(mediaLibrary).forEach(([mediaPath, base64]) => {
            if (typeof base64 === 'string' && base64.startsWith('data:')) {
              displayBody = displayBody.split(mediaPath).join(base64);
            }
          });
        } catch (e) {
          console.error('Error resolving old placeholders:', e);
        }
        editorRef.current.innerHTML = displayBody;
      }
    }, 100);
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    // Always clean from localStorage first for client-side custom articles fallback
    let deletedLocally = false;
    try {
      const custom = JSON.parse(localStorage.getItem('custom_news_articles') || '[]');
      const filtered = custom.filter((art: any) => art.id !== articleId);
      if (custom.length !== filtered.length) {
        localStorage.setItem('custom_news_articles', JSON.stringify(filtered));
        deletedLocally = true;
      }

      // Clean from modified/deleted track lists
      const modified = JSON.parse(localStorage.getItem('modified_news_articles') || '{}');
      if (modified[articleId]) {
        delete modified[articleId];
        localStorage.setItem('modified_news_articles', JSON.stringify(modified));
      }

      const deletedIds = JSON.parse(localStorage.getItem('deleted_news_articles') || '[]');
      if (!deletedIds.includes(articleId)) {
        deletedIds.push(articleId);
        localStorage.setItem('deleted_news_articles', JSON.stringify(deletedIds));
      }
    } catch (e) {
      console.error('Error clearing localStorage entry:', e);
    }

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE'
      });
      
      if (response.ok || deletedLocally) {
        setCustomNewsList(prev => prev.filter(art => art.id !== articleId));
        alert('Article deleted successfully!');
      } else {
        alert('Failed to delete article.');
      }
    } catch (e) {
      console.error('Error deleting article:', e);
      if (deletedLocally) {
        setCustomNewsList(prev => prev.filter(art => art.id !== articleId));
        alert('Article deleted successfully!');
      } else {
        alert('Failed to delete article.');
      }
    }
  };




  // Save configurations helper (Popups, ads ticker)
  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');

    if (activeTab === 'overlays') {
      // Save Overlays
      localStorage.setItem(`promo_popup_${popupScope}_enabled`, String(popupEnabled));
      localStorage.setItem(`promo_popup_${popupScope}_type`, popupType);
      localStorage.setItem(`promo_ad_${popupScope}_image`, adImage);
      localStorage.setItem(`promo_ad_${popupScope}_link`, adLink);
      localStorage.setItem(`promo_poll_${popupScope}_question`, pollQuestion);
      localStorage.setItem(`promo_poll_${popupScope}_option_yes`, optYes);
      localStorage.setItem(`promo_poll_${popupScope}_option_no`, optNo);
      localStorage.setItem(`promo_poll_${popupScope}_option_unsure`, optUnsure);

      // Save Inline image
      localStorage.setItem('inline_article_image_enabled', String(inlineImageEnabled));
      localStorage.setItem('inline_article_image_data', inlineImageData);
      localStorage.setItem('inline_article_image_caption', inlineImageCaption);

      // Save Inline promos
      localStorage.setItem('inline_article_promos_enabled', String(inlinePromosEnabled));
    } else if (activeTab === 'categories') {
      // Save youtube videos and sliders
      localStorage.setItem('latest_videos', JSON.stringify(videosList));

      // Save General banners
      const updatedAds = {
        ...customAds,
        [activeAdSpot]: {
          enabled: adSpotEnabled,
          image: adSpotImage,
          link: adSpotLink
        }
      };
      setCustomAds(updatedAds);
      localStorage.setItem('custom_ads_config', JSON.stringify(updatedAds));
    } else if (activeTab === 'breaking') {
      // Save Scrolling marquee items
      localStorage.setItem('flash_news_items', JSON.stringify(flashNewsList));
    }

    setTimeout(() => {
      setSaveStatus('saved');
      setRefreshCounter(prev => prev + 1);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  // Add/Edit marquee item
  const handleAddFlashNews = () => {
    if (!newNewsText.trim()) return;
    const item = {
      text: newNewsText.trim(),
      link: newNewsLink.trim() || `/search?q=${encodeURIComponent(newNewsText.trim())}`
    };
    let updated;
    if (editingFlashIndex !== null) {
      updated = [...flashNewsList];
      updated[editingFlashIndex] = item;
      setEditingFlashIndex(null);
      alert('Flash news ticker item updated successfully!');
    } else {
      updated = [...flashNewsList, item];
      alert('Flash news ticker item added successfully!');
    }
    setFlashNewsList(updated);
    localStorage.setItem('flash_news_items', JSON.stringify(updated));
    setNewNewsText('');
    setNewNewsLink('');
  };

  const startEditingFlashNews = (index: number) => {
    const item = flashNewsList[index];
    if (item) {
      setNewNewsText(item.text);
      setNewNewsLink(item.link || '');
      setEditingFlashIndex(index);
    }
  };

  const handleRemoveFlashNews = (idx: number) => {
    const updated = flashNewsList.filter((_, index) => index !== idx);
    setFlashNewsList(updated);
    localStorage.setItem('flash_news_items', JSON.stringify(updated));
  };

  // Add/Edit trending news item
  const handleAddTrendingNews = () => {
    if (!newTrendingText.trim()) return;
    const item = {
      text: newTrendingText.trim(),
      link: newTrendingLink.trim() || `/search?q=${encodeURIComponent(newTrendingText.trim())}`
    };
    let updated;
    if (editingTrendingIndex !== null) {
      updated = [...trendingNewsList];
      updated[editingTrendingIndex] = item;
      setEditingTrendingIndex(null);
      alert('Trending news item updated successfully!');
    } else {
      updated = [...trendingNewsList, item];
      alert('Trending news item added successfully!');
    }
    setTrendingNewsList(updated);
    localStorage.setItem('trending_news_items', JSON.stringify(updated));
    setNewTrendingText('');
    setNewTrendingLink('');
  };

  const startEditingTrendingNews = (index: number) => {
    const item = trendingNewsList[index];
    if (item) {
      setNewTrendingText(item.text);
      setNewTrendingLink(item.link || '');
      setEditingTrendingIndex(index);
    }
  };

  const handleRemoveTrendingNews = (idx: number) => {
    const updated = trendingNewsList.filter((_, index) => index !== idx);
    setTrendingNewsList(updated);
    localStorage.setItem('trending_news_items', JSON.stringify(updated));
  };

  // Handle Video fields edits
  const handleVideoFieldChange = (idx: number, field: 'id' | 'title' | 'thumbnail', val: string) => {
    const updated = [...videosList];
    if (!updated[idx]) {
      updated[idx] = { id: '', title: '', thumbnail: '' };
    }
    updated[idx] = { ...updated[idx], [field]: val };
    if (field === 'id' && !updated[idx].thumbnail) {
      updated[idx].thumbnail = `https://img.youtube.com/vi/${val}/hqdefault.jpg`;
    }
    setVideosList(updated);
  };

  // Handle Ad banner upload
  const handleAdSpotImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        setAdSpotImage(base64);
      });
    }
  };

  // Handle category specific banners
  const handleCatAdBannerUpload = (categoryKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        const parsedAds = { ...customAds };
        parsedAds[categoryKey] = {
          enabled: true,
          image: base64,
          link: (parsedAds[categoryKey] as any)?.link || '#'
        };
        setCustomAds(parsedAds);
        localStorage.setItem('custom_ads_config', JSON.stringify(parsedAds));
      });
    }
  };

  const handleCatAdBannerLinkChange = (categoryKey: string, link: string) => {
    const parsedAds = { ...customAds };
    parsedAds[categoryKey] = {
      enabled: (parsedAds[categoryKey] as any)?.enabled || false,
      image: (parsedAds[categoryKey] as any)?.image || '',
      link: link
    };
    setCustomAds(parsedAds);
    localStorage.setItem('custom_ads_config', JSON.stringify(parsedAds));
  };

  const toggleCatAdBannerStatus = (categoryKey: string, enabled: boolean) => {
    const parsedAds = { ...customAds };
    parsedAds[categoryKey] = {
      enabled: enabled,
      image: (parsedAds[categoryKey] as any)?.image || '',
      link: (parsedAds[categoryKey] as any)?.link || '#'
    };
    setCustomAds(parsedAds);
    localStorage.setItem('custom_ads_config', JSON.stringify(parsedAds));
  };

  // E-Paper publishing
  const handleAddEpaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!epaperTitle.trim() || !epaperDate || !epaperPdf) {
      alert('Please fill out all E-Paper fields!');
      return;
    }
    const newPaper = {
      id: `epaper-${Date.now()}`,
      title: epaperTitle.trim(),
      date: epaperDate,
      pdfUrl: epaperPdf
    };
    const updated = [newPaper, ...epapersList];
    setEpapersList(updated);
    localStorage.setItem('custom_epapers', JSON.stringify(updated));
    setEpaperTitle('');
    setEpaperDate('');
    setEpaperPdf('');
    alert('E-Paper edition added successfully!');
  };

  const handleDeleteEpaper = (id: string) => {
    if (!confirm('Are you sure you want to delete this E-Paper?')) return;
    const updated = epapersList.filter(p => p.id !== id);
    setEpapersList(updated);
    localStorage.setItem('custom_epapers', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('high_tv_admin_session');
    router.push('/superadminlogin');
  };

  // Loading Screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans">
        <svg className="animate-spin h-8 w-8 text-rose-600 mb-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Connecting High TV Core CMS Gate...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans admin-theme-wrapper">
      
      {/* ── STICKY LEFT SIDEBAR (Balagam TV Theme) ────────────────────────── */}
      <aside className="w-64 border-r border-slate-900 bg-[#0b1329] flex flex-col shrink-0 sticky top-0 h-screen select-none">
        
        {/* Branding header area */}
        <div className="p-5 border-b border-slate-900 flex items-center gap-3 shrink-0">
          <Link href="/" className="block max-w-[45px]">
            <img src="/logo.png" alt="High TV" className="w-full h-auto object-contain" />
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white leading-tight telugu-text">హై టీవీ</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">CMS Panel</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 flex flex-col gap-1 overflow-y-auto flex-1 hide-scrollbar">
          
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 pl-2">System Configs</span>
                    <button
            onClick={() => { setActiveTab('dashboard'); setNewsViewMode('list'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'dashboard' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-450 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('news'); setNewsViewMode('list'); setFilterCategory('all'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'news' && filterCategory === 'all' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>News Management</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('breaking'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'breaking' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4" />
              <span>Flash News Ticker</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('trending'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'trending' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Ticker</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('slider'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'slider' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4" />
              <span>Homepage Slides</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('sidebar-news'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'sidebar-news' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-4 h-4" />
              <span>Sidebar News Config</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('categories'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'categories' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Categories & Banners</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('overlays'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'overlays' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4" />
              <span>Overlay Overrides</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('epaper'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'epaper' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tv className="w-4 h-4" />
              <span>E-Paper editions</span>
            </div>
          </button>

          {/* Collapsible Categories Tree for Sidebar Filter */}
          <div className="mt-4 border-t border-slate-900 pt-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 mb-2 block">Website Pages ({22})</span>
            
            {/* 1. Main Categories Folder */}
            <div className="mb-0.5">
              <button
                onClick={() => toggleSidebarGroup('main')}
                className="w-full flex items-center justify-between px-2.5 py-2 text-slate-200 hover:text-white text-xs md:text-[13px] font-black cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedSidebar.main ? '' : '-rotate-90'}`} />
                  <span>Main Categories</span>
                </div>
              </button>
              {expandedSidebar.main && (
                <div className="pl-6 flex flex-col gap-0.5 border-l border-slate-900 ml-4 max-h-[220px] overflow-y-auto admin-scrollbar">
                  {MAIN_CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setActiveTab('news');
                        setFilterCategory(cat.slug);
                        setNewsViewMode('list');
                      }}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all telugu-text truncate shrink-0 ${
                        activeTab === 'news' && filterCategory === cat.slug ? 'bg-rose-950/50 text-white font-extrabold border-l-2 border-rose-600' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Andhra Pradesh collapsible */}
            <div className="mb-0.5">
              <button
                onClick={() => toggleSidebarGroup('ap')}
                className="w-full flex items-center justify-between px-2.5 py-2 text-slate-200 hover:text-white text-xs md:text-[13px] font-black cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedSidebar.ap ? '' : '-rotate-90'}`} />
                  <span>ఆంధ్రప్రదేశ్ (AP News)</span>
                </div>
              </button>
              {expandedSidebar.ap && (
                <div className="pl-6 flex flex-col gap-0.5 border-l border-slate-900 ml-4 max-h-[200px] overflow-y-auto admin-scrollbar">
                  <button
                    onClick={() => { setActiveTab('news'); setFilterCategory('andhra-pradesh'); setNewsViewMode('list'); }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-extrabold transition-all shrink-0 ${
                      activeTab === 'news' && filterCategory === 'andhra-pradesh' ? 'bg-rose-950/50 text-white border-l-2 border-rose-600' : 'text-amber-400 hover:text-white'
                    }`}
                  >
                    🌅 ఏపీ హోమ్ (AP State)
                  </button>
                  {apDistricts.map((dist) => (
                    <button
                      key={dist.slug}
                      onClick={() => { setActiveTab('news'); setFilterCategory(dist.slug); setNewsViewMode('list'); }}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all telugu-text truncate shrink-0 ${
                        activeTab === 'news' && filterCategory === dist.slug ? 'bg-rose-950/50 text-white' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {dist.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Telangana collapsible */}
            <div className="mb-0.5">
              <button
                onClick={() => toggleSidebarGroup('telangana')}
                className="w-full flex items-center justify-between px-2.5 py-2 text-slate-200 hover:text-white text-xs md:text-[13px] font-black cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedSidebar.telangana ? '' : '-rotate-90'}`} />
                  <span>తెలంగాణ (Telangana News)</span>
                </div>
              </button>
              {expandedSidebar.telangana && (
                <div className="pl-6 flex flex-col gap-0.5 border-l border-slate-900 ml-4 max-h-[200px] overflow-y-auto admin-scrollbar">
                  <button
                    onClick={() => { setActiveTab('news'); setFilterCategory('telangana'); setNewsViewMode('list'); }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-extrabold transition-all shrink-0 ${
                      activeTab === 'news' && filterCategory === 'telangana' ? 'bg-rose-950/50 text-white border-l-2 border-rose-600' : 'text-amber-400 hover:text-white'
                    }`}
                  >
                    🍇 తెలంగాణ హోమ్ (TG State)
                  </button>
                  {tgDistricts.map((dist) => (
                    <button
                      key={dist.slug}
                      onClick={() => { setActiveTab('news'); setFilterCategory(dist.slug); setNewsViewMode('list'); }}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all telugu-text truncate shrink-0 ${
                        activeTab === 'news' && filterCategory === dist.slug ? 'bg-rose-950/50 text-white' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {dist.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Health collapsible */}
            <div className="mb-0.5">
              <button
                onClick={() => toggleSidebarGroup('health')}
                className="w-full flex items-center justify-between px-2.5 py-2 text-slate-200 hover:text-white text-xs md:text-[13px] font-black cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedSidebar.health ? '' : '-rotate-90'}`} />
                  <span>హెల్త్ (Health)</span>
                </div>
              </button>
              {expandedSidebar.health && (
                <div className="pl-6 flex flex-col gap-0.5 border-l border-slate-900 ml-4">
                  <button
                    onClick={() => { setActiveTab('news'); setFilterCategory('health'); setNewsViewMode('list'); }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all shrink-0 ${
                      activeTab === 'news' && filterCategory === 'health' ? 'bg-rose-950/50 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    🩺 హెల్త్ హోమ్
                  </button>
                  <button
                    onClick={() => { setActiveTab('news'); setFilterCategory('doctors-corner'); setNewsViewMode('list'); }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all shrink-0 ${
                      activeTab === 'news' && filterCategory === 'doctors-corner' ? 'bg-rose-950/50 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    🥼 డాక్టర్స్ కార్నర్
                  </button>
                </div>
              )}
            </div>

            {/* 5. Education collapsible */}
            <div className="mb-0.5">
              <button
                onClick={() => toggleSidebarGroup('education')}
                className="w-full flex items-center justify-between px-2.5 py-2 text-slate-200 hover:text-white text-xs md:text-[13px] font-black cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedSidebar.education ? '' : '-rotate-90'}`} />
                  <span>విద్య (Education)</span>
                </div>
              </button>
              {expandedSidebar.education && (
                <div className="pl-6 flex flex-col gap-0.5 border-l border-slate-900 ml-4">
                  <button
                    onClick={() => { setActiveTab('news'); setFilterCategory('vidya'); setNewsViewMode('list'); }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all shrink-0 ${
                      activeTab === 'news' && filterCategory === 'vidya' ? 'bg-rose-950/50 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    🎓 విద్య హోమ్
                  </button>
                  <button
                    onClick={() => { setActiveTab('news'); setFilterCategory('admissions'); setNewsViewMode('list'); }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all shrink-0 ${
                      activeTab === 'news' && filterCategory === 'admissions' ? 'bg-rose-950/50 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    🏫 అడ్మిషన్స్
                  </button>
                  <button
                    onClick={() => { setActiveTab('news'); setFilterCategory('current-affairs'); setNewsViewMode('list'); }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all shrink-0 ${
                      activeTab === 'news' && filterCategory === 'current-affairs' ? 'bg-rose-950/50 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    📖 కరెంట్ అఫైర్స్
                  </button>
                </div>
              )}
            </div>

            {/* 6. Career collapsible */}
            <div className="mb-0.5">
              <button
                onClick={() => toggleSidebarGroup('career')}
                className="w-full flex items-center justify-between px-2.5 py-2 text-slate-200 hover:text-white text-xs md:text-[13px] font-black cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedSidebar.career ? '' : '-rotate-90'}`} />
                  <span>ఉపాధి (Career)</span>
                </div>
              </button>
              {expandedSidebar.career && (
                <div className="pl-6 flex flex-col gap-0.5 border-l border-slate-900 ml-4">
                  <button
                    onClick={() => { setActiveTab('news'); setFilterCategory('upadi'); setNewsViewMode('list'); }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all shrink-0 ${
                      activeTab === 'news' && filterCategory === 'upadi' ? 'bg-rose-950/50 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    👔 ఉపాధి హోమ్
                  </button>
                  <button
                    onClick={() => { setActiveTab('news'); setFilterCategory('notification'); setNewsViewMode('list'); }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all shrink-0 ${
                      activeTab === 'news' && filterCategory === 'notification' ? 'bg-rose-950/50 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    📢 నోటిఫికేషన్స్
                  </button>
                </div>
              )}
            </div>

          </div>

        </nav>

        {/* Profile and Logout area at bottom of sidebar */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40 shrink-0 space-y-3">
          <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white text-xs font-black">
              S
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-white truncate">Super Admin</span>
              <span className="text-[10px] text-slate-500 truncate">admin@hightv.in</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-955/20 hover:bg-red-955/40 text-red-200 text-xs font-bold cursor-pointer transition-all border border-red-900/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Account</span>
          </button>
        </div>

      </aside>

      {/* ── MAIN WORKSPACE AREA ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden min-w-0 bg-[#f8fafc] text-slate-700">
        
        {/* Workspace Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 md:px-8 flex items-center justify-between select-none">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="font-extrabold text-slate-400 uppercase tracking-widest text-[10px]">Super Admin Portal</span>
            <span className="text-slate-300">/</span>
            <span className="font-black text-[#02599c] capitalize">
              {activeTab === 'news' ? `News Management (${filterCategory.replace('-', ' ')})` : activeTab.replace('-', ' ')}
            </span>
          </div>
          <div>
            <Link 
              href="/"
              target="_blank"
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3.5 rounded-xl transition-all border border-slate-200/60 flex items-center gap-1.5"
            >
              <span>Visit Live Website</span>
              <Globe className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Scrollable Workspace Container */}
        <div className="flex-1 p-6 md:p-8 max-w-[1440px] w-full min-w-0 mx-auto">
          
          {/* ══════════════ VIEW: DASHBOARD OVERVIEW ══════════════ */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Overview Dashboard</h2>
                <p className="text-slate-500 text-xs mt-0.5">High TV Content Management System status metrics.</p>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Articles</span>
                  <span className="text-2xl font-bold text-slate-800">{allArticles.length}</span>
                  <span className="text-[10px] text-[#02599c] font-bold mt-1">Staged in CMS</span>
                </div>
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticker Headlines</span>
                  <span className="text-2xl font-bold text-slate-800">{flashNewsList.length}</span>
                  <span className="text-[10px] text-[#02599c] font-bold mt-1">Marquee tickers</span>
                </div>
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-Paper Editions</span>
                  <span className="text-2xl font-bold text-slate-800">{epapersList.length}</span>
                  <span className="text-[10px] text-[#02599c] font-bold mt-1">PDFs uploaded</span>
                </div>
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">General Advertisements</span>
                  <span className="text-2xl font-bold text-slate-800">
                    {Object.values(customAds).filter((ad: any) => ad?.enabled).length}
                  </span>
                  <span className="text-[10px] text-[#02599c] font-bold mt-1">Active banners</span>
                </div>
              </div>

              {/* Overview instruction helper */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <Info className="w-5 h-5 text-rose-600" />
                  <span>Welcome to Super Admin Dashboard</span>
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">
                  Use the left sidebar navigation to select any tab or subpage to update its content, upload custom news articles, or configure page-specific ad banner overrides. All changes are stored locally and will reflect immediately across your navigation panels and article views.
                </p>
                <div className="h-px bg-slate-100" />
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>22 Collapsible Pages Configured</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Rich Text WYSIWYG Editor Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Featured Image compression enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ VIEW: NEWS MANAGEMENT (Articles grid) ══════════════ */}
          {activeTab === 'news' && newsViewMode === 'list' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              
              {/* Heading */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-800">News Management</h2>
                  <p className="text-slate-500 text-xs">Review and manage all news articles.</p>
                </div>
                <button
                  onClick={() => setNewsViewMode('add')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 px-5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 self-start md:self-auto hover:scale-[1.01]"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Article</span>
                </button>
              </div>

              {/* Search & filter area */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles by title or keyword..."
                    className="w-full bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-colors text-slate-800"
                  />
                </div>
                
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 shrink-0">
                  <span>Filtering:</span>
                  <span className="text-[#02599c] capitalize">{filterCategory.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Table list */}
              <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black">
                        <th className="p-4 text-[10px] uppercase tracking-wider">Article Info</th>
                        <th className="p-4 text-[10px] uppercase tracking-wider">Category</th>
                        <th className="p-4 text-[10px] uppercase tracking-wider">Author</th>
                        <th className="p-4 text-[10px] uppercase tracking-wider text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredArticles.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-10 text-center text-slate-400 font-bold">
                            No articles found matching filters. Select a different category or add one above!
                          </td>
                        </tr>
                      ) : (
                        filteredArticles.map((art) => (
                          <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3.5 min-w-[320px]">
                                <img
                                  src={art.image}
                                  alt={art.title}
                                  className="w-14 h-9 object-cover rounded-lg border border-slate-200 shrink-0"
                                />
                                <div className="flex flex-col min-w-0 gap-0.5">
                                  <span className="text-xs font-black text-slate-800 telugu-text truncate" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                    {art.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(art.publishedAt).toLocaleDateString()} at {new Date(art.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 capitalize">
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200/50">
                                {art.districtSlug
                                  ? getArticleCategoryName(art)
                                  : (filterCategory === 'latest' 
                                      ? 'Breaking News' 
                                      : filterCategory === 'trending' 
                                        ? 'Trending News' 
                                        : filterCategory === 'featured' 
                                          ? 'Featured News' 
                                          : (art.category || art.categorySlug))}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 font-bold capitalize">
                              {art.author}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Link
                                  href={`/news/${art.slug}`}
                                  target="_blank"
                                  className="text-slate-500 hover:text-slate-800 p-2 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-slate-100"
                                  title="View Public Link"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => startEditing(art)}
                                  className="text-slate-500 hover:text-rose-600 p-2 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-slate-100"
                                  title="Edit News Article"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteArticle(art.id)}
                                  className="text-slate-500 hover:text-red-600 p-2 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-slate-100"
                                  title="Delete Article"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ══════════════ VIEW: ADD / EDIT NEWS ARTICLE (2-Column Workspace) ══════════════ */}
          {activeTab === 'news' && (newsViewMode === 'add' || newsViewMode === 'edit') && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              
              {/* Back breadcrumb and Actions */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setNewsViewMode('list')}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-black cursor-pointer bg-white border border-slate-200/60 rounded-xl px-3.5 py-2.5 transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to news list</span>
                </button>

                <h2 className="text-lg font-black text-slate-800">
                  {newsViewMode === 'add' ? 'Add New Article' : 'Edit News Article'}
                </h2>

                <button
                  type="button"
                  disabled={isSavingArticle}
                  onClick={handleSaveArticle}
                  className={`${
                    isSavingArticle ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 cursor-pointer hover:scale-[1.01]'
                  } text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-1.5`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>
                    {isSavingArticle 
                      ? (newsViewMode === 'add' ? 'Publishing...' : 'Updating...') 
                      : (newsViewMode === 'add' ? 'Publish Review' : 'Update Details')}
                  </span>
                </button>
              </div>

              {/* Two Column Grid */}
              <form onSubmit={handleSaveArticle} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (Inputs and WYSIWYG) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Headline Block */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Headline (Telugu/English)</label>
                    <input
                      type="text"
                      required
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      placeholder="Enter a catchy headline..."
                      className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-3.5 text-base font-bold outline-none transition-colors telugu-text text-slate-800"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif', textIndent: '10px' }}
                    />
                  </div>

                  {/* Slug Block */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">URL Slug (English - Mandatory)</label>
                    <input
                      type="text"
                      required
                      value={newsSlug}
                      onChange={(e) => setNewsSlug(e.target.value)}
                      placeholder="e.g. hyderabad-metro-news-update"
                      className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs font-mono outline-none transition-colors text-slate-800"
                    />
                    <span className="text-[10px] text-slate-400">Slug is mandatory for the URL. Strictly use alphanumeric English characters and hyphens.</span>
                  </div>

                  {/* Short Excerpt Block */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Short Excerpt (Optional)</label>
                    <textarea
                      rows={3}
                      value={newsDescription}
                      onChange={(e) => setNewsDescription(e.target.value)}
                      placeholder="Brief summary of the article..."
                      className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors resize-none telugu-text text-slate-800"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif', textIndent: '10px' }}
                    />
                  </div>

                  {/* Article Content WYSIWYG Editor Block */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Article Content</label>
                    
                    {/* Rich toolbar options */}
                    <div className="bg-slate-100 border border-slate-200 rounded-xl p-2 flex flex-wrap gap-1.5 items-center select-none text-slate-600">
                      
                      {/* Style normal header dropdown mockup */}
                      <div className="relative">
                        <select 
                          onChange={(e) => handleFormat('formatBlock', e.target.value)}
                          className="bg-white border border-slate-200 text-[10px] font-black rounded-lg px-2 py-1 outline-none cursor-pointer"
                        >
                          <option value="p">Normal</option>
                          <option value="h1">Heading 1</option>
                          <option value="h2">Heading 2</option>
                          <option value="h3">Heading 3</option>
                        </select>
                      </div>

                      <div className="relative">
                        <select 
                          onChange={(e) => handleFontSize(e.target.value)}
                          className="bg-white border border-slate-200 text-[10px] font-black rounded-lg px-2 py-1 outline-none cursor-pointer text-slate-700"
                          defaultValue=""
                        >
                          <option value="" disabled>Size</option>
                          <option value="12px">12 px</option>
                          <option value="14px">14 px</option>
                          <option value="16px">16 px</option>
                          <option value="18px">18 px</option>
                          <option value="20px">20 px</option>
                          <option value="22px">22 px</option>
                          <option value="24px">24 px</option>
                          <option value="28px">28 px</option>
                          <option value="32px">32 px</option>
                          <option value="36px">36 px</option>
                        </select>
                      </div>

                      <div className="w-px h-5 bg-slate-200 my-1 mx-0.5" />

                      <button type="button" onClick={() => handleFormat('bold')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleFormat('italic')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleFormat('underline')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleFormat('strikeThrough')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Strikethrough"><Strikethrough className="w-3.5 h-3.5" /></button>
                      
                      <div className="w-px h-5 bg-slate-200 my-1 mx-0.5" />

                      <button type="button" onClick={() => handleFormat('insertUnorderedList')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleFormat('insertOrderedList')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Number List"><ListOrdered className="w-3.5 h-3.5" /></button>
                      
                      <div className="w-px h-5 bg-slate-200 my-1 mx-0.5" />

                      {/* Color Picker helper */}
                      <button type="button" onClick={() => handleFormat('foreColor', '#e11d48')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-rose-600 font-bold text-xs" title="Text Color Red">A</button>
                      <button type="button" onClick={() => handleFormat('foreColor', '#02599c')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-blue-600 font-bold text-xs" title="Text Color Blue">A</button>
                      <button type="button" onClick={() => handleFormat('foreColor', '#000000')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-black font-bold text-xs" title="Text Color Black">A</button>

                      <div className="w-px h-5 bg-slate-200 my-1 mx-0.5" />

                      <button type="button" onClick={() => {
                        const url = prompt('Enter the link destination URL:');
                        if (url) handleFormat('createLink', url);
                      }} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Insert Link"><LinkIcon className="w-3.5 h-3.5" /></button>
                      
                      {/* Hidden File Inputs for Inline Media */}
                      <input 
                        type="file" 
                        ref={imageInputRef} 
                        accept="image/*" 
                        onChange={handleInlineImageUpload} 
                        className="hidden" 
                      />
                      <input 
                        type="file" 
                        ref={videoInputRef} 
                        accept="video/*" 
                        onChange={handleInlineVideoUpload} 
                        className="hidden" 
                      />

                      <button type="button" onClick={() => imageInputRef.current?.click()} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Upload Inline Image"><ImageIcon className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => videoInputRef.current?.click()} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Upload Inline Video"><Video className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={handleOpenPromoModal} className="p-1.5 hover:bg-rose-100 text-[#e60000] rounded-lg border border-red-200/50 bg-red-50/30 cursor-pointer flex items-center gap-1" title="Insert Related Article (ఈ వార్తా చదవండి)">
                        <Tv className="w-3.5 h-3.5 text-[#cc0000]" />
                        <span className="text-[9px] font-bold select-none telugu-text text-[#cc0000]" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఈ వార్తా చదవండి</span>
                      </button>
                      <button type="button" onClick={() => handleFormat('removeFormat')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Clear Formatting"><Eraser className="w-3.5 h-3.5" /></button>
                    </div>

                    {/* contenteditable editing panel + image resizer overlay wrapper */}
                    <div ref={editorWrapperRef} className="relative" onScroll={handleEditorScroll}>
                      <div 
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="వార్త పూర్తి సమాచారాన్ని ఇక్కడ రాయండి..."
                        className="wysiwyg-editor w-full bg-slate-50 border border-slate-200/60 focus:bg-white focus:border-rose-500 rounded-2xl p-5 text-sm outline-none transition-all text-slate-800 overflow-y-auto leading-relaxed telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        onClick={handleEditorImageClick}
                      />

                      {/* ── Blue Image Resizer Overlay ── */}
                      {resizerStyle && selectedImage && (
                        <div
                          ref={resizerRef}
                          style={{
                            position: 'absolute',
                            top: resizerStyle.top,
                            left: resizerStyle.left,
                            width: resizerStyle.width,
                            height: resizerStyle.height,
                            pointerEvents: 'none',
                            zIndex: 50,
                          }}
                        >
                          {/* ── Floating Toolbar above image ── */}
                          <div style={{
                            position: 'absolute',
                            top: -42,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: 8,
                            padding: '4px 6px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                            pointerEvents: 'all',
                            whiteSpace: 'nowrap',
                          }}>
                            {/* Align Left */}
                            <button
                              type="button"
                              title="Align Left"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!selectedImage) return;
                                const parent = selectedImage.parentElement;
                                if (parent && (parent.dataset.imgAlign === 'true')) {
                                  parent.style.textAlign = 'left';
                                } else {
                                  selectedImage.style.display = 'block';
                                  selectedImage.style.marginLeft = '0';
                                  selectedImage.style.marginRight = 'auto';
                                  if (parent) { parent.style.textAlign = 'left'; }
                                }
                                updateResizerPosition(selectedImage);
                              }}
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#94a3b8', padding: '2px 6px', borderRadius: 4,
                                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3,
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
                              Left
                            </button>

                            <div style={{ width: 1, height: 18, background: '#334155' }} />

                            {/* Align Center */}
                            <button
                              type="button"
                              title="Align Center"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!selectedImage) return;
                                selectedImage.style.display = 'block';
                                selectedImage.style.marginLeft = 'auto';
                                selectedImage.style.marginRight = 'auto';
                                const parent = selectedImage.parentElement;
                                if (parent) parent.style.textAlign = 'center';
                                updateResizerPosition(selectedImage);
                              }}
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#60a5fa', padding: '2px 6px', borderRadius: 4,
                                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3,
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
                              Center
                            </button>

                            <div style={{ width: 1, height: 18, background: '#334155' }} />

                            {/* Align Right */}
                            <button
                              type="button"
                              title="Align Right"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!selectedImage) return;
                                selectedImage.style.display = 'block';
                                selectedImage.style.marginLeft = 'auto';
                                selectedImage.style.marginRight = '0';
                                const parent = selectedImage.parentElement;
                                if (parent) parent.style.textAlign = 'right';
                                updateResizerPosition(selectedImage);
                              }}
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#94a3b8', padding: '2px 6px', borderRadius: 4,
                                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3,
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
                              Right
                            </button>

                            <div style={{ width: 1, height: 18, background: '#334155' }} />

                            {/* Full Width */}
                            <button
                              type="button"
                              title="Full Width"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!selectedImage) return;
                                selectedImage.style.width = '100%';
                                selectedImage.style.height = 'auto';
                                selectedImage.style.display = 'block';
                                selectedImage.style.marginLeft = '0';
                                selectedImage.style.marginRight = '0';
                                updateResizerPosition(selectedImage);
                              }}
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#94a3b8', padding: '2px 6px', borderRadius: 4,
                                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3,
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 8 3 12 8 16"/><polyline points="16 8 21 12 16 16"/></svg>
                              Full
                            </button>

                            <div style={{ width: 1, height: 18, background: '#334155' }} />

                            {/* Deselect / Close */}
                            <button
                              type="button"
                              title="Deselect Image"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSelectedImage(null);
                                setResizerStyle(null);
                              }}
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#f87171', padding: '2px 5px', borderRadius: 4,
                                fontSize: 13, fontWeight: 900,
                              }}
                            >✕</button>
                          </div>

                          {/* Blue selection border */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            border: '2px solid #2563eb',
                            borderRadius: 2,
                            boxShadow: '0 0 0 1px rgba(37,99,235,0.25)',
                            pointerEvents: 'none',
                          }} />

                          {/* ── Full-image drag-to-move area ── */}
                          <div
                            title="Drag to move image"
                            onMouseDown={handleImageMoveStart}
                            style={{
                              position: 'absolute', inset: 0,
                              cursor: 'grab',
                              pointerEvents: 'all',
                              zIndex: 2,
                              borderRadius: 2,
                              // Subtle blue tint only on hover (via inline hover workaround)
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(37,99,235,0.07)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                          >
                            {/* Move icon badge in the center */}
                            <div style={{
                              position: 'absolute',
                              top: '50%', left: '50%',
                              transform: 'translate(-50%, -50%)',
                              background: 'rgba(30,41,59,0.82)',
                              border: '1px solid rgba(255,255,255,0.18)',
                              borderRadius: 8,
                              padding: '5px 10px',
                              display: 'flex', alignItems: 'center', gap: 5,
                              pointerEvents: 'none',
                              color: '#e2e8f0',
                              fontSize: 11, fontWeight: 700,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                              whiteSpace: 'nowrap',
                            }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/>
                                <polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/>
                                <line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
                              </svg>
                              Drag to Move
                            </div>
                          </div>

                          {/* Image size badge */}
                          <div style={{
                            position: 'absolute', bottom: -26, left: 0,
                            background: '#2563eb', color: '#fff',
                            fontSize: 10, fontWeight: 700, padding: '2px 8px',
                            borderRadius: 4, whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}>
                            {Math.round(resizerStyle.width)} × {Math.round(resizerStyle.height)} px
                          </div>

                          {/* Drag handles — 8 positions */}
                          {(['nw','n','ne','e','se','s','sw','w'] as const).map((handle) => {
                            const isCorner = ['nw','ne','se','sw'].includes(handle);
                            const posStyle: React.CSSProperties = {
                              position: 'absolute', width: 10, height: 10,
                              background: '#2563eb', border: '1.5px solid #fff',
                              borderRadius: isCorner ? 2 : 3,
                              pointerEvents: 'all',
                              cursor:
                                handle === 'nw' || handle === 'se' ? 'nwse-resize' :
                                handle === 'ne' || handle === 'sw' ? 'nesw-resize' :
                                handle === 'n' || handle === 's' ? 'ns-resize' : 'ew-resize',
                              transform: 'translate(-50%, -50%)',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                              top:
                                handle.includes('n') ? 0 :
                                handle.includes('s') ? '100%' : '50%',
                              left:
                                handle.includes('w') ? 0 :
                                handle.includes('e') ? '100%' : '50%',
                            };
                            return (
                              <div
                                key={handle}
                                style={posStyle}
                                onMouseDown={(e) => handleResizerMouseDown(e, handle)}
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* ── Floating Delete Button for Promo Box ── */}
                      {promoBoxStyle && selectedPromoBox && (
                        <div
                          style={{
                            position: 'absolute',
                            top: promoBoxStyle.top,
                            left: promoBoxStyle.left,
                            width: promoBoxStyle.width,
                            height: promoBoxStyle.height,
                            pointerEvents: 'none',
                            zIndex: 50,
                          }}
                        >
                          <div style={{
                            position: 'absolute',
                            top: -42,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: 8,
                            padding: '4px 6px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                            pointerEvents: 'all',
                            whiteSpace: 'nowrap',
                          }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (selectedPromoBox) {
                                  selectedPromoBox.remove();
                                  setSelectedPromoBox(null);
                                  setPromoBoxStyle(null);
                                }
                              }}
                              className="text-white hover:bg-red-750 bg-red-600 font-black text-[10px] px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer border-none"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-white" />
                              <span>Remove Promo Link</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedPromoBox(null);
                                setPromoBoxStyle(null);
                              }}
                              className="text-slate-400 hover:text-white font-black text-[10px] px-2 py-1.5 rounded-md transition-colors cursor-pointer border-none bg-transparent"
                            >
                              Cancel
                            </button>
                          </div>
                          {/* Dotted highlight border around the promo box */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            border: '2px dashed #ef4444',
                            borderRadius: 4,
                            pointerEvents: 'none',
                          }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata fields (Author and date) */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Reporter / Author</label>
                      <input
                        type="text"
                        value={newsAuthor}
                        onChange={(e) => setNewsAuthor(e.target.value)}
                        placeholder="Reporter name"
                        className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                        style={{ textIndent: '6px' }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest flex items-center gap-2">
                        Publish Date &amp; Time
                        {newsViewMode === 'add' && (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full normal-case tracking-normal">
                            Auto
                          </span>
                        )}
                      </label>
                      {newsViewMode === 'add' ? (
                        <div className="bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                          <span>Auto-set to current time when published</span>
                        </div>
                      ) : (
                        <input
                          type="datetime-local"
                          required
                          value={newsPublishedDate}
                          onChange={(e) => setNewsPublishedDate(e.target.value)}
                          className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800"
                        />
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Column (Featured Image and Categories Checklist) */}
                <div className="space-y-6">
                  
                  {/* Featured Image Box */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Featured Image</label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-rose-500 rounded-2xl p-4 bg-slate-50 text-center relative cursor-pointer min-h-[160px] flex items-center justify-center transition-colors">
                      <input
                        type="file"
                        ref={featuredImageInputRef}
                        accept="image/*"
                        onChange={handleFeaturedImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {!newsImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-6 h-6 text-slate-400" />
                          <span className="text-xs font-bold text-slate-500">Click to upload featured image</span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider">Rescaled to max 800px width</span>
                        </div>
                      ) : (
                        <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-200">
                          <img src={newsImage} alt="Featured cover" className="w-full h-auto object-cover max-h-[160px] block" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setNewsImage('');
                            }}
                            className="absolute top-2 right-2 bg-black/60 hover:bg-black/90 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Target Placements (Promotion Flags) */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Target Placements</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/75 rounded-xl border border-slate-100 cursor-pointer transition-colors select-none">
                        <input
                          type="checkbox"
                          checked={isBreakingChecked}
                          onChange={(e) => setIsBreakingChecked(e.target.checked)}
                          className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-slate-300 rounded cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 telugu-text">బ్రేకింగ్ న్యూస్ (Breaking News)</span>
                          <span className="text-[10px] text-slate-400 font-normal">Shows in home breaking feed and ticker.</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/75 rounded-xl border border-slate-100 cursor-pointer transition-colors select-none">
                        <input
                          type="checkbox"
                          checked={isTrendingChecked}
                          onChange={(e) => setIsTrendingChecked(e.target.checked)}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 telugu-text">ట్రెండింగ్ న్యూస్ (Trending News)</span>
                          <span className="text-[10px] text-slate-400 font-normal">Shows in the home trending grid.</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/75 rounded-xl border border-slate-100 cursor-pointer transition-colors select-none">
                        <input
                          type="checkbox"
                          checked={isFeaturedChecked}
                          onChange={(e) => setIsFeaturedChecked(e.target.checked)}
                          className="w-4 h-4 text-[#02599c] focus:ring-[#02599c] border-slate-300 rounded cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 telugu-text">ముఖ్య వార్తలు (Featured News)</span>
                          <span className="text-[10px] text-slate-400 font-normal">Shows in the top home slider/highlights.</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Classification Tree Checklist (Select Categories) */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Classification</label>
                    
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 admin-scrollbar text-xs font-bold text-slate-600">
                      
                      {/* AP Group */}
                      <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
                        <button
                          type="button"
                          onClick={() => toggleClassificationGroup('ap')}
                          className="w-full flex items-center justify-between font-extrabold text-slate-700 cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('andhra-pradesh')} 
                              onChange={() => handleCategoryCheckboxChange('andhra-pradesh')}
                              onClick={(e) => e.stopPropagation()}
                            />
                            ఆంధ్రప్రదేశ్ (Andhra Pradesh)
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedClassification.ap ? '' : '-rotate-90'}`} />
                        </button>
                        {expandedClassification.ap && (
                          <div className="pl-6 pt-2 grid grid-cols-1 gap-1.5 border-l border-slate-200/80 ml-1.5 mt-1 max-h-[150px] overflow-y-auto admin-scrollbar">
                            {apDistricts.map((dist) => (
                              <label key={dist.slug} className="flex items-center gap-2 font-semibold text-slate-500 hover:text-slate-800 cursor-pointer text-[11px] telugu-text">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(dist.slug)}
                                  onChange={() => handleCategoryCheckboxChange(dist.slug)}
                                />
                                {dist.name}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* TG Group */}
                      <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
                        <button
                          type="button"
                          onClick={() => toggleClassificationGroup('telangana')}
                          className="w-full flex items-center justify-between font-extrabold text-slate-700 cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('telangana')} 
                              onChange={() => handleCategoryCheckboxChange('telangana')}
                              onClick={(e) => e.stopPropagation()}
                            />
                            తెలంగాణ (Telangana)
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedClassification.telangana ? '' : '-rotate-90'}`} />
                        </button>
                        {expandedClassification.telangana && (
                          <div className="pl-6 pt-2 grid grid-cols-1 gap-1.5 border-l border-slate-200/80 ml-1.5 mt-1 max-h-[150px] overflow-y-auto admin-scrollbar">
                            {tgDistricts.map((dist) => (
                              <label key={dist.slug} className="flex items-center gap-2 font-semibold text-slate-500 hover:text-slate-800 cursor-pointer text-[11px] telugu-text">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(dist.slug)}
                                  onChange={() => handleCategoryCheckboxChange(dist.slug)}
                                />
                                {dist.name}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Health Group */}
                      <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
                        <button
                          type="button"
                          onClick={() => toggleClassificationGroup('health')}
                          className="w-full flex items-center justify-between font-extrabold text-slate-700 cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('health')} 
                              onChange={() => handleCategoryCheckboxChange('health')}
                              onClick={(e) => e.stopPropagation()}
                            />
                            హెల్త్ (Health)
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedClassification.health ? '' : '-rotate-90'}`} />
                        </button>
                        {expandedClassification.health && (
                          <div className="pl-6 pt-2 flex flex-col gap-1.5 border-l border-slate-200 ml-1.5 mt-1">
                            <label className="flex items-center gap-2 font-semibold text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes('doctors-corner')}
                                onChange={() => handleCategoryCheckboxChange('doctors-corner')}
                              />
                              🥼 డాక్టర్స్ కార్నర్
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Education Group */}
                      <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
                        <button
                          type="button"
                          onClick={() => toggleClassificationGroup('education')}
                          className="w-full flex items-center justify-between font-extrabold text-slate-700 cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('vidya')} 
                              onChange={() => handleCategoryCheckboxChange('vidya')}
                              onClick={(e) => e.stopPropagation()}
                            />
                            విద్య (Education)
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedClassification.education ? '' : '-rotate-90'}`} />
                        </button>
                        {expandedClassification.education && (
                          <div className="pl-6 pt-2 flex flex-col gap-1.5 border-l border-slate-200 ml-1.5 mt-1">
                            <label className="flex items-center gap-2 font-semibold text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes('admissions')}
                                onChange={() => handleCategoryCheckboxChange('admissions')}
                              />
                              🏫 అడ్మిషన్స్
                            </label>
                            <label className="flex items-center gap-2 font-semibold text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes('current-affairs')}
                                onChange={() => handleCategoryCheckboxChange('current-affairs')}
                              />
                              📖 కరెంట్ అఫైర్స్
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Career Group */}
                      <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
                        <button
                          type="button"
                          onClick={() => toggleClassificationGroup('career')}
                          className="w-full flex items-center justify-between font-extrabold text-slate-700 cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('upadi')} 
                              onChange={() => handleCategoryCheckboxChange('upadi')}
                              onClick={(e) => e.stopPropagation()}
                            />
                            ఉపాధి (Career)
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedClassification.career ? '' : '-rotate-90'}`} />
                        </button>
                        {expandedClassification.career && (
                          <div className="pl-6 pt-2 flex flex-col gap-1.5 border-l border-slate-200 ml-1.5 mt-1">
                            <label className="flex items-center gap-2 font-semibold text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes('notification')}
                                onChange={() => handleCategoryCheckboxChange('notification')}
                              />
                              📢 నోటిఫికేషన్స్
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Other Categories collapsible */}
                      <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
                        <button
                          type="button"
                          onClick={() => toggleClassificationGroup('others')}
                          className="w-full flex items-center justify-between font-extrabold text-slate-700 cursor-pointer text-xs"
                        >
                          <span>Other Standard categories</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedClassification.others ? '' : '-rotate-90'}`} />
                        </button>
                        {expandedClassification.others && (
                          <div className="pl-4 pt-2 grid grid-cols-1 gap-1.5 border-l border-slate-200 ml-1.5 mt-1 max-h-[180px] overflow-y-auto admin-scrollbar">
                            {MAIN_CATEGORIES_LIST.map((cat) => (
                              <label key={cat.slug} className="flex items-center gap-2 font-semibold text-slate-500 hover:text-slate-800 cursor-pointer text-[11px] telugu-text">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(cat.slug)}
                                  onChange={() => handleCategoryCheckboxChange(cat.slug)}
                                />
                                {cat.name}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </div>

              </form>
            </div>
          )}

          {/* ══════════════ VIEW: BREAKING NEWS TICKER ══════════════ */}
          {activeTab === 'breaking' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800 font-sans">Breaking News Config</h2>
                <p className="text-slate-500 text-xs">Configure scrolling flash marquee headlines appearing on the website header ticker.</p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm">
                
                {/* Form to append Headline */}
                <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-2xl flex flex-col gap-4">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    {editingFlashIndex !== null ? '✍️ Edit scrolling headline' : 'Add scrolling headline'}
                  </span>
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      type="text"
                      value={newNewsText}
                      onChange={(e) => setNewNewsText(e.target.value)}
                      placeholder="e.g. నేడు హైదరాబాద్‌లో భారీ వర్షం..."
                      className="flex-1 bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />

                    {/* Article Picker — replaces URL input */}
                    <div className="flex-1 flex items-center gap-2">
                      {newNewsLink ? (
                        // Show selected article link as badge
                        <div className="flex-1 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 min-w-0">
                          <span className="text-[10px] font-bold text-blue-700 truncate flex-1 font-mono">{newNewsLink}</span>
                          <button
                            type="button"
                            onClick={() => setNewNewsLink('')}
                            className="text-blue-400 hover:text-red-500 flex-shrink-0 cursor-pointer transition-colors"
                            title="Clear selected article"
                          >
                            <span className="text-sm font-black">✕</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setShowFlashArticlePicker(true); setFlashArticleSearch(''); }}
                          className="flex-1 bg-white border border-dashed border-slate-300 hover:border-[#02599c] hover:bg-blue-50 text-slate-500 hover:text-[#02599c] font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span>Select Article to Link</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFlashNews}
                      className="bg-[#02599c] hover:bg-[#024a82] text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {editingFlashIndex !== null ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{editingFlashIndex !== null ? 'Update item' : 'Add item'}</span>
                    </button>
                    {editingFlashIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewNewsText('');
                          setNewNewsLink('');
                          setEditingFlashIndex(null);
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Flash News Article Picker Modal */}
                {showFlashArticlePicker && (() => {
                  const filteredFlashArticles = flashArticleSearch.trim()
                    ? allArticles.filter((a: any) =>
                        a.title?.toLowerCase().includes(flashArticleSearch.toLowerCase()) ||
                        a.category?.toLowerCase().includes(flashArticleSearch.toLowerCase()) ||
                        a.categorySlug?.toLowerCase().includes(flashArticleSearch.toLowerCase())
                      )
                    : allArticles;

                  return (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
                      <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh] animate-scale-up text-left">
                        {/* Modal Header */}
                        <div className="bg-[#02599c] text-white p-5 flex items-center justify-between flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            <h3 className="font-black text-sm">Select Article to Link Flash Headline</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowFlashArticlePicker(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors font-bold"
                          >✕</button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-slate-100 flex-shrink-0">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              autoFocus
                              value={flashArticleSearch}
                              onChange={e => setFlashArticleSearch(e.target.value)}
                              placeholder="Search by title or category..."
                              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-[#02599c] rounded-xl outline-none text-slate-800"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-2 font-bold">
                            {filteredFlashArticles.length} articles found. Click any article to set it as the redirect destination.
                          </p>
                        </div>

                        {/* Articles List */}
                        <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                          {filteredFlashArticles.length === 0 ? (
                            <div className="p-10 text-center text-slate-400 font-bold text-sm">No articles found.</div>
                          ) : (
                            filteredFlashArticles.map((art: any) => (
                              <button
                                key={art.id}
                                type="button"
                                onClick={() => {
                                  setNewNewsLink(`/news/${art.slug}`);
                                  // Auto-fill headline text if empty
                                  if (!newNewsText.trim()) {
                                    setNewNewsText(art.title);
                                  }
                                  setShowFlashArticlePicker(false);
                                }}
                                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors text-left group"
                              >
                                {/* Thumbnail */}
                                <div className="w-16 h-11 flex-shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200">
                                  <img
                                    src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=120&fit=crop'}
                                    alt={art.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0 py-0.5">
                                  <p
                                    className="text-xs font-bold text-slate-800 group-hover:text-[#02599c] telugu-text line-clamp-2 leading-relaxed transition-colors"
                                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                  >
                                    {art.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-slate-400 font-bold">{getArticleCategoryName(art)}</span>
                                    {art.publishedAt && (
                                      <span className="text-[10px] text-slate-350">• {new Date(art.publishedAt).toLocaleDateString('te-IN')}</span>
                                    )}
                                    <span className="text-[10px] font-mono text-slate-300">• /news/{art.slug}</span>
                                  </div>
                                </div>
                                <span className="flex-shrink-0 text-[10px] font-bold text-[#02599c] bg-blue-50 group-hover:bg-[#02599c] group-hover:text-white px-2 py-1 rounded-lg transition-colors mt-0.5">
                                  Select
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}


                <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black">
                        <th className="p-3 text-[10px] uppercase tracking-wider">#</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">Headline Text (Telugu)</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">Redirect Link</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {flashNewsList.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-450 font-bold">
                            No ticker headlines configured. Add one above!
                          </td>
                        </tr>
                      ) : (
                        flashNewsList.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-slate-400 font-bold">{index + 1}</td>
                            <td className="p-3 font-bold text-slate-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                              {item.text}
                            </td>
                            <td className="p-3 font-mono text-[10px] text-slate-400 truncate max-w-[200px]">{item.link}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => startEditingFlashNews(index)}
                                  className="text-slate-500 hover:text-rose-600 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-slate-100"
                                  title="Edit item"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFlashNews(index)}
                                  className="text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-red-500/10"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* ══════════════ VIEW: TRENDING NEWS TICKER ══════════════ */}
          {activeTab === 'trending' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800 font-sans">Trending News Config</h2>
                <p className="text-slate-500 text-xs">Configure the rotating trending headlines displayed in the website&apos;s top header TRENDING bar.</p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm">

                {/* Form to append Trending Headline */}
                <div className="bg-amber-50 p-4 border border-amber-200/60 rounded-2xl flex flex-col gap-4">
                  <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest">
                    {editingTrendingIndex !== null ? '✍️ Edit trending headline' : '📈 Add trending headline'}
                  </span>
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      type="text"
                      value={newTrendingText}
                      onChange={(e) => setNewTrendingText(e.target.value)}
                      placeholder="e.g. హైదరాబాద్‌లో నేడు భారీ ట్రాఫిక్ జామ్..."
                      className="flex-1 bg-white border border-slate-200/60 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />

                    {/* Article Picker — replaces URL input */}
                    <div className="flex-1 flex items-center gap-2">
                      {newTrendingLink ? (
                        <div className="flex-1 flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 min-w-0">
                          <span className="text-[10px] font-bold text-amber-700 truncate flex-1 font-mono">{newTrendingLink}</span>
                          <button
                            type="button"
                            onClick={() => setNewTrendingLink('')}
                            className="text-amber-400 hover:text-red-500 flex-shrink-0 cursor-pointer transition-colors"
                            title="Clear selected article"
                          >
                            <span className="text-sm font-black">✕</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setShowTrendingArticlePicker(true); setTrendingArticleSearch(''); }}
                          className="flex-1 bg-white border border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50 text-amber-500 hover:text-amber-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span>Select Article to Link</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTrendingNews}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {editingTrendingIndex !== null ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{editingTrendingIndex !== null ? 'Update item' : 'Add item'}</span>
                    </button>
                    {editingTrendingIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewTrendingText('');
                          setNewTrendingLink('');
                          setEditingTrendingIndex(null);
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Trending Article Picker Modal */}
                {showTrendingArticlePicker && (() => {
                  const filteredTrendingArticles = trendingArticleSearch.trim()
                    ? allArticles.filter((a: any) =>
                        a.title?.toLowerCase().includes(trendingArticleSearch.toLowerCase()) ||
                        a.category?.toLowerCase().includes(trendingArticleSearch.toLowerCase()) ||
                        a.categorySlug?.toLowerCase().includes(trendingArticleSearch.toLowerCase())
                      )
                    : allArticles;

                  return (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
                      <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh] animate-scale-up text-left">
                        {/* Modal Header */}
                        <div className="bg-amber-500 text-white p-5 flex items-center justify-between flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            <h3 className="font-black text-sm">Select Article to Link Trending Headline</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowTrendingArticlePicker(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors font-bold"
                          >✕</button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-slate-100 flex-shrink-0">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              autoFocus
                              value={trendingArticleSearch}
                              onChange={e => setTrendingArticleSearch(e.target.value)}
                              placeholder="Search by title or category..."
                              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl outline-none text-slate-800"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-2 font-bold">
                            {filteredTrendingArticles.length} articles found. Click any article to set it as the redirect destination.
                          </p>
                        </div>

                        {/* Articles List */}
                        <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                          {filteredTrendingArticles.length === 0 ? (
                            <div className="p-10 text-center text-slate-400 font-bold text-sm">No articles found.</div>
                          ) : (
                            filteredTrendingArticles.map((art: any) => (
                              <button
                                key={art.id}
                                type="button"
                                onClick={() => {
                                  setNewTrendingLink(`/news/${art.slug}`);
                                  if (!newTrendingText.trim()) {
                                    setNewTrendingText(art.title);
                                  }
                                  setShowTrendingArticlePicker(false);
                                }}
                                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-amber-50 cursor-pointer transition-colors text-left group"
                              >
                                <div className="w-16 h-11 flex-shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200">
                                  <img
                                    src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=120&fit=crop'}
                                    alt={art.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 py-0.5">
                                  <p
                                    className="text-xs font-bold text-slate-800 group-hover:text-amber-700 telugu-text line-clamp-2 leading-relaxed transition-colors"
                                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                  >
                                    {art.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-slate-400 font-bold">{getArticleCategoryName(art)}</span>
                                    {art.publishedAt && (
                                      <span className="text-[10px] text-slate-350">• {new Date(art.publishedAt).toLocaleDateString('te-IN')}</span>
                                    )}
                                    <span className="text-[10px] font-mono text-slate-300">• /news/{art.slug}</span>
                                  </div>
                                </div>
                                <span className="flex-shrink-0 text-[10px] font-bold text-amber-600 bg-amber-50 group-hover:bg-amber-500 group-hover:text-white px-2 py-1 rounded-lg transition-colors mt-0.5">
                                  Select
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Grid Table lists */}

                <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-50 border-b border-amber-100 text-slate-400 font-black">
                        <th className="p-3 text-[10px] uppercase tracking-wider">#</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">Trending Headline Text (Telugu)</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">Redirect Link</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {trendingNewsList.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-450 font-bold">
                            No trending headlines configured. Add one above!
                          </td>
                        </tr>
                      ) : (
                        trendingNewsList.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-slate-400 font-bold">{index + 1}</td>
                            <td className="p-3 font-bold text-slate-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                              {item.text}
                            </td>
                            <td className="p-3 font-mono text-[10px] text-slate-400 truncate max-w-[200px]">{item.link}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => startEditingTrendingNews(index)}
                                  className="text-slate-500 hover:text-amber-600 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-amber-50"
                                  title="Edit item"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTrendingNews(index)}
                                  className="text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-red-500/10"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* ══════════════ VIEW: CATEGORIES & BANNERS ══════════════ */}
          {activeTab === 'categories' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Categories & Banners Override</h2>
                <p className="text-slate-500 text-xs">Configure landing video embeds and category specific banner ads overrides.</p>
              </div>

              {/* 1. YouTube embeds block */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  🎥 Homepage YouTube Video Embeds
                </h3>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, idx) => {
                    const video = videosList[idx] || { id: '', title: '', thumbnail: '' };
                    return (
                      <div key={idx} className="bg-slate-50 p-4 border border-slate-200/60 rounded-xl flex flex-col md:flex-row gap-4">
                        <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-mono font-bold text-xs shrink-0 shadow-inner">
                          {idx + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YouTube Video ID</label>
                            <input
                              type="text"
                              value={video.id}
                              onChange={(e) => handleVideoFieldChange(idx, 'id', e.target.value)}
                              placeholder="e.g. p_kI2pXWkAc"
                              className="bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none transition-colors font-mono text-slate-800"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Video Title (Telugu/English)</label>
                            <input
                              type="text"
                              value={video.title}
                              onChange={(e) => handleVideoFieldChange(idx, 'title', e.target.value)}
                              placeholder="e.g. దేవర పార్ట్-1 అఫీషియల్ ట్రైలర్..."
                              className="bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thumbnail URL Override (Optional)</label>
                            <input
                              type="text"
                              value={video.thumbnail}
                              onChange={(e) => handleVideoFieldChange(idx, 'thumbnail', e.target.value)}
                              placeholder="e.g. /hightv_breaking.png"
                              className="bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none transition-colors text-slate-800"
                            />
                          </div>
                        </div>
                        <div className="w-full md:w-[130px] aspect-video border border-slate-200/80 rounded-xl overflow-hidden bg-black flex items-center justify-center shrink-0">
                          {video.id ? (
                            <img
                              src={video.thumbnail || `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                              alt="Video Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[9px] font-bold text-slate-400 uppercase">No video</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Global Ads layout banners */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm mt-2">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  🎁 Global Site Sponsor Advertisements
                </h3>

                <div className="flex bg-slate-100 p-1 rounded-xl gap-1.5 select-none w-full md:max-w-md">
                  {['leaderboard', 'sidebar', 'rectangle'].map((spot) => (
                    <button
                      key={spot}
                      type="button"
                      onClick={() => setActiveAdSpot(spot as any)}
                      className={`flex-1 text-center py-2 text-xs font-black rounded-lg transition-all cursor-pointer capitalize ${
                        activeAdSpot === spot ? 'bg-[#02599c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {spot}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-850">Activate this custom banner spot</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adSpotEnabled}
                        onChange={(e) => setAdSpotEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#02599c]"></div>
                    </label>
                  </div>

                  {adSpotEnabled && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image Media</label>
                        <div className="border border-dashed border-slate-200 bg-white hover:border-[#02599c] rounded-xl p-4 text-center relative cursor-pointer min-h-[100px] flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAdSpotImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          {!adSpotImage ? (
                            <span className="text-xs text-slate-400 font-bold">Select image banner file</span>
                          ) : (
                            <div className="relative max-w-[280px]">
                              <img src={adSpotImage} alt="ad" className="max-h-[80px] w-auto rounded border border-slate-200" />
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setAdSpotImage(''); }}
                                className="absolute -top-2 -right-2 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                              >✕</button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click URL Link</label>
                        <input
                          type="text"
                          value={adSpotLink}
                          onChange={(e) => setAdSpotLink(e.target.value)}
                          placeholder="e.g. https://www.godaddy.com"
                          className="bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs font-mono outline-none text-slate-850"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Category specific ads settings */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm mt-2">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  🎯 Page specific Banners (Category overrides)
                </h3>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 admin-scrollbar">
                  {[
                    { slug: 'politics', name: 'పాలిటిక్స్' },
                    { slug: 'sports', name: 'స్పోర్ట్స్' },
                    { slug: 'entertainment', name: 'ఫిల్మ్' },
                    { slug: 'business', name: 'బిజినెస్' }
                  ].map((cat) => {
                    const leadKey = `${cat.slug}_leaderboard`;
                    const catAd = customAds[leadKey] || { enabled: false, image: '', link: '#' };
                    return (
                      <div key={cat.slug} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col min-w-0 self-start md:self-center">
                          <span className="text-xs font-black text-slate-800 telugu-text">{cat.name} Page banner</span>
                          <span className="text-[10px] text-slate-400 font-mono">Spot: {leadKey}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <label className="relative inline-flex items-center cursor-pointer scale-90">
                            <input
                              type="checkbox"
                              checked={catAd.enabled}
                              onChange={(e) => toggleCatAdBannerStatus(leadKey, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#02599c]"></div>
                          </label>

                          {catAd.enabled && (
                            <div className="flex items-center gap-2 animate-fade-in">
                              <div className="relative border border-dashed border-slate-200 bg-white hover:border-[#02599c] rounded-lg p-1.5 cursor-pointer max-w-[120px] text-center text-[10px]">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleCatAdBannerUpload(leadKey, e)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                {catAd.image ? (
                                  <img src={catAd.image} alt="cat-ad" className="max-h-[30px] object-cover rounded block" />
                                ) : (
                                  <span className="font-bold text-slate-400">Upload banner</span>
                                )}
                              </div>
                              <input
                                type="text"
                                value={catAd.link}
                                onChange={(e) => handleCatAdBannerLinkChange(leadKey, e.target.value)}
                                placeholder="Redirect link"
                                className="bg-white border border-slate-200/60 focus:border-rose-500 rounded-lg px-2 py-1 text-[10px] outline-none text-slate-850 w-[140px]"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions submit buttons */}
              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  onClick={handleSaveConfigs}
                  disabled={saveStatus === 'saving'}
                  className={`w-full md:w-auto font-black text-xs py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md text-center flex items-center justify-center min-w-[150px] ${
                    saveStatus === 'saved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {saveStatus === 'saving' && 'Saving configurations...'}
                  {saveStatus === 'saved' && '✓ Configuration Saved!'}
                  {saveStatus === 'idle' && 'Save Configurations'}
                </button>
              </div>

            </div>
          )}

          {/* ══════════════ VIEW: OVERLAYS CONFIGS ══════════════ */}
          {activeTab === 'overlays' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Overlay Configuration</h2>
                <p className="text-slate-500 text-xs">Manage popup cards and inline article graphics configurations.</p>
              </div>

              {/* 1. Modal Promo Popups */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  📢 Global Promotional Popups
                </h3>

                <div className="flex bg-slate-100 p-1 rounded-xl gap-1.5 select-none w-full md:max-w-md text-xs font-black">
                  <button
                    type="button"
                    onClick={() => setPopupScope('home')}
                    className={`flex-1 text-center py-2 rounded-lg transition-all cursor-pointer ${
                      popupScope === 'home' ? 'bg-[#02599c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🏠 Homepage Popup
                  </button>
                  <button
                    type="button"
                    onClick={() => setPopupScope('article')}
                    className={`flex-1 text-center py-2 rounded-lg transition-all cursor-pointer ${
                      popupScope === 'article' ? 'bg-[#02599c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    📄 Article View Popup
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-850">Enable popup for {popupScope === 'home' ? 'Homepage' : 'Articles'}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={popupEnabled}
                        onChange={(e) => setPopupEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#02599c]"></div>
                    </label>
                  </div>

                  {popupEnabled && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Popup Action Style</label>
                        <div className="grid grid-cols-2 gap-3 max-w-sm">
                          <button
                            type="button"
                            onClick={() => setPopupType('ad')}
                            className={`py-2 px-3 rounded-xl border-2 font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
                              popupType === 'ad'
                                ? 'border-[#02599c] bg-[#02599c]/10 text-[#02599c] shadow-sm'
                                : 'border-slate-200 bg-white text-slate-450 hover:text-slate-700'
                            }`}
                          >
                            📢 Sponsor Ad
                          </button>
                          <button
                            type="button"
                            onClick={() => setPopupType('poll')}
                            className={`py-2 px-3 rounded-xl border-2 font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
                              popupType === 'poll'
                                ? 'border-[#02599c] bg-[#02599c]/10 text-[#02599c] shadow-sm'
                                : 'border-slate-200 bg-white text-slate-450 hover:text-slate-700'
                            }`}
                          >
                            📊 Voting Poll Card
                          </button>
                        </div>
                      </div>

                      <div className="h-px bg-slate-200 my-1" />

                      {popupType === 'ad' ? (
                        <div className="space-y-4 animate-fade-in">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ad Banner Image URL</label>
                            <input
                              type="text"
                              value={adImage}
                              onChange={(e) => setAdImage(e.target.value)}
                              className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-850"
                              placeholder="/popup-ad.png"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Redirect URL Link</label>
                            <input
                              type="text"
                              value={adLink}
                              onChange={(e) => setAdLink(e.target.value)}
                              className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-850"
                              placeholder="#"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-fade-in">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Voting Question (Telugu/English)</label>
                            <textarea
                              rows={2}
                              value={pollQuestion}
                              onChange={(e) => setPollQuestion(e.target.value)}
                              className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none resize-none text-slate-850 font-bold telugu-text"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider">Option 1</label>
                              <input
                                type="text"
                                value={optYes}
                                onChange={(e) => setOptYes(e.target.value)}
                                className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-2 py-1.5 text-xs outline-none text-slate-850 telugu-text font-bold"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider">Option 2</label>
                              <input
                                type="text"
                                value={optNo}
                                onChange={(e) => setOptNo(e.target.value)}
                                className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-2 py-1.5 text-xs outline-none text-slate-850 telugu-text font-bold"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider">Option 3</label>
                              <input
                                type="text"
                                value={optUnsure}
                                onChange={(e) => setOptUnsure(e.target.value)}
                                className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-2 py-1.5 text-xs outline-none text-slate-850 telugu-text font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Inline Image in Articles */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm mt-2">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  🖼️ Inline Graphic Overlay
                </h3>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black text-slate-850">Activate inline graphics</span>
                      <span className="text-[10px] text-slate-400">Renders this inline graphic image inside all article content details views.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inlineImageEnabled}
                        onChange={(e) => setInlineImageEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#02599c]"></div>
                    </label>
                  </div>

                  {inlineImageEnabled && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Graphic Image</label>
                        <div className="border border-dashed border-slate-200 bg-white hover:border-[#02599c] rounded-xl p-4 text-center relative cursor-pointer min-h-[100px] flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleCompressAndSetImage(file, (base64) => {
                                  setInlineImageData(base64);
                                });
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          {!inlineImageData ? (
                            <span className="text-xs text-slate-400 font-bold">Select image file</span>
                          ) : (
                            <div className="relative max-w-[200px]">
                              <img src={inlineImageData} alt="inline" className="max-h-[100px] w-auto rounded border border-slate-200" />
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setInlineImageData(''); }}
                                className="absolute -top-2 -right-2 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                              >✕</button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image Caption (Telugu/English)</label>
                        <input
                          type="text"
                          value={inlineImageCaption}
                          onChange={(e) => setInlineImageCaption(e.target.value)}
                          placeholder="e.g. యోగ ఆసనాలు వేస్తున్న మోదీ.."
                          className="bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none text-slate-850 font-bold telugu-text"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Related News Promo Box Toggle */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm mt-2">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  🔗 Inner Article Related Promos ("ఈ వార్తా చదవండి :")
                </h3>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black text-slate-850">Enable Related News Promos</span>
                      <span className="text-[10px] text-slate-400">Dynamically inserts related news suggestion boxes inside the article body text.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inlinePromosEnabled}
                        onChange={(e) => setInlinePromosEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#02599c]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Submit */}
              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  onClick={handleSaveConfigs}
                  disabled={saveStatus === 'saving'}
                  className={`w-full md:w-auto font-black text-xs py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md text-center flex items-center justify-center min-w-[150px] ${
                    saveStatus === 'saved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {saveStatus === 'saving' && 'Saving configurations...'}
                  {saveStatus === 'saved' && '✓ Configuration Saved!'}
                  {saveStatus === 'idle' && 'Save Configurations'}
                </button>
              </div>

            </div>
          )}

          {/* ══════════════ VIEW: E-PAPER EDITIONS ══════════════ */}
          {activeTab === 'epaper' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">E-Paper Editions Manager</h2>
                <p className="text-slate-500 text-xs">Publish and delete e-paper PDF issues displayed in the E-Paper page.</p>
              </div>

              {/* Upload E-Paper Form */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  Publish New E-Paper
                </h3>
                <form onSubmit={handleAddEpaper} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-Paper Edition Title (Telugu/English)</label>
                    <input
                      type="text"
                      required
                      value={epaperTitle}
                      onChange={(e) => setEpaperTitle(e.target.value)}
                      placeholder="e.g. నేటి ఈ-పేపర్ ఎడిషన్"
                      className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs outline-none font-bold text-slate-800 telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Edition Date</label>
                    <input
                      type="date"
                      required
                      value={epaperDate}
                      onChange={(e) => setEpaperDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs outline-none text-slate-800"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PDF Attachment File URL</label>
                    <input
                      type="text"
                      required
                      value={epaperPdf}
                      onChange={(e) => setEpaperPdf(e.target.value)}
                      placeholder="e.g. /epapers/edition_today.pdf"
                      className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none text-slate-800"
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1 hover:scale-[1.01]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish E-Paper</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Stored E-Papers Grid */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4 mt-2">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  Published Issues ({epapersList.length})
                </h3>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black">
                        <th className="p-3 text-[10px] uppercase tracking-wider">Date</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">Edition Title</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">File Path</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {epapersList.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-450 font-bold">
                            No custom epapers uploaded. Add one above!
                          </td>
                        </tr>
                      ) : (
                        epapersList.map((paper) => (
                          <tr key={paper.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono font-bold text-slate-650">{paper.date}</td>
                            <td className="p-3 font-bold text-slate-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                              {paper.title}
                            </td>
                            <td className="p-3 font-mono text-[10px] text-slate-400 truncate max-w-[200px]">{paper.pdfUrl}</td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteEpaper(paper.id)}
                                className="text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-red-500/10"
                                title="Delete E-Paper"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ══════════════ VIEW: HOMEPAGE SLIDES ══════════════ */}
          {activeTab === 'slider' && (() => {
            const sliderArticles = allArticles; // all articles from DB + local
            const filteredSliderArticles = sliderSearchQuery.trim()
              ? sliderArticles.filter((a: any) =>
                  a.title?.toLowerCase().includes(sliderSearchQuery.toLowerCase()) ||
                  a.category?.toLowerCase().includes(sliderSearchQuery.toLowerCase())
                )
              : sliderArticles;

            return (
              <div className="flex flex-col gap-6 animate-fade-in text-left">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Homepage Slider Picker</h2>
                    <p className="text-slate-500 text-xs mt-1">
                      Tick the checkbox on any article to add it to the home page hero slider. Uncheck to remove.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 flex-shrink-0">
                    <CheckCircle className="w-4 h-4" />
                    <span>{sliderSelectedIds.size} selected</span>
                  </div>
                </div>

                {/* Info banner */}
                <div className="bg-blue-50 border border-blue-200/60 rounded-2xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-700 leading-relaxed">
                    <span className="font-extrabold text-blue-900 block mb-1">How it works:</span>
                    Select articles below using the checkbox. Selected articles automatically appear in the homepage hero slider. The slider updates instantly — no save button needed.
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* LEFT: Article picker list */}
                  <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    {/* Search bar */}
                    <div className="p-4 border-b border-slate-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={sliderSearchQuery}
                          onChange={e => setSliderSearchQuery(e.target.value)}
                          placeholder="Search articles by title or category..."
                          className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-rose-400 rounded-xl outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Articles list */}
                    <div className="overflow-y-auto max-h-[560px] divide-y divide-slate-50">
                      {filteredSliderArticles.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 font-bold text-sm">
                          No articles found.
                        </div>
                      ) : (
                        filteredSliderArticles.map(art => {
                          const isSelected = sliderSelectedIds.has(String(art.id));
                          return (
                            <label
                              key={art.id}
                              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-[#02599c]' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                            >
                              {/* Checkbox */}
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSliderArticle(art)}
                                className="w-4 h-4 accent-[#02599c] flex-shrink-0 cursor-pointer rounded"
                              />
                              {/* Thumbnail */}
                              <div className="w-16 h-11 flex-shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200">
                                <img
                                  src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=120&fit=crop'}
                                  alt={art.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-xs font-bold text-slate-800 telugu-text line-clamp-2 leading-relaxed"
                                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                >
                                  {art.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-slate-400 font-bold">{getArticleCategoryName(art)}</span>
                                  {art.publishedAt && (
                                    <span className="text-[10px] text-slate-350">• {new Date(art.publishedAt).toLocaleDateString('te-IN')}</span>
                                  )}
                                </div>
                              </div>
                              {/* Selected badge */}
                              {isSelected && (
                                <span className="flex-shrink-0 text-[10px] font-black text-white bg-[#02599c] px-2 py-0.5 rounded-full">
                                  In Slider ✓
                                </span>
                              )}
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Selected slides preview */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                      <h3 className="text-sm font-black text-slate-800">
                        Slider Preview ({sliderSelectedIds.size})
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Articles selected for the hero slider</p>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 max-h-[520px]">
                      {sliderSelectedIds.size === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <div className="text-3xl mb-2">🖼️</div>
                          <p className="text-xs font-bold">No articles selected yet.</p>
                          <p className="text-[11px] text-slate-350 mt-1">Tick checkboxes on the left to add articles.</p>
                        </div>
                      ) : (
                        sliderSlidesList.map((slide, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-3 hover:bg-slate-50">
                            <img
                              src={slide.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&fit=crop'}
                              alt={slide.title}
                              className="w-14 h-10 object-cover rounded border border-slate-200 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-[11px] font-bold text-slate-700 telugu-text line-clamp-2 leading-relaxed"
                                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                              >
                                {slide.title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{slide.link}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const art = allArticles.find((a: any) => String(a.id) === String(slide.articleId));
                                if (art) toggleSliderArticle(art);
                              }}
                              className="text-red-400 hover:text-red-600 p-1 flex-shrink-0 cursor-pointer"
                              title="Remove from slider"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    {sliderSelectedIds.size > 0 && (
                      <div className="p-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            if (!confirm('Remove ALL articles from the slider?')) return;
                            setSliderSelectedIds(new Set());
                            setSliderSlidesList([]);
                            localStorage.setItem('homepage_slider_article_ids', '[]');
                            localStorage.setItem('homepage_banner_slides', '[]');
                          }}
                          className="w-full text-[11px] font-bold text-red-500 hover:text-red-700 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Clear All Slider Articles
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ══════════════ VIEW: SIDEBAR NEWS CONFIG ══════════════ */}
          {activeTab === 'sidebar-news' && (() => {
            // Find articles belonging to the selected sidebar category
            // Determine the effective district list for the dropdown
            const isDistrictCat = activeSidebarCategory === 'telangana-districts' || activeSidebarCategory === 'andhra-pradesh-districts';
            const districtListForDropdown = activeSidebarCategory === 'telangana-districts' ? tgDistricts
              : activeSidebarCategory === 'andhra-pradesh-districts' ? apDistricts
              : [];
            // Effective pin key: if a district is selected use district-{slug}, else use the category slug
            const effectivePinKey = (isDistrictCat && activeSidebarDistrict)
              ? `district-${activeSidebarDistrict}`
              : activeSidebarCategory;

            const catArticles = (activeSidebarCategory === 'home' || activeSidebarCategory === 'latest')
              ? allArticles
              : activeSidebarCategory === 'telangana-districts'
              ? (activeSidebarDistrict
                  ? allArticles.filter((art: any) => art.categorySlug === 'telangana' && art.districtSlug === activeSidebarDistrict)
                  : allArticles.filter((art: any) => art.categorySlug === 'telangana' && art.districtSlug))
              : activeSidebarCategory === 'andhra-pradesh-districts'
              ? (activeSidebarDistrict
                  ? allArticles.filter((art: any) => art.categorySlug === 'andhra-pradesh' && art.districtSlug === activeSidebarDistrict)
                  : allArticles.filter((art: any) => art.categorySlug === 'andhra-pradesh' && art.districtSlug))
              : allArticles.filter((art: any) => {
                  const matchesCategory = art.categorySlug === activeSidebarCategory || art.category?.toLowerCase() === activeSidebarCategory.toLowerCase();
                  if (activeSidebarCategory === 'telangana' || activeSidebarCategory === 'andhra-pradesh') {
                    return matchesCategory && !art.districtSlug;
                  }
                  return matchesCategory;
                });

            // Filter these category articles based on search query
            const filteredCatArticles = sidebarNewsSearch.trim()
              ? catArticles.filter((a: any) =>
                  a.title?.toLowerCase().includes(sidebarNewsSearch.toLowerCase())
                )
              : catArticles;

            // Get pins for the effective key (either district-specific or category)
            const pins = sidebarCategoryPins[effectivePinKey] || { trending: [], breaking: [] };

            return (
              <div className="flex flex-col gap-6 animate-fade-in text-left">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Sidebar News Configuration</h2>
                  <p className="text-slate-500 text-xs mt-1">
                    Select a category page from the list below, then pin specific articles to its sidebar's Trending or Breaking sections.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left Column: Pages List */}
                  <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                      Select Page (Category)
                    </h3>
                    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[500px] pr-1">
                      {SIDEBAR_CATEGORIES.map((cat) => {
                        const catPins = sidebarCategoryPins[cat.slug] || { trending: [], breaking: [] };
                        const tCount = catPins.trending?.length || 0;
                        const bCount = catPins.breaking?.length || 0;
                        const isActive = activeSidebarCategory === cat.slug;

                        return (
                          <button
                            key={cat.slug}
                            type="button"
                            onClick={() => {
                              setActiveSidebarCategory(cat.slug);
                              setActiveSidebarDistrict('');
                              setSidebarNewsSearch('');
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
                              isActive
                                ? 'bg-[#02599c] text-white shadow-md font-black scale-[1.01]'
                                : 'hover:bg-slate-50 text-slate-700 font-semibold'
                            }`}
                          >
                            <span className="text-xs telugu-text font-sans truncate pr-1">
                              {cat.name.split(' ')[0]}
                            </span>
                            {(tCount > 0 || bCount > 0) && (
                              <div className="flex items-center gap-1 shrink-0">
                                {tCount > 0 && (
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-black ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                                    {tCount}T
                                  </span>
                                )}
                                {bCount > 0 && (
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-black ${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-800'}`}>
                                    {bCount}B
                                  </span>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Article Selector & Pin Buttons */}
                  <div className="lg:col-span-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 telugu-text">
                          {SIDEBAR_CATEGORIES.find(c => c.slug === activeSidebarCategory)?.name}
                          {isDistrictCat && activeSidebarDistrict && (
                            <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              📍 {districtListForDropdown.find(d => d.slug === activeSidebarDistrict)?.name}
                            </span>
                          )}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Configure custom sidebar news for this page. (Unpinned items default to normal sorting)
                        </p>
                        {/* District dropdown — only shown for district categories */}
                        {isDistrictCat && (
                          <div className="mt-2">
                            <select
                              value={activeSidebarDistrict}
                              onChange={e => { setActiveSidebarDistrict(e.target.value); setSidebarNewsSearch(''); }}
                              className="w-full md:w-72 text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:border-[#02599c] outline-none cursor-pointer"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                            >
                              <option value="">-- అన్ని జిల్లాలు (All Districts) --</option>
                              {districtListForDropdown.map(d => {
                                const dPins = sidebarCategoryPins[`district-${d.slug}`] || { trending: [], breaking: [] };
                                const dT = dPins.trending?.length || 0;
                                const dB = dPins.breaking?.length || 0;
                                return (
                                  <option key={d.slug} value={d.slug}>
                                    {d.name}{dT > 0 || dB > 0 ? ` (T:${dT} B:${dB})` : ''}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={sidebarNewsSearch}
                          onChange={e => setSidebarNewsSearch(e.target.value)}
                          placeholder="Search this page's articles..."
                          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 focus:border-[#02599c] rounded-xl outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Articles list */}
                    <div className="overflow-y-auto divide-y divide-slate-50 max-h-[500px]">
                      {filteredCatArticles.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">
                          <div className="text-3xl mb-2">📰</div>
                          <p className="text-xs font-bold">No articles found in this category.</p>
                          <p className="text-[11px] text-slate-350 mt-1">
                            Create news articles classified under this page first.
                          </p>
                        </div>
                      ) : (
                        filteredCatArticles.map((art) => {
                          const artId = String(art.id);
                          const isTrendingPinned = pins.trending.includes(artId);
                          const isBreakingPinned = pins.breaking.includes(artId);

                          return (
                            <div
                              key={art.id}
                              className={`flex flex-col md:flex-row md:items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors ${
                                isTrendingPinned || isBreakingPinned ? 'bg-blue-50/30' : ''
                              }`}
                            >
                              {/* Thumbnail */}
                              <div className="w-16 h-11 flex-shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200">
                                <img
                                  src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&fit=crop'}
                                  alt={art.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <h4
                                  className="text-xs font-bold text-slate-800 telugu-text line-clamp-2 leading-relaxed"
                                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                >
                                  {art.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-400 font-bold">
                                  <span>ID: {art.id.slice(0, 8)}...</span>
                                  {art.publishedAt && (
                                    <span>• {new Date(art.publishedAt).toLocaleString('te-IN')}</span>
                                  )}
                                  {(art.categorySlug || art.districtSlug) && (
                                    <span className="bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                                      {getArticleCategoryName(art)}
                                    </span>
                                  )}
                                  {isTrendingPinned && (
                                    <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-1.5 py-0.5 rounded-md">
                                      Trending Sidebar Pin
                                    </span>
                                  )}
                                  {isBreakingPinned && (
                                    <span className="bg-red-100 text-red-800 text-[8px] font-black px-1.5 py-0.5 rounded-md">
                                      Breaking Sidebar Pin
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Buttons */}
                              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                                <button
                                  type="button"
                                  onClick={() => toggleSidebarNewsPin(effectivePinKey, 'trending', art.id)}
                                  className={`text-[10px] font-black py-2 px-3 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1 ${
                                    isTrendingPinned
                                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                      : 'bg-white hover:bg-amber-50 border border-amber-300 text-amber-600 hover:text-amber-800'
                                  }`}
                                >
                                  <span>🔥 {isTrendingPinned ? 'Trending (Pinned)' : 'Add to Trending'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleSidebarNewsPin(effectivePinKey, 'breaking', art.id)}
                                  className={`text-[10px] font-black py-2 px-3 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1 ${
                                    isBreakingPinned
                                      ? 'bg-red-600 hover:bg-red-700 text-white'
                                      : 'bg-white hover:bg-red-50 border border-red-300 text-red-600 hover:text-red-800'
                                  }`}
                                >
                                  <span>🚨 {isBreakingPinned ? 'Breaking (Pinned)' : 'Add to Breaking'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}


        </div>
      </main>

      {/* ── Related News Promos Inserter Modal ── */}
      {showPromoLinkModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-scale-up text-left">
            
            {/* Modal Header */}
            <div className="bg-[#02599c] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5" />
                <h3 className="font-black text-sm select-none">Related News Inserter (ఈ వార్తా చదవండి)</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowPromoLinkModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex flex-col gap-5">
              
              {/* Option A: Search & Select from Existing Articles */}
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Option A: Link Existing Article</h4>
                <div className="relative">
                  <input
                    type="text"
                    value={promoSearchQuery}
                    onChange={(e) => setPromoSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#02599c] focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs outline-none text-slate-900"
                    placeholder="Search articles by title or category..."
                  />
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto divide-y divide-slate-100 bg-slate-50">
                  {(() => {
                    const query = promoSearchQuery.trim().toLowerCase();
                    const list = allArticles.filter(art => 
                      !query || 
                      art.title.toLowerCase().includes(query) || 
                      (art.category && art.category.toLowerCase().includes(query))
                    );

                    if (list.length === 0) {
                      return <div className="p-5 text-center text-slate-400 text-xs font-bold">No articles match your query.</div>;
                    }

                    return list.map((art) => (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => handleInsertPromoLink(art.title, art.slug)}
                        className="w-full text-left p-3.5 hover:bg-[#02599c]/5 active:bg-[#02599c]/10 transition-colors flex items-center justify-between gap-4 cursor-pointer text-xs"
                      >
                        <span className="font-bold text-slate-800 line-clamp-2 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                          {art.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold bg-white border border-slate-200 rounded px-2 py-0.5 whitespace-nowrap">
                          {getArticleCategoryName(art)}
                        </span>
                      </button>
                    ));
                  })()}
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Option B: Enter Custom Title and Slug/URL manually */}
              <div className="flex flex-col gap-3.5">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Option B: Custom Promo Box</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Title (Telugu/English)</label>
                    <input
                      type="text"
                      value={customPromoTitle}
                      onChange={(e) => setCustomPromoTitle(e.target.value)}
                      placeholder="e.g. ఇక్కడ వేరే వార్త టైటిల్ రాయండి"
                      className="bg-slate-50 border border-slate-200 focus:border-[#02599c] focus:bg-white rounded-xl px-3 py-2.5 text-xs outline-none text-slate-900 font-bold telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Article Slug or Full URL</label>
                    <input
                      type="text"
                      value={customPromoSlug}
                      onChange={(e) => setCustomPromoSlug(e.target.value)}
                      placeholder="e.g. ap-heavy-rains-alert-2024"
                      className="bg-slate-50 border border-slate-200 focus:border-[#02599c] focus:bg-white rounded-xl px-3 py-2.5 text-xs outline-none text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!customPromoTitle.trim() || !customPromoSlug.trim()}
                  onClick={() => handleInsertPromoLink(customPromoTitle, customPromoSlug)}
                  className={`mt-1 font-black text-xs py-3 px-6 rounded-xl transition-all cursor-pointer text-center shadow-md flex items-center justify-center gap-1.5 ${
                    customPromoTitle.trim() && customPromoSlug.trim()
                      ? 'bg-rose-600 hover:bg-rose-700 text-white hover:scale-[1.01]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Custom Promo Box</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
