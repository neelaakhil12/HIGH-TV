import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import NewsCard from '@/components/cards/NewsCard';
import AdBanner from '@/components/home/AdBanner';
import RightSidebar from '@/components/layout/RightSidebar';
import { 
  politicsNews, 
  entertainmentNews, 
  sportsNews, 
  technologyNews, 
  businessNews, 
  healthNews, 
  viralNews, 
  featuredNews, 
  rasipalaluNews, 
  districtNews,
  womenNews,
  lifestyleNews,
  webstoriesNews,
  antharmadanamNews,
  adyathmikamNews,
  sampadakiyamNews,
  reporterProfiles,
  getReporterByAuthor
} from '@/lib/mockData';
import { Home, ChevronRight, PenTool } from 'lucide-react';
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
  return Object.keys(reporterProfiles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = reporterProfiles[slug] || reporterProfiles['default'];
  return {
    title: `${profile.name} - మా టీమ్ ప్రొఫైల్ & వార్తలు | హై టీవీ`,
    description: profile.bio,
  };
}

export default async function ReporterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = reporterProfiles[slug] || reporterProfiles['default'];
  
  // Find all articles written by this reporter
  const reporterArticles = allNews.filter((art) => {
    const rep = getReporterByAuthor(art.author);
    return rep.slug === slug;
  });

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col">
      <Header />

      <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-3 flex-wrap">
          <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-1">
            <Home size={14} /> హోమ్
          </Link>
          <ChevronRight size={14} />
          <Link href="/team" className="hover:text-brand-blue transition-colors telugu-text" style={{ fontFamily: 'Mandali, sans-serif' }}>
            మా టీమ్
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-semibold telugu-text" style={{ fontFamily: 'Mandali, sans-serif' }}>
            {profile.name}
          </span>
        </div>

        {/* 2-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
          {/* Left Content (70%) */}
          <div className="w-full lg:col-span-7">
            {/* Reporter Bio Header Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/30 rounded-2xl border border-blue-100 p-6 md:p-8 mb-8 shadow-xs select-none">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center text-center md:text-left">
                {/* Avatar */}
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 relative">
                  <img 
                    src={profile.image} 
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-3">
                  <div className="space-y-1.5">
                    <span className="bg-brand-blue/10 text-brand-blue text-[11px] font-bold px-2.5 py-1 rounded-full inline-block uppercase tracking-wider">
                      Verified Reporter
                    </span>
                    <h1 
                      className="text-2xl md:text-3xl font-black text-gray-950 telugu-text"
                      style={{ fontFamily: 'Mandali, sans-serif' }}
                    >
                      {profile.name}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                      {profile.role}
                    </p>
                  </div>

                  <p 
                    className="text-gray-700 text-sm md:text-base leading-relaxed telugu-text"
                    style={{ fontFamily: 'Mandali, sans-serif' }}
                  >
                    {profile.bio}
                  </p>
                </div>
              </div>
            </div>

            <AdBanner position="leaderboard" />

            {/* Reporter Articles Grid */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-brand-blue">
                <PenTool size={18} className="text-brand-blue" />
                <h2 
                  className="text-lg md:text-xl font-black text-gray-900 telugu-text"
                  style={{ fontFamily: 'Mandali, sans-serif' }}
                >
                  {profile.name} రాసిన తాజా వార్తలు ({reporterArticles.length})
                </h2>
              </div>

              {reporterArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {reporterArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-sm telugu-text" style={{ fontFamily: 'Mandali, sans-serif' }}>
                    ఈ రిపోర్టర్ రాసిన వార్తలు ఏవీ అందుబాటులో లేవు.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar (30%) */}
          <RightSidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
