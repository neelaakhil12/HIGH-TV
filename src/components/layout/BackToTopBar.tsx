'use client';

export default function BackToTopBar() {
  return (
    <div className="bg-[#013d6b] border-b border-[#025390]/60">
      <div className="max-w-[1050px] mx-auto px-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-white font-bold text-base hover:bg-white/10 transition-colors cursor-pointer group"
        >
          <span className="text-lg group-hover:-translate-y-0.5 transition-transform duration-150">▲</span>
          <span className="telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>పైకి వెళ్ళండి</span>
        </button>
      </div>
    </div>
  );
}
