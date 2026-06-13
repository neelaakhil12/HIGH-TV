'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/lib/mockData';

interface TabbedNewsWidgetProps {
  apNews: NewsArticle[];
  tgNews: NewsArticle[];
  adyathmikamNews: NewsArticle[];
  businessNews: NewsArticle[];
}

export default function TabbedNewsWidget({
  apNews,
  tgNews,
  adyathmikamNews,
  businessNews,
}: TabbedNewsWidgetProps) {
  const [activeTab, setActiveTab] = useState<'ap' | 'tg' | 'adyathmikam' | 'business'>('tg');

  const tabs = [
    { id: 'tg', name: 'తెలంగాణ', data: tgNews },
    { id: 'ap', name: 'ఆంధ్రప్రదేశ్', data: apNews },
    { id: 'adyathmikam', name: 'ఆధ్యాత్మికం', data: adyathmikamNews },
    { id: 'business', name: 'బిజినెస్', data: businessNews },
  ] as const;

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-100 bg-gray-50 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[110px] text-center py-3 text-sm md:text-base font-black telugu-text transition-colors border-b-2 outline-none cursor-pointer ${
                isActive
                  ? 'border-brand-red text-brand-red bg-white'
                  : 'border-transparent text-gray-500 hover:text-brand-blue hover:bg-gray-100/50'
              }`}
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main article inside tab */}
          {currentTab.data[0] && (
            <div className="flex flex-col group border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
              <Link href={`/news/${currentTab.data[0].slug}`} className="block overflow-hidden rounded-lg mb-3 img-zoom-container">
                <Image
                  src={currentTab.data[0].image}
                  alt={currentTab.data[0].title}
                  width={400}
                  height={225}
                  className="w-full h-44 object-cover"
                />
              </Link>
              <span className="text-xs uppercase font-bold text-brand-blue tracking-wide mb-1 block">
                {currentTab.data[0].category}
              </span>
              <Link href={`/news/${currentTab.data[0].slug}`}>
                <h3
                  className="font-black text-gray-900 group-hover:text-brand-blue transition-colors text-[15px] md:text-[17px] mb-2 line-clamp-2 telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {currentTab.data[0].title}
                </h3>
              </Link>
              <p
                className="text-gray-500 text-sm line-clamp-3 leading-relaxed telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {currentTab.data[0].description}
              </p>
            </div>
          )}

          {/* List of other articles in this tab */}
          <div className="flex flex-col divide-y divide-gray-50 justify-center">
            {currentTab.data.slice(1, 5).map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="flex items-center gap-3 py-2.5 hover:bg-blue-50/50 px-2 rounded-lg transition-colors group"
              >
                <div className="w-14 h-11 flex-shrink-0 overflow-hidden rounded bg-gray-100 img-zoom-container">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={60}
                    height={45}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-bold text-gray-800 group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    {article.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All button */}
        <div className="mt-4 pt-3 border-t border-gray-50 text-center">
          <Link
            href={`/category/${
              currentTab.id === 'tg'
                ? 'telangana'
                : currentTab.id === 'ap'
                ? 'andhra-pradesh'
                : currentTab.id
            }`}
            className="inline-block text-sm font-bold text-brand-blue hover:text-brand-red transition-colors telugu-text"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            {currentTab.name} వార్తలు అన్నీ చూడండి &raquo;
          </Link>
        </div>
      </div>
    </div>
  );
}
