import Image from 'next/image';
import Link from 'next/link';
import { Clock, Share2, Eye } from 'lucide-react';
import { NewsArticle, formatTimeAgo } from '@/lib/mockData';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'horizontal' | 'mini' | 'featured';
}

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  if (variant === 'horizontal') {
    return (
      <article className="news-card flex gap-3 bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-red-100 p-3">
        <Link href={`/news/${article.slug}`} className="flex-shrink-0 img-zoom-container rounded-md overflow-hidden w-28 h-20">
          <Image
            src={article.image}
            alt={article.title}
            width={112}
            height={80}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <span
            className="category-pill text-white mb-1.5 inline-block"
            style={{ background: article.categoryColor }}
          >
            {article.category}
          </span>
          <Link href={`/news/${article.slug}`}>
            <h3
              className="text-sm font-bold text-gray-800 hover:text-[#C00000] transition-colors line-clamp-2 leading-snug telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
            <Clock size={10} />
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'mini') {
    return (
      <article className="flex gap-2 py-2.5 border-b border-gray-100 last:border-b-0 group">
        <Link href={`/news/${article.slug}`} className="flex-shrink-0 img-zoom-container rounded overflow-hidden w-20 h-14">
          <Image
            src={article.image}
            alt={article.title}
            width={80}
            height={56}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="flex-1">
          <Link href={`/news/${article.slug}`}>
            <p
              className="text-xs font-semibold text-gray-800 group-hover:text-[#C00000] transition-colors line-clamp-2 leading-snug telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {article.title}
            </p>
          </Link>
          <span className="text-xs text-gray-400 mt-1 block">{formatTimeAgo(article.publishedAt)}</span>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="news-card relative rounded-xl overflow-hidden shadow-lg h-72 group">
        <div className="img-zoom-container absolute inset-0">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <span
            className="category-pill text-white mb-2 w-fit"
            style={{ background: article.categoryColor }}
          >
            {article.category}
          </span>
          <Link href={`/news/${article.slug}`}>
            <h3
              className="text-white text-base font-black leading-tight hover:text-red-200 transition-colors telugu-text line-clamp-2"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-gray-300 text-xs">
              <Clock size={10} />
              <span>{formatTimeAgo(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-300 text-xs">
              <Eye size={10} />
              <span>{(article.views / 1000).toFixed(1)}K</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default card
  return (
    <article className="news-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:border-red-100 flex flex-col">
      {/* Thumbnail */}
      <Link href={`/news/${article.slug}`} className="img-zoom-container block relative" style={{ paddingTop: '56.25%' }}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {article.isBreaking && (
          <div className="absolute top-2 left-2 bg-[#C00000] text-white text-[10px] font-black px-2 py-0.5 rounded breaking-badge uppercase">
            🔴 Breaking
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span
          className="category-pill text-white mb-2 w-fit"
          style={{ background: article.categoryColor }}
        >
          {article.category}
        </span>

        <Link href={`/news/${article.slug}`} className="flex-1">
          <h2
            className="text-sm md:text-base font-bold text-gray-800 hover:text-[#C00000] transition-colors leading-snug line-clamp-2 mb-2 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {article.title}
          </h2>
          <p
            className="text-xs text-gray-500 leading-relaxed line-clamp-2 telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {article.description}
          </p>
        </Link>

        {/* Meta */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span>{formatTimeAgo(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={10} />
              <span>{(article.views / 1000).toFixed(1)}K</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-[#C00000] transition-colors" aria-label="Share">
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
