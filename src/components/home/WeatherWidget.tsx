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
    city: 'నల్గొండ',
    temp: 34,
    condition: 'ఎండగా ఉంటుంది',
    icon: <Sun size={24} className="text-amber-500" />,
    bg: 'from-amber-50/50 to-orange-50/30'
  }
];

export default function WeatherWidget() {
  return (
    <div className="bg-white border border-gray-150 rounded-xl p-4 mb-3.5 md:mb-8 shadow-3xs select-none">
      {/* Title */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
          <h3 
            className="font-black text-blue-600 text-[15px] md:text-base telugu-text" 
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            <span className="md:hidden">వాతావరణ సమాచారం</span>
            <span className="hidden md:inline">వాతావరణ సమాచారం (Weather Updates)</span>
          </h3>
        </div>
        <Link 
          href="/weather" 
          className="hidden md:flex text-sm font-extrabold text-blue-500 hover:text-blue-700 items-center gap-0.5 transition-colors telugu-text"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          పూర్తి వివరాలు చూడండి →
        </Link>
      </div>

      {/* Horizontally scrollable on mobile, Grid on desktop */}
      <div className="flex overflow-x-auto gap-3 pb-2.5 snap-x hide-scrollbar md:grid md:grid-cols-3 md:pb-0">
        {homeWeatherData.map((data, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${data.bg} border border-gray-100 rounded-lg p-2.5 flex items-center justify-between hover:shadow-xs hover:border-blue-100 transition-all duration-200 flex-shrink-0 w-[185px] snap-start md:w-auto min-w-0`}
          >
            <div className="space-y-0.5 text-left min-w-0 flex-1 mr-1.5">
              <h4 
                className="font-black text-[12px] md:text-[13px] text-gray-900 telugu-text leading-tight"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {data.city}
              </h4>
              <p 
                className="text-[10px] md:text-[11px] text-gray-500 font-bold telugu-text leading-tight"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {data.condition}
              </p>
            </div>
            
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <div className="scale-80 md:scale-90 flex-shrink-0">
                {data.icon}
              </div>
              <span className="text-[13px] md:text-base font-black text-gray-800 font-sans tracking-tight whitespace-nowrap ml-0.5">
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
