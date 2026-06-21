import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackButton from '@/components/layout/BackButton';
import RightSidebar from '@/components/layout/RightSidebar';
import DistrictDropdown from '@/components/layout/DistrictDropdown';
import { Home, ChevronRight, MapPin } from 'lucide-react';
import {
  apDistricts,
  tgDistricts,
  districtNews,
  featuredNews,
  politicsNews,
  entertainmentNews,
  sportsNews,
  technologyNews,
  businessNews,
  healthNews,
  viralNews,
} from '@/lib/mockData';
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
];

export async function generateStaticParams() {
  const tgParams = tgDistricts.map((d) => ({ state: 'telangana', districtSlug: d.slug }));
  const apParams = apDistricts.map((d) => ({ state: 'andhra-pradesh', districtSlug: d.slug }));
  return [...tgParams, ...apParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; districtSlug: string }>;
}): Promise<Metadata> {
  const { state, districtSlug } = await params;
  const allDistricts = [...tgDistricts, ...apDistricts];
  const district = allDistricts.find((d) => d.slug === districtSlug);
  const stateName = state === 'telangana' ? 'తెలంగాణ' : 'ఆంధ్రప్రదేశ్';
  return {
    title: `${district?.name || districtSlug} వార్తలు | హై టీవీ`,
    description: `${district?.name || districtSlug}, ${stateName} తాజా వార్తలు - హై టీవీ`,
  };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ state: string; districtSlug: string }>;
}) {
  const { state, districtSlug } = await params;

  const allDistricts = [...tgDistricts, ...apDistricts];
  const district = allDistricts.find((d) => d.slug === districtSlug);
  const stateName = state === 'telangana' ? 'తెలంగాణ' : 'ఆంధ్రప్రదేశ్';
  const stateCategory = state === 'telangana' ? 'telangana' : 'andhra-pradesh';

  // Filter district news
  let articles = districtNews.filter((n) => n.districtSlug === districtSlug);
  if (articles.length === 0) {
    articles = allNews.slice(0, 12).map((a, i) => ({ ...a, id: `fallback-${i}`, districtSlug }));
  }

  const topRow = articles.slice(0, 3);
  const bottomRow = articles.slice(3, 12);

  // Sibling districts for dropdown
  const siblings = state === 'telangana' ? tgDistricts : apDistricts;

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col">
      <Header />

      <main className="max-w-[1050px] mx-auto bg-white shadow-md border-x border-gray-200 px-4 py-5 flex-1 w-full text-left">
        {/* Breadcrumb row with dropdown before back button */}
        <div className="flex items-center justify-between gap-4 mb-4 border-b border-gray-100 pb-3 overflow-visible">
          <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-[15.5px] text-gray-500 font-sans whitespace-nowrap overflow-hidden">
            <Link href="/" className="hover:text-[#025390] transition-colors flex items-center gap-0.5 md:gap-1 font-bold flex-shrink-0">
              <Home className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" /> Home
            </Link>
            <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 flex-shrink-0" />
            <Link href={`/category/${stateCategory}?view=districts`} className="hover:text-[#025390] transition-colors font-bold flex-shrink-0">
              {stateName}
            </Link>
            <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-gray-800 font-bold flex-shrink-0 telugu-text truncate max-w-[120px]" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              {district?.name || districtSlug}
            </span>
          </div>
          {/* Dropdown + Back button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <DistrictDropdown state={state} currentSlug={districtSlug} districts={siblings} />
            <BackButton />
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-5 pb-3 border-b-2 border-[#025390]">
          <h1
            className="text-xl md:text-2xl font-bold text-[#025390] telugu-text leading-snug flex items-center gap-2"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            <MapPin size={19} className="text-[#025390] flex-shrink-0" />
            {district?.name || districtSlug} వార్తలు
          </h1>
        </div>

        {/* News Grid + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
          {/* News (70%) */}
          <div className="w-full lg:col-span-7 space-y-8">
            {/* Top 3 prominent cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {topRow.map((art) => (
                <div key={art.id} className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm hover:shadow-md transition-all flex flex-col group">
                  <Link href={`/news/${art.slug}`} className="block relative aspect-video rounded-md overflow-hidden bg-black/5 mb-3">
                    <img
                      src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop'}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    />
                    <div className="absolute bottom-2 left-2 bg-white/95 px-2 py-0.5 rounded flex items-center gap-1">
                      <MapPin size={10} className="text-[#025390]" />
                      <span className="text-[12px] font-bold text-gray-700 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                        {district?.name}
                      </span>
                    </div>
                  </Link>
                  <Link href={`/news/${art.slug}`}>
                    <h3
                      className="text-sm font-bold text-[#02599c] hover:text-[#013f70] hover:underline leading-relaxed line-clamp-3 telugu-text text-center px-1"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      {art.title}
                    </h3>
                  </Link>
                </div>
              ))}
            </div>

            {/* Bottom compact list */}
            {bottomRow.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 border-t border-gray-100">
                {bottomRow.map((art) => (
                  <div key={art.id} className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm hover:shadow-md transition-all flex flex-col group">
                    <Link href={`/news/${art.slug}`} className="block relative aspect-video rounded-md overflow-hidden bg-black/5 mb-3">
                      <img
                        src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop'}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                      />
                    </Link>
                    <Link href={`/news/${art.slug}`}>
                      <h4
                        className="text-sm font-bold text-[#02599c] hover:text-[#013f70] hover:underline leading-relaxed line-clamp-3 telugu-text text-center px-1"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      >
                        {art.title}
                      </h4>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar (30%) */}
          <RightSidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
