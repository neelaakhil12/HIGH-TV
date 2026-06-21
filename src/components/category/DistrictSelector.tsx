'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { District } from '@/lib/mockData';
import { ChevronDown, MapPin, Check } from 'lucide-react';

interface DistrictSelectorProps {
  category: string;
  districts: District[];
  activeDistrictSlug?: string;
}

export default function DistrictSelector({
  category,
  districts,
  activeDistrictSlug,
}: DistrictSelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeDistrict = districts.find((d) => d.slug === activeDistrictSlug);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    if (slug) {
      router.push(`/category/${category}?view=districts&district=${slug}`);
    } else {
      router.push(`/category/${category}?view=districts`);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#02599c] cursor-pointer font-extrabold telugu-text shadow-3xs w-48 transition-all"
        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
      >
        <span className="truncate flex items-center gap-1.5">
          <MapPin size={14} className="text-[#e60000] flex-shrink-0" />
          {activeDistrict ? activeDistrict.name : 'ఏ జిల్లా'}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-1.5 w-52 rounded-xl shadow-xl bg-white border border-gray-150 z-50 focus:outline-none animate-fade-in origin-top-right overflow-hidden"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          <div className="py-1 max-h-60 overflow-y-auto scrollbar-thin">
            <button
              onClick={() => handleSelect('')}
              className={`w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-[#02599c] flex items-center justify-between ${!activeDistrictSlug ? 'bg-blue-50/50 text-[#02599c]' : ''}`}
            >
              <span>అన్ని జిల్లాలు</span>
              {!activeDistrictSlug && <Check size={14} className="text-[#02599c]" />}
            </button>
            {districts.map((dist) => {
              const isActive = activeDistrictSlug === dist.slug;
              return (
                <button
                  key={dist.slug}
                  onClick={() => handleSelect(dist.slug)}
                  className={`w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-[#02599c] flex items-center justify-between transition-colors ${isActive ? 'bg-blue-50 text-[#02599c]' : ''}`}
                >
                  <span className="truncate">{dist.name}</span>
                  {isActive && <Check size={14} className="text-[#02599c]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
