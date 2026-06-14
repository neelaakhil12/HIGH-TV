'use client';

import { useState, useEffect } from 'react';
import { X as XIcon } from 'lucide-react';

interface PromotionPopupProps {
  id?: 'home' | 'article';
}

export default function PromotionPopup({ id = 'home' }: PromotionPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [popupType, setPopupType] = useState<'ad' | 'poll'>('ad');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Dynamic configuration states
  const [adImage, setAdImage] = useState('/popup-ad.png');
  const [adLink, setAdLink] = useState('#');
  const [pollQuestion, setPollQuestion] = useState('కాంగ్రెస్‌లో టీఎన్ఎస్ పార్టీని విలీనం చేస్తారని మీరు భావిస్తున్నారా?');
  const [pollOptions, setPollOptions] = useState([
    { id: 'yes', text: 'అవును' },
    { id: 'no', text: 'కాదు' },
    { id: 'unsure', text: 'చెప్పలేం' }
  ]);

  const handleVoteSubmit = () => {
    if (selectedOption) {
      setHasVoted(true);
    }
  };

  useEffect(() => {
    // Read from localStorage to check popup configurations set in the admin panel for this specific ID
    const savedEnabled = localStorage.getItem(`promo_popup_${id}_enabled`);
    const savedType = localStorage.getItem(`promo_popup_${id}_type`);
    const savedAdImage = localStorage.getItem(`promo_ad_${id}_image`);
    const savedAdLink = localStorage.getItem(`promo_ad_${id}_link`);
    const savedPollQuestion = localStorage.getItem(`promo_poll_${id}_question`);
    const savedOptYes = localStorage.getItem(`promo_poll_${id}_option_yes`);
    const savedOptNo = localStorage.getItem(`promo_poll_${id}_option_no`);
    const savedOptUnsure = localStorage.getItem(`promo_poll_${id}_option_unsure`);

    const isActuallyEnabled = savedEnabled === null ? true : savedEnabled === 'true';
    setIsEnabled(isActuallyEnabled);

    if (savedType !== null) setPopupType(savedType as 'ad' | 'poll');
    if (savedAdImage !== null) setAdImage(savedAdImage);
    if (savedAdLink !== null) setAdLink(savedAdLink);
    if (savedPollQuestion !== null) setPollQuestion(savedPollQuestion);

    if (savedOptYes !== null || savedOptNo !== null || savedOptUnsure !== null) {
      setPollOptions([
        { id: 'yes', text: savedOptYes || 'అవును' },
        { id: 'no', text: savedOptNo || 'కాదు' },
        { id: 'unsure', text: savedOptUnsure || 'చెప్పలేం' }
      ]);
    }

    // Check session storage to show it once per session (specifically for this ID)
    const hasSeenPopup = sessionStorage.getItem(`hasSeenPromoPopup_${id}`);

    if (!hasSeenPopup && isActuallyEnabled) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(`hasSeenPromoPopup_${id}`, 'true');
      }, 1500); // 1.5 seconds delay on load
      return () => clearTimeout(timer);
    }
  }, [id]);

  if (!isOpen || !isEnabled) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      {/* Modal Container */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl border border-gray-150 w-full overflow-hidden relative animate-scale-up flex flex-col transition-all duration-300 ${
          popupType === 'ad' 
            ? 'max-w-[400px] lg:max-w-[760px] lg:w-[760px] lg:h-[556px]' 
            : 'max-w-[400px] lg:max-w-[420px] lg:w-[420px] h-auto'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - absolute positioning overlay */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors cursor-pointer z-20 lg:top-4 lg:right-4"
          aria-label="Close"
        >
          <XIcon size={14} strokeWidth={2.5} />
        </button>

        {/* Content body */}
        <div className="p-0 flex-1 overflow-y-auto lg:overflow-visible">
          {popupType === 'ad' ? (
            /* ══════════════ ADVERTISEMENT VIEW ══════════════ */
            <div className="w-full h-[380px] lg:h-full relative flex flex-col">
              <a 
                href={adLink}
                target={adLink === '#' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (adLink === '#') {
                    e.preventDefault();
                  }
                }}
                className="w-full h-full flex-1 block cursor-pointer"
              >
                <img 
                  src={adImage} 
                  alt="Advertisement"
                  className="w-full h-full object-cover select-none hover:opacity-95 transition-opacity"
                />
              </a>
              {/* AD indicator label */}
              <span className="absolute top-3 left-3 text-[9px] bg-black/60 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider select-none pointer-events-none z-10">
                AD
              </span>
            </div>
          ) : (
            /* ══════════════ POLL VIEW ══════════════ */
            <div className="p-5 text-left flex flex-col gap-4 w-full">
              {/* Poll Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-150">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-[#e60000] rounded-full"></div>
                  <h3 className="font-black text-gray-900 text-[16px] md:text-[18px] telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    తాజా పోల్స్
                  </h3>
                </div>
                <span className="text-[12px] font-bold text-gray-400 select-none mr-8">
                  {id === 'home' ? 'Home Poll' : 'Article Poll'}
                </span>
              </div>

              {/* Poll Body */}
              <div className="space-y-4 font-sans">
                <p 
                  className="text-[15.5px] font-black text-gray-850 leading-snug telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {pollQuestion}
                </p>

                {!hasVoted ? (
                  <div className="space-y-3">
                    {/* Options list */}
                    <div className="space-y-2.5">
                      {pollOptions.map((opt) => {
                        const isSelected = selectedOption === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedOption(opt.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full border text-left transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border-[#02599c] bg-blue-50/20 text-[#02599c] font-black'
                                : 'border-gray-200 text-gray-750 hover:border-gray-300 hover:bg-gray-50/40 font-bold'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'border-[#02599c]' : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#02599c]"></div>
                              )}
                            </div>
                            <span className="text-[15px] telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                              {opt.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleVoteSubmit}
                      disabled={!selectedOption}
                      className={`w-full text-white text-[15px] font-black py-2.5 rounded-full transition-all mt-4 cursor-pointer shadow-md text-center ${
                        selectedOption 
                          ? 'bg-[#0b2545] hover:bg-[#02599c] hover:scale-[1.01] active:scale-95' 
                          : 'bg-gray-300 cursor-not-allowed opacity-80'
                      }`}
                    >
                      Submit Vote
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5 animate-fade-in pt-1">
                    {/* Option 1 Results */}
                    <div>
                      <div className="flex justify-between text-[14px] font-bold text-gray-700 mb-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                        <span>{pollOptions[0]?.text || 'అవును'}</span>
                        <span className="font-sans">62%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-[#02599c] h-2 rounded-full transition-all duration-500 animate-slide-right" style={{ width: '62%' }}></div>
                      </div>
                    </div>

                    {/* Option 2 Results */}
                    <div>
                      <div className="flex justify-between text-[14px] font-bold text-gray-700 mb-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                        <span>{pollOptions[1]?.text || 'కాదు'}</span>
                        <span className="font-sans">28%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-red-500 h-2 rounded-full transition-all duration-500 animate-slide-right" style={{ width: '28%' }}></div>
                      </div>
                    </div>

                    {/* Option 3 Results */}
                    <div>
                      <div className="flex justify-between text-[14px] font-bold text-gray-700 mb-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                        <span>{pollOptions[2]?.text || 'చెప్పలేం'}</span>
                        <span className="font-sans">10%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-gray-450 h-2 rounded-full transition-all duration-500 animate-slide-right" style={{ width: '10%' }}></div>
                      </div>
                    </div>

                    <div 
                      className="text-center text-[12px] text-gray-500 font-bold mt-4 pt-1.5 border-t border-gray-50 telugu-text" 
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      మొత్తం ఓట్లు: 12,482
                    </div>
                  </div>
                )}

                {/* Footer Poll Active Badge */}
                <div className={`mt-4 py-1 px-4 text-center rounded-full text-[11px] font-black tracking-wider uppercase border select-none transition-colors ${
                  hasVoted 
                    ? 'bg-blue-50 text-[#02599c] border-blue-100' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  {hasVoted ? 'Vote Submitted' : 'Poll Active'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
