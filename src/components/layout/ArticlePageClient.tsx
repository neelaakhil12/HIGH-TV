'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BackButton from '@/components/layout/BackButton';
import ShareButton from '@/components/layout/ShareButton';
import DistrictNewsTabs from '@/components/layout/DistrictNewsTabs';
import AdBanner from '@/components/home/AdBanner';
import { Home, ChevronRight, Clock, Calendar, ThumbsUp, TrendingUp } from 'lucide-react';

function FallbackImage({ src, alt, className, fill, width, height, ...props }: {
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

  if (fill) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
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
      {...props}
    />
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
  article,
  reporter,
  trendingNews,
  latestNews,
  apDistrictNews,
  tgDistrictNews,
  otherNews,
  englishCategories
}: ArticlePageClientProps) {
  const searchParams = useSearchParams();
  const isCompact = searchParams.get('compact') === '1';
  const [isExpanded, setIsExpanded] = useState(!isCompact);
  const [inlineImage, setInlineImage] = useState<string | null>(null);
  const [inlineCaption, setInlineCaption] = useState<string>('యోగ ఆసనాలు వేస్తున్న మోదీ..');

  useEffect(() => {
    const isEnabled = localStorage.getItem('inline_article_image_enabled') === 'true';
    if (isEnabled) {
      const savedImage = localStorage.getItem('inline_article_image_data');
      const savedCaption = localStorage.getItem('inline_article_image_caption');
      if (savedImage) {
        setInlineImage(savedImage);
      }
      if (savedCaption) {
        setInlineCaption(savedCaption);
      }
    } else {
      setInlineImage(null);
    }
  }, []);
  
  const [currentCategorySlug, setCurrentCategorySlug] = useState<string>(
    article.isBreaking ? 'latest' : article.categorySlug
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && document.referrer) {
      const ref = document.referrer;
      const match = ref.match(/\/category\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        setCurrentCategorySlug(match[1]);
      }
    }
  }, [article]);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} | ${hours}:${mins} IST`;
  }

  function formatTimeOnly(dateStr: string) {
    const d = new Date(dateStr);
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  }

  // Define two distinct layouts based on isExpanded
  if (isExpanded) {
    // ═══ FULL 3-COLUMN LAYOUT "LIKE BEFORE" ═══
    return (
      <main className="max-w-[1050px] mx-auto bg-white shadow-md border-x border-gray-200 px-2.5 py-4 md:px-4">
        {/* Mobile-only Ad — square, above breadcrumb */}
        <div className="md:hidden mb-3 max-w-[280px] mx-auto w-full">
          <div className="bg-gray-100 text-[9px] text-gray-400 font-bold text-center py-0.5 uppercase tracking-wider rounded-t border-t border-x border-gray-200">
            Advertisement
          </div>
          <div className="bg-gradient-to-br from-[#7b2d00] to-[#c0392b] rounded-b overflow-hidden flex flex-col items-center justify-center p-3 gap-2.5 text-white text-center border-b border-x border-gray-200 shadow-sm">
            <div className="text-3xl">💍</div>
            <div className="text-base font-black leading-tight">CMR జ్యువెల్లరీ</div>
            <div className="text-[11px] font-bold opacity-90">Gold &amp; Diamond Sale</div>
            <div className="text-[11px] opacity-80 telugu-text leading-tight" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              వేసవి ఆఫర్లు — 30% వరకు తగ్గింపు
            </div>
            <a href="#" className="mt-1 bg-yellow-400 text-[#7b2d00] rounded-full px-4 py-1 text-xs font-black hover:bg-yellow-300 transition-colors shadow-xs">
              Shop Now →
            </a>
          </div>
        </div>

        {/* Breadcrumb & Back Button */}

        <div className="flex items-center justify-between gap-4 mb-3 border-b border-gray-100 pb-3 overflow-hidden">
          <div className="flex items-center gap-1 md:gap-2 text-[13px] md:text-[17.5px] text-gray-500 font-sans whitespace-nowrap overflow-hidden">
            <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
              <Home size={14} className="flex-shrink-0" /> Home
            </Link>
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            <Link href={`/category/${currentCategorySlug}`} className="hover:text-brand-blue transition-colors font-bold flex-shrink-0">
              {englishCategories[currentCategorySlug] || article.category}
            </Link>
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-400 truncate max-w-[200px] telugu-text flex-shrink-0" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              {article.title}
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
            {/* Ad 1 — Jewellery */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-100 text-[10px] text-gray-400 font-bold text-center py-0.5 uppercase tracking-wider">Advertisement</div>
              <div className="bg-gradient-to-br from-[#7b2d00] to-[#c0392b] p-4 text-white text-center min-h-[180px] flex flex-col items-center justify-center gap-2">
                <div className="text-3xl">💍</div>
                <div className="text-base font-black leading-tight">CMR జ్యువెల్లరీ</div>
                <div className="text-[11px] font-bold opacity-90">Gold & Diamond Sale</div>
                <div className="text-[10px] opacity-80 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>వేసవి ఆఫర్లు — 30% వరకు తగ్గింపు</div>
                <div className="mt-2 bg-yellow-400 text-[#7b2d00] rounded-full px-3 py-1 text-[10px] font-black">Shop Now →</div>
              </div>
            </div>

            {/* Trending News */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="flex items-center gap-2 bg-[#025390] text-white px-3 py-2.5">
                <TrendingUp size={14} />
                <span className="font-black text-base telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  ట్రెండింగ్ వార్తలు
                </span>
              </div>
              <ul className="divide-y divide-gray-100">
                {trendingNews.slice(0, 8).map((item) => (
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

            {/* Ad 2 — Education */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-100 text-[10px] text-gray-400 font-bold text-center py-0.5 uppercase tracking-wider">Advertisement</div>
              <div className="bg-gradient-to-br from-[#1a237e] to-[#283593] p-4 text-white text-center min-h-[150px] flex flex-col items-center justify-center gap-2">
                <div className="text-2xl">🎓</div>
                <div className="text-sm font-black leading-tight">NARAYANA<br />IIT Academy</div>
                <div className="text-[10px] font-bold opacity-90 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>JEE • NEET • EAMCET</div>
                <div className="text-[9px] opacity-80">Admissions Open 2026</div>
                <div className="mt-2 bg-yellow-300 text-[#1a237e] rounded-full px-3 py-1 text-[10px] font-black">Enroll Now</div>
              </div>
            </div>
          </aside>

          {/* Middle: Full Article Content */}
          <article className="bg-white border border-gray-200 rounded overflow-hidden flex-1 max-w-[750px] mx-auto">
            <div className="p-4 md:p-5">
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
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {article.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-gray-500 mb-4 pb-3 border-b border-gray-100 font-sans meta-info">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-[#025390] rounded-full flex items-center justify-center">
                    <span className="text-white text-[12px] font-black">హై</span>
                  </div>
                  <Link href={`/reporter/${reporter.slug}`} className="font-bold text-[#025390] hover:text-red-600 transition-colors telugu-text" style={{ fontFamily: 'Mandali, sans-serif' }}>
                    {reporter.name}
                  </Link>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span className="font-semibold">Published: {formatDate(article.publishedAt)}</span>
                </div>
                <div className="ml-auto">
                  <ShareButton title={article.title} />
                </div>
              </div>

              {/* Description summary */}
              <p
                className="hidden md:block article-summary telugu-text text-gray-700 border-l-4 border-[#025390] pl-3 bg-blue-50/40 py-2 pr-3 rounded-r mb-4"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {article.description}
              </p>

              {/* Hero Image */}
              <div className="rounded overflow-hidden mb-5 border border-gray-100 relative aspect-video flex items-center justify-center bg-gray-50">
                <FallbackImage
                  src={article.image}
                  alt={article.title}
                  className="w-full h-auto max-h-[450px] object-cover"
                />
              </div>



              {/* Full Article Body */}
              <div className="telugu-text space-y-[18px] text-gray-800 article-body" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                <p>{article.description} ఈ వార్తకు సంబంధించిన విశేషాలు క్రింద వివరించబడ్డాయి. హై టీవీ డెస్క్ నుండి తాజా సమాచారం ఇక్కడ లభిస్తుంది.</p>
                <p>అధికారులు తెలిపిన వివరాల ప్రకారం, ఈ నిర్ణయం రాష్ట్ర ప్రజలకు అత్యంత ప్రయోజనకరంగా ఉంటుందని భావిస్తున్నారు. ఈ పరిణామాలు భవిష్యత్తులో మరింత సానుకూలమైన ఫలితాలను ఇస్తాయని నిపుణులు అభిప్రాయపడుతున్నారు.</p>



                {/* ఈ వార్తా చదవండి promo 1 */}
                {trendingNews[0] && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2.5 bg-red-50/50 border-l-4 border-[#e60000] rounded px-4 py-3 my-4 text-[14px] md:text-[18px]">
                    <span className="text-[#e60000] font-black flex-shrink-0 telugu-text font-bold" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                      ఈ వార్తా చదవండి:
                    </span>
                    <Link href={`/news/${trendingNews[0].slug}`} className="text-[#02599c] font-bold hover:text-[#e60000] hover:underline transition-colors telugu-text leading-snug" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                      {trendingNews[0].title}
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

                {/* ఈ వార్తా చదవండి promo 2 */}
                {trendingNews[1] && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2.5 bg-red-50/50 border-l-4 border-[#e60000] rounded px-4 py-3 my-4 text-[14px] md:text-[18px]">
                    <span className="text-[#e60000] font-black flex-shrink-0 telugu-text font-bold" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                      ఈ వార్తా చదవండి:
                    </span>
                    <Link href={`/news/${trendingNews[1].slug}`} className="text-[#02599c] font-bold hover:text-[#e60000] hover:underline transition-colors telugu-text leading-snug" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                      {trendingNews[1].title}
                    </Link>
                  </div>
                )}



                {/* Read latest & Follow us strip */}
                <div className="hidden lg:block border-t border-gray-100 pt-5 mt-6 space-y-2.5 text-gray-800 font-sans text-[15px] select-none leading-normal">
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 bg-[#e60000] text-white rounded-[3px] w-4.5 h-4.5 flex items-center justify-center mt-1 select-none">
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span>
                      Read latest{' '}
                      <Link href="/category/national" className="text-[#e60000] font-bold hover:underline">
                        India News
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
            </div>
          </article>

          {/* Right Sidebar */}
          <aside className="hidden lg:flex flex-col gap-3">
            {/* Ad 3 — Real Estate */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-100 text-[10px] text-gray-400 font-bold text-center py-0.5 uppercase tracking-wider">Advertisement</div>
              <div className="bg-gradient-to-br from-[#0d3b2e] to-[#1a5c45] p-4 text-white text-center min-h-[160px] flex flex-col items-center justify-center gap-2">
                <div className="text-2xl">🏢</div>
                <div className="text-sm font-black leading-tight">NAVANAAMI<br /><span className="text-xs font-bold opacity-80">at Kokapet</span></div>
                <div className="text-[10px] font-bold opacity-90">2437 – 3379 SqFt</div>
                <div className="text-[11px] font-black text-yellow-300">₹2.3 Cr* Onwards</div>
                <div className="mt-1 bg-white text-[#0d3b2e] rounded-full px-3 py-1 text-[10px] font-black">+91 98861 88383</div>
              </div>
            </div>

            {/* Latest News */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="bg-[#e60000] text-white px-3 py-2.5">
                <span className="font-black text-base telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  బ్రేకింగ్ న్యూస్
                </span>
              </div>
              <ul className="divide-y divide-gray-100">
                {latestNews.slice(0, 8).map((item) => (
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

            {/* Ad 4 — Health Insurance */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-100 text-[10px] text-gray-400 font-bold text-center py-0.5 uppercase tracking-wider">Advertisement</div>
              <div className="bg-gradient-to-br from-[#e65100] to-[#bf360c] p-4 text-white text-center min-h-[140px] flex flex-col items-center justify-center gap-2">
                <div className="text-2xl">🏥</div>
                <div className="text-sm font-black">Star Health</div>
                <div className="text-[10px] font-bold opacity-90 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఆరోగ్య బీమా ₹99/నెల</div>
                <div className="text-[9px] opacity-80">Family Floater Plans Available</div>
                <div className="mt-2 bg-white text-[#e65100] rounded-full px-3 py-1 text-[10px] font-black">Get Quote →</div>
              </div>
            </div>

            {/* district news */}
            <DistrictNewsTabs apNews={apDistrictNews} tgNews={tgDistrictNews} />
          </aside>

        </div>
      </main>
    );
  }

  // ═══ COMPACT LAYOUT (DEFAULT VIEW) ═══
  return (
    <main className="max-w-[1050px] mx-auto bg-white shadow-md border-x border-gray-200 px-2.5 py-4 md:px-4">
      {/* Breadcrumb & Back Button */}
      <div className="flex items-center justify-between gap-4 mb-4 border-b border-gray-100 pb-3 overflow-hidden">
        <div className="flex items-center gap-1 md:gap-2 text-[13px] md:text-[17.5px] text-gray-500 font-sans whitespace-nowrap overflow-hidden">
          <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
            <Home size={14} className="flex-shrink-0" /> Home
          </Link>
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
          <Link href={`/category/${currentCategorySlug}`} className="hover:text-brand-blue transition-colors font-bold flex-shrink-0">
            {englishCategories[currentCategorySlug] || article.category}
          </Link>
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-400 truncate max-w-[200px] telugu-text flex-shrink-0" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            {article.title}
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
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm relative w-full h-[220px] sm:h-[280px] md:h-[260px] lg:h-[290px] flex items-center justify-center bg-gray-50">
            <FallbackImage
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
          {/* "పూర్తిగా చదవండి" button under image */}
          <div className="mt-3">
            <button
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#cc0000] hover:bg-[#e60000] text-white font-black text-[15px] md:text-[16px] px-6 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer select-none telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              పూర్తిగా చదవండి
            </button>
          </div>
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
          >
            {article.title}
          </h1>

          {/* Limited Description & Toggled Read Button */}
          <div className="telugu-text space-y-[18px] text-gray-800 article-body" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
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

            <p className="article-summary telugu-text">{article.description} ఈ వార్తకు సంబంధించిన విశేషాలు క్రింద వివరించబడ్డాయి. తాజా సమాచారం ఇక్కడ లభిస్తుంది.</p>
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
            <ShareButton title={article.title} />
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
    </main>
  );
}
