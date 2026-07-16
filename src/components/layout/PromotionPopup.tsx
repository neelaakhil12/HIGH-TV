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
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({});
  const [customDbPoll, setCustomDbPoll] = useState<any | null>(null);

  // Dynamic configuration states
  const [adImage, setAdImage] = useState('/popup-ad.png');
  const [adLink, setAdLink] = useState('#');
  const [adOrientation, setAdOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [pollQuestion, setPollQuestion] = useState('కాంగ్రెస్‌లో టీఎన్ఎస్ పార్టీని విలీనం చేస్తారని మీరు భావిస్తున్నారా?');
  const [pollOptions, setPollOptions] = useState([
    { id: 'opt_0', text: 'అవును' },
    { id: 'opt_1', text: 'కాదు' }
  ]);

  const handleVoteSubmit = async () => {
    if (selectedOption && pollVotes) {
      const updatedVotes = {
        ...pollVotes,
        [selectedOption]: (pollVotes[selectedOption] || 0) + 1
      };
      setPollVotes(updatedVotes);

      if (customDbPoll) {
        let options: any[] = [];
        try {
          options = JSON.parse(customDbPoll.body || '[]');
        } catch (e) {}
        
        const updatedOptions = options.map((opt: any) =>
          opt.id === selectedOption ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
        );
        
        const updatedArticle = {
          ...customDbPoll,
          body: JSON.stringify(updatedOptions),
          views: (customDbPoll.views || 0) + 1
        };
        
        try {
          await fetch(`/api/articles/${customDbPoll.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedArticle)
          });
        } catch (err) {
          console.error('Failed to submit dynamic poll vote:', err);
        }
        
        const hasVotedKey = `promo_poll_db_${customDbPoll.id}_voted`;
        try { localStorage.setItem(hasVotedKey, 'true'); } catch {}
        setHasVoted(true);
      } else {
        // Save vote counts to database (shared across all profiles/users)
        const votesKey = `promo_poll_${id}_votes_data`;
        fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            [votesKey]: JSON.stringify({ question: pollQuestion, votes: updatedVotes })
          }),
        }).catch(err => console.error('Error saving poll votes:', err));

        // Mark this browser as having voted (per-browser state — localStorage is correct here)
        const hasVotedKey = `promo_poll_${id}_voted_for_${pollQuestion}`;
        try { localStorage.setItem(hasVotedKey, 'true'); } catch {}

        setHasVoted(true);
      }
    }
  };

  useEffect(() => {
    // 1. Check if pollId query parameter exists in the URL
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlPollId = searchParams.get('pollId');
      if (urlPollId) {
        if (urlPollId.startsWith('promo_')) {
          const promoType = urlPollId.replace('promo_', '');
          if (promoType === id) {
            setTimeout(() => {
              setPopupType('poll');
              setIsOpen(true);
            }, 500);
          }
        } else {
          // Fetch dynamic database poll
          fetch(`/api/articles/${urlPollId}`)
            .then(res => res.ok ? res.json() : null)
            .then(art => {
              if (art && art.categorySlug === 'polls') {
                let options: any[] = [];
                try {
                  options = JSON.parse(art.body || '[]');
                } catch (e) {}
                
                setPopupType('poll');
                setPollQuestion(art.title);
                setPollOptions(options.map((opt: any, idx: number) => ({
                  id: opt.id || `opt_${idx}`,
                  text: opt.label || opt.text
                })));
                
                const votes: Record<string, number> = {};
                options.forEach(opt => {
                  votes[opt.id] = opt.votes || 0;
                });
                setPollVotes(votes);
                
                const hasVotedKey = `promo_poll_db_${art.id}_voted`;
                let userHasVoted = false;
                try { userHasVoted = localStorage.getItem(hasVotedKey) === 'true'; } catch {}
                setHasVoted(userHasVoted);
                
                setCustomDbPoll(art);
                setIsEnabled(true);
                setIsOpen(true);
              }
            })
            .catch(err => console.error('Error fetching shared poll:', err));
          return;
        }
      }
    }

    const keys = [
      `promo_popup_${id}_enabled`,
      `promo_popup_${id}_type`,
      `promo_ad_${id}_image`,
      `promo_ad_${id}_link`,
      `promo_ad_${id}_orientation`,
      `promo_poll_${id}_question`,
      `promo_poll_${id}_option_yes`,
      `promo_poll_${id}_option_no`,
      `promo_poll_${id}_option_unsure`,
      `promo_poll_${id}_options`,
      `promo_poll_${id}_votes_data`,
    ];

    fetch(`/api/settings?keys=${keys.join(',')}&t=` + Date.now())
      .then(res => res.ok ? res.json() : {})
      .then((dbSettings: any) => {
        const getSetting = (key: string, defaultValue: string | null = null) => {
          if (dbSettings[key] !== undefined && dbSettings[key] !== null) return dbSettings[key];
          return defaultValue;
        };

        const savedEnabled = getSetting(`promo_popup_${id}_enabled`);
        const savedType = getSetting(`promo_popup_${id}_type`);
        const savedAdImage = getSetting(`promo_ad_${id}_image`);
        const savedAdLink = getSetting(`promo_ad_${id}_link`);
        const savedAdOrientation = getSetting(`promo_ad_${id}_orientation`);
        const savedPollQuestion = getSetting(`promo_poll_${id}_question`);
        const savedOptYes = getSetting(`promo_poll_${id}_option_yes`);
        const savedOptNo = getSetting(`promo_poll_${id}_option_no`);
        const savedOptUnsure = getSetting(`promo_poll_${id}_option_unsure`);

        const isActuallyEnabled = savedEnabled === null ? true : savedEnabled === 'true';
        setIsEnabled(isActuallyEnabled);

        if (savedType !== null) setPopupType(savedType as 'ad' | 'poll');
        if (savedAdImage !== null && savedAdImage.trim() !== '') setAdImage(savedAdImage);
        if (savedAdLink !== null) setAdLink(savedAdLink);
        if (savedAdOrientation !== null) setAdOrientation(savedAdOrientation as 'horizontal' | 'vertical');
        
        const activeQuestion = savedPollQuestion || 'కాంగ్రెస్‌లో టీఎన్ఎస్ పార్టీని విలీనం చేస్తారని మీరు భావిస్తున్నారా?';
        setPollQuestion(activeQuestion);

        const savedOptions = getSetting(`promo_poll_${id}_options`);
        let optsList: string[] = ['అవును', 'కాదు'];
        if (savedOptions) {
          try {
            optsList = JSON.parse(savedOptions);
          } catch (e) {}
        } else {
          if (savedOptYes || savedOptNo || savedOptUnsure) {
            optsList = [];
            if (savedOptYes) optsList.push(savedOptYes);
            if (savedOptNo) optsList.push(savedOptNo);
            if (savedOptUnsure) optsList.push(savedOptUnsure);
          }
        }
        const mappedOptions = optsList.map((text, index) => ({
          id: `opt_${index}`,
          text
        }));
        setPollOptions(mappedOptions);

        // Check if this browser has voted (per-browser localStorage — intentional)
        const hasVotedKey = `promo_poll_${id}_voted_for_${activeQuestion}`;
        let userHasVoted = false;
        try { userHasVoted = localStorage.getItem(hasVotedKey) === 'true'; } catch {}
        setHasVoted(userHasVoted);

        // Load vote counts from database (shared across all users/profiles)
        const savedVotesData = getSetting(`promo_poll_${id}_votes_data`);
        let votes: Record<string, number> = {};

        if (savedVotesData) {
          try {
            const parsedData = JSON.parse(savedVotesData);
            if (parsedData && parsedData.question === activeQuestion && parsedData.votes) {
              votes = parsedData.votes;
            }
          } catch (e) {}
        }

        // If no valid vote data, initialise zeros
        if (Object.keys(votes).length === 0) {
          mappedOptions.forEach((opt) => { votes[opt.id] = 0; });
        }
        setPollVotes(votes);

        if (isActuallyEnabled) {
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 25000); // 25 seconds delay on load
          return () => clearTimeout(timer);
        }
      })
      .catch(err => console.error('Error fetching popup settings:', err));
  }, [id]);

  if (!isOpen || !isEnabled) return null;

  const totalVotes = Object.values(pollVotes).reduce((sum, val) => sum + val, 0);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      {/* Modal Container */}
      <div 
        className={`bg-white rounded-lg shadow-2xl border border-gray-150 overflow-hidden relative animate-scale-up flex flex-col transition-all duration-300 max-h-[95vh] mx-auto ${
          popupType === 'ad' 
            ? 'w-fit h-fit'
            : 'max-w-[480px] lg:max-w-[500px] lg:w-[500px] w-full h-auto'
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
        <div className={`p-0 flex-1 overflow-y-auto h-auto ${
          popupType === 'ad' ? 'w-fit mx-auto' : 'w-full'
        }`}>
          {popupType === 'ad' ? (
            /* ══════════════ ADVERTISEMENT VIEW ══════════════ */
            <div className="w-fit h-auto relative flex flex-col mx-auto">
              <a 
                href={adLink}
                target={adLink === '#' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (adLink === '#') {
                    e.preventDefault();
                  }
                }}
                className="w-fit h-auto block cursor-pointer mx-auto"
              >
                <img 
                  src={adImage} 
                  alt="Advertisement"
                  className={`h-auto object-contain mx-auto select-none hover:opacity-95 transition-opacity block ${
                    adOrientation === 'horizontal'
                      ? 'w-full max-w-[95vw] md:w-[800px] md:max-w-[800px] lg:w-[900px] lg:max-w-[900px] md:max-h-none max-h-[85vh]'
                      : 'w-full max-w-[95vw] md:w-[600px] md:max-w-[600px] lg:w-[700px] lg:max-w-[700px] md:max-h-none max-h-[85vh]'
                  }`}
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
                    {pollOptions.map((opt, index) => {
                      const votesForOpt = pollVotes[opt.id] || 0;
                      const pct = totalVotes > 0 ? Math.round((votesForOpt / totalVotes) * 100) : 0;
                      
                      const colors = ['bg-[#02599c]', 'bg-red-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500', 'bg-gray-450'];
                      const progressColor = colors[index % colors.length];

                      return (
                        <div key={opt.id}>
                          <div className="flex justify-between text-[14px] font-bold text-gray-700 mb-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                            <span>{opt.text}</span>
                            <span className="font-sans">{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className={`${progressColor} h-2 rounded-full transition-all duration-500 animate-slide-right`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}

                    <div 
                      className="text-center text-[12px] text-gray-500 font-bold mt-4 pt-1.5 border-t border-gray-50 telugu-text" 
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      మొత్తం ఓట్లు: {totalVotes.toLocaleString('te-IN')}
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

                {/* Share Poll Section */}
                {(() => {
                  const pollIdToShare = customDbPoll ? customDbPoll.id : `promo_${id}`;
                  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?pollId=${pollIdToShare}` : '';
                  return (
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-[12px] font-bold text-gray-400">
                        Share Poll
                      </span>
                      <div className="flex gap-2">
                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(pollQuestion)}%20${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-[#25d366] text-white hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                          title="WhatsApp"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                          </svg>
                        </a>
                        {/* Telegram */}
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(pollQuestion)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0088cc] text-white hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                          title="Telegram"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0C5.347 0 0 5.348 0 11.947c0 6.598 5.347 11.947 11.944 11.947 6.598 0 11.948-5.349 11.948-11.947S18.542 0 11.944 0zm5.89 8.24l-1.974 9.297c-.148.653-.537.813-1.084.507l-3.007-2.213-1.452 1.395c-.161.161-.295.295-.606.295l.216-3.063 5.576-5.038c.242-.216-.053-.337-.375-.121L8.257 12.6l-2.969-.927c-.645-.202-.658-.645.135-.955l11.603-4.473c.537-.202 1.007.121.808 1.995z"/>
                          </svg>
                        </a>
                        {/* Copy Link */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shareUrl);
                            alert('Poll link copied to clipboard!');
                          }}
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-150 text-gray-600 hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                          title="Copy Link"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
