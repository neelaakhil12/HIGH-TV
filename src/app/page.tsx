import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import HeroSlider from '@/components/home/HeroSlider';
import BreakingNewsSection from '@/components/home/BreakingNewsSection';
import TrendingSection from '@/components/home/TrendingSection';
import NewsSection from '@/components/home/NewsSection';
import VideoSection from '@/components/home/VideoSection';
import PhotoGallery from '@/components/home/PhotoGallery';
import AdBanner from '@/components/home/AdBanner';
import NewsCard from '@/components/cards/NewsCard';
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
} from '@/lib/mockData';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />

      <main>
        {/* Hero Slider */}
        <HeroSlider />

        {/* Ad Banner */}
        <div className="max-w-[1400px] mx-auto px-4 mt-6">
          <AdBanner position="leaderboard" />
        </div>

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* Breaking News + Sidebar layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">
            {/* Main area */}
            <div className="xl:col-span-3">
              <BreakingNewsSection />
              <TrendingSection />

              {/* Politics */}
              <NewsSection
                title="Politics"
                titleTelugu="రాజకీయాలు"
                articles={politicsNews}
                viewAllLink="/category/politics"
                accentColor="#1a6b3a"
                layout="featured-left"
              />

              {/* Entertainment */}
              <NewsSection
                title="Entertainment"
                titleTelugu="సినిమా"
                articles={entertainmentNews}
                viewAllLink="/category/entertainment"
                accentColor="#db2777"
                layout="grid4"
              />

              {/* Sports */}
              <NewsSection
                title="Sports"
                titleTelugu="క్రీడలు"
                articles={sportsNews}
                viewAllLink="/category/sports"
                accentColor="#ea580c"
                layout="featured-left"
              />

              {/* Mid Ad */}
              <AdBanner position="rectangle" />

              {/* Business + Tech side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <NewsSection
                  title="Business"
                  titleTelugu="వ్యాపారం"
                  articles={businessNews}
                  viewAllLink="/category/business"
                  accentColor="#15803d"
                  layout="list"
                />
                <NewsSection
                  title="Technology"
                  titleTelugu="టెక్నాలజీ"
                  articles={technologyNews}
                  viewAllLink="/category/technology"
                  accentColor="#4f46e5"
                  layout="list"
                />
              </div>

              {/* Viral + Health */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <NewsSection
                  title="Viral"
                  titleTelugu="వైరల్"
                  articles={viralNews}
                  viewAllLink="/category/viral"
                  accentColor="#dc2626"
                  layout="list"
                />
                <NewsSection
                  title="Health"
                  titleTelugu="ఆరోగ్యం"
                  articles={healthNews}
                  viewAllLink="/category/health"
                  accentColor="#0891b2"
                  layout="list"
                />
              </div>

              {/* Rasipalalu */}
              <NewsSection
                title="Horoscopes"
                titleTelugu="రాశిఫలాలు"
                articles={rasipalaluNews}
                viewAllLink="/category/rasipalalu"
                accentColor="#b45309"
                layout="grid3"
              />

              {/* Video News */}
              <VideoSection />

              {/* Photo Gallery */}
              <PhotoGallery />
            </div>

            {/* Sidebar */}
            <aside className="xl:col-span-1 space-y-6">
              {/* Sidebar Ad */}
              <AdBanner position="sidebar" />

              {/* Most Read */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gray-800 px-4 py-3">
                  <h3 className="text-white font-black text-base telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    అత్యధికంగా చదివినవి
                  </h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {featuredNews.map((article, index) => (
                    <div key={article.id} className="flex gap-3 p-3 hover:bg-red-50 transition-colors group">
                      <span className="flex-shrink-0 w-7 h-7 bg-[#C00000] text-white text-xs font-black rounded flex items-center justify-center">
                        {index + 1}
                      </span>
                      <Link href={`/news/${article.slug}`} className="flex-1">
                        <p
                          className="text-xs font-semibold text-gray-700 group-hover:text-[#C00000] transition-colors line-clamp-2 leading-snug telugu-text"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        >
                          {article.title}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Second Sidebar Ad */}
              <AdBanner position="sidebar" />

              {/* Tags */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-black text-gray-800 text-base mb-3 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  ట్రెండింగ్ ట్యాగ్స్
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['రాజకీయాలు', 'ఆంధ్రప్రదేశ్', 'తెలంగాణ', 'క్రికెట్', 'సినిమా', 'AI', 'బడ్జెట్', 'వరదలు', 'IPL', 'మెట్రో', 'వ్యాపారం', 'ఆరోగ్యం'].map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${tag}`}
                      className="text-xs bg-gray-100 hover:bg-[#C00000] hover:text-white text-gray-600 px-3 py-1.5 rounded-full transition-colors font-medium telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Social Follow Box */}
              <div className="bg-[#C00000] rounded-xl p-4 text-white">
                <h3 className="font-black text-lg mb-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  మాతో అనుసంధానం
                </h3>
                <p className="text-red-100 text-xs mb-4 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  సోషల్ మీడియాలో హై టీవీను ఫాలో చేయండి
                </p>
                <div className="space-y-2">
                  {[
                    { name: 'Facebook', count: '2.4L', color: '#1877f2' },
                    { name: 'Twitter', count: '85K', color: '#1da1f2' },
                    { name: 'YouTube', count: '1.2L', color: '#ff0000' },
                    { name: 'Instagram', count: '67K', color: '#e1306c' },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href="#"
                      className="flex items-center justify-between bg-white/15 hover:bg-white/25 transition-colors rounded-lg px-3 py-2"
                    >
                      <span className="font-bold text-sm">{social.name}</span>
                      <span className="text-red-100 text-xs">{social.count} followers</span>
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
