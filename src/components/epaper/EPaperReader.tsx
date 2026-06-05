'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  Share2,
  X,
  FileText,
  CheckCircle,
} from 'lucide-react';

const editions = [
  'ప్రధాన సంచిక (Main Edition)',
  'హైదరాబాద్ ఎడిషన్ (Hyderabad)',
  'విజయవాడ ఎడిషన్ (Vijayawada)',
  'విశాఖపట్నం ఎడిషన్ (Visakhapatnam)',
  'తెలంగాణ జిల్లాలు (Telangana Districts)',
];

const epaperPages = [
  { pageNum: 1, title: 'మొదటి పేజీ (Page 1)', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=1100&fit=crop' },
  { pageNum: 2, title: 'రాష్ట్ర వార్తలు (Page 2)', image: 'https://images.unsplash.com/photo-1588681664899-f142ff22516d?w=800&h=1100&fit=crop' },
  { pageNum: 3, title: 'క్రీడా విభాగం (Page 3)', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=1100&fit=crop' },
  { pageNum: 4, title: 'వాణిజ్యం / వ్యాపారం (Page 4)', image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=1100&fit=crop' },
  { pageNum: 5, title: 'సినిమా విశేషాలు (Page 5)', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=1100&fit=crop' },
  { pageNum: 6, title: 'జాతీయ వార్తలు (Page 6)', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=1100&fit=crop' },
  { pageNum: 7, title: 'అంతర్జాతీయ ప్రగతి (Page 7)', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=1100&fit=crop' },
  { pageNum: 8, title: 'జిల్లా ఎడిటోరియల్ (Page 8)', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=1100&fit=crop' },
];

export default function EPaperReader() {
  const [selectedEdition, setSelectedEdition] = useState(0);
  const [selectedDate, setSelectedDate] = useState('2026-06-05');
  const [activePageIdx, setActivePageIdx] = useState<number | null>(null);
  const [zoom, setZoom] = useState(100);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

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
      alert('పిడిఎఫ్ (PDF) విజయవంతంగా డౌన్‌లోడ్ చేయబడింది!');
    }, 2000);
  };

  const handleShare = () => {
    setCopied(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
      {/* EPaper Toolbar Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6 pb-6 border-b border-gray-200">
        {/* Edition selector */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="text-sm font-bold text-gray-700 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            ఎడిషన్ ఎంచుకోండి:
          </label>
          <select
            value={selectedEdition}
            onChange={(e) => setSelectedEdition(Number(e.target.value))}
            className="w-full sm:w-72 bg-white text-sm font-semibold text-gray-800 px-3.5 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#C00000] focus:ring-0 outline-none transition-colors telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {editions.map((edition, idx) => (
              <option key={idx} value={idx}>
                {edition}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selector */}
        <div className="w-full lg:w-auto flex items-center justify-between sm:justify-start gap-2.5">
          <button
            onClick={handlePrevDay}
            className="bg-white hover:bg-gray-100 border border-gray-200 w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <Calendar size={16} className="text-[#C00000]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm font-bold text-gray-800 outline-none border-none p-0 cursor-pointer"
            />
          </div>

          <button
            onClick={handleNextDay}
            className="bg-white hover:bg-gray-100 border border-gray-200 w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 transition-colors shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Global actions */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full lg:w-auto flex items-center justify-center gap-2 bg-[#C00000] hover:bg-[#8B0000] disabled:bg-gray-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md telugu-text"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          <Download size={16} />
          {downloading ? 'డౌన్‌లోడ్ అవుతోంది...' : 'పూర్తి పేపర్ డౌన్‌లోడ్ (PDF)'}
        </button>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {epaperPages.map((page, idx) => (
          <div
            key={page.pageNum}
            onClick={() => {
              setActivePageIdx(idx);
              setZoom(100);
            }}
            className="group cursor-pointer bg-white rounded-xl border border-gray-200 hover:border-[#C00000] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            {/* Page Thumbnail */}
            <div className="relative aspect-[3/4] bg-gray-100 w-full overflow-hidden">
              <Image
                src={page.image}
                alt={page.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="bg-[#C00000] text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={20} />
                </div>
              </div>
            </div>
            
            {/* Page Footer Label */}
            <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-sm font-black text-gray-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                పేజీ {page.pageNum}
              </span>
              <span className="text-xs text-gray-500 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                {page.title.split(' ')[0]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Lightbox Viewer */}
      {activePageIdx !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
          {/* Lightbox Toolbar */}
          <div className="bg-gray-900 border-b border-gray-800 text-white px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="text-[#C00000] hidden sm:block" size={20} />
              <div>
                <h3 className="text-sm sm:text-base font-black telugu-text leading-tight" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  హై టీవీ ఈ-పేపర్ ({selectedDate})
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-400 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  {editions[selectedEdition]} — పేజీ {epaperPages[activePageIdx].pageNum}
                </p>
              </div>
            </div>

            {/* Viewer Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setZoom(Math.max(75, zoom - 25))}
                className="w-9 h-9 rounded-lg hover:bg-gray-800 flex items-center justify-center text-gray-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-xs text-gray-400 w-12 text-center font-semibold">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="w-9 h-9 rounded-lg hover:bg-gray-800 flex items-center justify-center text-gray-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>

              <div className="w-px h-6 bg-gray-800 mx-1 hidden sm:block"></div>

              <button
                onClick={handleDownload}
                className="w-9 h-9 rounded-lg hover:bg-gray-800 flex items-center justify-center text-gray-300 transition-colors"
                title="Download Page PDF"
              >
                <Download size={18} />
              </button>
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-lg hover:bg-gray-800 flex items-center justify-center text-gray-300 transition-colors relative"
                title="Share Link"
              >
                <Share2 size={18} />
                {copied && (
                  <span className="absolute -bottom-8 right-0 bg-[#0f766e] text-white text-[9px] font-semibold py-1 px-2 rounded shadow-lg whitespace-nowrap z-50">
                    Copied!
                  </span>
                )}
              </button>

              <div className="w-px h-6 bg-gray-800 mx-1"></div>

              <button
                onClick={() => setActivePageIdx(null)}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#C00000] hover:text-white flex items-center justify-center text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Lightbox Main Reading Frame */}
          <div className="flex-1 overflow-auto flex items-start justify-center p-4">
            <div
              className="relative transition-all duration-200 ease-out shadow-2xl bg-white rounded-lg overflow-hidden"
              style={{
                width: `${600 * (zoom / 100)}px`,
                height: `${850 * (zoom / 100)}px`,
                maxWidth: 'none',
              }}
            >
              <Image
                src={epaperPages[activePageIdx].image}
                alt={epaperPages[activePageIdx].title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Lightbox Footer Pagination */}
          <div className="bg-gray-900 border-t border-gray-800 py-3 px-4 flex items-center justify-between text-white">
            <button
              onClick={() => setActivePageIdx(Math.max(0, activePageIdx - 1))}
              disabled={activePageIdx === 0}
              className="flex items-center gap-1 bg-white/5 disabled:bg-gray-900 disabled:text-gray-600 hover:bg-white/15 px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              <ChevronLeft size={16} /> మునుపటి పేజీ
            </button>
            
            <span className="text-xs sm:text-sm text-gray-400 font-semibold telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              పేజీ {activePageIdx + 1} / {epaperPages.length}
            </span>

            <button
              onClick={() => setActivePageIdx(Math.min(epaperPages.length - 1, activePageIdx + 1))}
              disabled={activePageIdx === epaperPages.length - 1}
              className="flex items-center gap-1 bg-white/5 disabled:bg-gray-900 disabled:text-gray-600 hover:bg-white/15 px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              తదుపరి పేజీ <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
