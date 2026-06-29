'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, ChevronRight, CloudSun, Sun, CloudRain, Cloud, Wind, Droplets } from 'lucide-react';
import BackButton from '@/components/layout/BackButton';
import RightSidebar from '@/components/layout/RightSidebar';
import CategoryArticlesFeed from '@/components/category/CategoryArticlesFeed';

const DEFAULT_WEATHER_DATA = [
  {
    city: 'హైదరాబాద్',
    temp: 32,
    condition: 'పాక్షికంగా మేఘావృతం',
    humidity: 60,
    wind: 12,
    high: 34,
    low: 24,
    forecast: [
      { day: 'శుక్రవారం', temp: 33, cond: 'మేఘావృతం' },
      { day: 'శనివారం', temp: 31, cond: 'ఉరుములతో కూడిన వర్షం' },
      { day: 'ఆదివారం', temp: 30, cond: 'భారీ వర్షం' },
      { day: 'సోమవారం', temp: 32, cond: 'పాక్షికంగా మేఘావృతం' }
    ]
  },
  {
    city: 'రంగారెడ్డి',
    temp: 31,
    condition: 'ఉరుములతో కూడిన వర్షం',
    humidity: 68,
    wind: 14,
    high: 33,
    low: 22,
    forecast: [
      { day: 'శుక్రవారం', temp: 32, cond: 'తేలికపాటి వర్షం' },
      { day: 'శనివారం', temp: 31, cond: 'ఉరుములతో కూడిన వర్షం' },
      { day: 'ఆదివారం', temp: 29, cond: 'భారీ వర్షం' },
      { day: 'సోమవారం', temp: 32, cond: 'పాక్షికంగా మేఘావృతం' }
    ]
  },
  {
    city: 'వరంగల్',
    temp: 33,
    condition: 'మేఘావృతం',
    humidity: 62,
    wind: 11,
    high: 35,
    low: 23,
    forecast: [
      { day: 'శుక్రవారం', temp: 32, cond: 'తేలికపాటి వర్షం' },
      { day: 'శనివారం', temp: 30, cond: 'భారీ వర్షం' },
      { day: 'ఆదివారం', temp: 31, cond: 'మేఘావృతం' },
      { day: 'సోమవారం', temp: 33, cond: 'పాక్షికంగా మేఘావృతం' }
    ]
  },
  {
    city: 'ఖమ్మం',
    temp: 35,
    condition: 'ఎండగా ఉంటుంది',
    humidity: 52,
    wind: 9,
    high: 37,
    low: 25,
    forecast: [
      { day: 'శుక్రవారం', temp: 36, cond: 'ఎండగా ఉంటుంది' },
      { day: 'శనివారం', temp: 35, cond: 'ఎండగా ఉంటుంది' },
      { day: 'ఆదివారం', temp: 34, cond: 'పాక్షికంగా మేఘావృతం' },
      { day: 'సోమవారం', temp: 34, cond: 'మేఘావృతం' }
    ]
  },
  {
    city: 'విశాఖపట్నం',
    temp: 34,
    condition: 'ఎండగా మరియు ఉక్కపోత',
    humidity: 75,
    wind: 18,
    high: 35,
    low: 27,
    forecast: [
      { day: 'శుక్రవారం', temp: 34, cond: 'ఎండగా ఉంటుంది' },
      { day: 'శనివారం', temp: 33, cond: 'పాక్షికంగా మేఘావృతం' },
      { day: 'ఆదివారం', temp: 32, cond: 'తేలికపాటి వర్షం' },
      { day: 'సోమవారం', temp: 33, cond: 'మేఘావృతం' }
    ]
  },
  {
    city: 'విజయవాడ',
    temp: 37,
    condition: 'తీవ్రమైన ఎండ',
    humidity: 50,
    wind: 10,
    high: 39,
    low: 26,
    forecast: [
      { day: 'శుక్రవారం', temp: 38, cond: 'తీవ్రమైన ఎండ' },
      { day: 'శనివారం', temp: 37, cond: 'ఎండగా ఉంటుంది' },
      { day: 'ఆదివారం', temp: 35, cond: 'పాక్షికంగా మేఘావృతం' },
      { day: 'సోమవారం', temp: 36, cond: 'ఎండగా ఉంటుంది' }
    ]
  },
  {
    city: 'తిరుపతి',
    temp: 35,
    condition: 'ఎండగా ఉంటుంది',
    humidity: 55,
    wind: 9,
    high: 37,
    low: 25,
    forecast: [
      { day: 'శుక్రవారం', temp: 36, cond: 'ఎండగా ఉంటుంది' },
      { day: 'శనివారం', temp: 35, cond: 'ఎండగా ఉంటుంది' },
      { day: 'ఆదివారం', temp: 34, cond: 'పాక్షికంగా మేఘావృతం' },
      { day: 'సోమవారం', temp: 34, cond: 'మేఘావృతం' }
    ]
  }
];

const getWeatherIcon = (condition: string, size = 36) => {
  const cond = (condition || '').toLowerCase();
  if (cond.includes('వర్షం') || cond.includes('rain') || cond.includes('ఉరుము') || cond.includes('storm')) {
    return <CloudRain size={size} className="text-blue-500 flex-shrink-0" />;
  }
  if (cond.includes('మేఘ') || cond.includes('cloud') || cond.includes('మబ్బు')) {
    return <Cloud size={size} className="text-gray-400 flex-shrink-0" />;
  }
  if (cond.includes('ఎండ') || cond.includes('sun') || cond.includes('తీవ్రమైన') || cond.includes('ఎండగా')) {
    return <Sun size={size} className="text-amber-500 animate-spin-slow flex-shrink-0" />;
  }
  return <CloudSun size={size} className="text-blue-400 flex-shrink-0" />;
};

interface WeatherPageClientProps {
  dbArticles: any[];
}

export default function WeatherPageClient({ dbArticles }: WeatherPageClientProps) {
  const [weatherData, setWeatherData] = useState<any[]>(DEFAULT_WEATHER_DATA);

  useEffect(() => {
    fetch('/api/settings?key=weather_page_reports_data&t=' + Date.now())
      .then(res => res.ok ? res.json() : {})
      .then((data: any) => {
        const weatherVal = data.weather_page_reports_data || null;
        if (weatherVal) {
          try {
            setWeatherData(JSON.parse(weatherVal));
            return;
          } catch {}
        }
        // Fallback
        const savedWeather = localStorage.getItem('weather_page_reports_data');
        if (savedWeather) {
          try { setWeatherData(JSON.parse(savedWeather)); } catch {}
        }
      })
      .catch(() => {
        try {
          const savedWeather = localStorage.getItem('weather_page_reports_data');
          if (savedWeather) setWeatherData(JSON.parse(savedWeather));
        } catch {}
      });
  }, []);

  return (
    <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full">
      <BackButton />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-3 flex-wrap font-sans">
        <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-1 font-bold">
          <Home size={14} /> Home
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-bold">
          Weather Info
        </span>
      </div>

      {/* 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        {/* Left Content (70%) */}
        <div className="w-full lg:col-span-7 space-y-6">
          
          {/* Page Title & Intro */}
          <div className="bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-md select-none relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-6 translate-y-6 scale-125">
              <CloudSun size={180} />
            </div>
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                <CloudSun size={12} /> Weather Report
              </div>
              <h1 
                className="text-2xl md:text-3.5xl font-black telugu-text text-left"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                తెలుగు రాష్ట్రాల వాతావరణ అప్‌డేట్స్
              </h1>
              <p 
                className="text-blue-50 text-xs md:text-sm max-w-xl leading-relaxed telugu-text text-left"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                ఆంధ్రప్రదేశ్ మరియు తెలంగాణలోని ప్రముఖ నగరాల ప్రస్తుత ఉష్ణోగ్రతలు, గాలిలో తేమ, గాలి వేగం మరియు రాబోయే 4 రోజుల వాతావరణ అంచనాలు.
              </p>
            </div>
          </div>

          {/* City Weather Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {weatherData.map((data) => (
              <div 
                key={data.city}
                className="bg-white border border-gray-150 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top: City Info & Main Weather */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5 text-left">
                    <h2 
                      className="text-xl font-black text-gray-950 telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      {data.city}
                    </h2>
                    <p 
                      className="text-xs font-bold text-gray-500 telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      {data.condition}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-0.5 text-red-600 font-semibold">↑ {data.high}°C</span>
                      <span className="flex items-center gap-0.5 text-blue-600 font-semibold">↓ {data.low}°C</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 select-none">
                    {getWeatherIcon(data.condition)}
                    <span className="text-3xl font-black text-gray-900 font-sans tracking-tighter">
                      {data.temp}°C
                    </span>
                  </div>
                </div>

                {/* Middle: Details */}
                <div className="grid grid-cols-2 gap-2 my-4 p-2.5 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100">
                  <div className="flex items-center gap-1.5 justify-start">
                    <Droplets size={14} className="text-blue-500" />
                    <span>తేమ: <strong className="font-sans text-gray-800">{data.humidity}%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-start">
                    <Wind size={14} className="text-teal-500" />
                    <span>గాలి వేగం: <strong className="font-sans text-gray-800">{data.wind} km/h</strong></span>
                  </div>
                </div>

                {/* Bottom: Forecast */}
                <div className="border-t border-gray-100 pt-3.5 space-y-2">
                  <p 
                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    రాబోయే 4 రోజులు
                  </p>
                  <div className="grid grid-cols-4 gap-1">
                    {data.forecast.map((f: any, i: number) => (
                      <div key={i} className="flex flex-col items-center p-1 hover:bg-gray-50 rounded transition-colors text-center">
                        <span className="text-[9px] text-gray-400 font-bold truncate w-full">{f.day.substring(0, 3)}</span>
                        <div className="my-1 scale-95 select-none">{getWeatherIcon(f.cond, 20)}</div>
                        <span className="text-xs font-bold text-gray-700 font-sans">{f.temp}°C</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Weather News / Articles Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 
              className="text-2xl font-black text-slate-800 border-b-2 border-rose-600 pb-2 mb-6 telugu-text text-left"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              వాతావరణ తాజా వార్తలు (Weather Latest News)
            </h2>
            <CategoryArticlesFeed 
              initialArticles={dbArticles} 
              categorySlug="weather" 
            />
          </div>

        </div>

        {/* Right Sidebar (30%) */}
        <RightSidebar categorySlug="weather" />
      </div>
    </main>
  );
}
