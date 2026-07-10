'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

interface District {
  slug: string;
  name: string;
}

interface Props {
  state: string;
  currentSlug: string;
  districts: District[];
}

export default function DistrictDropdown({ state, currentSlug, districts }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = districts.find((d) => d.slug === currentSlug);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-[#025390] hover:bg-[#01437a] text-white font-bold text-[13px] md:text-[14px] telugu-text px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
      >
        <MapPin size={13} className="flex-shrink-0" />
        {current?.name || 'జిల్లా ఎంచుకోండి'}
        <ChevronDown size={13} className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel — 3 columns */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-[450px] max-w-[calc(100vw-2rem)] md:max-w-[560px] overflow-x-auto">
          <div className="min-w-[440px] md:min-w-[480px]">
            <p
              className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2 px-1"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              జిల్లా ఎంచుకోండి
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {districts.map((d) => {
                const isActive = d.slug === currentSlug;
                return (
                  <button
                    key={d.slug}
                    onClick={() => {
                      setOpen(false);
                      router.push(`/district/${state}/${d.slug}`);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-[13px] md:text-[15.5px] font-semibold telugu-text transition-all cursor-pointer truncate ${
                      isActive
                        ? 'bg-[#025390] text-white'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-[#025390]'
                    }`}
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    title={d.name}
                  >
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
