'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Images, X, ZoomIn } from 'lucide-react';
import { galleryImages } from '@/lib/mockData';

interface PhotoItem {
  id: string;
  title: string;
  image?: string | null;
}

export default function PhotoGallery({ photos = [] }: { photos?: PhotoItem[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = (photos || []).map(p => ({
    id: p.id,
    src: p.image || '/hightv_breaking.png',
    alt: p.title
  }));

  if (items.length === 0) return null;

  const displayItems = items.slice(0, 4);

  return (
    <section className="mb-10 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#64748b] rounded-full"></div>
          <div className="flex items-center gap-2">
            <Images size={20} className="text-[#64748b]" />
            <h2
              className="text-xl md:text-2xl font-black text-[#64748b] telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              ఫోటో గ్యాలరీ
            </h2>
          </div>
        </div>
        <Link href="/category/photos" className="text-sm font-semibold text-[#64748b] flex items-center gap-1">
          అన్నీ చూడండి →
        </Link>
      </div>

      <div className="flex md:grid md:grid-cols-4 overflow-x-auto md:overflow-x-visible gap-4 pb-2.5 md:pb-0 snap-x snap-mandatory scroll-smooth hide-scrollbar">
        {displayItems.map((img, index) => (
          <div
            key={img.id}
            className="flex-shrink-0 w-[140px] aspect-[9/16] md:w-auto md:aspect-auto md:h-48 rounded-none overflow-hidden group cursor-pointer img-zoom-container shadow-sm border border-gray-100 snap-start relative"
            onClick={() => setLightbox(index)}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-medium telugu-text">{img.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/25 hover:bg-white/35 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>
          <div className="max-w-4xl max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={items[lightbox].src}
              alt={items[lightbox].alt}
              className="rounded-xl max-h-[85vh] max-w-full object-contain"
            />
            <p className="text-white text-center mt-3 telugu-text font-medium" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              {items[lightbox].alt}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
