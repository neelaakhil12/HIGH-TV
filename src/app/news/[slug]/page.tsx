import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import BackButton from '@/components/layout/BackButton';
import ShareButton from '@/components/layout/ShareButton';
import Footer from '@/components/layout/Footer';
import DistrictNewsTabs from '@/components/layout/DistrictNewsTabs';
import {
  featuredNews,
  politicsNews,
  entertainmentNews,
  sportsNews,
  technologyNews,
  businessNews,
  healthNews,
  viralNews,
  videoNews,
  rasipalaluNews,
  womenNews,
  lifestyleNews,
  webstoriesNews,
  antharmadanamNews,
  adyathmikamNews,
  sampadakiyamNews,
  districtNews,
  getReporterByAuthor,
} from '@/lib/mockData';
import { Home, ChevronRight, Clock, ThumbsUp, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

const allNews = [
  ...featuredNews,
  ...politicsNews,
  ...entertainmentNews,
  ...sportsNews,
  ...technologyNews,
  ...businessNews,
  ...healthNews,
  ...viralNews,
  ...videoNews,
  ...rasipalaluNews,
  ...womenNews,
  ...lifestyleNews,
  ...webstoriesNews,
  ...antharmadanamNews,
  ...adyathmikamNews,
  ...sampadakiyamNews,
  ...districtNews,
];

const englishCategories: Record<string, string> = {
  'latest': 'Latest News',
  'telangana': 'Telangana',
  'andhra-pradesh': 'Andhra Pradesh',
  'national': 'National',
  'international': 'International',
  'business': 'Business',
  'sports': 'Sports',
  'entertainment': 'Entertainment',
  'technology': 'Technology',
  'health': 'Health',
  'viral': 'Viral',
  'rasipalalu': 'Astrology',
  'photos': 'Photos',
  'videos': 'Videos',
  'webstories': 'Web Stories',
  'antharmadanam': 'Opinion',
  'adyathmikam': 'Devotional',
  'sampadakiyam': 'Editorial',
  'women': 'Women',
  'lifestyle': 'Lifestyle',
  'epaper': 'E-Paper'
};

export async function generateStaticParams() {
  return allNews.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = allNews.find((n) => n.slug === slug);
  return {
    title: article ? `${article.title} | హై టీవీ` : 'వార్త | హై టీవీ',
    description: article?.description,
    openGraph: {
      title: article?.title,
      description: article?.description,
      images: article?.image ? [article.image] : [],
    },
  };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(2);
  const hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${day}/${month}/${year}, ${h}:${mins} ${ampm}`;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = allNews.find((n) => n.slug === slug) || allNews[0];
  const reporter = getReporterByAuthor(article.author);

  // Trending: top viewed articles (excluding current)
  const trendingNews = allNews
    .filter((n) => n.id !== article.id)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 8);

  // Latest news for right sidebar
  const latestNews = allNews
    .filter((n) => n.id !== article.id)
    .slice(0, 8);

  // District news
  const apDistrictNews = districtNews.filter((n) => n.categorySlug === 'andhra-pradesh').slice(0, 5);
  const tgDistrictNews = districtNews.filter((n) => n.categorySlug === 'telangana').slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />

      <main className="max-w-[1050px] mx-auto bg-white shadow-md border-x border-gray-200 px-4 py-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 flex-wrap font-sans border-b border-gray-100 pb-3">
          <Link href="/" className="hover:text-[#025390] transition-colors flex items-center gap-1 font-bold">
            <Home size={12} /> Home
          </Link>
          <ChevronRight size={12} />
          <Link href={`/category/${article.categorySlug}`} className="hover:text-[#025390] transition-colors font-bold">
            {englishCategories[article.categorySlug] || article.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-400 truncate max-w-[300px] telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            {article.title.slice(0, 50)}...
          </span>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[185px_1fr_185px] gap-3">

          {/* ═══ LEFT SIDEBAR ═══ */}
          <aside className="hidden lg:flex flex-col gap-3">

            {/* Ad 1 — Jewellery */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-100 text-[10px] text-gray-400 font-bold text-center py-0.5 uppercase tracking-wider">Advertisement</div>
              <div className="bg-gradient-to-br from-[#7b2d00] to-[#c0392b] p-4 text-white text-center min-h-[180px] flex flex-col items-center justify-center gap-2">
                <div className="text-3xl">💍</div>
                <div className="text-base font-black leading-tight">CMR జ్యువెల్లరీ</div>
                <div className="text-[11px] font-bold opacity-90">Gold & Diamond Sale</div>
                <div className="text-[10px] opacity-80 telugu-text" style={{fontFamily:'Noto Sans Telugu,sans-serif'}}>వేసవి ఆఫర్లు — 30% వరకు తగ్గింపు</div>
                <div className="mt-2 bg-yellow-400 text-[#7b2d00] rounded-full px-3 py-1 text-[10px] font-black">Shop Now →</div>
              </div>
            </div>

            {/* Trending News */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="flex items-center gap-2 bg-[#025390] text-white px-3 py-2.5">
                <TrendingUp size={14} />
                <span className="font-black text-sm telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  ట్రెండింగ్ వార్తలు
                </span>
              </div>
              <ul className="divide-y divide-gray-100">
                {trendingNews.map((item, idx) => (
                  <li key={item.id}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="flex items-start gap-2.5 px-3 py-3 hover:bg-blue-50/50 transition-colors group"
                    >
                      <span className="text-[#025390] font-black text-base mt-0.5 flex-shrink-0">■</span>
                      <p
                        className="text-[17px] font-semibold text-gray-700 group-hover:text-[#025390] leading-snug line-clamp-2 telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
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
                <div className="text-sm font-black leading-tight">NARAYANA<br/>IIT Academy</div>
                <div className="text-[10px] font-bold opacity-90 telugu-text" style={{fontFamily:'Noto Sans Telugu,sans-serif'}}>JEE • NEET • EAMCET</div>
                <div className="text-[9px] opacity-80">Admissions Open 2026</div>
                <div className="mt-2 bg-yellow-300 text-[#1a237e] rounded-full px-3 py-1 text-[10px] font-black">Enroll Now</div>
              </div>
            </div>
          </aside>

          {/* ═══ MIDDLE — ARTICLE ═══ */}
          <article className="bg-white border border-gray-200 rounded overflow-hidden flex-1 max-w-[750px] mx-auto">
            <div className="p-4 md:p-5">

              {/* Category pill */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="category-pill text-white text-xs"
                  style={{ background: article.categoryColor }}
                >
                  {article.category}
                </span>
                {article.isBreaking && (
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded breaking-badge">
                    🔴 Breaking
                  </span>
                )}
              </div>

              {/* Headline */}
              <h1
                className="text-2xl md:text-3xl font-black text-[#cc0000] leading-tight mb-3 telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {article.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4 pb-3 border-b border-gray-100 font-sans">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-[#025390] rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">హై</span>
                  </div>
                  <Link href={`/reporter/${reporter.slug}`} className="font-bold text-[#025390] hover:text-red-600 transition-colors telugu-text" style={{ fontFamily: 'Mandali, sans-serif' }}>
                    {reporter.name}
                  </Link>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span className="font-semibold">Updated: {formatDate(article.publishedAt)} IST</span>
                </div>
                <div className="ml-auto">
                  <ShareButton title={article.title} />
                </div>
              </div>

              {/* Description pull-quote */}
              <p
                className="text-base text-gray-700 leading-relaxed mb-4 border-l-4 border-[#025390] pl-3 bg-blue-50/40 py-2 pr-3 rounded-r telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {article.description}
              </p>

              {/* Hero Image */}
              <div className="rounded overflow-hidden mb-5 border border-gray-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={800}
                  height={450}
                  className="w-full h-auto"
                  priority
                />
              </div>

              {/* Article Body */}
              <div className="telugu-text space-y-4 text-[20px] text-gray-800 leading-loose" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                <p>{article.description} ఈ వార్తకు సంబంధించిన విశేషాలు క్రింద వివరించబడ్డాయి. హై టీవీ డెస్క్ నుండి తాజా సమాచారం ఇక్కడ లభిస్తుంది.</p>
                <p>అధికారులు తెలిపిన వివరాల ప్రకారం, ఈ నిర్ణయం రాష్ట్ర ప్రజలకు అత్యంత ప్రయోజనకరంగా ఉంటుందని భావిస్తున్నారు. ఈ పరిణామాలు భవిష్యత్తులో మరింత సానుకూలమైన ఫలితాలను ఇస్తాయని నిపుణులు అభిప్రాయపడుతున్నారు.</p>
                <p>ఈ అంశంపై స్థానిక ప్రజలు, నిపుణులు వివిధ అభిప్రాయాలు వ్యక్తం చేశారు. కొందరు ఈ నిర్ణయాన్ని స్వాగతిస్తున్నారు, మరికొందరు దీనిపై సందేహాలు వ్యక్తం చేస్తున్నారు.</p>
                <p>హై టీవీ ఈ అంశాన్ని నిరంతరం ట్రాక్ చేస్తూ తాజా అప్‌డేట్‌లను అందిస్తుంది. మరిన్ని వివరాలకు మా వెబ్‌సైట్‌ను అనుసరించండి.</p>
              </div>

              {/* Tags */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${tag}`}
                    className="text-xs bg-gray-100 hover:bg-[#025390] hover:text-white text-gray-600 px-3 py-1 rounded-full transition-colors font-medium telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Like / Share bar */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-100">
                <button className="flex items-center gap-2 text-gray-600 hover:text-[#025390] transition-colors font-semibold text-sm cursor-pointer">
                  <ThumbsUp size={16} />
                  <span className="telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>లైక్ చేయండి</span>
                </button>
                <ShareButton title={article.title} />
              </div>
            </div>
          </article>

          {/* ═══ RIGHT SIDEBAR ═══ */}
          <aside className="hidden lg:flex flex-col gap-3">

            {/* Ad 3 — Real Estate */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-100 text-[10px] text-gray-400 font-bold text-center py-0.5 uppercase tracking-wider">Advertisement</div>
              <div className="bg-gradient-to-br from-[#0d3b2e] to-[#1a5c45] p-4 text-white text-center min-h-[160px] flex flex-col items-center justify-center gap-2">
                <div className="text-2xl">🏢</div>
                <div className="text-sm font-black leading-tight">NAVANAAMI<br/><span className="text-xs font-bold opacity-80">at Kokapet</span></div>
                <div className="text-[10px] font-bold opacity-90">2437 – 3379 SqFt</div>
                <div className="text-[11px] font-black text-yellow-300">₹2.3 Cr* Onwards</div>
                <div className="mt-1 bg-white text-[#0d3b2e] rounded-full px-3 py-1 text-[10px] font-black">+91 98861 88383</div>
              </div>
            </div>

            {/* Latest News */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="bg-[#e60000] text-white px-3 py-2.5">
                <span className="font-black text-sm telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  తాజా వార్తలు
                </span>
              </div>
              <ul className="divide-y divide-gray-100">
                {latestNews.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="flex items-start gap-2 px-3 py-3 hover:bg-red-50/50 transition-colors group"
                    >
                      <span className="text-[#e60000] font-black text-base mt-0.5 flex-shrink-0">■</span>
                      <p
                        className="text-[17px] font-semibold text-gray-700 group-hover:text-[#e60000] leading-snug line-clamp-2 telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
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
                <div className="text-[10px] font-bold opacity-90 telugu-text" style={{fontFamily:'Noto Sans Telugu,sans-serif'}}>ఆరోగ్య బీమా ₹99/నెల</div>
                <div className="text-[9px] opacity-80">Family Floater Plans Available</div>
                <div className="mt-2 bg-white text-[#e65100] rounded-full px-3 py-1 text-[10px] font-black">Get Quote →</div>
              </div>
            </div>

            {/* జిల్లా వార్తలు — Toggle */}
            <DistrictNewsTabs apNews={apDistrictNews} tgNews={tgDistrictNews} />

          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
