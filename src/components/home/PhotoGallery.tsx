'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Images, X, ZoomIn } from 'lucide-react';
import { galleryImages } from '@/lib/mockData';

export default function PhotoGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section className="mb-10">
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
        <Link href="/category/photos" className="text-xs font-semibold text-[#64748b] flex items-center gap-1">
          అన్నీ చూడండి →
        </Link>
      </div>

      {/* Masonry Grid */}
      <div className="masonry-grid">
        {galleryImages.map((img, index) => (
          <div
            key={img.id}
            className="masonry-item relative rounded-xl overflow-hidden group cursor-pointer img-zoom-container shadow-sm border border-gray-100"
            onClick={() => setLightbox(index)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={600}
              height={400}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium truncate telugu-text">{img.alt}</p>
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
            className="absolute top-4 right-4 text-white bg-white/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>
          <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={galleryImages[lightbox].src.replace('w=600', 'w=1200')}
              alt={galleryImages[lightbox].alt}
              width={1200}
              height={800}
              className="rounded-xl max-h-[85vh] w-auto object-contain"
            />
            <p className="text-white text-center mt-3 telugu-text font-medium" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              {galleryImages[lightbox].alt}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
