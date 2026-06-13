'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  Minus,
  Plus,
  Scissors,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Grid,
  X,
  Maximize2,
  ArrowUp,
  ChevronDown,
  MapPin,
  Menu,
  Search
} from 'lucide-react';

interface EpaperPageData {
  pageNum: number;
  title: string;
}

const BASE_WIDTH = 1400;

// Helper to format Date picker string to display date format
const formatDisplayDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatDatePickerLabel = (dateStr: string) => {
  if (!dateStr) return 'dd-mm-yyyy';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // dd-mm-yyyy format
  }
  return dateStr;
};

const getPdfUrlForDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '/BalagamTV_Main_Edition__13_Jun_2026.pdf';
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const shortMonth = months[date.getMonth()];
  const year = date.getFullYear();
  return `/BalagamTV_Main_Edition__${day}_${shortMonth}_${year}.pdf`;
};

interface ArticleZone {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Page dimensions (base 1400px wide, aspect ~1.414 for A3 newspaper)
// All coordinates are in base-100%-zoom pixel space (1400px wide canvas)
const PAGE_H = 1980; // approximate full page height at BASE_WIDTH=1400

const generateMockZonesForPage = (pageIdx: number): ArticleZone[] => {
  // Page 1 – front page: masthead + 4-column layout
  // Columns: L(0-340) | CL(340-730) | CR(730-1060) | R(1060-1400)
  if (pageIdx === 0) {
    return [
      // Masthead full-width header band
      { id: 'p1-masthead',    title: 'బలగం టీవీ శీర్షిక',          x: 0,    y: 0,   width: 1400, height: 195 },
      // Left column – big lead story spanning full height
      { id: 'p1-col1-art1',  title: 'ప్రధాన వార్త – ఎడమ కాలమ్ 1', x: 0,    y: 195, width: 340,  height: 600 },
      { id: 'p1-col1-art2',  title: 'ప్రధాన వార్త – ఎడమ కాలమ్ 2', x: 0,    y: 795, width: 340,  height: 595 },
      { id: 'p1-col1-art3',  title: 'ప్రధాన వార్త – ఎడమ కాలమ్ 3', x: 0,    y: 1390,width: 340,  height: 590 },
      // Center-left column
      { id: 'p1-col2-art1',  title: 'ముఖ్య కథనం 1 – మధ్య కాలమ్',  x: 340,  y: 195, width: 390,  height: 800 },
      { id: 'p1-col2-art2',  title: 'ముఖ్య కథనం 2 – మధ్య కాలమ్',  x: 340,  y: 995, width: 390,  height: 500 },
      { id: 'p1-col2-art3',  title: 'ముఖ్య కథనం 3 – మధ్య కాలమ్',  x: 340,  y: 1495,width: 390,  height: 485 },
      // Center-right column
      { id: 'p1-col3-art1',  title: 'వార్తా కథనం 1 – మధ్య-కుడి',   x: 730,  y: 195, width: 330,  height: 600 },
      { id: 'p1-col3-art2',  title: 'వార్తా కథనం 2 – మధ్య-కుడి',   x: 730,  y: 795, width: 330,  height: 600 },
      { id: 'p1-col3-art3',  title: 'వార్తా కథనం 3 – మధ్య-కుడి',   x: 730,  y: 1395,width: 330,  height: 585 },
      // Right column
      { id: 'p1-col4-art1',  title: 'జాతీయ వార్తలు 1 – కుడి కాలమ్', x: 1060, y: 195, width: 340,  height: 530 },
      { id: 'p1-col4-art2',  title: 'జాతీయ వార్తలు 2 – కుడి కాలమ్', x: 1060, y: 725, width: 340,  height: 530 },
      { id: 'p1-col4-art3',  title: 'జాతీయ వార్తలు 3 – కుడి కాలమ్', x: 1060, y: 1255,width: 340,  height: 725 },
    ];
  }

  // Page 2 – inside page: 3-column gapless grid
  if (pageIdx === 1) {
    const cw = Math.floor(1400 / 3); // ~466
    return [
      { id: 'p2-c1-r1', title: 'రాష్ట్ర వార్తలు 1',      x: 0,       y: 0,    width: cw, height: 660 },
      { id: 'p2-c1-r2', title: 'రాష్ట్ర వార్తలు 2',      x: 0,       y: 660,  width: cw, height: 660 },
      { id: 'p2-c1-r3', title: 'రాష్ట్ర వార్తలు 3',      x: 0,       y: 1320, width: cw, height: 660 },
      { id: 'p2-c2-r1', title: 'జాతీయ వార్తలు 1',       x: cw,      y: 0,    width: cw, height: 660 },
      { id: 'p2-c2-r2', title: 'జాతీయ వార్తలు 2',       x: cw,      y: 660,  width: cw, height: 660 },
      { id: 'p2-c2-r3', title: 'జాతీయ వార్తలు 3',       x: cw,      y: 1320, width: cw, height: 660 },
      { id: 'p2-c3-r1', title: 'అంతర్జాతీయ వార్తలు 1',  x: cw * 2,  y: 0,    width: 1400 - cw * 2, height: 660 },
      { id: 'p2-c3-r2', title: 'అంతర్జాతీయ వార్తలు 2',  x: cw * 2,  y: 660,  width: 1400 - cw * 2, height: 660 },
      { id: 'p2-c3-r3', title: 'అంతర్జాతీయ వార్తలు 3',  x: cw * 2,  y: 1320, width: 1400 - cw * 2, height: 660 },
    ];
  }

  // Pages 3+ – generic 3-column gapless grid, 3 rows
  const cw = Math.floor(1400 / 3);
  const rh = Math.floor(PAGE_H / 3);
  const zones: ArticleZone[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      zones.push({
        id: `p${pageIdx + 1}-c${c}-r${r}`,
        title: `వార్తా కథనం ${r * 3 + c + 1}`,
        x: c * cw,
        y: r * rh,
        width: c === 2 ? 1400 - cw * 2 : cw,
        height: r === 2 ? PAGE_H - rh * 2 : rh,
      });
    }
  }
  return zones;
};

interface EditionCardThumbnailProps {
  pdfjs: any;
  dateIso: string;
  defaultPdfDoc: any;
  cardIdx: number;
  totalPages: number;
}

export function EditionCardThumbnail({ pdfjs, dateIso, defaultPdfDoc, cardIdx, totalPages }: EditionCardThumbnailProps) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!pdfjs) return;
    let isCancelled = false;

    const loadPdf = async () => {
      const url = getPdfUrlForDate(dateIso);
      
      let exists = false;
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) {
          exists = true;
        } else if (res.status === 405) {
          const resGet = await fetch(url);
          exists = resGet.ok;
        }
      } catch {
        exists = false;
      }

      if (isCancelled) return;

      if (exists) {
        try {
          const loadingTask = pdfjs.getDocument({ url });
          const pdf = await loadingTask.promise;
          if (!isCancelled) {
            setPdfDoc(pdf);
            setPageNum(1);
            setLoading(false);
          }
        } catch (err) {
          console.error(`Failed to load pdf for ${dateIso}:`, err);
          if (!isCancelled) {
            setPdfDoc(defaultPdfDoc);
            setPageNum((cardIdx % totalPages) + 1);
            setLoading(false);
          }
        }
      } else {
        if (!isCancelled) {
          setPdfDoc(defaultPdfDoc);
          setPageNum((cardIdx % totalPages) + 1);
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfjs, dateIso, defaultPdfDoc, cardIdx, totalPages]);

  if (loading) {
    return <div className="text-gray-400 text-xs font-semibold animate-pulse">Loading preview...</div>;
  }

  if (!pdfDoc) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center select-none">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#cc0000] font-black text-lg mb-2">B</div>
        <span className="text-[10px] text-gray-500 font-bold uppercase">Balagam TV</span>
        <span className="text-[8px] text-red-500 font-bold mt-1 uppercase tracking-wider">Not Uploaded</span>
      </div>
    );
  }

  return <NewspaperPDFPage pdfDoc={pdfDoc} pageNum={pageNum} zoom={25} className="w-full h-full block" />;
}

interface NewspaperPDFPageProps {
  pdfDoc: any;
  pageNum: number;
  zoom: number;
  onRenderSuccess?: (canvas: HTMLCanvasElement) => void;
  className?: string;
}

export function NewspaperPDFPage({ pdfDoc, pageNum, zoom, onRenderSuccess, className }: NewspaperPDFPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (!pdfDoc) return;
    
    let isCancelled = false;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const originalViewport = page.getViewport({ scale: 1.0 });
        const targetWidth = BASE_WIDTH;
        const scale = (targetWidth / originalViewport.width) * (zoom / 100);
        
        const viewport = page.getViewport({ scale });
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        if (isCancelled) return;
        
        if (onRenderSuccess) {
          onRenderSuccess(canvas);
        }
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum, zoom]);

  return <canvas ref={canvasRef} className={className || "w-full h-full object-contain"} />;
}

export default function EPaperReader() {
  const [viewMode, setViewMode] = useState<'dashboard' | 'reader'>('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  
  const getTodayString = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Clipping / Crop box state
  const [isClipping, setIsClipping] = useState(false);
  const [clipBox, setClipBox] = useState({ x: 250, y: 200, width: 320, height: 240 });
  const [interactionType, setInteractionType] = useState<'none' | 'moving' | 'resizing-tl' | 'resizing-tr' | 'resizing-bl' | 'resizing-br'>('none');
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Share Modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedClipUrl, setGeneratedClipUrl] = useState('');
  const [clipCopied, setClipCopied] = useState(false);

  // Article Reader Modal state
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [activeArticle, setActiveArticle] = useState<ArticleZone | null>(null);
  const [articleCopied, setArticleCopied] = useState(false);

  // PDF.js integration states
  const [pdfjs, setPdfjs] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(8); // default to 8 pages
  const [pageAspectRatio, setPageAspectRatio] = useState(1100 / BASE_WIDTH);
  const [loadError, setLoadError] = useState<boolean>(false);
  
  // States for fallback default PDF (dashboard thumbnails)
  const [defaultPdfDoc, setDefaultPdfDoc] = useState<any>(null);
  const [defaultTotalPages, setDefaultTotalPages] = useState<number>(8);
  const [defaultPageAspectRatio, setDefaultPageAspectRatio] = useState<number>(1.415);
  const [loadedPdfUrl, setLoadedPdfUrl] = useState('/BalagamTV_Main_Edition__13_Jun_2026.pdf');

  // Custom states for ABN-style selectors
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [showEditionModal, setShowEditionModal] = useState<boolean>(false);
  const [selectedEdition, setSelectedEdition] = useState<string>('Hyderabad Main');
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);

  // States for standalone article view
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeArticlePageIdx, setActiveArticlePageIdx] = useState<number>(0);
  const [activeArticleDate, setActiveArticleDate] = useState<string>('');

  // Calendar navigation state
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(new Date());

  // Hover/Highlight active article state
  const [highlightedZoneId, setHighlightedZoneId] = useState<string | null>(null);

  // Clear active highlight when page details change
  useEffect(() => {
    setHighlightedZoneId(null);
  }, [activePageIdx, selectedDate, selectedEdition, viewMode]);

  // Dynamically load PDF.js client-side
  useEffect(() => {
    import('pdfjs-dist').then((pdfjsModule) => {
      pdfjsModule.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      setPdfjs(pdfjsModule);
    }).catch(err => {
      console.error('Failed to load pdfjs-dist', err);
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrlParams(new URLSearchParams(window.location.search));
    }
  }, []);

  useEffect(() => {
    if (urlParams) {
      const isArticle = urlParams.get('view') === 'article';
      if (isArticle) {
        const artId = urlParams.get('articleId');
        const d = urlParams.get('date') || getTodayString();
        const pStr = urlParams.get('page');
        const pNum = pStr ? parseInt(pStr, 10) : 1;
        
        setActiveArticleId(artId);
        setActiveArticlePageIdx(pNum - 1);
        setActiveArticleDate(d);
      }
    }
  }, [urlParams]);

  // Sync calendar view date when calendar modal opens
  useEffect(() => {
    if (showCalendarModal) {
      setCalendarViewDate(new Date(selectedDate));
    }
  }, [showCalendarModal, selectedDate]);

  // Load default PDF Document for the dashboard fallback
  useEffect(() => {
    if (!pdfjs) return;
    const loadDefaultPdf = async () => {
      try {
        const loadingTask = pdfjs.getDocument({ url: '/BalagamTV_Main_Edition__13_Jun_2026.pdf' });
        const pdf = await loadingTask.promise;
        setDefaultPdfDoc(pdf);
        setDefaultTotalPages(pdf.numPages);
        
        try {
          const page = await pdf.getPage(1);
          const vp = page.getViewport({ scale: 1.0 });
          setDefaultPageAspectRatio(vp.height / vp.width);
        } catch (aspectErr) {
          console.error('Error loading default page aspect ratio:', aspectErr);
        }
      } catch (err) {
        console.error('Error loading default PDF:', err);
      }
    };
    loadDefaultPdf();
  }, [pdfjs]);

  const isArticleView = urlParams?.get('view') === 'article';
  const targetDate = isArticleView ? activeArticleDate : selectedDate;
  const targetPageIdx = isArticleView ? activeArticlePageIdx : activePageIdx;

  // Load selected date PDF for reader view
  useEffect(() => {
    if (!pdfjs) return;
    const loadReaderPdf = async () => {
      try {
        setLoadError(false);
        const url = getPdfUrlForDate(targetDate);
        
        let pdfExists = false;
        try {
          const checkRes = await fetch(url, { method: 'HEAD' });
          if (checkRes.ok) {
            pdfExists = true;
          } else if (checkRes.status === 405) {
            const checkResGet = await fetch(url);
            pdfExists = checkResGet.ok;
          }
        } catch {
          pdfExists = false;
        }

        const targetUrl = pdfExists ? url : '/BalagamTV_Main_Edition__13_Jun_2026.pdf';
        const loadingTask = pdfjs.getDocument({ url: targetUrl });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setLoadedPdfUrl(targetUrl);
      } catch (err) {
        console.error('Error loading reader PDF:', err);
        setLoadError(true);
      }
    };
    loadReaderPdf();
  }, [pdfjs, targetDate]);

  // Adjust aspect ratio based on page dimensions
  useEffect(() => {
    if (!pdfDoc) return;
    const fetchAspectRatio = async () => {
      try {
        const page = await pdfDoc.getPage(targetPageIdx + 1);
        const vp = page.getViewport({ scale: 1.0 });
        setPageAspectRatio(vp.height / vp.width);
      } catch (err) {
        console.error('Error getting page aspect ratio:', err);
      }
    };
    fetchAspectRatio();
  }, [pdfDoc, targetPageIdx]);

  // Generate 48 recent dates (descending)
  const getRecentDates = () => {
    const dates = [];
    const today = new Date();
    let currentD = new Date(today);
    for (let i = 0; i < 48; i++) {
      if (i > 0) {
        // Organic gaps like the screenshot: sometimes skip 1 day, sometimes 2 days
        const daysToSubtract = (i % 4 === 0) ? 2 : 1;
        currentD.setDate(currentD.getDate() - daysToSubtract);
      }
      const day = currentD.getDate();
      const monthName = currentD.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
      const year = currentD.getFullYear();
      const formattedDate = `${day} ${monthName} ${year}`;
      
      const pad = (n: number) => String(n).padStart(2, '0');
      const isoString = `${year}-${pad(currentD.getMonth() + 1)}-${pad(day)}`;
      dates.push({ label: formattedDate, isoValue: isoString });
    }
    return dates;
  };
  const recentDates = getRecentDates();

  const cardsPerPage = 12;
  const totalPagesCount = Math.ceil(recentDates.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentDatesPage = recentDates.slice(startIndex, endIndex);

  const epaperPages: EpaperPageData[] = Array.from({ length: totalPages }, (_, i) => ({
    pageNum: i + 1,
    title: `పేజీ ${i + 1} (Page ${i + 1})`
  }));

  const toggleFullscreen = () => {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(`Error enabling fullscreen: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch((err) => {
            console.error(`Error exiting fullscreen: ${err.message}`);
          });
        }
      }
    }
  };

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setZoom(50);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = loadedPdfUrl;
    const filename = loadedPdfUrl.split('/').pop() || 'BalagamTV_Main_Edition__13_Jun_2026.pdf';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadClip = async () => {
    if (!pdfDoc) return;
    try {
      const page = await pdfDoc.getPage(activePageIdx + 1);
      const originalViewport = page.getViewport({ scale: 1.0 });
      const targetWidth = BASE_WIDTH;
      
      const scaleFactor = 2; // high resolution download
      const renderScale = (targetWidth / originalViewport.width) * scaleFactor;
      const viewport = page.getViewport({ scale: renderScale });
      
      const canvas = document.createElement('canvas');
      canvas.width = clipBox.width * scaleFactor;
      canvas.height = clipBox.height * scaleFactor;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = viewport.width;
        tempCanvas.height = viewport.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          const renderContext = {
            canvasContext: tempCtx,
            viewport: viewport
          };
          await page.render(renderContext).promise;
          
          ctx.drawImage(
            tempCanvas,
            clipBox.x * scaleFactor,
            clipBox.y * scaleFactor,
            clipBox.width * scaleFactor,
            clipBox.height * scaleFactor,
            0,
            0,
            canvas.width,
            canvas.height
          );
          
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const link = document.createElement('a');
          link.download = `hightv-clip-${selectedDate}-page${activePageIdx + 1}.jpg`;
          link.href = imgData;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (err) {
      console.error('Error downloading clip:', err);
    }
  };

  const handleDownloadArticleClip = async () => {
    if (!pdfDoc || !activeArticle) return;
    try {
      const page = await pdfDoc.getPage(activePageIdx + 1);
      const originalViewport = page.getViewport({ scale: 1.0 });
      const targetWidth = BASE_WIDTH;
      
      const scaleFactor = 2; // high resolution download
      const renderScale = (targetWidth / originalViewport.width) * scaleFactor;
      const viewport = page.getViewport({ scale: renderScale });
      
      const canvas = document.createElement('canvas');
      canvas.width = activeArticle.width * scaleFactor;
      canvas.height = activeArticle.height * scaleFactor;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = viewport.width;
        tempCanvas.height = viewport.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          const renderContext = {
            canvasContext: tempCtx,
            viewport: viewport
          };
          await page.render(renderContext).promise;
          
          ctx.drawImage(
            tempCanvas,
            activeArticle.x * scaleFactor,
            activeArticle.y * scaleFactor,
            activeArticle.width * scaleFactor,
            activeArticle.height * scaleFactor,
            0,
            0,
            canvas.width,
            canvas.height
          );
          
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const link = document.createElement('a');
          link.download = `hightv-article-${selectedDate}-page${activePageIdx + 1}-${activeArticle.id}.jpg`;
          link.href = imgData;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (err) {
      console.error('Error downloading article clip:', err);
    }
  };

  const handleSelectEdition = (isoDate: string) => {
    setSelectedDate(isoDate);
    setViewMode('reader');
    setActivePageIdx(0);
    setIsClipping(false);
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent, handle: 'tl' | 'tr' | 'bl' | 'br') => {
    setInteractionType(`resizing-${handle}` as typeof interactionType);
    e.stopPropagation();
    if ('preventDefault' in e) e.preventDefault();
  };

  const handleClipDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    const { clientX, clientY } = getPointerPos(e);
    const pX = (clientX - rect.left) / scale;
    const pY = (clientY - rect.top) / scale;
    setInteractionType('moving');
    setDragStartOffset({ x: pX - clipBox.x, y: pY - clipBox.y });
    e.stopPropagation();
    if ('preventDefault' in e) e.preventDefault();
  };

  const handleContainerPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (interactionType === 'none') return;
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    const { clientX, clientY } = getPointerPos(e);
    const pX = (clientX - rect.left) / scale;
    const pY = (clientY - rect.top) / scale;

    const currentHeight = BASE_WIDTH * pageAspectRatio;

    if (interactionType === 'moving') {
      const newX = pX - dragStartOffset.x;
      const newY = pY - dragStartOffset.y;
      setClipBox(prev => ({
        ...prev,
        x: Math.max(0, Math.min(BASE_WIDTH - prev.width, newX)),
        y: Math.max(0, Math.min(currentHeight - prev.height, newY))
      }));
    } else if (interactionType.startsWith('resizing-')) {
      const handle = interactionType.replace('resizing-', '');
      const minSize = 60;
      setClipBox(prev => {
        const { x, y, width, height } = prev;
        if (handle === 'br') return { x, y, width: Math.max(minSize, Math.min(BASE_WIDTH - x, pX - x)), height: Math.max(minSize, Math.min(currentHeight - y, pY - y)) };
        if (handle === 'tl') {
          const re = x + width, be = y + height;
          const nx = Math.max(0, Math.min(re - minSize, pX)), ny = Math.max(0, Math.min(be - minSize, pY));
          return { x: nx, y: ny, width: re - nx, height: be - ny };
        }
        if (handle === 'tr') {
          const be = y + height, ny = Math.max(0, Math.min(be - minSize, pY));
          return { x, y: ny, width: Math.max(minSize, Math.min(BASE_WIDTH - x, pX - x)), height: be - ny };
        }
        if (handle === 'bl') {
          const re = x + width, nx = Math.max(0, Math.min(re - minSize, pX));
          return { x: nx, y, width: re - nx, height: Math.max(minSize, Math.min(currentHeight - y, pY - y)) };
        }
        return prev;
      });
    }
  };

  const handleContainerPointerUp = () => setInteractionType('none');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isClipping) setIsClipping(false);
        if (showShareModal) setShowShareModal(false);
        if (showArticleModal) setShowArticleModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClipping, showShareModal, showArticleModal]);

  if (isArticleView) {
    const activeArticleObj = activeArticleId 
      ? generateMockZonesForPage(activeArticlePageIdx).find(z => z.id === activeArticleId)
      : null;

    const currentPageZones = generateMockZonesForPage(activeArticlePageIdx);
    const currentZoneIdx = activeArticleId 
      ? currentPageZones.findIndex(z => z.id === activeArticleId)
      : -1;

    const prevZoneId = currentZoneIdx > 0 ? currentPageZones[currentZoneIdx - 1].id : null;
    const nextZoneId = currentZoneIdx >= 0 && currentZoneIdx < currentPageZones.length - 1 
      ? currentPageZones[currentZoneIdx + 1].id 
      : null;

    return (
      <div className="min-h-screen bg-[#e9eff4] flex flex-col select-none animate-fade-in">
        <style>{`
          header.sticky, header { display: none !important; }
          footer { display: none !important; }
        `}</style>
        
        {/* Sticky top toolbar */}
        <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm sticky top-0 z-50 text-xs font-semibold h-11">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                try {
                  window.close();
                } catch {
                  window.location.href = '/category/epaper';
                }
              }}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg px-3 py-1.5 shadow-sm transition-colors border border-gray-200 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 12h16M4 12l6-6M4 12l6 6" />
              </svg>
              <span>Go to page</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-[#cc0000]" title="Increase Font Size">
              <span className="text-[14px] font-black">A⁺</span>
              <span className="hidden sm:inline">font-inc</span>
            </button>

            <div className="h-4 w-px bg-gray-200"></div>

            <button className="flex items-center gap-1 hover:text-[#cc0000]" title="Zoom In">
              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" fill="none"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <span className="hidden sm:inline">Zoom In</span>
            </button>

            <div className="h-4 w-px bg-gray-200"></div>

            <button className="flex items-center gap-1 hover:text-[#cc0000]" title="Text View">
              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="17" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="17" y1="18" x2="3" y2="18"></line>
              </svg>
              <span>Text View</span>
            </button>
          </div>
        </header>

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 relative max-w-[900px] mx-auto w-full">
          <div className="flex flex-col items-center gap-1 mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-[#cc0000] text-white font-black text-center px-2 py-0.5 rounded leading-none text-xs">
                <span>HIGH TV</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>హై టీవీ ఈ-పేపర్</h2>
            </div>
            {activeArticleDate && (
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                {formatDisplayDate(activeArticleDate)} | {selectedEdition} | Page: {activeArticlePageIdx + 1}
              </span>
            )}
          </div>

          <div className="relative w-full max-w-2xl bg-white border border-gray-200 shadow-2xl rounded-[32px] p-8 flex flex-col items-center mb-8 min-h-[400px]">
            {activeArticleObj ? (
              <div className="relative w-full flex flex-col items-center px-8">
                <div 
                  className="relative overflow-hidden bg-white border border-gray-150 rounded-2xl flex items-center justify-center p-2 mb-6 shadow-inner"
                  style={{
                    width: `${activeArticleObj.width}px`,
                    maxWidth: '100%',
                    height: `${activeArticleObj.height}px`
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: `-${activeArticleObj.x}px`,
                      top: `-${activeArticleObj.y}px`,
                      width: `${BASE_WIDTH}px`,
                      height: `${BASE_WIDTH * pageAspectRatio}px`
                    }}
                  >
                    {pdfDoc && (
                      <NewspaperPDFPage
                        pdfDoc={pdfDoc}
                        pageNum={activeArticlePageIdx + 1}
                        zoom={100}
                        className="w-full h-full block"
                      />
                    )}
                  </div>
                </div>

                <div className="w-full text-center">
                  <h3 className="text-xl font-extrabold text-gray-900 telugu-text mb-2 leading-normal" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    {activeArticleObj.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-2">
                    Source: High TV Digital | {formatDisplayDate(activeArticleDate)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm animate-pulse">
                Loading article clipping...
              </div>
            )}

            {activeArticleObj && prevZoneId && (
              <button
                onClick={() => setActiveArticleId(prevZoneId)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#cc0000] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer z-50 hover:bg-[#a60000]"
                title="Previous Article"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {activeArticleObj && nextZoneId && (
              <button
                onClick={() => setActiveArticleId(nextZoneId)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#cc0000] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer z-50 hover:bg-[#a60000]"
                title="Next Article"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <button
              onClick={() => {
                const url = `https://hightv.in/clip/article-${activeArticleId}`;
                navigator.clipboard.writeText(url);
                alert("Article link copied!");
              }}
              className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
              title="Copy Share Link"
            >
              <Share2 size={20} />
            </button>
          </div>

          <div className="text-center text-[10px] text-gray-400 mt-auto py-6">
            © 2026 All Rights Reserved. Powered by High TV
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-[#f8fafc] text-gray-900 select-none">
      {viewMode === 'dashboard' ? (
        <div className="flex-1 p-6 md:p-10 max-w-[1200px] mx-auto w-full flex flex-col min-h-screen">
          {/* Dashboard Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Select Edition</h1>
              <p className="text-sm text-gray-500 mt-1">Choose your region to read the latest e-paper.</p>
            </div>
            
            {/* Styled Date Picker Input */}
            <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm relative cursor-pointer hover:bg-gray-50 transition-colors w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} className="text-gray-400" />
                <span className="font-semibold text-sm">{formatDatePickerLabel(selectedDate)}</span>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {currentDatesPage.map((dateObj, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectEdition(dateObj.isoValue)}
                className="group cursor-pointer flex flex-col bg-white rounded-2xl border border-gray-200 p-3 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 hover:-translate-y-1"
              >
                <div 
                  className="relative overflow-hidden bg-white border border-gray-200 shadow-sm rounded-none"
                  style={{ aspectRatio: `1 / ${defaultPageAspectRatio}` }}
                >
                  {defaultPdfDoc ? (
                    <EditionCardThumbnail
                      pdfjs={pdfjs}
                      dateIso={dateObj.isoValue}
                      defaultPdfDoc={defaultPdfDoc}
                      cardIdx={startIndex + idx}
                      totalPages={defaultTotalPages}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-semibold animate-pulse">
                      Loading preview...
                    </div>
                  )}
                </div>
                <div className="mt-3 text-left">
                  <p className="font-bold text-sm text-gray-900">Main Edition</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{dateObj.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-2 mt-10 select-none">
            {/* Prev Arrow */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-500 hover:bg-gray-50 transition-colors ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPagesCount }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setCurrentPage(pNum)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors border ${
                  pNum === currentPage
                    ? 'bg-[#cc0000] text-white border-[#cc0000]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {pNum}
              </button>
            ))}

            {/* Next Arrow */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPagesCount, prev + 1))}
              disabled={currentPage === totalPagesCount}
              className={`w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-500 hover:bg-gray-50 transition-colors ${
                currentPage === totalPagesCount ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Floating back-to-top button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#cc0000] hover:bg-[#b91c1c] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            title="Scroll to Top"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      ) : (
        <div className="bg-[#e9eff4] overflow-hidden flex flex-col flex-1" style={{ minHeight: isMobile ? 'calc(100svh - 120px)' : '750px' }}>
          
          {/* Top Branding Row */}
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-4 select-none">
            <div className="flex items-center gap-3">
              <Link href="/" className="group flex items-center gap-2">
                <div className="flex flex-col bg-[#cc0000] text-white font-black text-center px-2 py-0.5 rounded leading-none">
                  <span className="text-[15px] tracking-tight">HIGH</span>
                  <span className="text-[9px] tracking-widest mt-0.5">TV</span>
                </div>
                <div className="flex flex-col justify-center leading-none">
                  <span className="text-[17px] font-black text-gray-900 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>హై టీవీ</span>
                  <span className="text-[9px] text-[#cc0000] font-bold tracking-widest mt-0.5">ఈ-పేపర్</span>
                </div>
              </Link>
            </div>

            {/* Mock Ad Banner */}
            <div className="hidden md:flex items-center justify-between flex-1 max-w-[650px] bg-gradient-to-r from-amber-400 to-yellow-300 border border-yellow-500 rounded px-4 py-1.5 shadow-sm text-xs select-none">
              <div className="flex items-center gap-3">
                <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded animate-pulse">ADVERTISEMENT</span>
                <span className="text-gray-900 font-extrabold telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>స్వర్ణయుగం హౌసింగ్ వెంచర్స్ - ప్లాట్లు అమ్మకానికి కలవు</span>
              </div>
              <span className="text-[#cc0000] font-black tracking-wider">📞 99999 88888</span>
            </div>

            <div className="w-12 h-6 md:block hidden"></div>
          </div>
          
          {/* Main E-Paper Reader Controls Bar */}
          <header className="bg-white border-b border-gray-200 px-2 flex items-center justify-between shadow-sm z-10 select-none text-gray-700 text-xs font-semibold h-10">
            {/* Left Actions Block */}
            <div className="flex items-center h-full">
              {/* Menu Button */}
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800" title="Menu">
                <Menu size={16} />
              </button>
              
              <div className="h-5 w-px bg-gray-200 mx-2"></div>

              {/* Home Button */}
              <button 
                onClick={() => setViewMode('dashboard')}
                className="flex items-center gap-1.5 px-2.5 h-full hover:bg-gray-50 transition-colors text-gray-700 hover:text-[#cc0000]"
                title="Back to Editions Dashboard"
              >
                <Home size={14} className="text-gray-500" />
                <span>Home</span>
              </button>
              
              <div className="h-5 w-px bg-gray-200 mx-2"></div>

              {/* Calendar Date Selector Trigger */}
              <button 
                onClick={() => setShowCalendarModal(true)}
                className="flex items-center gap-1.5 px-2.5 h-full hover:bg-gray-50 transition-colors text-gray-700 hover:text-[#cc0000]"
                title="Change Date"
              >
                <span>{formatDisplayDate(selectedDate)}</span>
                <Calendar size={14} className="text-gray-400" />
              </button>

              <div className="h-5 w-px bg-gray-200 mx-2"></div>

              {/* Edition Selector Trigger */}
              <button 
                onClick={() => setShowEditionModal(true)}
                className="flex items-center gap-1.5 px-2.5 h-full hover:bg-gray-50 transition-colors text-gray-700 hover:text-[#cc0000]"
                title="Select Edition"
              >
                <span className="text-[#cc0000]">{selectedEdition}</span>
                <MapPin size={14} className="text-gray-400" />
              </button>

              <div className="h-5 w-px bg-gray-200 mx-2"></div>

              {/* Page Dropdown Selector */}
              <div className="relative flex items-center px-3 h-full hover:bg-gray-50 transition-colors pr-6">
                <select
                  value={activePageIdx}
                  onChange={(e) => {
                    setActivePageIdx(Number(e.target.value));
                    setIsClipping(false);
                  }}
                  className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer appearance-none"
                >
                  {epaperPages.map((page, idx) => (
                    <option key={idx} value={idx}>{page.pageNum}: Page</option>
                  ))}
                </select>
                <Grid size={13} className="text-gray-400 pointer-events-none absolute right-2.5" />
              </div>

              <div className="h-5 w-px bg-gray-200 mx-2"></div>

              {/* Crop & Share Button */}
              <button 
                onClick={() => setIsClipping(!isClipping)}
                className={`flex items-center gap-1.5 px-3 h-full transition-colors ${
                  isClipping 
                    ? 'bg-red-50 text-[#cc0000]' 
                    : 'hover:bg-gray-50 text-gray-700 hover:text-red-600'
                }`}
              >
                <Scissors size={14} className={isClipping ? 'text-[#cc0000]' : 'text-gray-400'} />
                <span>Crop&Share</span>
              </button>

              <div className="h-5 w-px bg-gray-200 mx-2"></div>

              {/* Grid View Sidebar Button */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center justify-center px-3 h-full hover:bg-gray-50 transition-colors text-gray-700 hover:text-brand-blue"
                title="Toggle Thumbnails Sidebar"
              >
                <Grid size={14} className="text-gray-400" />
              </button>

              <div className="h-5 w-px bg-gray-200 mx-2"></div>

              {/* Quick Zoom Levels Q0, Q1, Q2 */}
              <div className="flex items-center h-full px-1 gap-1.5">
                {[
                  { level: 75, icon: '⁰', label: 'Zoom Out (75%)' },
                  { level: 100, icon: '¹', label: 'Zoom Actual (100%)' },
                  { level: 150, icon: '²', label: 'Zoom In (150%)' }
                ].map((item) => (
                  <button 
                    key={item.level}
                    onClick={() => setZoom(item.level)}
                    className={`w-6 h-6 rounded flex items-center justify-center relative font-bold transition-all ${
                      zoom === item.level ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-800'
                    }`}
                    title={item.label}
                  >
                    <Search size={12} className="stroke-[2.5]" />
                    <span className="absolute -top-1.5 -right-0.5 text-[8px] font-black">{item.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Actions Block */}
            <div className="flex items-center h-full pr-1 gap-2">
              {/* Download Page Button */}
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-1 bg-[#cc0000] hover:bg-[#a60000] text-white rounded px-2.5 py-1 text-[11px] font-bold transition-all shadow-sm"
              >
                <Download size={11} />
                <span>Download</span>
              </button>

              <div className="h-5 w-px bg-gray-200"></div>

              {/* Fullscreen Toggle */}
              <button 
                onClick={toggleFullscreen}
                className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize2 size={15} />
              </button>

              <div className="h-5 w-px bg-gray-200"></div>

              {/* Sidebar Toggle Button */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`w-8 h-full flex items-center justify-center transition-colors ${
                  isSidebarOpen ? 'text-brand-blue hover:text-brand-dark-blue hover:bg-gray-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title="Toggle Pages Sidebar"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
              </button>
            </div>
          </header>

          {/* Main content workspace */}
          <div className="flex-1 flex relative overflow-hidden">
            
            {/* Page Thumbnail Sidebar - Desktop only */}
            {isSidebarOpen && (
              <aside className="w-40 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0">
                <div className="p-2.5 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-[10px] text-gray-500 uppercase tracking-wider">All Pages</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={13} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2.5 space-y-3 scrollbar-thin">
                  {epaperPages.map((page, idx) => (
                    <button
                      key={page.pageNum}
                      onClick={() => { setActivePageIdx(idx); setIsClipping(false); }}
                      className={`w-full text-left rounded-lg overflow-hidden border transition-all flex flex-col group ${
                        idx === activePageIdx ? 'border-brand-blue ring-2 ring-brand-blue/10' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="relative aspect-[3/4] w-full bg-white overflow-hidden flex items-center justify-center">
                        {pdfDoc ? (
                          <NewspaperPDFPage pdfDoc={pdfDoc} pageNum={page.pageNum} zoom={20} />
                        ) : (
                          <div className="text-gray-400 text-[10px] animate-pulse">Loading...</div>
                        )}
                      </div>
                      <div className="p-1.5 bg-gray-50 text-[10px] font-bold text-gray-600 text-center w-full group-hover:bg-gray-100 transition-colors">
                        పేజీ {page.pageNum}
                      </div>
                    </button>
                  ))}
                </div>
              </aside>
            )}

            {/* Mobile Page Navigator Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex overflow-x-auto hide-scrollbar gap-2 px-3 py-2 shadow-lg">
              {epaperPages.map((page, idx) => (
                <button
                  key={page.pageNum}
                  onClick={() => { setActivePageIdx(idx); setIsClipping(false); }}
                  className={`flex-shrink-0 w-9 h-9 rounded-lg text-[11px] font-black transition-all border ${
                    idx === activePageIdx ? 'bg-[#cc0000] text-white border-[#cc0000]' : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {page.pageNum}
                </button>
              ))}
            </div>

            {/* Workspace Display Canvas */}
            <div
              className="flex-1 overflow-auto relative bg-[#e9eff4]"
              onMouseMove={handleContainerPointerMove}
              onMouseUp={handleContainerPointerUp}
              onTouchMove={handleContainerPointerMove}
              onTouchEnd={handleContainerPointerUp}
            >
              <div
                className="relative flex justify-center min-h-full items-start"
                style={{
                  minWidth: `${BASE_WIDTH * (zoom / 100) + 32}px`,
                  padding: isMobile ? '8px 8px 80px 8px' : '24px 24px 48px 24px',
                }}
              >
                {/* Floating Clipping Instructions Bar */}
                {isClipping && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white border border-gray-700/50 backdrop-blur px-4 py-2 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-3 animate-fade-in">
                    <span>✂️ <strong>Clipping Mode:</strong> Drag the crop zone to select, click Download Clip.</span>
                    <button 
                      onClick={() => setIsClipping(false)}
                      className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* Page View Frame */}
                <div
                  ref={imageContainerRef}
                  className="relative shadow-2xl bg-white rounded-lg overflow-hidden select-none border border-gray-300 flex-shrink-0"
                  style={{
                    width:  `${BASE_WIDTH  * (zoom / 100)}px`,
                    height: `${BASE_WIDTH * pageAspectRatio * (zoom / 100)}px`,
                    transition: 'width 0.2s, height 0.2s',
                  }}
                >
                  {/* PDF Page Canvas */}
                  {pdfDoc ? (
                    <>
                      <NewspaperPDFPage
                        pdfDoc={pdfDoc}
                        pageNum={activePageIdx + 1}
                        zoom={zoom}
                      />
                      
                      {/* Interactive Article Click Zones */}
                      {!isClipping && generateMockZonesForPage(activePageIdx).map((zone, zIdx) => (
                        <div
                          key={zone.id || zIdx}
                          tabIndex={0}
                          role="button"
                          aria-label={zone.title ? `Read article: ${zone.title}` : 'Read news article'}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              const url = `/category/epaper?view=article&articleId=${zone.id}&date=${selectedDate}&page=${activePageIdx + 1}`;
                              window.open(url, '_blank');
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = `/category/epaper?view=article&articleId=${zone.id}&date=${selectedDate}&page=${activePageIdx + 1}`;
                            window.open(url, '_blank');
                          }}
                          className="absolute cursor-pointer z-20 outline-none"
                          style={{
                            left: `${zone.x * (zoom / 100)}px`,
                            top: `${zone.y * (zoom / 100)}px`,
                            width: `${zone.width * (zoom / 100)}px`,
                            height: `${zone.height * (zoom / 100)}px`,
                          }}
                          title={zone.title}
                        />
                      ))}
                    </>
                  ) : loadError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-6 text-center select-none">
                      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-[#cc0000] mb-4">
                        <X size={32} />
                      </div>
                      <h3 className="text-lg font-black text-gray-900">E-Paper PDF Not Uploaded Yet</h3>
                      <p className="text-sm text-gray-500 mt-2 max-w-sm">
                        The Balagam TV Main Edition PDF file for this date is not uploaded to the server yet. Please try again later.
                      </p>
                      <button
                        onClick={() => setViewMode('dashboard')}
                        className="mt-6 bg-[#cc0000] hover:bg-[#b91c1c] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow transition-all cursor-pointer"
                      >
                        Back to Select Edition
                      </button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white text-gray-500 font-semibold animate-pulse">
                      Loading E-Paper Page...
                    </div>
                  )}

                  {/* Interactive clipping crop-box overlay */}
                  {isClipping && (
                    <div
                      className="absolute border-2 border-dashed border-[#dc2626] bg-black/10 z-30 flex flex-col justify-between p-2 shadow-inner touch-none"
                      style={{
                        left:   `${clipBox.x      * (zoom / 100)}px`,
                        top:    `${clipBox.y      * (zoom / 100)}px`,
                        width:  `${clipBox.width  * (zoom / 100)}px`,
                        height: `${clipBox.height * (zoom / 100)}px`,
                      }}
                    >
                      {/* Draggable move overlay */}
                      <div
                        onMouseDown={handleClipDragStart}
                        onTouchStart={handleClipDragStart}
                        className="absolute inset-0 cursor-move z-10"
                      />

                      {/* Corner Resize Handles */}
                      <div
                        onMouseDown={(e) => handleResizeStart(e, 'tl')}
                        onTouchStart={(e) => handleResizeStart(e, 'tl')}
                        className="absolute w-5 h-5 bg-white border-2 border-[#dc2626] rounded-full cursor-nwse-resize z-40"
                        style={{ left: '-10px', top: '-10px' }}
                      />
                      <div
                        onMouseDown={(e) => handleResizeStart(e, 'tr')}
                        onTouchStart={(e) => handleResizeStart(e, 'tr')}
                        className="absolute w-5 h-5 bg-white border-2 border-[#dc2626] rounded-full cursor-nesw-resize z-40"
                        style={{ right: '-10px', top: '-10px' }}
                      />
                      <div
                        onMouseDown={(e) => handleResizeStart(e, 'bl')}
                        onTouchStart={(e) => handleResizeStart(e, 'bl')}
                        className="absolute w-5 h-5 bg-white border-2 border-[#dc2626] rounded-full cursor-nesw-resize z-40"
                        style={{ left: '-10px', bottom: '-10px' }}
                      />
                      <div
                        onMouseDown={(e) => handleResizeStart(e, 'br')}
                        onTouchStart={(e) => handleResizeStart(e, 'br')}
                        className="absolute w-5 h-5 bg-white border-2 border-[#dc2626] rounded-full cursor-nwse-resize z-40"
                        style={{ right: '-10px', bottom: '-10px' }}
                      />

                      {/* Crop Controls */}
                      <div className="z-20 pointer-events-none flex flex-col justify-between h-full w-full">
                        <div className="bg-[#dc2626] text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded shadow w-fit select-none">
                          CROP ZONE
                        </div>
                        
                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => {
                            const randomId = `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
                            setGeneratedClipUrl(`https://hightv.in/clip/clip-${randomId}`);
                            setShowShareModal(true);
                            setIsClipping(false);
                          }}
                          className="self-end bg-green-600 hover:bg-green-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded transition-colors shadow-md flex items-center gap-1 cursor-pointer pointer-events-auto"
                        >
                          <Scissors size={10} />
                          <span>Download Clip</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Page-Turning Overlay Arrows */}
                {activePageIdx > 0 && !isClipping && (
                  <button
                    onClick={() => {
                      setActivePageIdx(activePageIdx - 1);
                      setIsClipping(false);
                    }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-brand-blue/80 hover:bg-brand-dark-blue text-white flex items-center justify-center transition-all shadow-xl hover:scale-110 animate-fade-in"
                    title="Previous Page"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                {activePageIdx < epaperPages.length - 1 && !isClipping && (
                  <button
                    onClick={() => {
                      setActivePageIdx(activePageIdx + 1);
                      setIsClipping(false);
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-brand-blue/80 hover:bg-brand-dark-blue text-white flex items-center justify-center transition-all shadow-xl hover:scale-110 animate-fade-in"
                    title="Next Page"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Share / Clip Confirmation Modal */}
          {showShareModal && (
            <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-6 relative flex flex-col gap-4">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-gray-900">Share It</h3>
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Scaled Dynamic Clip Preview */}
                <div 
                  className="relative border border-gray-200 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center p-4" 
                  style={{ height: '260px' }}
                >
                  {(() => {
                    const previewMaxHeight = 228;
                    const previewMaxWidth = 340;
                    
                    const scale = Math.min(
                      previewMaxWidth / clipBox.width,
                      previewMaxHeight / clipBox.height
                    );
                    
                    const scaledW = clipBox.width * scale;
                    const scaledH = clipBox.height * scale;
                    
                    return (
                      <div className="relative overflow-hidden" style={{ width: `${scaledW}px`, height: `${scaledH}px` }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: `-${clipBox.x * scale}px`,
                            top: `-${clipBox.y * scale}px`,
                            width: `${BASE_WIDTH * scale}px`,
                            height: `${BASE_WIDTH * pageAspectRatio * scale}px`,
                          }}
                        >
                          {pdfDoc && (
                            <NewspaperPDFPage
                              pdfDoc={pdfDoc}
                              pageNum={activePageIdx + 1}
                              zoom={scale * 100}
                              className="w-full h-full block"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Share Link Input */}
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 shadow-inner">
                  <input
                    type="text"
                    readOnly
                    value={generatedClipUrl}
                    className="flex-1 bg-transparent text-xs font-semibold text-gray-600 outline-none select-all overflow-ellipsis"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedClipUrl);
                      setClipCopied(true);
                      setTimeout(() => setClipCopied(false), 2000);
                    }}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors shadow-sm relative flex-shrink-0"
                  >
                    {clipCopied ? (
                      <span className="text-[10px] text-green-600 font-bold">✓</span>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    )}
                    {clipCopied && (
                      <span className="absolute -top-8 bg-green-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap z-50">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-4 py-1">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generatedClipUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                  
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(generatedClipUrl)}&text=${encodeURIComponent("Check out this news clip!")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out this news clip: " + generatedClipUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#25d366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                  </a>

                  <a
                    href={`mailto:?subject=${encodeURIComponent("News Clip")}&body=${encodeURIComponent("Check out this news clip: " + generatedClipUrl)}`}
                    className="w-10 h-10 rounded-full bg-[#ea4335] hover:bg-[#d93025] text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                </div>

                {/* Bottom Actions */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button
                    onClick={() => {
                      if (!pdfDoc) return;
                      // Open PDF in new window
                      window.open(loadedPdfUrl, '_blank');
                    }}
                    className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-full text-sm transition-colors shadow-sm"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    <span>Open PDF</span>
                  </button>

                  <button
                    onClick={handleDownloadClip}
                    className="flex items-center justify-center gap-2 bg-[#cc0000] hover:bg-[#b91c1c] text-white font-bold py-3.5 rounded-full text-sm transition-colors shadow-md"
                  >
                    <Download size={15} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Article Reader Modal */}
          {showArticleModal && activeArticle && (
            <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-6 relative flex flex-col gap-4">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-gray-900 line-clamp-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    {activeArticle.title}
                  </h3>
                  <button 
                    onClick={() => setShowArticleModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Scaled Dynamic Crop Preview of Article */}
                <div 
                  className="relative border border-gray-200 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center p-4" 
                  style={{ height: '380px' }}
                >
                  {(() => {
                    const previewMaxHeight = 348;
                    const previewMaxWidth = 440;
                    
                    const scale = Math.min(
                      previewMaxWidth / activeArticle.width,
                      previewMaxHeight / activeArticle.height
                    );
                    
                    const scaledW = activeArticle.width * scale;
                    const scaledH = activeArticle.height * scale;
                    
                    return (
                      <div className="relative overflow-hidden" style={{ width: `${scaledW}px`, height: `${scaledH}px` }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: `-${activeArticle.x * scale}px`,
                            top: `-${activeArticle.y * scale}px`,
                            width: `${BASE_WIDTH * scale}px`,
                            height: `${BASE_WIDTH * pageAspectRatio * scale}px`,
                          }}
                        >
                          {pdfDoc && (
                            <NewspaperPDFPage
                              pdfDoc={pdfDoc}
                              pageNum={activePageIdx + 1}
                              zoom={scale * 100}
                              className="w-full h-full block"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Share Link Input */}
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 shadow-inner">
                  <input
                    type="text"
                    readOnly
                    value={`https://hightv.in/clip/article-${activeArticle.id}`}
                    className="flex-1 bg-transparent text-xs font-semibold text-gray-600 outline-none select-all overflow-ellipsis"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://hightv.in/clip/article-${activeArticle.id}`);
                      setArticleCopied(true);
                      setTimeout(() => setArticleCopied(false), 2000);
                    }}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors shadow-sm relative flex-shrink-0"
                  >
                    {articleCopied ? (
                      <span className="text-[10px] text-green-600 font-bold">✓</span>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    )}
                    {articleCopied && (
                      <span className="absolute -top-8 bg-green-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap z-50">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-4 py-1">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://hightv.in/clip/article-${activeArticle.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                  
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://hightv.in/clip/article-${activeArticle.id}`)}&text=${encodeURIComponent(`Check out this story: ${activeArticle.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this story: ${activeArticle.title} - https://hightv.in/clip/article-${activeArticle.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#25d366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                  </a>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(activeArticle.title)}&body=${encodeURIComponent("Check out this story: " + activeArticle.title + " - https://hightv.in/clip/article-" + activeArticle.id)}`}
                    className="w-10 h-10 rounded-full bg-[#ea4335] hover:bg-[#d93025] text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                </div>

                {/* Bottom Actions */}
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    onClick={() => setShowArticleModal(false)}
                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-full text-sm transition-colors shadow-sm"
                  >
                    <span>Close</span>
                  </button>

                  <button
                    onClick={handleDownloadArticleClip}
                    className="flex items-center justify-center gap-2 bg-[#cc0000] hover:bg-[#b91c1c] text-white font-bold px-6 py-3 rounded-full text-sm transition-colors shadow-md"
                  >
                    <Download size={15} />
                    <span>Download Article</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Calendar Date Selector Modal */}
          {showCalendarModal && (
            <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-left">
              <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-6 relative flex flex-col gap-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-gray-900">Select Date</h3>
                  <button 
                    onClick={() => setShowCalendarModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Calendar Navigation */}
                <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-2">
                  <button 
                    onClick={() => {
                      const newD = new Date(calendarViewDate);
                      newD.setMonth(newD.getMonth() - 1);
                      setCalendarViewDate(newD);
                    }}
                    className="p-1 hover:bg-gray-200 rounded-full text-gray-600"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-extrabold text-sm text-gray-800">
                    {calendarViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button 
                    onClick={() => {
                      const newD = new Date(calendarViewDate);
                      newD.setMonth(newD.getMonth() + 1);
                      setCalendarViewDate(newD);
                    }}
                    className="p-1 hover:bg-gray-200 rounded-full text-gray-600"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 mb-1">
                  <span>SU</span>
                  <span>MO</span>
                  <span>TU</span>
                  <span>WE</span>
                  <span>TH</span>
                  <span>FR</span>
                  <span>SA</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const year = calendarViewDate.getFullYear();
                    const month = calendarViewDate.getMonth();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const firstDayIndex = new Date(year, month, 1).getDay();
                    
                    const dayCells = [];
                    for (let i = 0; i < firstDayIndex; i++) {
                      dayCells.push(<div key={`empty-${i}`} className="h-9" />);
                    }
                    
                    for (let d = 1; d <= daysInMonth; d++) {
                      const pad = (n: number) => String(n).padStart(2, '0');
                      const isoVal = `${year}-${pad(month + 1)}-${pad(d)}`;
                      const isSelected = isoVal === selectedDate;
                      
                      dayCells.push(
                        <button
                          key={`day-${d}`}
                          onClick={() => {
                            setSelectedDate(isoVal);
                            setShowCalendarModal(false);
                            setActivePageIdx(0);
                            setIsClipping(false);
                          }}
                          className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isSelected 
                              ? 'bg-[#cc0000] text-white shadow-md' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    }
                    return dayCells;
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Edition Selector Modal */}
          {showEditionModal && (
            <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-left">
              <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-6 relative flex flex-col gap-4 border border-gray-100 max-h-[85vh]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-lg font-extrabold text-gray-900">Select District Edition</h3>
                  <button 
                    onClick={() => setShowEditionModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                  {/* Category: Telangana */}
                  <div className="border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200 select-none">
                      <span className="font-extrabold text-xs text-gray-700 uppercase tracking-wider">Telangana Editions</span>
                      <span className="text-[10px] text-gray-400 font-bold">7 Districts</span>
                    </div>
                    <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                      {[
                        'Hyderabad Main',
                        'Karimnagar Main',
                        'Warangal Main',
                        'Nizamabad Main',
                        'Khammam Main',
                        'Mahaboobnagar Main',
                        'Nalgonda Main'
                      ].map((ed) => (
                        <button
                          key={ed}
                          onClick={() => {
                            setSelectedEdition(ed);
                            setShowEditionModal(false);
                            setActivePageIdx(0);
                            setIsClipping(false);
                          }}
                          className={`text-[11px] font-bold py-2 px-3 rounded-lg border text-left transition-all ${
                            selectedEdition === ed 
                              ? 'border-[#cc0000] bg-red-50/50 text-[#cc0000]' 
                              : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {ed}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category: Andhra Pradesh */}
                  <div className="border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200 select-none">
                      <span className="font-extrabold text-xs text-gray-700 uppercase tracking-wider">Andhra Pradesh Editions</span>
                      <span className="text-[10px] text-gray-400 font-bold">8 Districts</span>
                    </div>
                    <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                      {[
                        'Vijayawada Main',
                        'Visakhapatnam Main',
                        'Tirupathi Main',
                        'Guntur Main',
                        'Nellore Main',
                        'Kurnool Main',
                        'Ananthapuramu Main',
                        'Rajamahendravaram Main'
                      ].map((ed) => (
                        <button
                          key={ed}
                          onClick={() => {
                            setSelectedEdition(ed);
                            setShowEditionModal(false);
                            setActivePageIdx(0);
                            setIsClipping(false);
                          }}
                          className={`text-[11px] font-bold py-2 px-3 rounded-lg border text-left transition-all ${
                            selectedEdition === ed 
                              ? 'border-[#cc0000] bg-red-50/50 text-[#cc0000]' 
                              : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {ed}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
