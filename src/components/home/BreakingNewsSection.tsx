import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { politicsNews, formatTimeAgo } from '@/lib/mockData';

export default function BreakingNewsSection() {
  const breaking = politicsNews.filter((n) => n.isBreaking);
  const latest = [...politicsNews, ...politicsNews].slice(0, 8);

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="bg-[#66000c] rounded-t-xl px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <AlertCircle size={18} className="breaking-badge" />
          <h2
            className="text-lg font-black telugu-text tracking-wide"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            బ్రేకింగ్ న్యూస్
          </h2>
          <span className="ml-2 bg-white text-[#66000c] text-xs font-black px-2 py-0.5 rounded-full breaking-badge">
            LIVE
          </span>
        </div>
        <Link href="/category/latest" className="flex items-center gap-1 text-red-100 text-xs font-semibold hover:text-white transition-colors">
          అన్నీ <ArrowRight size={12} />
        </Link>
      </div>

      <div className="bg-white rounded-b-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Breaking news list */}
          <div className="border-r border-gray-100">
            {latest.slice(0, 5).map((article, index) => (
              <Link
                key={`${article.id}-${index}`}
                href={`/news/${article.slug}`}
                className="flex gap-3 p-4 border-b border-gray-50 hover:bg-red-50 transition-colors group last:border-b-0"
              >
                <span className="flex-shrink-0 w-7 h-7 bg-[#66000c] text-white text-xs font-black rounded flex items-center justify-center">
                  {index + 1}
                </span>
                <div>
                  <span
                    className="text-sm font-semibold text-gray-700 group-hover:text-[#66000c] transition-colors leading-snug block telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    {article.title}
                  </span>
                  <span className="text-xs text-gray-400 mt-1 block">{formatTimeAgo(article.publishedAt)}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Featured image side */}
          <div>
            {breaking[0] && (
              <div className="relative h-full min-h-[300px]">
                <div className="img-zoom-container absolute inset-0">
                  <Image
                    src={breaking[0].image}
                    alt={breaking[0].title}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#66000c] text-white text-xs font-black px-2 py-0.5 rounded breaking-badge">
                      🔴 BREAKING
                    </span>
                  </div>
                  <Link href={`/news/${breaking[0].slug}`}>
                    <h3
                      className="text-white text-base font-black leading-tight hover:text-red-200 transition-colors telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      {breaking[0].title}
                    </h3>
                  </Link>
                  <p
                    className="text-gray-300 text-xs mt-1.5 line-clamp-2 telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    {breaking[0].description}
                  </p>
                </div>
              </div>
            )}

            {/* Additional latest 3 */}
            {latest.slice(5, 8).map((article, index) => (
              <Link
                key={`right-${article.id}-${index}`}
                href={`/news/${article.slug}`}
                className="flex gap-3 p-3 border-t border-gray-100 hover:bg-red-50 transition-colors group"
              >
                <div className="flex-shrink-0 img-zoom-container rounded overflow-hidden w-16 h-12">
                  <Image src={article.image} alt={article.title} width={64} height={48} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p
                    className="text-xs font-semibold text-gray-700 group-hover:text-[#66000c] transition-colors line-clamp-2 telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    {article.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
