import Header from '@/components/layout/Header';
import { MapPin } from 'lucide-react';
import BackButton from '@/components/layout/BackButton';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import NewsCard from '@/components/cards/NewsCard';
import AdBanner from '@/components/home/AdBanner';
import RightSidebar from '@/components/layout/RightSidebar';
import EPaperReader from '@/components/epaper/EPaperReader';
import FlashNewsBar from '@/components/home/FlashNewsBar';
import DistrictSelector from '@/components/category/DistrictSelector';
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

  const cat = categories.find((c) => c.slug === category);
  
  // Get all articles for this category
  let articles = allNews.filter((n) => n.categorySlug === category);

  // Apply district filter if present
  let activeDistrictName = '';
  if (districtSlug) {
    const matchedDistrict = [...apDistricts, ...tgDistricts].find((d) => d.slug === districtSlug);
    if (matchedDistrict) {
      activeDistrictName = matchedDistrict.name;
      articles = articles.filter((n) => n.districtSlug === districtSlug);
    }
  }

  // If no articles match this category slug, adapt generic news items so the page displays a fully-populated grid
  const allArticles = articles.length > 0 
    ? articles 
    : allNews.slice(0, 12).map((art, idx) => ({
        ...art,
        id: `fallback-${category}-${idx}`,
        category: cat?.name || category,
        categorySlug: category,
      }));

  const breadcrumbName = (category === 'andhra-pradesh' || category === 'telangana')
    ? 'రాష్ట్ర వార్తలు'
    : (cat?.name || category);

  const isDistrictsView = viewType === 'districts' && (category === 'andhra-pradesh' || category === 'telangana');
  const targetDistricts = category === 'andhra-pradesh' ? apDistricts : tgDistricts;

  // Set up filtered district articles
  let filteredDistrictArticles = districtNews.filter((n) => n.categorySlug === category);
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
    : allNews.slice(0, 12).map((art, idx) => {
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
      <Header />

      {category === 'epaper' ? (
        <main className="flex-1 w-full">
          <EPaperReader />
        </main>
      ) : (
        <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full">
          <BackButton />
          {/* Flash News Strip */}
          <FlashNewsBar />

          {isDistrictsView ? (
            <>
              {/* Breadcrumb for districts view */}
              <div className="flex items-center gap-2 text-[15.5px] text-gray-500 mb-5 border-b border-gray-100 pb-3 font-sans">
                <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-1 font-bold">
                  <Home size={14} /> Home
                </Link>
                <ChevronRight size={14} />
                <Link href={`/category/${category}`} className="hover:text-brand-blue transition-colors font-bold">
                  {englishCategories[category] || category}
                </Link>
                <ChevronRight size={14} />
                <span className="text-gray-800 font-bold">
                  District News
                </span>
                {activeDistrictObj && (
                  <>
                    <ChevronRight size={14} />
                    <span className="text-brand-blue font-extrabold capitalize">
                      {activeDistrictObj.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </>
                )}
              </div>

              {/* District News Page Header Row */}
              <div className="flex items-center justify-between border-b-2 border-[#e60000] pb-3 mb-6">
                <h1
                  className="text-3xl md:text-4xl font-black text-[#e60000] telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {category === 'andhra-pradesh' ? 'ఆంధ్రప్రదేశ్' : 'తెలంగాణ'} జిల్లా వార్తలు
                </h1>
                <DistrictSelector 
                  category={category}
                  districts={targetDistricts}
                  activeDistrictSlug={districtSlug}
                />
              </div>

              <AdBanner position="leaderboard" />

              {/* 70% Left and 30% Right Layout */}
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
                            <MapPin size={11} className="text-[#e60000] flex-shrink-0" />
                            <span 
                              className="text-[13px] font-bold text-gray-700 telugu-text"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                            >
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

                  {/* Bottom Rows: 3 columns of smaller compact row list items */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-gray-100">
                    {bottomRow.map((art) => (
                      <div key={art.id} className="flex gap-3 items-start p-2 hover:bg-blue-50/35 rounded-lg transition-colors">
                        {/* Left Thumbnail — fully clickable */}
                        <Link href={`/news/${art.slug}`} className="w-[100px] h-[68px] flex-shrink-0 rounded overflow-hidden bg-gray-50 border border-gray-150 relative block">
                          <img 
                            src={art.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"} 
                            alt={art.title} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" 
                          />
                        </Link>
                        {/* Right Text Content */}
                        <div className="flex-1 flex flex-col text-left justify-between min-h-[68px]">
                          <div>
                            {/* Location Pin + District Name */}
                            <div className="flex items-center gap-0.5 mb-1 select-none">
                              <MapPin size={11} className="text-[#e60000] flex-shrink-0" />
                              <span 
                                className="text-[12.5px] font-extrabold text-[#e60000] telugu-text"
                                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                              >
                                {art.districtName}
                              </span>
                            </div>
                            {/* Article Title */}
                            <Link href={`/news/${art.slug}`}>
                              <h4 
                                className="text-sm md:text-base font-bold text-[#02599c] hover:text-[#013f70] hover:underline leading-snug line-clamp-2 telugu-text"
                                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                              >
                                {art.title}
                              </h4>
                            </Link>
                          </div>
                          {/* Custom Time */}
                          <span className="text-[12px] text-[#02599c] font-bold mt-1 block">
                            {art.publishedTimeOnly}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar (30%) */}
                <RightSidebar />
              </div>
            </>
          ) : (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[15.5px] text-gray-500 mb-5 border-b border-gray-100 pb-3 font-sans">
                <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-1 font-bold">
                  <Home size={14} /> Home
                </Link>
                <ChevronRight size={14} />
                <span className="text-gray-800 font-bold">
                  {englishCategories[category] || category}
                </span>
                {activeDistrictObj && (
                  <>
                    <ChevronRight size={14} />
                    <span className="text-brand-blue font-extrabold capitalize">
                      {activeDistrictObj.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </>
                )}
              </div>

              {/* Rastra News Page Header */}
              <div className="mb-6 pb-3 border-b-2 border-[#e60000]">
                <h1
                  className="text-3xl md:text-4xl font-black text-[#e60000] telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {category === 'andhra-pradesh' ? 'ఆంధ్రప్రదేశ్ వార్తలు' : category === 'telangana' ? 'తెలంగాణ వార్తలు' : `${cat?.name || category} వార్తలు`}
                </h1>
              </div>

              <AdBanner position="leaderboard" />

              {/* 70% Left and 30% Right Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 mt-6">
                {/* Articles List (70%) — horizontal 2-column format */}
                <div className="w-full lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-0">
                    {allArticles.map((article) => {
                      const d = new Date(article.publishedAt);
                      const h = d.getHours() % 12 || 12;
                      const m = String(d.getMinutes()).padStart(2, '0');
                      const timeStr = `${h}:${m}`;
                      return (
                        <Link
                          key={article.id}
                          href={`/news/${article.slug}`}
                          className="flex gap-3 items-start py-3 px-2 border-b border-gray-100 hover:bg-blue-50/40 transition-colors group"
                        >
                          {/* Thumbnail */}
                          <div className="w-[120px] h-[80px] flex-shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-150 relative">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <h3
                              className="text-[18px] font-bold text-[#02599c] group-hover:text-[#013f70] leading-snug line-clamp-2 telugu-text"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                            >
                              {article.title}{' '}
                              <span className="text-[#e60000] font-black text-[15.5px] font-sans">[{timeStr}]</span>
                            </h3>
                            <p
                              className="text-[15.5px] text-gray-500 mt-1 line-clamp-2 telugu-text leading-snug"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                            >
                              {article.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Load More */}
                  <div className="text-center mt-8">
                    <button
                      className="bg-brand-blue text-white font-bold px-8 py-3 rounded-lg hover:bg-brand-dark-blue transition-colors telugu-text cursor-pointer"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      మరిన్ని వార్తలు లోడ్ చేయండి
                    </button>
                  </div>
                </div>

                {/* Sidebar (30%) */}
                <RightSidebar />
              </div>
            </>
          )}
        </main>
      )}

      <Footer />
    </div>
  );
}
