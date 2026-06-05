import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import NewsCard from '@/components/cards/NewsCard';
import AdBanner from '@/components/home/AdBanner';
import EPaperReader from '@/components/epaper/EPaperReader';
import { categories, politicsNews, entertainmentNews, sportsNews, technologyNews, businessNews, healthNews, viralNews, featuredNews, rasipalaluNews } from '@/lib/mockData';
import { Home, ChevronRight } from 'lucide-react';
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
];

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  return {
    title: `${cat?.name || category} వార్తలు | హై టీవీ`,
    description: `${cat?.name} తాజా వార్తలు - హై టీవీ`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  const articles = allNews.filter((n) => n.categorySlug === category);
  const allArticles = articles.length > 0 ? articles : allNews.slice(0, 12);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link href="/" className="hover:text-[#C00000] transition-colors flex items-center gap-1">
            <Home size={14} /> హోమ్
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-semibold telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            {cat?.name || category}
          </span>
        </div>

        {/* Category Header */}
        <div className="mb-6 pb-4 border-b-2" style={{ borderColor: cat?.color || '#C00000' }}>
          <h1
            className="text-3xl font-black telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif', color: cat?.color || '#C00000' }}
          >
            {category === 'epaper' ? 'హై టీవీ ఈ-పేపర్' : `${cat?.name || category} వార్తలు`}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {category === 'epaper'
              ? 'డిజిటల్ దినపత్రిక సంచికను ఇక్కడ చదవండి'
              : `${allArticles.length} వార్తలు అందుబాటులో ఉన్నాయి`}
          </p>
        </div>

        <AdBanner position="leaderboard" />

        {category === 'epaper' ? (
          <div className="mt-6">
            <EPaperReader />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
            {/* Articles Grid */}
            <div className="xl:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <button
                  className="bg-[#C00000] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#8B0000] transition-colors telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  మరిన్ని వార్తలు లోడ్ చేయండి
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="xl:col-span-1 space-y-6">
              <AdBanner position="sidebar" />

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-black text-gray-800 text-base mb-3 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  వర్గాలు
                </h3>
                <div className="space-y-1">
                  {categories.slice(0, 10).map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-red-50 group transition-colors"
                    >
                      <span
                        className="text-sm font-medium text-gray-700 group-hover:text-[#C00000] transition-colors telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      >
                        {c.name}
                      </span>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-[#C00000] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
