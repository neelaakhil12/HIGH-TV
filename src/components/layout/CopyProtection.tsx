'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function CopyProtection() {
  const pathname = usePathname();
  const [isAdminPage, setIsAdminPage] = useState(true);

  useEffect(() => {
    const isControlPanel = pathname ? (
      pathname.startsWith('/admin') || 
      pathname.startsWith('/employee') || 
      pathname.startsWith('/superadmin')
    ) : false;
    
    setIsAdminPage(isControlPanel);

    if (isControlPanel) return;

    const handleCopyCut = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
      }
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'c' || key === 'a' || key === 'x' || key === 'u' || key === 's') {
          e.preventDefault();
        }
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
      }
    };

    document.addEventListener('copy', handleCopyCut);
    document.addEventListener('cut', handleCopyCut);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopyCut);
      document.removeEventListener('cut', handleCopyCut);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pathname]);

  if (isAdminPage) return null;

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      body * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    ` }} />
  );
}
