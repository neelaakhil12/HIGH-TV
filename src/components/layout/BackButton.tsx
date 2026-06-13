'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-[15px] px-3.5 py-2 rounded-lg border border-gray-200 cursor-pointer transition-colors shadow-3xs mb-4 select-none telugu-text"
      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
    >
      <ArrowLeft size={12} className="stroke-[3]" />
      వెనుకకు
    </button>
  );
}
