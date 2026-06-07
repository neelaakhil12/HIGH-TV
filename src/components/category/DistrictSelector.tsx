'use client';

import { useRouter } from 'next/navigation';
import { District } from '@/lib/mockData';

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

  return (
    <select
      className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white text-gray-700 outline-none focus:border-[#02599c] focus:ring-1 focus:ring-[#02599c] cursor-pointer font-extrabold telugu-text shadow-3xs"
      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
      value={activeDistrictSlug || ''}
      onChange={(e) => {
        const val = e.target.value;
        if (val) {
          router.push(`/category/${category}?view=districts&district=${val}`);
        } else {
          router.push(`/category/${category}?view=districts`);
        }
      }}
    >
      <option value="" className="font-bold">ఏ జిల్లా</option>
      {districts.map((dist) => (
        <option key={dist.slug} value={dist.slug} className="font-bold">
          {dist.name}
        </option>
      ))}
    </select>
  );
}
