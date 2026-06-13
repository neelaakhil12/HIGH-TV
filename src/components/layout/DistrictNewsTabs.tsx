'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DistrictArticle {
  id: string;
  slug: string;
  title: string;
  image: string;
}

interface Props {
  apNews: DistrictArticle[];
  tgNews: DistrictArticle[];
}

export default function DistrictNewsTabs({ apNews, tgNews }: Props) {
  const [active, setActive] = useState<'ap' | 'tg'>('ap');
  const news = active === 'ap' ? apNews : tgNews;

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      {/* Header */}
      <div className="bg-[#025390] text-white px-3 py-2.5">
        <span className="font-black text-base telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
          జిల్లా వార్తలు
        </span>
      </div>

      {/* Slide Toggle */}
      <div className="flex bg-gray-100 p-1 gap-1 m-2 rounded-lg">
        <button
          onClick={() => setActive('ap')}
          className={`flex-1 py-1.5 text-[15px] font-black rounded-md transition-all duration-200 telugu-text ${
            active === 'ap'
              ? 'bg-[#e60000] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          ఆంధ్రప్రదేశ్
        </button>
        <button
          onClick={() => setActive('tg')}
          className={`flex-1 py-1.5 text-[15px] font-black rounded-md transition-all duration-200 telugu-text ${
            active === 'tg'
              ? 'bg-[#025390] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          తెలంగాణ
        </button>
      </div>

      {/* News List */}
      <ul className="divide-y divide-gray-100 pb-1">
        {news.map((item) => (
          <li key={item.id}>
            <Link
              href={`/news/${item.slug}`}
              className="flex items-start gap-2 px-3 py-2.5 hover:bg-blue-50/50 transition-colors group"
            >
              <div className="w-14 h-10 flex-shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-150">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <p
                className="text-[16px] font-semibold text-gray-700 group-hover:text-[#025390] leading-snug line-clamp-2 telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {item.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
