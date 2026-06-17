'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages } from '@/lib/mockData';

export default function PhotosPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="select-none">
      {/* Grid of Photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((img, index) => (
          <div
            key={img.id}
            className="flex flex-col group cursor-pointer bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
            onClick={() => setLightboxIndex(index)}
          >
            {/* Image Wrapper */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-50 border-b border-gray-100">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Zoom overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            {/* Caption below the card */}
            <div className="p-3 bg-gray-50/50">
              <p
                className="text-[14px] font-bold text-gray-800 group-hover:text-brand-blue leading-snug telugu-text text-center"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {img.alt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer z-50"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close Lightbox"
          >
            <X size={20} />
          </button>

          {/* Nav Arrows */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-40">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center pointer-events-auto hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center pointer-events-auto hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Image Container */}
          <div className="max-w-4xl max-h-[80vh] w-full flex items-center justify-center relative px-8" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[lightboxIndex].src.replace('w=600', 'w=1200')}
              alt={galleryImages[lightboxIndex].alt}
              className="rounded-xl max-h-[75vh] max-w-full object-contain shadow-2xl border border-white/10"
            />
          </div>

          {/* Caption text */}
          <div className="mt-4 text-center px-4" onClick={(e) => e.stopPropagation()}>
            <p
              className="text-white text-base md:text-lg font-black telugu-text max-w-xl"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {galleryImages[lightboxIndex].alt}
            </p>
            <span className="text-[11px] text-gray-400 font-bold mt-1 block font-sans uppercase tracking-widest">
              Photo {lightboxIndex + 1} of {galleryImages.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
