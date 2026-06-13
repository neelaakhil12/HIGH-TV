'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  FileText,
  X,
  Layers
} from 'lucide-react';

const editions = [
  'Main Edition',
  'Hyderabad Edition',
  'Vijayawada Edition',
  'Visakhapatnam Edition',
  'Telangana Districts',
];

const epaperPages = [
  { pageNum: 1, title: 'మొదటి పేజీ (Page 1)', image: '/newspaper_sample.svg' },
  { pageNum: 2, title: 'రాష్ట్ర వార్తలు (Page 2)', image: '/newspaper_sample.svg' },
  { pageNum: 3, title: 'క్రీడా విభాగం (Page 3)', image: '/newspaper_sample.svg' },
  { pageNum: 4, title: 'వాణిజ్యం / వ్యాపారం (Page 4)', image: '/newspaper_sample.svg' },
  { pageNum: 5, title: 'సినిమా విశేషాలు (Page 5)', image: '/newspaper_sample.svg' },
  { pageNum: 6, title: 'జాతీయ వార్తలు (Page 6)', image: '/newspaper_sample.svg' },
  { pageNum: 7, title: 'అంతర్జాతీయ ప్రగతి (Page 7)', image: '/newspaper_sample.svg' },
  { pageNum: 8, title: 'జిల్లా ఎడిటోరియల్ (Page 8)', image: '/newspaper_sample.svg' },
];

export default function EPaperReader() {
  const [selectedEdition, setSelectedEdition] = useState(0);
  const [selectedDate, setSelectedDate] = useState('2026-06-05');
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'reader' | 'grid'>('reader');
  const [zoom, setZoom] = useState(100);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and set initial zoom
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile default to 50% so page fits the screen width (800*0.5=400px)
      if (mobile) setZoom(50);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Clipping / Crop Box state
  const [isClipping, setIsClipping] = useState(false);
  const [clipBox, setClipBox] = useState({ x: 250, y: 200, width: 320, height: 240 });
  const [interactionType, setInteractionType] = useState<'none' | 'moving' | 'resizing-tl' | 'resizing-tr' | 'resizing-bl' | 'resizing-br'>('none');
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Share Modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedClipUrl, setGeneratedClipUrl] = useState('');
  const [clipCopied, setClipCopied] = useState(false);

  // Unified pointer position helper (mouse + touch)
  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      const link = document.createElement('a');
      link.href = '/newspaper_sample.svg';
      link.download = `hightv-epaper-${selectedDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  const handleShare = () => {
    setCopied(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopied(false), 2000);
  };

  const zoomIn  = () => setZoom(prev => Math.min(200, prev + 25));
  const zoomOut = () => setZoom(prev => Math.max(25, prev - 25));

  // Clipping Drag / Resize Logic — supports both mouse and touch
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

    if (interactionType === 'moving') {
      const newX = pX - dragStartOffset.x;
      const newY = pY - dragStartOffset.y;
      setClipBox(prev => ({
        ...prev,
        x: Math.max(0, Math.min(800 - prev.width, newX)),
        y: Math.max(0, Math.min(1100 - prev.height, newY))
      }));
    } else if (interactionType.startsWith('resizing-')) {
      const handle = interactionType.replace('resizing-', '');
      const minSize = 60;
      setClipBox(prev => {
        const { x, y, width, height } = prev;
        if (handle === 'br') return { x, y, width: Math.max(minSize, Math.min(800 - x, pX - x)), height: Math.max(minSize, Math.min(1100 - y, pY - y)) };
        if (handle === 'tl') {
          const re = x + width, be = y + height;
          const nx = Math.max(0, Math.min(re - minSize, pX)), ny = Math.max(0, Math.min(be - minSize, pY));
          return { x: nx, y: ny, width: re - nx, height: be - ny };
        }
        if (handle === 'tr') {
          const be = y + height, ny = Math.max(0, Math.min(be - minSize, pY));
          return { x, y: ny, width: Math.max(minSize, Math.min(800 - x, pX - x)), height: be - ny };
        }
        if (handle === 'bl') {
          const re = x + width, nx = Math.max(0, Math.min(re - minSize, pX));
          return { x: nx, y, width: re - nx, height: Math.max(minSize, Math.min(1100 - y, pY - y)) };
        }
        return prev;
      });
    }
  };

  const handleContainerPointerUp = () => setInteractionType('none');

  // Escape key handler to cancel clipping mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isClipping) setIsClipping(false);
        if (showShareModal) setShowShareModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClipping, showShareModal]);

  return (
    <div className="bg-[#e9eff4] overflow-hidden border border-gray-200 shadow-lg flex flex-col" style={{ minHeight: isMobile ? 'calc(100svh - 120px)' : '750px' }}>
      
      {/* 1. Main E-Paper Reader Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm z-10">
        
        {/* Left Section: Home and Title */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link 
            href="/" 
            className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-brand-blue hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Home size={18} />
          </Link>
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
          <div>
            <h1 className="text-sm md:text-base font-bold text-gray-900 leading-tight">
              {editions[selectedEdition]}
            </h1>
            <p className="text-[10px] md:text-xs font-semibold text-gray-400 tracking-wider uppercase">
              PAGE {activePageIdx + 1} OF {epaperPages.length}
            </p>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto justify-end">
          
          {/* Zoom controls */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-700 shadow-sm">
            <button 
              onClick={zoomOut} 
              className="w-7 h-7 rounded hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-900"
              title="Zoom Out"
            >
              <Minus size={14} />
            </button>
            <span className="text-xs font-bold w-12 text-center select-none text-gray-600">
              {zoom}%
            </span>
            <button 
              onClick={zoomIn} 
              className="w-7 h-7 rounded hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-900"
              title="Zoom In"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* CLIP button */}
          <button 
            onClick={() => setIsClipping(!isClipping)}
            className={`flex items-center gap-1.5 border rounded-lg px-3 py-2 text-xs font-bold transition-all shadow-sm ${
              isClipping 
                ? 'bg-red-50 border-red-200 text-brand-red' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Scissors size={14} className={isClipping ? 'text-brand-red' : 'text-gray-500'} />
            <span>CLIP</span>
          </button>

          {/* SHARE EDITION button */}
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-brand-blue hover:bg-brand-dark-blue text-white rounded-lg px-4 py-2 text-xs font-bold transition-all shadow-md relative"
          >
            <Share2 size={14} />
            <span>SHARE EDITION</span>
            {copied && (
              <span className="absolute -bottom-9 right-0 bg-green-700 text-white text-[10px] font-bold py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-50">
                Copied!
              </span>
            )}
          </button>

          {/* DOWNLOAD PDF button */}
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-400 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all shadow-md"
          >
            <Download size={14} />
            <span>{downloading ? 'DOWNLOADING...' : 'DOWNLOAD PDF'}</span>
          </button>
        </div>
      </header>

      {/* 2. Sub-Header: Edition selection, date selector, and view modes */}
      <div className="bg-white/80 border-b border-gray-200/50 backdrop-blur-sm px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-9">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఎడిషన్:</span>
            <select
              value={selectedEdition}
              onChange={(e) => setSelectedEdition(Number(e.target.value))}
              className="bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 font-semibold outline-none focus:border-brand-blue transition-colors"
            >
              {editions.map((edition, idx) => (
                <option key={idx} value={idx}>{edition}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex items-center gap-1 text-gray-600 hover:text-gray-900 font-bold"
          >
            <Layers size={14} />
            <span>{isSidebarOpen ? 'పేజీల ప్యానెల్ దాచు (Hide Pages)' : 'పేజీల ప్యానెల్ చూపు (Show Pages)'}</span>
          </button>
        </div>

        {/* Date switcher */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevDay} 
            className="bg-white border border-gray-300 hover:bg-gray-50 rounded p-1 text-gray-600"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="flex items-center gap-1 bg-white border border-gray-300 rounded px-2 py-1">
            <Calendar size={12} className="text-brand-red" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="font-bold text-gray-700 outline-none border-none p-0 cursor-pointer text-xs"
            />
          </div>
          <button 
            onClick={handleNextDay} 
            className="bg-white border border-gray-300 hover:bg-gray-50 rounded p-1 text-gray-600"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* View Mode Grid/Reader toggles */}
        <button
          onClick={() => setViewMode(viewMode === 'reader' ? 'grid' : 'reader')}
          className="flex items-center gap-1 bg-white border border-gray-300 hover:bg-gray-50 rounded px-3 py-1 text-gray-700 font-bold transition-colors"
        >
          <Grid size={13} />
          <span>{viewMode === 'reader' ? 'గ్రిడ్ వ్యూ (Grid View)' : 'రీడర్ వ్యూ (Reader View)'}</span>
        </button>
      </div>

      {/* 3. Main content workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Thumbnail Sidebar — desktop only */}
        {viewMode === 'reader' && isSidebarOpen && (
          <aside className="w-44 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-xs text-gray-500 uppercase tracking-wider">All Pages</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {epaperPages.map((page, idx) => (
                <button
                  key={page.pageNum}
                  onClick={() => { setActivePageIdx(idx); setIsClipping(false); }}
                  className={`w-full text-left rounded-lg overflow-hidden border transition-all flex flex-col group ${
                    idx === activePageIdx ? 'border-brand-blue ring-2 ring-brand-blue/20' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full bg-gray-50">
                    <Image src={page.image} alt={page.title} fill sizes="150px" className="object-cover" />
                  </div>
                  <div className="p-1.5 bg-gray-50 text-[10px] font-bold text-gray-600 text-center w-full group-hover:bg-gray-100 transition-colors">
                    పేజీ {page.pageNum}
                  </div>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Mobile page switcher bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex overflow-x-auto hide-scrollbar gap-2 px-3 py-2 shadow-lg">
          {epaperPages.map((page, idx) => (
            <button
              key={page.pageNum}
              onClick={() => { setActivePageIdx(idx); setIsClipping(false); }}
              className={`flex-shrink-0 w-9 h-9 rounded-lg text-[11px] font-black transition-all border ${
                idx === activePageIdx ? 'bg-[#02599c] text-white border-[#02599c]' : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              {page.pageNum}
            </button>
          ))}
        </div>

        {/* Workspace Display Area */}
        <div
          className="flex-1 overflow-auto flex flex-col relative bg-[#e9eff4]"
          onMouseMove={handleContainerPointerMove}
          onMouseUp={handleContainerPointerUp}
          onTouchMove={handleContainerPointerMove}
          onTouchEnd={handleContainerPointerUp}
        >
          {viewMode === 'reader' ? (
            // Reader View — horizontally + vertically scrollable
            <div
              className="flex-1 overflow-auto"
              style={{ paddingBottom: isMobile ? '60px' : '24px' }}
            >
              {/* Inner wrapper: sized to the newspaper frame, centered on desktop */}
              <div
                className="relative flex justify-center"
                style={{
                  minWidth: `${800 * (zoom / 100) + 32}px`,
                  padding: isMobile ? '8px' : '24px',
                }}
              >
              
              {/* Floating Clipping Instructions Bar */}
              {isClipping && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white border border-gray-700/50 backdrop-blur px-4 py-2 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-3 animate-fade-in">
                  <span>✂️ <strong>Clipping Mode:</strong> Drag the crop zone to select, click Download.</span>
                  <button 
                    onClick={() => setIsClipping(false)}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* Page View Frame — always zoom-based pixels, scrollable when wider than screen */}
              <div
                ref={imageContainerRef}
                className="relative shadow-2xl bg-white rounded-lg overflow-hidden select-none border border-gray-300 flex-shrink-0"
                style={{
                  width:  `${800  * (zoom / 100)}px`,
                  height: `${1100 * (zoom / 100)}px`,
                  transition: 'width 0.2s, height 0.2s',
                }}
              >
                <Image
                  src={epaperPages[activePageIdx].image}
                  alt={epaperPages[activePageIdx].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-contain pointer-events-none"
                  priority
                />

                {/* Interactive clipping crop-box overlay — mouse + touch */}
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

                    {/* Corner Resize Handles — larger on mobile for finger tapping */}
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

                    {/* Content */}
                    <div className="z-20 pointer-events-none flex flex-col justify-between h-full w-full">
                      <div className="bg-[#dc2626] text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded shadow w-fit select-none">
                        CROP AREA
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
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-brand-blue/80 hover:bg-brand-dark-blue text-white flex items-center justify-center transition-all shadow-xl hover:scale-110"
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
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-brand-blue/80 hover:bg-brand-dark-blue text-white flex items-center justify-center transition-all shadow-xl hover:scale-110"
                  title="Next Page"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>{/* end inner wrapper */}
          </div>
          ) : (
            // Thumbnail Grid View
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {epaperPages.map((page, idx) => (
                  <div
                    key={page.pageNum}
                    onClick={() => {
                      setActivePageIdx(idx);
                      setViewMode('reader');
                      setIsClipping(false);
                    }}
                    className="group cursor-pointer bg-white rounded-xl border border-gray-200 hover:border-brand-blue overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative aspect-[3/4] bg-gray-100 w-full overflow-hidden">
                      <Image
                        src={page.image}
                        alt={page.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="bg-brand-blue text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                          <Grid size={18} />
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border-t border-gray-100 bg-gray-50 text-center text-xs font-bold text-gray-700">
                      పేజీ {page.pageNum}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. "Share It" Crop Confirmation Modal (matching the user's screenshot layout) */}
      {showShareModal && (
        <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-6 relative animate-fade-in flex flex-col gap-4">
            
            {/* Title & Close */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-gray-900">Share It</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scaled Dynamic Crop Preview */}
            <div 
              className="relative border border-gray-200 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center p-4" 
              style={{ height: '260px' }}
            >
              {(() => {
                const previewMaxHeight = 228;
                const previewMaxWidth = 340;
                
                // Determine scale factor based on clip width/height
                const scale = Math.min(
                  previewMaxWidth / clipBox.width,
                  previewMaxHeight / clipBox.height
                );
                
                const scaledW = clipBox.width * scale;
                const scaledH = clipBox.height * scale;
                
                return (
                  <div 
                    className="relative overflow-y-auto rounded-xl border border-gray-200 shadow-md bg-white scrollbar-thin"
                    style={{
                      width: `${scaledW}px`,
                      height: `${scaledH}px`,
                      maxHeight: '100%',
                    }}
                  >
                    <div className="relative" style={{ width: `${scaledW}px`, height: `${1100 * scale}px` }}>
                      <img
                        src={epaperPages[activePageIdx].image}
                        alt="Clip Preview"
                        className="max-w-none"
                        style={{
                          position: 'absolute',
                          left: `-${clipBox.x * scale}px`,
                          top: `-${clipBox.y * scale}px`,
                          width: `${800 * scale}px`,
                          height: `${1100 * scale}px`,
                        }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Shareable Link Input with Copy Button */}
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
                title="Copy Link"
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

            {/* Social Share Buttons */}
            <div className="flex items-center justify-center gap-4 py-1">
              
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generatedClipUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                title="Share on Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              
              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(generatedClipUrl)}&text=${encodeURIComponent("Check out this news clip from High TV!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                title="Share on X (Twitter)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out this news clip from High TV: " + generatedClipUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25d366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                title="Share on WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent("News Clip from High TV")}&body=${encodeURIComponent("Check out this news clip: " + generatedClipUrl)}`}
                className="w-10 h-10 rounded-full bg-[#ea4335] hover:bg-[#d93025] text-white flex items-center justify-center transition-all hover:scale-110 shadow"
                title="Share via Email"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>

            {/* Bottom Actions: Open & Download */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <button
                onClick={() => window.open(epaperPages[activePageIdx].image, '_blank')}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-full text-sm transition-colors shadow-sm"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>Open</span>
              </button>

              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = epaperPages[activePageIdx].image;
                  link.download = `hightv-clip-${Date.now()}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold py-3.5 rounded-full text-sm transition-colors shadow-md"
              >
                <Download size={15} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
