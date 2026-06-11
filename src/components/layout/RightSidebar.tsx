'use client';

import Link from 'next/link';
import AdBanner from '@/components/home/AdBanner';
import { politicsNews, featuredNews, formatTimeAgo } from '@/lib/mockData';

export default function RightSidebar() {
  // Select 5 popular articles to display as Trending News in the sidebar
  const trendingArticles = [...featuredNews, ...politicsNews].slice(0, 5);

  return (
    <aside className="w-full lg:col-span-3 flex flex-col gap-4 select-none">
      
      {/* 1. Health Portal Link (Arogyam Banner) */}
      <Link href="/category/health" className="block w-full group overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white hover:border-gray-300 transition-colors duration-200">
        <img 
          src="/health.jpg" 
          alt="ఆరోగ్యం" 
          className="w-full h-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </Link>

      {/* 2. Top Sponsored Ad */}
      <AdBanner position="rectangle" />

      {/* 3. New Widget: Trending News (ట్రెండింగ్ వార్తలు) */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-left">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
          <div className="w-1.5 h-6 bg-[#e60000] rounded-full"></div>
          <h3 className="font-black text-gray-900 text-[16px] md:text-[18px] telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            ట్రెండింగ్ వార్తలు
          </h3>
        </div>
        <div className="space-y-3">
          {trendingArticles.map((article, idx) => (
            <Link
              key={`${article.id}-${idx}`}
              href={`/news/${article.slug}`}
              className="flex items-center gap-2.5 pb-2.5 last:pb-0 last:border-b-0 border-b border-gray-50 group cursor-pointer"
            >
              {/* Image thumbnail */}
              <div className="w-12 h-9 flex-shrink-0 overflow-hidden rounded bg-gray-100 border border-gray-150 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                />
              </div>
              {/* Text */}
              <div className="min-w-0 flex-1">
                <h4
                  className="text-[12px] font-black text-gray-800 leading-snug group-hover:text-[#02599c] transition-colors telugu-text line-clamp-2"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {article.title}
                </h4>
                <span className="text-[8.5px] text-gray-400 mt-0.5 block">{formatTimeAgo(article.publishedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Astrology / Sidebar Ads */}
      <AdBanner position="astrology" />
      <AdBanner position="sidebar" />

      {/* 5. Sponsored Ad: Zomato */}
      <div className="w-full bg-gradient-to-b from-[#1a0a00] via-[#7d1206] to-[#1a0a00] border border-red-900/40 rounded-xl overflow-hidden shadow-md relative text-left">
        <div className="h-1 w-full bg-gradient-to-r from-red-400 via-orange-300 to-red-400" />
        <div className="absolute top-2.5 left-3 bg-black/40 text-red-300 text-[6px] font-black px-1.5 py-0.5 rounded uppercase leading-none">SPONSORED</div>
        <div className="w-full h-[100px] relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=100&fit=crop" alt="Food" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#7d1206]/80 to-transparent" />
        </div>
        <div className="p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-[10px] shadow-sm border border-red-300/30 flex-shrink-0">Z</div>
            <div>
              <div className="text-white font-black text-[12px] font-sans">Zomato</div>
              <div className="text-red-200 text-[7px] font-bold font-sans uppercase tracking-wide">Food Delivery</div>
            </div>
          </div>
          <h4 className="text-[13px] font-black text-red-200 leading-snug font-sans">Order Food<br />in 30 Minutes!</h4>
          <p className="text-[8.5px] text-red-100/80 font-bold font-sans leading-relaxed">Restaurants near you • Free delivery on first order</p>
          <div className="bg-red-500/30 border border-red-500/40 rounded px-2 py-1 text-center text-amber-300 font-black text-[9px] font-sans uppercase">🎉 60% OFF up to ₹120</div>
          <button className="w-full bg-red-500 hover:bg-red-400 text-white font-black text-[9px] py-2 rounded-lg uppercase tracking-wider font-sans transition-colors cursor-pointer shadow">Order Now</button>
          <div className="text-center text-[7px] text-red-300/70 font-bold font-sans">Available on App & Web • 500+ Restaurants</div>
        </div>
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
      </div>

      {/* 6. AdBanner: Gold Loan */}
      <AdBanner position="gold-loan" />

      {/* 7. Sponsored Ad: Myntra */}
      <div className="w-full bg-gradient-to-b from-[#0d0520] via-[#3b0764] to-[#0d0520] border border-purple-800/40 rounded-xl overflow-hidden shadow-md relative text-left">
        <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-purple-300 to-pink-400" />
        <div className="absolute top-2.5 left-3 bg-black/40 text-pink-300 text-[6px] font-black px-1.5 py-0.5 rounded uppercase leading-none">SPONSORED</div>
        <div className="w-full h-[100px] relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=100&fit=crop" alt="Fashion" className="w-full h-full object-cover opacity-65" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3b0764]/80 to-transparent" />
        </div>
        <div className="p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white font-black text-[10px] shadow-sm border border-pink-300/30 flex-shrink-0">M</div>
            <div>
              <div className="text-white font-black text-[12px] font-sans">Myntra</div>
              <div className="text-pink-200 text-[7px] font-bold font-sans uppercase tracking-wide">Fashion & Lifestyle</div>
            </div>
          </div>
          <h4 className="text-[13px] font-black text-pink-200 leading-snug font-sans">End of Season<br />Sale is LIVE!</h4>
          <p className="text-[8.5px] text-purple-100/80 font-bold font-sans leading-relaxed">Upto 80% OFF on Top Brands — Levis, H&M, Puma & more</p>
          <div className="grid grid-cols-3 gap-1 text-center">
            {['80% OFF', '5000+\nBrands', 'Free\nReturn'].map((s) => (
              <div key={s} className="bg-white/10 rounded px-1 py-1.5 border border-white/10">
                <div className="text-[8px] font-black text-pink-300 font-sans leading-tight whitespace-pre-line">{s}</div>
              </div>
            ))}
          </div>
          <button className="w-full bg-pink-500 hover:bg-pink-400 text-white font-black text-[9px] py-2 rounded-lg uppercase tracking-wider font-sans transition-colors cursor-pointer shadow">Shop Now</button>
          <div className="text-center text-[7px] text-purple-300/70 font-bold font-sans">Download App • Get Extra 10% OFF</div>
        </div>
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-pink-400/50 to-transparent" />
      </div>

      {/* 8. AdBanner: Coaching */}
      <AdBanner position="coaching" />

      {/* 9. Trending Tags Box */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-left">
        <h3 className="font-black text-gray-800 text-[15px] mb-3 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ట్రెండింగ్ ట్యాగ్స్</h3>
        <div className="flex flex-wrap gap-2">
          {['రాజకీయాలు', 'ఆంధ్రప్రదేశ్', 'తెలంగాణ', 'క్రికెట్', 'సినిమా', 'AI', 'బడ్జెట్', 'వరదలు', 'IPL', 'మెట్రో', 'వ్యాపారం', 'ఆరోగ్యం'].map((tag) => (
            <Link key={tag} href={`/search?q=${tag}`} className="text-xs bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-600 px-3 py-1.5 rounded-full transition-colors font-medium telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      {/* 10. Social Follow Box */}
      <div className="bg-brand-blue rounded-xl p-4 text-white text-left">
        <h3 className="font-black text-lg mb-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>మాతో అనుసంధానం</h3>
        <p className="text-blue-100 text-xs mb-4 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>सोशल मीडियालो ईनाडुनु फालो चेयండి</p>
        <div className="space-y-2">
          {[
            { name: 'Facebook', count: '2.4L' },
            { name: 'Twitter', count: '85K' },
            { name: 'YouTube', count: '1.2L' },
            { name: 'Instagram', count: '67K' },
          ].map((social) => (
            <a key={social.name} href="#" className="flex items-center justify-between bg-white/15 hover:bg-white/25 transition-colors rounded-lg px-3 py-2">
              <span className="font-bold text-sm">{social.name}</span>
              <span className="text-blue-100 text-xs">{social.count} followers</span>
            </a>
          ))}
        </div>
      </div>

    </aside>
  );
}
