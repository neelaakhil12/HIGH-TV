import Header from '@/components/layout/Header';
export const dynamic = 'force-dynamic';
import DistrictDropdown from '@/components/layout/DistrictDropdown';
import { MapPin } from 'lucide-react';
import BackButton from '@/components/layout/BackButton';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import NewsCard from '@/components/cards/NewsCard';
import AdBanner from '@/components/home/AdBanner';
import RightSidebar from '@/components/layout/RightSidebar';
import EPaperReader from '@/components/epaper/EPaperReader';
import CategoryArticlesFeed from '@/components/category/CategoryArticlesFeed';
import WebStoriesPage from '@/components/category/WebStoriesPage';
import ShortsPage from '@/components/category/ShortsPage';
import PhotosPage from '@/components/category/PhotosPage';
import CitizenReporterForm from '@/components/category/CitizenReporterForm';
import LiveUpdatesPage from '@/components/category/LiveUpdatesPage';
import MultiDistrictFeed from '@/components/category/MultiDistrictFeed';
import EditorialPageClient from '@/components/category/EditorialPageClient';
import { 
  categories, 
  politicsNews, 
  entertainmentNews, 
  sportsNews, 
  technologyNews, 
  businessNews, 
  healthNews, 
  viralNews, 
  featuredNews, 
  rasipalaluNews, 
  apDistricts, 
  tgDistricts, 
  districtNews,
  womenNews,
  lifestyleNews,
  webstoriesNews,
  antharmadanamNews,
  adyathmikamNews,
  sampadakiyamNews
} from '@/lib/mockData';
import { Home, ChevronRight, X } from 'lucide-react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';


const allNews = [
  ...politicsNews,
  ...entertainmentNews,
  ...sportsNews,
  ...technologyNews,
  ...businessNews,
  ...healthNews,
  ...viralNews,
  ...featuredNews,
  ...rasipalaluNews,
  ...districtNews,
  ...womenNews,
  ...lifestyleNews,
  ...webstoriesNews,
  ...antharmadanamNews,
  ...adyathmikamNews,
  ...sampadakiyamNews,
];

const englishCategories: Record<string, string> = {
  'latest': 'Breaking News',
  'live-updates': 'Live Updates',
  'telangana': 'Telangana',
  'andhra-pradesh': 'Andhra Pradesh',
  'national': 'National',
  'international': 'International',
  'business': 'Business',
  'politics': 'పాలిటిక్స్',
  'sports': 'Sports',
  'entertainment': 'Entertainment',
  'technology': 'Technology',
  'health': 'Health',
  'doctors-corner': "Doctor's Corner",
  'viral': 'Viral',
  'rasipalalu': 'Astrology',
  'photos': 'Photos',
  'shorts': 'Shorts',
  'webstories': 'Web Stories',
  'antharmadanam': 'Opinion',
  'adyathmikam': 'Devotional',
  'sampadakiyam': 'Editorial',
  'women': 'Women',
  'lifestyle': 'Lifestyle',
  'epaper': 'E-Paper',
  'vidya': 'Vidya',
  'admissions': 'Admissions',
  'current-affairs': 'Current Affairs',
  'upadi': 'Upadi',
  'notification': 'Notification',
  'citizen-reporter': 'Citizen Reporter'
};

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ 
  params,
  searchParams 
}: { 
  params: Promise<{ category: string }>;
  searchParams: Promise<{ district?: string; view?: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const sParams = await searchParams;
  const viewType = sParams?.view;
  
  const cat = categories.find((c) => c.slug === category);
  let titleName = cat?.name || category;

  if (category === 'andhra-pradesh' || category === 'telangana') {
    const stateName = category === 'andhra-pradesh' ? 'ఆంధ్రప్రదేశ్' : 'తెలంగాణ';
    if (viewType === 'districts') {
      titleName = `${stateName} జిల్లా వార్తలు`;
    } else {
      titleName = `${stateName} వార్తలు`;
    }
  }

  return {
    title: `${titleName} | హై టీవీ`,
    description: `${titleName} తాజా వార్తలు - హై టీవీ`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ district?: string; view?: string }>;
}) {
  const { category } = await params;
  const sParams = await searchParams;
  const districtSlug = sParams?.district;
  const viewType = sParams?.view;

  // 1. Fetch latest articles from the database
  let dbArticles: any[] = [];
  let deletedArticles: any[] = [];
    const shouldSelectBody = category === 'shorts';

    try {
      [dbArticles, deletedArticles] = await Promise.all([
        prisma.article.findMany({
          where: { isDeleted: false },
          orderBy: { publishedAt: 'desc' },
          take: 100,
          select: {
            id: true,
            title: true,
            slug: true,
            categorySlug: true,
            districtSlug: true,
            category: true,
            author: true,
            publishedAt: true,
            description: true,
            image: true,
            views: true,
            isBreaking: true,
            isTrending: true,
            isFeatured: true,
            body: shouldSelectBody,
          }
        }),
        prisma.article.findMany({
          where: { isDeleted: true },
          select: { id: true, slug: true }
        })
      ]);
  } catch (e) {
    console.error('Error fetching articles for category page:', e);
  }

  const deletedIds = new Set(deletedArticles.map(a => a.id));
  const deletedSlugs = new Set(deletedArticles.map(a => a.slug));

  // 2. Map and combine
  const mappedDbArticles = dbArticles.map((art) => ({
    ...art,
    content: art.body || '',
  }));

  const filteredAllNews = allNews.filter(art => !deletedIds.has(art.id) && !deletedSlugs.has(art.slug));
  const combinedNews = [...mappedDbArticles, ...filteredAllNews];
  const seenSlugs = new Set<string>();
  const allArticlesList = combinedNews.filter((n) => {
    if (seenSlugs.has(n.slug)) return false;
    seenSlugs.add(n.slug);
    return true;
  });

  const cat = categories.find((c) => c.slug === category);
  
  // Get all articles for this category
  let articles = allArticlesList.filter((n) => n.categorySlug === category);
  if ((category === 'telangana' || category === 'andhra-pradesh') && viewType !== 'districts' && !districtSlug) {
    articles = articles.filter((n) => !n.districtSlug);
  }
  if (category === 'latest') {
    articles = allArticlesList.filter((n) => n.isBreaking);
    if (articles.length === 0) {
      articles = allArticlesList.slice(0, 12);
    }
  } else if (category === 'trending') {
    articles = allArticlesList.filter((n) => n.isTrending);
    if (articles.length === 0) {
      articles = allArticlesList.slice(0, 12);
    }
  } else if (category === 'featured') {
    articles = allArticlesList.filter((n) => n.isFeatured);
    if (articles.length === 0) {
      articles = allArticlesList.slice(0, 12);
    }
  }

  // Apply district filter if present
  let activeDistrictName = '';
  if (districtSlug) {
    const matchedDistrict = [...apDistricts, ...tgDistricts].find((d) => d.slug === districtSlug);
    if (matchedDistrict) {
      activeDistrictName = matchedDistrict.name;
      articles = articles.filter((n) => n.districtSlug === districtSlug);
    }
  }

  const allArticles = articles;

  const breadcrumbName = (category === 'andhra-pradesh' || category === 'telangana')
    ? 'రాష్ట్ర వార్తలు'
    : (cat?.name || category);

  const isDistrictsView = viewType === 'districts' && (category === 'andhra-pradesh' || category === 'telangana');
  const targetDistricts = category === 'andhra-pradesh' ? apDistricts : tgDistricts;

  // Set up filtered district articles
  let filteredDistrictArticles = allArticlesList.filter((n) => n.categorySlug === category && n.districtSlug);
  if (districtSlug) {
    filteredDistrictArticles = filteredDistrictArticles.filter((n) => n.districtSlug === districtSlug);
  }

  const activeDistrictObj = districtSlug ? targetDistricts.find((d) => d.slug === districtSlug) : null;

  // Map district metadata and mock timestamps
  const mappedDistrictArticles = filteredDistrictArticles.length > 0 
    ? filteredDistrictArticles.map((art, idx) => {
        const dist = targetDistricts.find((d) => d.slug === art.districtSlug) || targetDistricts[idx % targetDistricts.length];
        return {
          ...art,
          districtName: dist?.name || '',
          publishedTimeOnly: `[${19 - (idx % 3)}:${((50 - idx * 12) % 60 + 60) % 60}`.padEnd(7, '0').replace('NaN', '30') + ']'
        };
      })
    : (category === 'telangana' || category === 'andhra-pradesh')
      ? []
      : allArticlesList.slice(0, 12).map((art, idx) => {
          const dist = activeDistrictObj || targetDistricts[idx % targetDistricts.length];
          return {
            ...art,
            id: `fallback-dist-${category}-${idx}`,
            districtSlug: dist.slug,
            districtName: dist.name,
            publishedTimeOnly: `[${19 - (idx % 3)}:${((50 - idx * 12) % 60 + 60) % 60}`.padEnd(7, '0') + ']'
          };
        });

  const topRow = mappedDistrictArticles.slice(0, 3);
  const bottomRow = mappedDistrictArticles.slice(3, 12);

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col">
      {category !== 'epaper' && <Header />}

      {category === 'live-updates' ? (
        <main className="flex-1 w-full">
          <LiveUpdatesPage />
        </main>
      ) : category === 'sampadakiyam' ? (
        <main className="flex-1 w-full">
          <EditorialPageClient allArticles={allArticlesList} />
        </main>
      ) : category === 'epaper' ? (
        <main className="flex-1 w-full">
          <EPaperReader />
        </main>
      ) : category === 'webstories' ? (
        <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full text-left">
          {/* Breadcrumb Row with Back Button on the right */}
          <div className="flex items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-3 overflow-hidden">
            <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-[15.5px] text-gray-500 font-sans whitespace-nowrap overflow-hidden">
              <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
                <Home className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" /> Home
              </Link>
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-800 font-bold flex-shrink-0">
                Web Stories
              </span>
            </div>
            <div className="flex-shrink-0 pb-0.5">
              <BackButton />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-6 border-b-2 border-[#e60000] pb-3">
            <h1
              className="text-3xl md:text-4xl font-black text-[#e60000] telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              వెబ్ స్టోరీస్
            </h1>
          </div>
          
          {/* 70% Left and 30% Right Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 mt-6">
            <div className="w-full lg:col-span-7">
              <WebStoriesPage />
            </div>
            {/* Sidebar (30%) */}
            <div className="w-full lg:col-span-3">
              <RightSidebar categorySlug={category} />
            </div>
          </div>
        </main>
      ) : category === 'shorts' ? (
        <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full text-left">
          {/* Breadcrumb Row with Back Button on the right */}
          <div className="flex items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-3 overflow-hidden">
            <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-[15.5px] text-gray-500 font-sans whitespace-nowrap overflow-hidden">
              <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
                <Home className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" /> Home
              </Link>
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-800 font-bold flex-shrink-0">
                Shorts
              </span>
            </div>
            <div className="flex-shrink-0 pb-0.5">
              <BackButton />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-6 border-b-2 border-[#f43f5e] pb-3">
            <h1
              className="text-3xl md:text-4xl font-black text-[#f43f5e] telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              షార్ట్స్
            </h1>
          </div>
          
          <div className="mt-6">
            <ShortsPage articles={allArticles} />
          </div>
        </main>
      ) : category === 'photos' ? (
        <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full text-left">
          {/* Breadcrumb Row with Back Button on the right */}
          <div className="flex items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-3 overflow-hidden">
            <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-[15.5px] text-gray-500 font-sans whitespace-nowrap overflow-hidden">
              <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
                <Home className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" /> Home
              </Link>
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-800 font-bold flex-shrink-0">
                Photos
              </span>
            </div>
            <div className="flex-shrink-0 pb-0.5">
              <BackButton />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-6 border-b-2 border-[#64748b] pb-3">
            <h1
              className="text-3xl md:text-4xl font-black text-[#64748b] telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              ఫోటో గ్యాలరీ
            </h1>
          </div>
          
          <div className="mt-6">
            <PhotosPage articles={allArticles} />
          </div>
        </main>
      ) : category === 'citizen-reporter' ? (
        <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full text-left">
          {/* Breadcrumb Row with Back Button on the right */}
          <div className="flex items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-3 overflow-hidden">
            <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-[15.5px] text-gray-500 font-sans whitespace-nowrap overflow-hidden">
              <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
                <Home className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" /> Home
              </Link>
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-800 font-bold flex-shrink-0">
                Citizen Reporter
              </span>
            </div>
            <div className="flex-shrink-0 pb-0.5">
              <BackButton />
            </div>
          </div>
          
          {/* 70% Left and 30% Right Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 mt-4">
            <div className="w-full lg:col-span-7">
              <CitizenReporterForm />
            </div>
            {/* Right Sidebar Column (30%) with Ads */}
            <div className="w-full lg:col-span-3">
              <RightSidebar categorySlug={category} />
            </div>
          </div>
        </main>
      ) : (
        <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full">

          {isDistrictsView ? (
            <>
              {/* Breadcrumb for districts view */}
              <div className="flex items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-3 overflow-hidden">
                <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-[15.5px] text-gray-500 font-sans whitespace-nowrap overflow-hidden">
                  <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
                    <Home size={11} className="md:hidden" /><Home size={14} className="hidden md:block" /> Home
                  </Link>
                  <ChevronRight size={10} className="md:hidden flex-shrink-0" /><ChevronRight size={14} className="hidden md:block flex-shrink-0" />
                  <Link href={`/category/${category}`} className="hover:text-brand-blue transition-colors font-bold flex-shrink-0">
                    {englishCategories[category] || category}
                  </Link>
                  <ChevronRight size={10} className="md:hidden flex-shrink-0" /><ChevronRight size={14} className="hidden md:block flex-shrink-0" />
                  <span className="text-gray-800 font-bold flex-shrink-0">
                    District News
                  </span>
                  {activeDistrictObj && (
                    <>
                      <ChevronRight size={10} className="md:hidden flex-shrink-0" /><ChevronRight size={14} className="hidden md:block flex-shrink-0" />
                      <span className="text-brand-blue font-extrabold capitalize truncate">
                        {activeDistrictObj.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex-shrink-0 pb-0.5">
                  <BackButton />
                </div>
              </div>

              {/* District News Page Header Row */}
              <div className="flex items-center justify-between border-b-2 border-[#e60000] pb-2 mb-6 gap-3">
                <h1
                  className="text-lg md:text-3xl font-black text-[#e60000] telugu-text leading-snug"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {category === 'andhra-pradesh' ? 'ఆంధ్రప్రదేశ్' : 'తెలంగాణ'} జిల్లా వార్తలు
                </h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-[13px] md:text-[15px] font-black text-gray-700 telugu-text hidden sm:inline"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    జిల్లా ఎంచుకోండి:
                  </span>
                  <DistrictDropdown
                    state={category}
                    currentSlug={districtSlug || ''}
                    districts={targetDistricts}
                  />
                </div>
              </div>

              {/* News Grid */}
              {districtSlug ? (
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 mt-6">
                  {/* Districts News Layout (70%) */}
                  <div className="w-full lg:col-span-7 space-y-8">
                    {/* Top Row: 3 columns of prominent cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {topRow.map((art) => (
                        <div key={art.id} className="bg-white rounded-lg border border-gray-150 p-2.5 shadow-3xs hover:shadow-2xs transition-all flex flex-col group text-left">
                          {/* Image container — fully clickable */}
                          <Link href={`/news/${art.slug}`} className="block relative aspect-video rounded-md overflow-hidden bg-black/5 mb-3">
                            <img
                              src={art.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"}
                              alt={art.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                            />
                            {/* District tag overlaid bottom-left */}
                            <div className="absolute bottom-2 left-2 bg-white/95 border border-gray-250 px-2 py-0.5 rounded shadow-3xs flex items-center gap-1 select-none">
                              <MapPin size={11} className="text-[#025390] flex-shrink-0" />
                              <span className="text-[13px] font-bold text-gray-700 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                {art.districtName}
                              </span>
                            </div>
                          </Link>
                          {/* Title Link */}
                          <Link href={`/news/${art.slug}`}>
                            <h3
                              className="text-base md:text-lg font-bold text-[#02599c] hover:text-[#013f70] hover:underline transition-colors leading-snug telugu-text text-center px-1"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                            >
                              {art.title}
                            </h3>
                          </Link>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Rows */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-gray-100">
                      {bottomRow.map((art) => (
                        <div key={art.id} className="flex gap-3 items-start p-2 hover:bg-blue-50/35 rounded-lg transition-colors">
                          <Link href={`/news/${art.slug}`} className="w-[100px] h-[68px] flex-shrink-0 rounded overflow-hidden bg-slate-50 border border-gray-150 relative block">
                            <img
                              src={art.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"}
                              alt={art.title}
                              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </Link>
                          <div className="flex-1 flex flex-col text-left justify-between min-h-[68px]">
                            <div>
                              <div className="flex items-center gap-0.5 mb-1 select-none">
                                <MapPin size={11} className="text-[#025390] flex-shrink-0" />
                                <span className="text-[12.5px] font-extrabold text-[#025390] telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                  {art.districtName}
                                </span>
                              </div>
                              <Link href={`/news/${art.slug}`}>
                                <h4
                                  className="text-sm md:text-base font-bold text-[#02599c] hover:text-[#013f70] hover:underline leading-relaxed line-clamp-2 telugu-text pb-0.5"
                                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                >
                                  {art.title}
                                </h4>
                              </Link>
                            </div>
                            <span className="text-[12px] text-[#02599c] font-bold mt-1 block">
                              {art.publishedTimeOnly}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar (30%) */}
                  <RightSidebar categorySlug={`${category}-districts`} />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 mt-6">
                  {/* Multi-district list layout showing 1 article per district */}
                  <div className="w-full lg:col-span-7">
                    <MultiDistrictFeed
                      state={category}
                      districts={targetDistricts}
                      initialArticles={allArticlesList}
                    />
                  </div>
                  {/* Sidebar (30%) */}
                  <RightSidebar categorySlug={`${category}-districts`} />
                </div>
              )}
            </>
          ) : (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-3 overflow-hidden">
                <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-[15.5px] text-gray-500 font-sans whitespace-nowrap overflow-hidden">
                  <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
                    <Home className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" /> Home
                  </Link>
                  <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-800 font-bold flex-shrink-0">
                    {englishCategories[category] || category}
                  </span>
                  {activeDistrictObj && (
                    <>
                      <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-brand-blue font-extrabold capitalize truncate">
                        {activeDistrictObj.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex-shrink-0 pb-0.5">
                  <BackButton />
                </div>
              </div>

              {/* Rastra News Page Header */}
              <div className="mb-6 pb-3 border-b-2 border-[#e60000]">
                <h1
                  className="text-lg md:text-4xl font-black text-[#e60000] telugu-text leading-snug"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {category === 'andhra-pradesh' ? 'ఆంధ్రప్రదేశ్ వార్తలు' : category === 'telangana' ? 'తెలంగాణ వార్తలు' : `${cat?.name || category} వార్తలు`}
                </h1>
              </div>

              {/* 70% Left and 30% Right Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 mt-6">
                {/* Articles List (70%) — horizontal 2-column format */}
                <div className="w-full lg:col-span-7">
                  <CategoryArticlesFeed 
                    initialArticles={allArticles} 
                    categorySlug={category} 
                    districtSlug={districtSlug}
                  />

                  {/* Load More */}
                  <div className="text-center mt-6">
                    <button
                      className="bg-brand-blue text-white font-bold px-4 py-1.5 text-xs sm:px-8 sm:py-3 sm:text-base rounded-lg hover:bg-brand-dark-blue transition-colors telugu-text cursor-pointer"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      మరిన్ని వార్తలు లోడ్ చేయండి
                    </button>
                  </div>
                </div>

                {/* Sidebar (30%) */}
                <RightSidebar categorySlug={category} />
              </div>
            </>
          )}
        </main>
      )}

      {category !== 'epaper' && <Footer />}
    </div>
  );
}
