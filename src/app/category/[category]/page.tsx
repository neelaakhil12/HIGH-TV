import Header from '@/components/layout/Header';
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
    title: `${titleName} | ఈనాడు క్లోన్`,
    description: `${titleName} తాజా వార్తలు - ఈనాడు క్లోన్`,
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
        <main className="flex-1 w-full bg-[#e9eff4]">
          <EPaperReader />
        </main>
      ) : (
        <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full">
          {/* Flash News Strip */}
          <FlashNewsBar />

          {isDistrictsView ? (
            <>
              {/* Breadcrumb for districts view */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 border-b border-gray-100 pb-3">
                <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-1">
                  <Home size={14} /> హోమ్
                </Link>
                <ChevronRight size={14} />
                <Link href={`/category/${category}`} className="hover:text-brand-blue transition-colors telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  {breadcrumbName}
                </Link>
                <ChevronRight size={14} />
                <span className="text-gray-800 font-semibold telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  జిల్లాల వారీగా వార్తలు
                </span>
                {activeDistrictName && (
                  <>
                    <ChevronRight size={14} />
                    <span className="text-brand-blue font-bold telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                      {activeDistrictName}
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
                        {/* Image container */}
                        <div className="relative aspect-video rounded-md overflow-hidden bg-black/5 mb-3">
                          <img 
                            src={art.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"} 
                            alt={art.title} 
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200" 
                          />
                          {/* District tag overlaid bottom-left */}
                          <div className="absolute bottom-2 left-2 bg-white/95 border border-gray-250 px-2 py-0.5 rounded shadow-3xs flex items-center gap-1 select-none">
                            <span className="text-[#fe0000] text-xs">📍</span>
                            <span 
                              className="text-[11px] font-bold text-gray-700 telugu-text"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                            >
                              {art.districtName}
                            </span>
                          </div>
                        </div>
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
                        {/* Left Thumbnail */}
                        <div className="w-[100px] h-[68px] flex-shrink-0 rounded overflow-hidden bg-gray-50 border border-gray-150 relative">
                          <img 
                            src={art.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"} 
                            alt={art.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        {/* Right Text Content */}
                        <div className="flex-1 flex flex-col text-left justify-between min-h-[68px]">
                          <div>
                            {/* Location Pin + District Name */}
                            <div className="flex items-center gap-0.5 mb-1 select-none">
                              <span className="text-[#fe0000] text-[10px]">📍</span>
                              <span 
                                className="text-[10.5px] font-extrabold text-[#e60000] telugu-text"
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
                          <span className="text-[10px] text-[#02599c] font-bold mt-1 block">
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
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 border-b border-gray-100 pb-3">
                <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-1">
                  <Home size={14} /> హోమ్
                </Link>
                <ChevronRight size={14} />
                <span className="text-gray-800 font-semibold telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  {breadcrumbName}
                </span>
                {activeDistrictName && (
                  <>
                    <ChevronRight size={14} />
                    <span className="text-brand-blue font-bold telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                      {activeDistrictName}
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
                {/* Articles Grid (70%) */}
                <div className="w-full lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {allArticles.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
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
