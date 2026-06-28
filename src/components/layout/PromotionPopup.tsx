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

  // Dynamic configuration states
  const [adImage, setAdImage] = useState('/popup-ad.png');
  const [adLink, setAdLink] = useState('#');
  const [adOrientation, setAdOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [pollQuestion, setPollQuestion] = useState('కాంగ్రెస్‌లో టీఎన్ఎస్ పార్టీని విలీనం చేస్తారని మీరు భావిస్తున్నారా?');
  const [pollOptions, setPollOptions] = useState([
    { id: 'opt_0', text: 'అవును' },
    { id: 'opt_1', text: 'కాదు' }
  ]);

  const handleVoteSubmit = () => {
    if (selectedOption && pollVotes) {
      const updatedVotes = {
        ...pollVotes,
        [selectedOption]: (pollVotes[selectedOption] || 0) + 1
      };
      setPollVotes(updatedVotes);
      
      const votesKey = `promo_poll_${id}_votes_data`;
      localStorage.setItem(votesKey, JSON.stringify({ question: pollQuestion, votes: updatedVotes }));
      
      const hasVotedKey = `promo_poll_${id}_voted_for_${pollQuestion}`;
      localStorage.setItem(hasVotedKey, 'true');
      
      setHasVoted(true);
    }
  };

  useEffect(() => {
    // Read from localStorage to check popup configurations set in the admin panel for this specific ID
    const savedEnabled = localStorage.getItem(`promo_popup_${id}_enabled`);
    const savedType = localStorage.getItem(`promo_popup_${id}_type`);
    const savedAdImage = localStorage.getItem(`promo_ad_${id}_image`);
    const savedAdLink = localStorage.getItem(`promo_ad_${id}_link`);
    const savedAdOrientation = localStorage.getItem(`promo_ad_${id}_orientation`);
    const savedPollQuestion = localStorage.getItem(`promo_poll_${id}_question`);
    const savedOptYes = localStorage.getItem(`promo_poll_${id}_option_yes`);
    const savedOptNo = localStorage.getItem(`promo_poll_${id}_option_no`);
    const savedOptUnsure = localStorage.getItem(`promo_poll_${id}_option_unsure`);

    const isActuallyEnabled = savedEnabled === null ? true : savedEnabled === 'true';
    setIsEnabled(isActuallyEnabled);

    if (savedType !== null) setPopupType(savedType as 'ad' | 'poll');
    if (savedAdImage !== null) setAdImage(savedAdImage);
    if (savedAdLink !== null) setAdLink(savedAdLink);
    if (savedAdOrientation !== null) setAdOrientation(savedAdOrientation as 'horizontal' | 'vertical');
    
    const activeQuestion = savedPollQuestion || 'కాంగ్రెస్‌లో టీఎన్ఎస్ పార్టీని విలీనం చేస్తారని మీరు భావిస్తున్నారా?';
    setPollQuestion(activeQuestion);

    const savedOptions = localStorage.getItem(`promo_poll_${id}_options`);
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

    // Check if user has voted on this question
    const hasVotedKey = `promo_poll_${id}_voted_for_${activeQuestion}`;
    const userHasVoted = localStorage.getItem(hasVotedKey) === 'true';
    setHasVoted(userHasVoted);

    // Load or initialize vote counts
    const votesKey = `promo_poll_${id}_votes_data`;
    const savedVotesData = localStorage.getItem(votesKey);
    let votes: Record<string, number> = {};
    
    let parsedData: any = null;
    if (savedVotesData) {
      try {
        parsedData = JSON.parse(savedVotesData);
      } catch (e) {}
    }

    if (parsedData && parsedData.question === activeQuestion && userHasVoted) {
      votes = parsedData.votes;
    } else {
      // Initialize with exactly 0 votes if user has not voted yet or question changed
      votes = {};
      mappedOptions.forEach((opt) => {
        votes[opt.id] = 0;
      });
      localStorage.setItem(votesKey, JSON.stringify({ question: activeQuestion, votes }));
    }
    setPollVotes(votes);

    if (isActuallyEnabled) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 25000); // 25 seconds delay on load
      return () => clearTimeout(timer);
    }
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
                      ? 'w-full max-w-[95vw] md:w-[800px] md:max-w-[800px] lg:w-[950px] lg:max-w-[950px] max-h-[88vh]'
                      : 'w-full max-w-[95vw] md:w-[650px] md:max-w-[650px] lg:w-[750px] lg:max-w-[750px] max-h-[88vh]'
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
