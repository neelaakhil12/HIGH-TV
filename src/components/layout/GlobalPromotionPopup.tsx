'use client';

import { usePathname } from 'next/navigation';
import PromotionPopup from './PromotionPopup';

export default function GlobalPromotionPopup() {
  const pathname = usePathname();

  // Do not show the popup on the admin configurations page
  if (pathname === '/admin') {
    return null;
  }

  // Homepage uses the 'home' popup settings
  if (pathname === '/') {
    return <PromotionPopup id="home" />;
  }

  // All other pages (news articles, category feeds, reporter profiles, etc.) use the 'article' popup settings
  return <PromotionPopup id="article" />;
}
