import Link from 'next/link';
import { CloudSun, Sun, SunDim, Thermometer, CloudRain, ArrowRight, Cloud } from 'lucide-react';

const homeWeatherData = [
  {
    city: 'హైదరాబాద్',
    temp: 32,
    condition: 'పాక్షికంగా మేఘావృతం',
    icon: <CloudSun size={24} className="text-blue-400" />,
    bg: 'from-blue-50/50 to-sky-50/30'
  },
  {
    city: 'రంగారెడ్డి',
    temp: 31,
    condition: 'ఉరుములతో కూడిన వర్షం',
    icon: <CloudRain size={24} className="text-blue-500" />,
    bg: 'from-blue-50/50 to-indigo-50/30'
  },
  {
    city: 'వరంగల్',
    temp: 33,
    condition: 'మేఘావృతం',
    icon: <Cloud size={24} className="text-gray-400" />,
    bg: 'from-gray-50/50 to-slate-50/30'
  },
  {
    city: 'ఖమ్మం',
    temp: 35,
    condition: 'ఎండగా ఉంటుంది',
    icon: <Sun size={24} className="text-amber-500" />,
    bg: 'from-amber-50/50 to-orange-50/30'
  }
];

export default function WeatherWidget() {
  return (
    <div className="bg-white border border-gray-150 rounded-xl p-4 mb-8 shadow-3xs select-none">
      {/* Title */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
          <h3 
            className="font-black text-blue-600 text-base telugu-text" 
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            వాతావరణ సమాచారం (Weather Updates)
          </h3>
        </div>
        <Link 
          href="/weather" 
          className="text-sm font-extrabold text-blue-500 hover:text-blue-700 flex items-center gap-0.5 transition-colors telugu-text"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          పూర్తి వివరాలు చూడండి →
        </Link>
      </div>

      {/* Grid of cities */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {homeWeatherData.map((data, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${data.bg} border border-gray-100 rounded-lg p-3 flex items-center justify-between hover:shadow-xs hover:border-blue-100 transition-all duration-200 min-w-0`}
          >
            <div className="space-y-1 text-left min-w-0 flex-1 mr-2">
              <h4 
                className="font-black text-[13px] text-gray-900 telugu-text leading-tight"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {data.city}
              </h4>
              <p 
                className="text-[11px] text-gray-500 font-bold telugu-text leading-tight"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {data.condition}
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="scale-90">{data.icon}</div>
              <span className="text-base font-black text-gray-800 font-sans tracking-tight whitespace-nowrap">
                {data.temp}°C
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile-only full button */}
      <div className="mt-3 block md:hidden">
        <Link 
          href="/weather" 
          className="w-full py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg text-sm font-bold text-blue-600 flex items-center justify-center gap-1.5 transition-all active:scale-98 telugu-text"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          పూర్తి వాతావరణ నివేదిక చూడండి
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
