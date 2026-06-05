export default function AdBanner({ position = 'leaderboard' }: { position?: 'leaderboard' | 'sidebar' | 'rectangle' }) {
  if (position === 'sidebar') {
    return (
      <div className="ad-placeholder rounded-lg flex flex-col items-center justify-center p-4 text-center" style={{ height: '250px' }}>
        <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">వ్యాపార ప్రకటన</div>
        <div className="text-gray-300 text-4xl font-black mb-1">AD</div>
        <div className="text-gray-400 text-xs">300 × 250</div>
        <div className="mt-3 text-gray-400 text-xs">ప్రకటనకు సంప్రదించండి</div>
        <a href="mailto:ads@hightv.com" className="mt-2 text-[#66000c] text-xs font-semibold hover:underline">
          ads@hightv.com
        </a>
      </div>
    );
  }

  if (position === 'rectangle') {
    return (
      <div className="ad-placeholder rounded-lg flex items-center justify-center p-4 text-center w-full" style={{ height: '90px' }}>
        <div>
          <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold">వ్యాపార ప్రకటన - 728 × 90</div>
        </div>
      </div>
    );
  }

  // leaderboard
  return (
    <div className="ad-placeholder rounded-lg flex items-center justify-center p-4 text-center w-full mb-6" style={{ height: '100px' }}>
      <div>
        <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">వ్యాపార ప్రకటన</div>
        <div className="text-gray-300 text-sm">728 × 90 Leaderboard</div>
      </div>
    </div>
  );
}
