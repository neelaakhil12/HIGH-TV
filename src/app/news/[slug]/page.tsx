import Image from 'next/image';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdBanner from '@/components/home/AdBanner';
import NewsCard from '@/components/cards/NewsCard';
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
  formatTimeAgo,
  womenNews,
  lifestyleNews,
  webstoriesNews,
  antharmadanamNews,
  adyathmikamNews,
  sampadakiyamNews,
  getReporterByAuthor,
} from '@/lib/mockData';
import { Home, ChevronRight, Clock, Eye, Share2, Bookmark, ThumbsUp } from 'lucide-react';
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
];

export async function generateStaticParams() {
  return allNews.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = allNews.find((n) => n.slug === slug);
  return {
    title: article ? `${article.title} | ఈనాడు క్లోన్` : 'వార్త | ఈనాడు క్లోన్',
    description: article?.description,
    openGraph: {
      title: article?.title,
      description: article?.description,
      images: article?.image ? [article.image] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = allNews.find((n) => n.slug === slug) || allNews[0];
  const reporter = getReporterByAuthor(article.author);
  const related = allNews.filter((n) => n.id !== article.id && n.categorySlug === article.categorySlug).slice(0, 4);
  const fallbackRelated = allNews.filter((n) => n.id !== article.id).slice(0, 4);
  const relatedArticles = related.length > 0 ? related : fallbackRelated;

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <TopBar />
      <Header />

      <main className="max-w-[1200px] mx-auto bg-white px-4 py-6 shadow-md border-x border-gray-200">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 flex-wrap">
          <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-1">
            <Home size={14} /> హోమ్
          </Link>
          <ChevronRight size={14} />
          <Link href={`/category/${article.categorySlug}`} className="hover:text-brand-blue transition-colors telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            {article.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-400 truncate max-w-[200px] telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            {article.title.slice(0, 30)}...
          </span>
        </div>

        {/* 68% Left and 30% Right Layout */}
        <div className="flex flex-col lg:flex-row justify-between gap-[2%]">
          {/* Article Main (68%) */}
          <article className="w-full lg:w-[68%] flex-shrink-0">
            {/* Category + Breaking */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="category-pill text-white"
                style={{ background: article.categoryColor }}
              >
                {article.category}
              </span>
              {article.isBreaking && (
                <span className="bg-brand-red text-white text-xs font-black px-3 py-0.5 rounded breaking-badge">
                  🔴 బ్రేకింగ్ న్యూస్
                </span>
              )}
            </div>

            {/* Headline */}
            <h1
              className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4 telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {article.title}
            </h1>

            {/* Description */}
            <p
              className="text-xl text-gray-600 leading-relaxed mb-5 telugu-text border-l-4 border-brand-blue pl-4 bg-blue-50/50 py-3 pr-4 rounded-r-lg"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {article.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 bg-brand-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">ఈ</span>
                </div>
                <Link href={`/reporter/${reporter.slug}`} className="font-bold text-brand-blue hover:text-brand-red transition-colors telugu-text" style={{ fontFamily: 'Mandali, sans-serif' }}>
                  {reporter.name}
                </Link>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{formatTimeAgo(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{article.views.toLocaleString()} వీక్షణలు</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-sm font-semibold text-gray-600">షేర్ చేయండి:</span>
              <button className="flex items-center gap-1 bg-[#1877f2] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </button>
              <button className="flex items-center gap-1 bg-[#1da1f2] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                Twitter
              </button>
              <button className="flex items-center gap-1 bg-[#25d366] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                <Share2 size={14} /> WhatsApp
              </button>
              <button className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors ml-auto cursor-pointer">
                <Bookmark size={14} /> సేవ్
              </button>
            </div>

            {/* Hero Image */}
            <div className="img-zoom-container rounded-xl overflow-hidden shadow-lg mb-6">
              <Image
                src={article.image}
                alt={article.title}
                width={1200}
                height={675}
                className="w-full h-auto animate-fade-in"
                priority
              />
            </div>
            <p className="text-xs text-gray-400 text-center mb-6 italic">
              చిత్రం: ఈనాడు క్లోన్
            </p>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              <p className="text-gray-700 leading-loose text-lg md:text-xl mb-4">
                {article.description} ఈ వార్తకు సంబంధించిన విశేషాలు క్రింద వివరించబడ్డాయి. ఈనాడు క్లోన్ డెస్క్ నుండి తాజా సమాచారం ఇక్కడ లభిస్తుంది.
              </p>
              <p className="text-gray-700 leading-loose text-lg md:text-xl mb-4">
                అధికారులు తెలిపిన వివరాల ప్రకారం, ఈ నిర్ణయం రాష్ట్ర ప్రజలకు అత్యంత ప్రయోజనకరంగా ఉంటుందని భావిస్తున్నారు. ఈ పరిణామాలు భవిష్యత్తులో మరింత సానుకూలమైన ఫలితాలను ఇస్తాయని నిపుణులు అభిప్రాయపడుతున్నారు.
              </p>

              {/* Mid-article Ad */}
              <AdBanner position="rectangle" />

              <p className="text-gray-700 leading-loose text-lg md:text-xl mb-4">
                ఈ అంశంపై స్థానిక ప్రజలు, నిపుణులు వివిధ అభిప్రాయాలు వ్యక్తం చేశారు. కొందరు ఈ నిర్ణయాన్ని స్వాగతిస్తున్నారు, మరికొందరు దీనిపై సందేహాలు వ్యక్తం చేస్తున్నారు. మొత్తంమీద, ఈ పరిస్థితి భవిష్యత్తులో ఎలా అభివృద్ధి చెందుతుందో అనే విషయంపై అందరి దృష్టి నెలకొని ఉంది.
              </p>
              <p className="text-gray-700 leading-loose text-lg md:text-xl">
                ఈనాడు క్లోన్ ఈ అంశాన్ని నిరంతరం ట్రాక్ చేస్తూ తాజా అప్‌డేట్‌లను అందిస్తుంది. మరిన్ని వివరాలకు మా వెబ్‌సైట్‌ను అనుసరించండి.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${tag}`}
                    className="text-xs bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-600 px-3 py-1.5 rounded-full transition-colors font-medium telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Like / Share */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
              <button className="flex items-center gap-2 text-gray-600 hover:text-brand-blue transition-colors font-semibold text-sm cursor-pointer">
                <ThumbsUp size={18} /> ఈ వార్త ఇష్టమైందా? లైక్ చేయండి
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-blue transition-colors cursor-pointer">
                <Share2 size={16} /> షేర్
              </button>
            </div>

            {/* Related News */}
            <div className="mt-8">
              <h2
                className="text-xl font-black text-gray-800 mb-5 telugu-text border-l-4 border-brand-blue pl-3"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                సంబంధిత వార్తలు
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <NewsCard key={rel.id} article={rel} variant="horizontal" />
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-10 bg-gray-50 rounded-xl p-6">
              <h2
                className="text-xl font-black text-gray-800 mb-4 telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                వ్యాఖ్యలు
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-brand-blue transition-colors"
                  rows={4}
                  placeholder="మీ అభిప్రాయం తెలపండి..."
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                />
                <div className="flex justify-end mt-2">
                  <button className="bg-brand-blue text-white font-bold px-5 py-2 rounded-lg text-sm hover:bg-brand-dark-blue transition-colors telugu-text cursor-pointer"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    వ్యాఖ్యను పంపండి
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">వ్యాఖ్యలు దురుద్దేశపూరితంగా ఉండకూడదు</p>
            </div>
          </article>

          {/* Sidebar (30%) */}
          <aside className="w-full lg:w-[30%] flex-shrink-0 space-y-6">
            <AdBanner position="sidebar" />

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              <div className="bg-brand-blue px-4 py-3">
                <h3 className="text-white font-black text-base telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  తాజా వార్తలు
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {allNews.slice(0, 6).map((a) => (
                  <Link
                    key={a.id}
                    href={`/news/${a.slug}`}
                    className="flex gap-2 p-3 hover:bg-blue-50 transition-colors group"
                  >
                    <Image src={a.image} alt={a.title} width={60} height={45} className="rounded flex-shrink-0 object-cover w-15 h-12" />
                    <p
                      className="text-sm md:text-base font-bold text-gray-700 group-hover:text-brand-blue transition-colors line-clamp-3 telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      {a.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
