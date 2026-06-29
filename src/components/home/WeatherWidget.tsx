'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CloudSun, Sun, CloudRain, ArrowRight, Cloud } from 'lucide-react';

const STATIC_HOME_WEATHER_DATA = [
  {
    city: 'హైదరాబాద్',
    temp: 32,
    condition: 'పాక్షికంగా మేఘావృతం',
    icon: <CloudSun size={32} className="text-blue-400 flex-shrink-0" />,
    bg: 'from-blue-50/50 to-sky-50/30'
  },
  {
    city: 'రంగారెడ్డి',
    temp: 31,
    condition: 'ఉరుములతో కూడిన వర్షం',
    icon: <CloudRain size={32} className="text-blue-500 flex-shrink-0" />,
    bg: 'from-blue-50/50 to-indigo-50/30'
  },
  {
    city: 'నల్గొండ',
    temp: 34,
    condition: 'ఎండగా ఉంటుంది',
    icon: <Sun size={32} className="text-amber-500 flex-shrink-0" />,
    bg: 'from-amber-50/50 to-orange-50/30'
  },
  {
    city: 'వరంగల్',
    temp: 33,
    condition: 'పాక్షికంగా మేఘావృతం',
    icon: <Cloud size={32} className="text-gray-400 flex-shrink-0" />,
    bg: 'from-gray-50/50 to-blue-50/30'
  }
];

const getWeatherIcon = (condition: string, size = 32) => {
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

export default function WeatherWidget() {
  const [weatherList, setWeatherList] = useState<any[]>(STATIC_HOME_WEATHER_DATA);

  useEffect(() => {
    const handleResolveWeather = (weatherData: string | null) => {
      try {
        if (weatherData) {
          const customReports = JSON.parse(weatherData);
          const updated = STATIC_HOME_WEATHER_DATA.map((staticCity) => {
            const matched = customReports.find((c: any) => c.city === staticCity.city);
            if (matched) {
              return {
                ...staticCity,
                temp: matched.temp,
                condition: matched.condition,
                icon: getWeatherIcon(matched.condition, 32)
              };
            }
            return staticCity;
          });
          setWeatherList(updated);
        }
      } catch (e) {
        console.error('Error resolving weather widget data:', e);
      }
    };

    fetch('/api/settings?key=weather_page_reports_data&t=' + Date.now())
      .then(res => res.ok ? res.json() : {})
      .then((data: any) => {
        const weatherVal = data.weather_page_reports_data || null;
        handleResolveWeather(weatherVal);
      })
      .catch(() => {
        handleResolveWeather(null);
      });
  }, []);

  return (
    <div className="bg-white border border-gray-150 rounded-xl p-5 md:p-6 mb-3.5 md:mb-8 shadow-3xs select-none">
      {/* Title */}
      <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
          <h3 
            className="font-black text-blue-600 text-[17px] md:text-[20px] telugu-text pl-2.5" 
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            వెదర్
          </h3>
        </div>
        <Link 
          href="/weather" 
          className="hidden md:flex text-[15px] md:text-[16px] font-extrabold text-blue-500 hover:text-blue-700 items-center gap-0.5 transition-colors telugu-text"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          పూర్తి వివరాలు చూడండి →
        </Link>
      </div>

      {/* 2 in a Row Grid (2x2 Layout) */}
      <div className="grid grid-cols-2 gap-3.5 md:gap-5">
        {weatherList.map((data, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${data.bg} border border-gray-100 rounded-lg p-3 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-xs hover:border-blue-100 transition-all duration-200 min-w-0`}
          >
            <div className="space-y-1 text-left min-w-0 flex-1 md:mr-2">
              <h4 
                className="font-black text-[15.5px] md:text-[18px] text-gray-900 telugu-text leading-tight pl-2.5"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {data.city}
              </h4>
              <p 
                className="hidden md:block text-[12px] md:text-[14px] text-gray-500 font-bold telugu-text leading-tight pl-2.5"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {data.condition}
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0 mt-1 md:mt-0 pl-2.5 md:pl-0">
              <div className="flex-shrink-0">
                {data.icon}
              </div>
              <span className="text-[16px] md:text-[21px] font-black text-gray-800 font-sans tracking-tight whitespace-nowrap">
                {data.temp}°C
              </span>
            </div>

            <p 
              className="block md:hidden text-[11px] text-gray-500 font-bold telugu-text leading-tight mt-1.5 pl-2.5"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {data.condition}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile-only full button */}
      <div className="mt-4 block md:hidden">
        <Link 
          href="/weather" 
          className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg text-sm font-bold text-blue-600 flex items-center justify-center gap-1.5 transition-all active:scale-98 telugu-text"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          పూర్తి వెదర్ నివేదిక చూడండి
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
