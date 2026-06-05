import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsCard from '@/components/cards/NewsCard';
import { featuredNews, politicsNews, entertainmentNews, sportsNews } from '@/lib/mockData';
import { Search } from 'lucide-react';

const allNews = [...featuredNews, ...politicsNews, ...entertainmentNews, ...sportsNews];

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <h1
            className="text-2xl font-black text-gray-800 mb-4 telugu-text text-center"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            వార్తలు వెతకండి
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="వార్తలు, విషయాలు లేదా కేటగిరీ వెతకండి..."
              className="search-input w-full pl-5 pr-12 py-4 border-2 border-gray-200 rounded-xl text-base focus:border-[#C00000] transition-colors"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              autoFocus
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#C00000] text-white rounded-lg flex items-center justify-center hover:bg-[#8B0000] transition-colors">
              <Search size={18} />
            </button>
          </div>
        </div>

        <h2
          className="text-lg font-bold text-gray-800 mb-5 telugu-text"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          తాజా వార్తలు
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {allNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
