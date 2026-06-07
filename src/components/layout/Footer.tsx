import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { categories } from '@/lib/mockData';

// Inline SVG social icons
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20.06 12 20.06 12 20.06s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function Footer() {
  const mainCategories = categories.slice(0, 8);
  const moreCategories = categories.slice(8);

  return (
    <footer className="bg-[#025390] text-blue-100 border-t border-brand-dark-blue">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex-shrink-0 inline-flex items-center mb-4 group bg-white p-2 rounded-lg">
              <Image
                src="/logo.jpg"
                alt="లోగో"
                width={140}
                height={40}
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-5 text-blue-200 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              ఈనాడు క్లోన్ - తెలుగు ప్రజలకు వేగవంతమైన, విశ్వసనీయమైన వార్తలు అందించే ప్రముఖ డిజిటల్ వార్తా వేదిక.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
                { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
                { icon: <YoutubeIcon />, href: '#', label: 'YouTube' },
                { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-hover-yellow hover:text-brand-dark-blue transition-colors text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories 1 */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 telugu-text border-l-4 border-hover-yellow pl-3"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              వర్గాలు
            </h3>
            <ul className="space-y-2 text-blue-200">
              {mainCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm hover:text-hover-yellow transition-colors telugu-text flex items-center gap-1.5"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories 2 */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 telugu-text border-l-4 border-hover-yellow pl-3"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              మరిన్ని వర్గాలు
            </h3>
            <ul className="space-y-2 text-blue-200">
              {moreCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm hover:text-hover-yellow transition-colors telugu-text flex items-center gap-1.5"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 telugu-text border-l-4 border-hover-yellow pl-3"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              సంప్రదించండి
            </h3>
            <ul className="space-y-3 text-blue-200">
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={14} className="text-hover-yellow mt-0.5 flex-shrink-0" />
                <span className="telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  రామోజీ ఫిల్మ్ సిటీ, అనస్పూర్ గ్రామం, హయాత్‌నగర్ మండలం, హైదరాబాద్ - 501512
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-hover-yellow flex-shrink-0" />
                <a href="tel:+914023456789" className="hover:text-hover-yellow transition-colors">+91-40-2345-6789</a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-hover-yellow flex-shrink-0" />
                <a href="mailto:news@eenadu.net" className="hover:text-hover-yellow transition-colors">news@eenadu.net</a>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-brand-dark-blue/40 rounded-lg border border-blue-800">
              <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">వార్తా సూచన</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="మీ ఇమెయిల్"
                  className="w-full sm:flex-1 bg-white/10 text-white placeholder-blue-300 text-xs px-3 py-2 rounded border border-blue-800 focus:border-hover-yellow outline-none"
                />
                <button className="w-full sm:w-auto bg-brand-red text-white text-xs px-3 py-2 rounded hover:bg-[#d00000] transition-colors font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#003e67] border-t border-brand-dark-blue/40 text-blue-200">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
            © 2026 ఈనాడు క్లోన్. అన్ని హక్కులు నిల్వ చేయబడ్డాయి.
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/privacy" className="hover:text-hover-yellow transition-colors telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>గోప్యత విధానం</Link>
            <Link href="/terms" className="hover:text-hover-yellow transition-colors telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>నిబంధనలు</Link>
            <Link href="/about" className="hover:text-hover-yellow transition-colors telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>మా గురించి</Link>
            <Link href="/contact" className="hover:text-hover-yellow transition-colors telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>సంప్రదింపు</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
