'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NewsArticle } from '@/lib/mockData';
import NewsCard from '@/components/cards/NewsCard';

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
    { id: 'adyathmikam', name: 'దైవం', data: adyathmikamNews },
    { id: 'business', name: 'బిజినెస్', data: businessNews },
  ] as const;

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-3 md:mb-8">
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
          {currentTab.data.slice(0, 4).map((article) => (
            <NewsCard key={article.id} article={article} variant="horizontal" />
          ))}
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
            {currentTab.name} {'వార్తలు అన్నీ చూడండి'} &raquo;
          </Link>
        </div>
      </div>
    </div>
  );
}
