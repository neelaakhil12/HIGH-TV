'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { getMergedArticles } from '@/lib/mockData';

interface District {
  slug: string;
  name: string;
}

interface MultiDistrictFeedProps {
  state: string; // 'telangana' or 'andhra-pradesh'
  districts: District[];
  initialArticles: any[];
}

export default function MultiDistrictFeed({
  state,
  districts,
  initialArticles,
}: MultiDistrictFeedProps) {
  const [districtListArticles, setDistrictListArticles] = useState<any[]>([]);

  useEffect(() => {
    try {
      // 1. Get all articles (both static and custom merged)
      const merged = getMergedArticles(initialArticles, state);

      // 2. For each district in this state, find the latest news article
      const list = districts.map((dist) => {
        // Find matching article (first checking districtSlug matches)
        let art = merged.find((n: any) => n.districtSlug === dist.slug);
        
        if (!art) return null;

        return {
          ...art,
          districtName: dist.name,
        };
      }).filter(Boolean);

      setDistrictListArticles(list);
    } catch (e) {
      console.error('Error loading multi-district feed', e);
      // Fallback mapping using initialArticles
      const fallbackList = districts.map((dist) => {
        const art = initialArticles.find((n: any) => n.districtSlug === dist.slug);
        if (!art) return null;
        return {
          ...art,
          districtName: dist.name,
        };
      }).filter(Boolean);
      setDistrictListArticles(fallbackList);
    }
  }, [state, districts, initialArticles]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
      {districtListArticles.map((art) => (
        <Link
          key={art.id}
          href={`/district/${state}/${art.districtSlug}`}
          className="flex gap-4 p-3 bg-white hover:bg-blue-50/25 rounded-xl border border-gray-150 transition-all group items-center"
        >
          {/* Left Side: Smaller Image */}
          <div className="w-[110px] h-[75px] sm:w-[140px] sm:h-[95px] flex-shrink-0 rounded-lg overflow-hidden bg-black/5 relative">
            <img
              src={art.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"}
              alt={art.title?.replace(/<[^>]*>/g, '')}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-355"
            />
            {/* Map pin badge */}
            <div className="absolute top-1.5 left-1.5 bg-[#025390] text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 shadow-sm">
              <MapPin size={9} className="text-white flex-shrink-0" />
              <span className="telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                {art.districtName}
              </span>
            </div>
          </div>

          {/* Right Side: Title & Description */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <h3
              className="text-[14.5px] sm:text-base font-black text-[#02599c] group-hover:text-[#013f70] group-hover:underline transition-colors leading-snug telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              dangerouslySetInnerHTML={{ __html: art.title }}
            />
            
            {art.description && (
              <p
                className="hidden sm:line-clamp-2 text-[13px] text-gray-550 telugu-text leading-relaxed"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: art.description }}
              />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
