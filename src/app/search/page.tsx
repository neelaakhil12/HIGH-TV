import Header from '@/components/layout/Header';
import BackButton from '@/components/layout/BackButton';
import Footer from '@/components/layout/Footer';
import NewsCard from '@/components/cards/NewsCard';
import RightSidebar from '@/components/layout/RightSidebar';
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
  sampadakiyamNews
} from '@/lib/mockData';
import { Search } from 'lucide-react';

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
];

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col">
      <Header />

      <main className="max-w-[1050px] mx-auto bg-white px-4 py-8 flex-1 shadow-md border-x border-gray-200 w-full">
        <BackButton />
        <div className="max-w-2xl mx-auto mb-8">
          <h1
            className="text-xl md:text-2xl font-black text-gray-800 mb-4 telugu-text text-center"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            వార్తలు వెతకండి
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="వార్తలు, కేటగిరీ వెతకండి..."
              className="search-input w-full pl-4 md:pl-5 pr-12 py-3 md:py-4 border-2 border-gray-200 rounded-xl text-[13px] md:text-base focus:border-brand-blue transition-colors"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              autoFocus
            />
            <button className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 bg-brand-blue text-white rounded-lg flex items-center justify-center hover:bg-brand-dark-blue transition-colors cursor-pointer">
              <Search className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>

        {/* 2-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
          {/* Main search results area (70%) */}
          <div className="w-full lg:col-span-7">
            <h2
              className="text-lg font-bold text-gray-800 mb-5 telugu-text text-left"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              బ్రేకింగ్ న్యూస్
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {allNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
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
