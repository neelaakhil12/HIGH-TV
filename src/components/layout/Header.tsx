'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Tv, Menu, X, ChevronDown } from 'lucide-react';
import { categories } from '@/lib/mockData';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b-2 border-[#66000c] sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <Image
              src="/logo.jpg"
              alt="హై టీవీ లోగో"
              width={160}
              height={48}
              priority
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="వార్తలు వెతకండి..."
                className="search-input w-full pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-full text-sm focus:border-[#66000c] transition-colors telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66000c] hover:text-[#4d0009]">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden text-gray-600 hover:text-[#66000c] transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Live TV Button */}
            <a
              href="#live-tv"
              className="flex items-center gap-1.5 bg-[#66000c] text-white font-bold px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-[#4d0009] transition-colors shadow-md"
            >
              <Tv size={14} />
              <span className="hidden sm:inline telugu-text">లైవ్ TV</span>
              <span className="sm:hidden">Live</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-600 hover:text-[#66000c] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="వార్తలు వెతకండి..."
                className="search-input w-full pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-full text-sm focus:border-[#66000c] transition-colors"
                autoFocus
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66000c]">
                <Search size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Category Nav */}
      <div className="hidden md:block bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4">
          <nav className="flex items-center gap-0 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex-shrink-0 px-3.5 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#66000c] hover:bg-red-50 transition-colors relative group telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {cat.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#66000c] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 max-h-[70vh] overflow-y-auto">
          <nav className="flex flex-col">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-sm font-semibold text-gray-700 hover:text-[#66000c] hover:bg-red-50 border-b border-gray-50 transition-colors telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
