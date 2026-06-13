import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { politicsNews, formatTimeAgo } from '@/lib/mockData';

export default function BreakingNewsSection() {
  const breaking = politicsNews.filter((n) => n.isBreaking);
  const latest = [...politicsNews, ...politicsNews].slice(0, 3);

  return (
    <section className="mb-5">
      <div className="bg-brand-blue rounded-t-xl px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <AlertCircle size={16} className="breaking-badge" />
          <h2 className="text-base font-black telugu-text tracking-wide" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            బ్రేకింగ్ న్యూస్
          </h2>
          <span className="ml-1.5 bg-brand-red text-white text-[10px] font-black px-1.5 py-0.5 rounded-full breaking-badge">LIVE</span>
        </div>
        <Link href="/category/latest" className="flex items-center gap-1 text-blue-100 text-xs font-semibold hover:text-white transition-colors">
          అన్నీ <ArrowRight size={11} />
        </Link>
      </div>
      <div className="bg-white rounded-b-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[270px]">
          <div className="border-r border-gray-100 overflow-hidden flex flex-col">
            {latest.map((article, index) => (
              <Link
                key={`${article.id}-${index}`}
                href={`/news/${article.slug}`}
                className="flex items-center gap-3 px-3 py-2 border-b border-gray-50 hover:bg-blue-50 transition-colors group last:border-b-0 flex-1"
              >
                <div className="w-14 h-10 flex-shrink-0 overflow-hidden rounded bg-gray-100 border border-gray-150 relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[16px] font-black text-gray-800 group-hover:text-brand-blue transition-colors leading-snug block telugu-text line-clamp-2" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    {article.title}
                  </span>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">{formatTimeAgo(article.publishedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="relative overflow-hidden h-[180px] lg:h-full">
            {breaking[0] && (
              <>
                <img src={breaking[0].image} alt={breaking[0].title} className="w-full h-full object-cover" loading="eager" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <span className="bg-brand-red text-white text-[9px] font-black px-1.5 py-0.5 rounded breaking-badge mb-1 inline-block">🔴 BREAKING</span>
                  <Link href={`/news/${breaking[0].slug}`}>
                    <h3 className="text-white text-[18px] font-black leading-snug hover:text-hover-yellow transition-colors telugu-text line-clamp-2" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                      {breaking[0].title}
                    </h3>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
