import Image from 'next/image';
import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import { videoNews, formatTimeAgo } from '@/lib/mockData';

export default function VideoSection() {
  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#66000c] rounded-full"></div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#66000c] rounded flex items-center justify-center">
              <Play size={10} className="text-white fill-white ml-0.5" />
            </div>
            <h2
              className="text-xl md:text-2xl font-black text-[#66000c] telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              వీడియో వార్తలు
            </h2>
          </div>
        </div>
        <Link href="/category/videos" className="flex items-center gap-1 text-xs font-semibold text-[#66000c]">
          అన్నీ చూడండి →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videoNews.map((video) => (
          <article key={video.id} className="news-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer">
            <div className="relative img-zoom-container" style={{ paddingTop: '56.25%' }}>
              <Image
                src={video.image}
                alt={video.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="play-button w-14 h-14 bg-[#66000c]/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <Play size={24} className="text-white fill-white ml-1" />
                </div>
              </div>
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-0.5 rounded">
                4:32
              </div>
              {/* Category */}
              <div className="absolute top-2 left-2">
                <span
                  className="category-pill text-white"
                  style={{ background: video.categoryColor }}
                >
                  {video.category}
                </span>
              </div>
            </div>

            <div className="p-3">
              <h3
                className="text-sm font-bold text-gray-800 group-hover:text-[#66000c] transition-colors line-clamp-2 leading-snug mb-2 telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {video.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock size={10} />
                  <span>{formatTimeAgo(video.publishedAt)}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
