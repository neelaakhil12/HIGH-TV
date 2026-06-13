'use client';

import { useState } from 'react';
import { X as XIcon, MessageCircle, Link2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex items-center gap-1.5 select-none">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-[#25d366] text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
        title="WhatsApp"
      >
        <MessageCircle size={15} strokeWidth={2.5} />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-[#1877f2] text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
        title="Facebook"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      </a>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-[#0f1419] text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
        title="Twitter / X"
      >
        <XIcon size={13} strokeWidth={2.5} />
      </a>

      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-[#0088cc] text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
        title="Telegram"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0C5.347 0 0 5.348 0 11.947c0 6.598 5.347 11.947 11.944 11.947 6.598 0 11.948-5.349 11.948-11.947S18.542 0 11.944 0zm5.89 8.24l-1.974 9.297c-.148.653-.537.813-1.084.507l-3.007-2.213-1.452 1.395c-.161.161-.295.295-.606.295l.216-3.063 5.576-5.038c.242-.216-.053-.337-.375-.121L8.257 12.6l-2.969-.927c-.645-.202-.658-.645.135-.955l11.603-4.473c.537-.202 1.007.121.808 1.995z"/>
        </svg>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
        title={copied ? "Copied!" : "Copy Link"}
      >
        {copied ? <Check size={15} className="text-green-600" /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
