'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Clock, Share2 } from 'lucide-react';
import { NewsArticle } from '@/lib/mockData';

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${mins} ${ampm}`;
}

function ShareButton({ articleTitle, slug }: { articleTitle: string; slug: string }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!showShareMenu) return;
    const handleOutsideClick = () => {
      setShowShareMenu(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showShareMenu]);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/news/${slug}`
    : `https://hightv.in/news/${slug}`;

  const handleInstagramShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
      setShowShareMenu(false);
    }, 2000);
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowShareMenu(!showShareMenu);
        }}
        className="text-gray-400 hover:text-[#0b2545] transition-colors flex items-center justify-center p-1.5 rounded-full hover:bg-gray-50 active:scale-95"
        aria-label="Share"
      >
        <Share2 size={14} />
      </button>

      {showShareMenu && (
        <div className="absolute right-0 bottom-full mb-2 z-35 bg-white border border-gray-150 rounded-xl shadow-xl p-1.5 flex flex-col min-w-[140px] text-left animate-fade-in overflow-hidden">
          {linkCopied && (
            <div className="absolute inset-0 bg-[#E1306C] text-white text-[11px] font-bold flex flex-col items-center justify-center text-center px-2 z-10 animate-fade-in">
              <span className="telugu-text">లింక్ కాపీ చేయబడింది!</span>
              <span className="text-[9px] opacity-90 mt-0.5">ఇన్‌స్టాగ్రామ్‌లో షేర్ చేయండి</span>
            </div>
          )}

          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(articleTitle + ' - ' + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowShareMenu(false)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            <svg className="w-4 h-4 text-[#25D366] fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>వాట్సాప్</span>
          </a>

          {/* Instagram */}
          <button
            onClick={handleInstagramShare}
            className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors w-full text-left telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            <svg className="w-4 h-4 text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>ఇన్‌స్టాగ్రామ్</span>
          </button>

          {/* Twitter / X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowShareMenu(false)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            <svg className="w-3.5 h-3.5 text-gray-950 fill-current ml-[1px]" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>ట్విట్టర్ (X)</span>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowShareMenu(false)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>ఫేస్‌బుక్</span>
          </a>
        </div>
      )}
    </div>
  );
}

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'horizontal' | 'mini' | 'featured';
}

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  if (variant === 'horizontal') {
    return (
      <article className="news-card flex flex-col gap-2.5 bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-blue-100 p-3 text-left">
        <Link href={`/news/${article.slug}`} className="block img-zoom-container rounded-md overflow-hidden w-full aspect-video relative">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 300px"
          />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <span
              className="category-pill text-white mb-1.5 inline-block w-fit"
              style={{ background: article.categoryColor }}
            >
              {article.category}
            </span>
            <Link href={`/news/${article.slug}`}>
              <h3
                className="text-sm font-bold text-gray-800 hover:text-brand-blue transition-colors line-clamp-2 leading-snug telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {article.title}
              </h3>
            </Link>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
            <Clock size={10} />
            <span>{formatTime(article.publishedAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'mini') {
    return (
      <article className="flex gap-2 py-2.5 border-b border-gray-100 last:border-b-0 group">
        <Link href={`/news/${article.slug}`} className="flex-shrink-0 img-zoom-container rounded overflow-hidden w-20 h-14">
          <Image
            src={article.image}
            alt={article.title}
            width={80}
            height={56}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="flex-1">
          <Link href={`/news/${article.slug}`}>
            <p
              className="text-xs font-semibold text-gray-800 group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {article.title}
            </p>
          </Link>
          <span className="text-xs text-gray-400 mt-1 block">{formatTime(article.publishedAt)}</span>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="news-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:border-blue-100 flex flex-col h-full text-left">
        <Link href={`/news/${article.slug}`} className="block img-zoom-container rounded-md overflow-hidden w-full aspect-video relative">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover animate-fade-in"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </Link>
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <span
              className="category-pill text-white mb-2.5 w-fit inline-block"
              style={{ background: article.categoryColor }}
            >
              {article.category}
            </span>
            <Link href={`/news/${article.slug}`}>
              <h3
                className="text-base md:text-lg lg:text-xl font-black text-gray-950 leading-snug hover:text-brand-blue transition-colors telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {article.title}
              </h3>
            </Link>
            <p
              className="text-xs md:text-sm text-gray-500 leading-relaxed mt-2 line-clamp-2 telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {article.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Clock size={10} />
                <span>{formatTime(article.publishedAt)}</span>
              </div>
            </div>
            <ShareButton articleTitle={article.title} slug={article.slug} />
          </div>
        </div>
      </article>
    );
  }

  // Default card
  return (
    <article className="news-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:border-blue-100 flex flex-col">
      {/* Thumbnail */}
      <Link href={`/news/${article.slug}`} className="img-zoom-container block relative" style={{ paddingTop: '56.25%' }}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {article.isBreaking && (
          <div className="absolute top-2 left-2 bg-brand-red text-white text-[10px] font-black px-2 py-0.5 rounded breaking-badge uppercase">
            🔴 Breaking
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span
          className="category-pill text-white mb-2 w-fit"
          style={{ background: article.categoryColor }}
        >
          {article.category}
        </span>

        <Link href={`/news/${article.slug}`} className="flex-1">
          <h2
            className="text-sm md:text-base font-bold text-gray-800 hover:text-brand-blue transition-colors leading-snug line-clamp-2 mb-2 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {article.title}
          </h2>
          <p
            className="text-xs text-gray-500 leading-relaxed line-clamp-2 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {article.description}
          </p>
        </Link>

        {/* Meta */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span>{formatTime(article.publishedAt)}</span>
            </div>
          </div>
          <ShareButton articleTitle={article.title} slug={article.slug} />
        </div>
      </div>
    </article>
  );
}
