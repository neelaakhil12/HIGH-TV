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
  FileCheck,
  Globe
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
  tgDistricts
} from '@/lib/mockData';

// Main 22 Pages/Categories List (excluding subpages)
const MAIN_CATEGORIES_LIST = [
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

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Dashboard navigation tab: 'dashboard', 'news', 'breaking', 'categories', 'overlays', 'epaper'
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // News filtering state (filters News list based on selected category in sidebar)
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Mode inside News Management: 'list', 'add', 'edit'
  const [newsViewMode, setNewsViewMode] = useState<'list' | 'add' | 'edit'>('list');
  
  // General configs states
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Form states (popups, tickers, media)
  const [customNewsList, setCustomNewsList] = useState<any[]>([]);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // WYSIWYG Editor references
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);

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

    // Load Custom News Articles
    try {
      setCustomNewsList(JSON.parse(localStorage.getItem('custom_news_articles') || '[]'));
    } catch {
      setCustomNewsList([]);
    }

    // Load Flash news
    try {
      setFlashNewsList(JSON.parse(localStorage.getItem('flash_news_items') || '[]'));
    } catch {
      setFlashNewsList([]);
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

    // E-paper list
    try {
      setEpapersList(JSON.parse(localStorage.getItem('custom_epapers') || '[]'));
    } catch {
      setEpapersList([]);
    }
  }, [isAuthenticated, popupScope, activeAdSpot, refreshCounter]);

  // Set default published date when switching to add article view
  useEffect(() => {
    if (newsViewMode === 'add') {
      setNewsPublishedDate(new Date().toISOString().slice(0, 16));
      setNewsTitle('');
      setNewsSlug('');
      setNewsDescription('');
      setNewsImage('');
      setEditingArticle(null);
      // Auto-check filterCategory in classification tree
      if (filterCategory !== 'all' && filterCategory !== 'latest') {
        setSelectedCategories([filterCategory]);
      } else {
        setSelectedCategories([]);
      }
      setTimeout(() => {
        if (editorRef.current) editorRef.current.innerHTML = '';
      }, 50);
    }
  }, [newsViewMode]);

  // Auto slug generation based on English text input
  useEffect(() => {
    if (newsViewMode === 'add' && newsTitle) {
      const cleanTitle = newsTitle.trim().toLowerCase()
        .replace(/[^a-z0-9\u0C00-\u0C7F ]/g, '') // Keep Telugu & English alphanumerics
        .replace(/\s+/g, '-');
      setNewsSlug(`${cleanTitle}-${Date.now().toString().slice(-4)}`);
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
          
          // Insert actual HTML image element in editor
          const imgHTML = `<img src="${mediaPath}" class="w-full h-auto rounded-xl my-4 block" alt="inline-img" />`;
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
          
          // Insert actual video element in editor
          const videoHTML = `<video src="${mediaPath}" controls class="w-full h-auto rounded-xl my-4 block"></video>`;
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

  // Compile full article listings (mock news databases + custom news articles database)
  const allArticles = useMemo(() => {
    const staticArticles = [
      ...politicsNews,
      ...entertainmentNews,
      ...sportsNews,
      ...technologyNews,
      ...businessNews,
      ...healthNews,
      ...viralNews,
      ...rasipalaluNews,
      ...adyathmikamNews,
      ...sampadakiyamNews,
      ...womenNews,
      ...lifestyleNews,
      ...districtNews,
      ...vidyaNews,
      ...admissionsNews,
      ...currentAffairsNews,
      ...upadiNews,
      ...notificationNews,
      ...webstoriesNews,
      ...antharmadanamNews
    ];

    // Read modified and deleted maps
    let modified = {};
    let deleted: string[] = [];
    try {
      modified = JSON.parse(localStorage.getItem('modified_news_articles') || '{}');
      deleted = JSON.parse(localStorage.getItem('deleted_news_articles') || '[]');
    } catch {}

    // Filter, modify and merge
    const activeStatic = staticArticles
      .filter((art) => !deleted.includes(art.id))
      .map((art) => {
        if ((modified as any)[art.id]) {
          return { ...art, ...(modified as any)[art.id] };
        }
        return art;
      });

    const activeCustom = customNewsList.filter((art) => !deleted.includes(art.id));

    // De-duplicate in case static arrays overlap
    const seenIds = new Set<string>();
    const merged: any[] = [];

    [...activeCustom, ...activeStatic].forEach((art) => {
      if (!seenIds.has(art.id)) {
        seenIds.add(art.id);
        merged.push(art);
      }
    });

    // Sort by publication date
    return merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [customNewsList, refreshCounter]);

  // Filter articles based on sidebar category filter selection
  const filteredArticles = useMemo(() => {
    let result = allArticles;

    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter((art) => {
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
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !editorRef.current?.innerHTML.trim()) {
      alert('Title and Article Body Content are required!');
      return;
    }

    // Determine category configurations from checked boxes
    let categorySlug = 'politics';
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

    const excerptText = newsDescription.trim() || editorRef.current.innerText.slice(0, 140).trim().replace(/<[^>]*>/g, '') + '...';

    const cleanBodyHTML = editorRef.current.innerHTML;

    if (newsViewMode === 'add') {
      const newArticle = {
        id: `custom-art-${Date.now()}`,
        title: newsTitle.trim(),
        slug: newsSlug.trim() || `${newsTitle.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`,
        categorySlug,
        category: resolvedCat,
        districtSlug,
        author: newsAuthor.trim() || 'హై టీవీ డెస్క్',
        publishedAt: new Date(newsPublishedDate).toISOString(),
        description: excerptText,
        body: cleanBodyHTML,
        image: newsImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop',
        views: 0,
        isBreaking: false,
        isTrending: false,
        isFeatured: false
      };

      const updated = [newArticle, ...customNewsList];
      setCustomNewsList(updated);
      localStorage.setItem('custom_news_articles', JSON.stringify(updated));
      alert('Article published successfully!');
    } else if (newsViewMode === 'edit' && editingArticle) {
      const modified = JSON.parse(localStorage.getItem('modified_news_articles') || '{}');
      modified[editingArticle.id] = {
        id: editingArticle.id,
        slug: editingArticle.slug,
        title: newsTitle.trim(),
        categorySlug,
        category: resolvedCat,
        districtSlug,
        author: newsAuthor.trim() || 'హై టీవీ డెస్క్',
        publishedAt: new Date(newsPublishedDate).toISOString(),
        description: excerptText,
        body: cleanBodyHTML,
        image: newsImage,
        isBreaking: editingArticle.isBreaking,
        isTrending: editingArticle.isTrending,
        isFeatured: editingArticle.isFeatured
      };
      localStorage.setItem('modified_news_articles', JSON.stringify(modified));
      alert('Article updated successfully!');
    }

    // Reset view
    setNewsViewMode('list');
    setRefreshCounter(prev => prev + 1);
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

    setNewsViewMode('edit');
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = art.body || art.content || '';
      }
    }, 100);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      if (articleId.startsWith('custom-art-')) {
        const custom = JSON.parse(localStorage.getItem('custom_news_articles') || '[]');
        const updated = custom.filter((art: any) => art.id !== articleId);
        localStorage.setItem('custom_news_articles', JSON.stringify(updated));
        setCustomNewsList(updated);
      } else {
        const deleted = JSON.parse(localStorage.getItem('deleted_news_articles') || '[]');
        if (!deleted.includes(articleId)) {
          deleted.push(articleId);
          localStorage.setItem('deleted_news_articles', JSON.stringify(deleted));
        }
      }
      setRefreshCounter(prev => prev + 1);
      alert('Article deleted successfully!');
    } catch {
      alert('Failed to delete article.');
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

  // Add marquee item
  const handleAddFlashNews = () => {
    if (!newNewsText.trim()) return;
    const newMarquee = [
      ...flashNewsList,
      {
        text: newNewsText.trim(),
        link: newNewsLink.trim() || `/search?q=${encodeURIComponent(newNewsText.trim())}`
      }
    ];
    setFlashNewsList(newMarquee);
    localStorage.setItem('flash_news_items', JSON.stringify(newMarquee));
    setNewNewsText('');
    setNewNewsLink('');
  };

  const handleRemoveFlashNews = (idx: number) => {
    const updated = flashNewsList.filter((_, index) => index !== idx);
    setFlashNewsList(updated);
    localStorage.setItem('flash_news_items', JSON.stringify(updated));
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
                        <th className="p-4 text-[10px] uppercase tracking-wider">Status</th>
                        <th className="p-4 text-[10px] uppercase tracking-wider text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredArticles.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-10 text-center text-slate-400 font-bold">
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
                                {art.category || art.categorySlug}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 font-bold capitalize">
                              {art.author}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-bold text-slate-500">Approved</span>
                              </div>
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
                  onClick={handleSaveArticle}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 hover:scale-[1.01]"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{newsViewMode === 'add' ? 'Publish Review' : 'Update Details'}</span>
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
                      <button type="button" onClick={() => handleFormat('removeFormat')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Clear Formatting"><Eraser className="w-3.5 h-3.5" /></button>
                    </div>

                    {/* contenteditable editing panel */}
                    <div 
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      data-placeholder="వార్త పూర్తి సమాచారాన్ని ఇక్కడ రాయండి..."
                      className="wysiwyg-editor w-full bg-slate-50 border border-slate-200/60 focus:bg-white focus:border-rose-500 rounded-2xl p-5 text-sm outline-none transition-all text-slate-800 overflow-y-auto leading-relaxed telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />
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
                      <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Publish Date & Time</label>
                      <input
                        type="datetime-local"
                        required
                        value={newsPublishedDate}
                        onChange={(e) => setNewsPublishedDate(e.target.value)}
                        className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800"
                      />
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
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Add scrolling headline</span>
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      type="text"
                      value={newNewsText}
                      onChange={(e) => setNewNewsText(e.target.value)}
                      placeholder="e.g. నేడు హైదరాబాద్‌లో భారీ వర్షం..."
                      className="flex-1 bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />
                    <input
                      type="text"
                      value={newNewsLink}
                      onChange={(e) => setNewNewsLink(e.target.value)}
                      placeholder="Redirect URL path (optional)"
                      className="flex-1 bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs font-mono outline-none transition-colors text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddFlashNews}
                      className="bg-[#02599c] hover:bg-[#024a82] text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add item</span>
                    </button>
                  </div>
                </div>

                {/* Grid Table lists */}
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
                              <button
                                type="button"
                                onClick={() => handleRemoveFlashNews(index)}
                                className="text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-red-500/10"
                                title="Remove item"
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

        </div>
      </main>
    </div>
  );
}
