'use client';

import { useState, useEffect } from 'react';

const VOTED_STORAGE_KEY = 'navasakam_voted_polls';

const formatDateTelugu = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsIn: string;
  originalArticle?: any;
}

const defaultPolls: Poll[] = [];
const defaultMorePolls: Poll[] = [];

export default function PollWidget({ scope = 'general' }: { scope?: 'general' | 'article' }) {
  const [dbPolls, setDbPolls] = useState<Poll[]>([]);
  const [activeTab, setActiveTab] = useState<'latest' | 'more'>('latest');
  const [activePollIndex, setActivePollIndex] = useState(0);

  // voted: pollId -> optionId (persisted in localStorage)
  const [voted, setVoted] = useState<Record<string, string>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<Record<string, string>>({});
  // localVotes: optimistic UI vote counts before server confirms
  const [localVotes, setLocalVotes] = useState<Record<string, Record<string, number>>>({});

  // ── Load voted state from localStorage on mount ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VOTED_STORAGE_KEY);
      if (stored) {
        setVoted(JSON.parse(stored));
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // ── Fetch polls from DB ──
  useEffect(() => {
    fetch('/api/articles?category=polls&t=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const parsed = data.map((art: any) => {
            let options: PollOption[] = [];
            try {
              options = JSON.parse(art.body || '[]');
            } catch (e) {}
            return {
              id: art.id,
              question: art.title,
              options: options,
              totalVotes: options.reduce((sum, opt) => sum + (opt.votes || 0), 0),
              endsIn: art.description || 'రేపటి వరకు',
              originalArticle: art,
            };
          });
          setDbPolls(parsed);
        }
      })
      .catch((err) => console.error('Failed to load polls', err));
  }, []);

  // Filter dynamic database polls by scope
  // "general" = districtSlug is 'general', null, or empty (anything that is NOT explicitly 'article')
  // "article" = districtSlug is exactly 'article'
  const filteredDbPolls = dbPolls.filter((p) => {
    const distSlug = p.originalArticle?.districtSlug ?? '';
    const isArticlePoll = distSlug === 'article';
    return scope === 'article' ? isArticlePoll : !isArticlePoll;
  });

  const latestPollsList = filteredDbPolls.length > 0
    ? [filteredDbPolls[0]]
    : (scope === 'general' ? defaultPolls : []);
  const morePollsList = filteredDbPolls.length > 1
    ? [...filteredDbPolls.slice(1), ...defaultMorePolls]
    : (scope === 'general' ? defaultMorePolls : []);

  const currentPolls = activeTab === 'latest' ? latestPollsList : morePollsList;
  const poll = currentPolls[activePollIndex] ?? currentPolls[0];

  // If no poll available for this scope, render nothing
  if (!poll) return null;

  // ── Determine if poll has expired ──
  let isEnded = false;
  let friendlyEndsIn = poll.endsIn;

  if (poll.originalArticle?.description) {
    try {
      const parsed = JSON.parse(poll.originalArticle.description);
      if (parsed && parsed.startDate && parsed.endDate) {
        const today = new Date().toISOString().split('T')[0];
        isEnded = today > parsed.endDate;
        friendlyEndsIn = `${formatDateTelugu(parsed.startDate)} నుండి ${formatDateTelugu(parsed.endDate)} వరకు`;
        if (isEnded) {
          friendlyEndsIn = 'ముగిసింది (Ended)';
        }
      }
    } catch (e) {}
  }

  // ── A user "has voted" if: poll ended OR they previously submitted a vote ──
  const hasVoted = !!voted[poll.id] || isEnded;
  const userChoiceId = voted[poll.id] || selectedOptionId[poll.id];

  // ── Vote counts (merge optimistic local + server counts) ──
  const getVotes = (optionId: string): number => {
    const base = poll.options.find((o) => o.id === optionId)?.votes ?? 0;
    return base + (localVotes[poll.id]?.[optionId] ?? 0);
  };

  const getTotalVotes = (): number => {
    const sumOptions = poll.options.reduce((sum, opt) => sum + getVotes(opt.id), 0);
    return sumOptions > 0 ? sumOptions : poll.totalVotes;
  };

  // ── Handle vote submission ──
  const handleVote = async () => {
    const currentSelection = selectedOptionId[poll.id];
    if (!currentSelection || hasVoted) return;

    // 1. Mark as voted in state AND localStorage
    const newVoted = { ...voted, [poll.id]: currentSelection };
    setVoted(newVoted);
    try {
      localStorage.setItem(VOTED_STORAGE_KEY, JSON.stringify(newVoted));
    } catch (e) {
      // ignore quota errors
    }

    // 2. Optimistic local vote count
    setLocalVotes((prev) => ({
      ...prev,
      [poll.id]: {
        ...(prev[poll.id] ?? {}),
        [currentSelection]: (prev[poll.id]?.[currentSelection] ?? 0) + 1,
      },
    }));

    // 3. Persist to server in background
    if (poll.originalArticle) {
      const updatedOptions = poll.options.map((opt) =>
        opt.id === currentSelection ? { ...opt, votes: opt.votes + 1 } : opt
      );
      const updatedArticle = {
        ...poll.originalArticle,
        body: JSON.stringify(updatedOptions),
        views: poll.totalVotes + 1,
      };
      try {
        await fetch(`/api/articles/${poll.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedArticle),
        });
      } catch (err) {
        console.error('Failed to submit poll vote', err);
      }
    }
  };

  const handleTabChange = (tab: 'latest' | 'more') => {
    setActiveTab(tab);
    setActivePollIndex(0);
  };

  const totalVotes = getTotalVotes();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden select-none text-left">
      {/* Header Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => handleTabChange('latest')}
          className={`flex-1 py-2.5 text-[15px] font-black transition-colors duration-150 cursor-pointer
            ${activeTab === 'latest'
              ? 'bg-[#e60000] text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          తాజా పోల్స్
        </button>
        <button
          onClick={() => handleTabChange('more')}
          className={`flex-1 py-2.5 text-[15px] font-black transition-colors duration-150 cursor-pointer
            ${activeTab === 'more'
              ? 'bg-[#e60000] text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          మరిన్ని పోల్స్
        </button>
      </div>

      <div className="p-3.5">
        {/* Poll Navigation Dots (if multiple) */}
        {currentPolls.length > 1 && (
          <div className="flex gap-1.5 justify-center mb-3">
            {currentPolls.map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePollIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 cursor-pointer
                  ${i === activePollIndex ? 'bg-[#e60000]' : 'bg-gray-200 hover:bg-gray-300'}`}
              />
            ))}
          </div>
        )}

        {/* Question */}
        <p
          className="text-[16px] font-black text-gray-800 leading-snug mb-4 telugu-text"
          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
        >
          {poll.question}
        </p>

        {/* Options */}
        <div className="space-y-2.5">
          {poll.options.map((option) => {
            const votes = getVotes(option.id);
            const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            const isUserChoice = userChoiceId === option.id;
            const isWinner = hasVoted && votes === Math.max(...poll.options.map((o) => getVotes(o.id)));

            return (
              <div key={option.id}>
                {!hasVoted ? (
                  /* ── Voting state: radio button ── */
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all duration-150
                      ${selectedOptionId[poll.id] === option.id
                        ? 'border-[#e60000] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="radio"
                      name={`poll-${poll.id}`}
                      value={option.id}
                      checked={selectedOptionId[poll.id] === option.id}
                      onChange={() => setSelectedOptionId((prev) => ({ ...prev, [poll.id]: option.id }))}
                      className="w-4 h-4 accent-[#e60000] flex-shrink-0 cursor-pointer"
                    />
                    <span
                      className="text-[15px] font-bold text-gray-700 leading-snug telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      {option.label}
                    </span>
                  </label>
                ) : (
                  /* ── Results state: progress bar (shown permanently after voting) ── */
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[14.5px] font-black leading-snug telugu-text ${isUserChoice ? 'text-[#e60000]' : 'text-gray-700'}`}
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      >
                        {option.label}
                        {isUserChoice && <span className="ml-1 text-[11px]">✓</span>}
                      </span>
                      <span className={`text-[14.5px] font-black tabular-nums ${isWinner ? 'text-[#e60000]' : 'text-gray-500'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${isUserChoice ? 'bg-[#e60000]' : isWinner ? 'bg-red-300' : 'bg-gray-300'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 font-bold text-right tabular-nums">
                      {votes.toLocaleString('te-IN')} ఓట్లు
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4">
          {!hasVoted ? (
            <button
              onClick={handleVote}
              disabled={!selectedOptionId[poll.id]}
              className={`w-full py-2.5 rounded-lg text-[15px] font-black text-white transition-all duration-200 cursor-pointer
                ${selectedOptionId[poll.id]
                  ? 'bg-[#e60000] hover:bg-[#cc0000] shadow-sm hover:shadow-md active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              ఓటు వేయండి
            </button>
          ) : (
            <div className="text-center space-y-0.5">
              {!isEnded && voted[poll.id] && (
                <p
                  className="text-[13px] text-[#e60000] font-black telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  మీ ఓటు నమోదైంది ✓
                </p>
              )}
              <p
                className="text-[13px] text-gray-400 font-bold telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                మొత్తం ఓట్లు: <span className="text-gray-600 font-black">{totalVotes.toLocaleString('te-IN')}</span>
                &nbsp;•&nbsp;{friendlyEndsIn}
              </p>
            </div>
          )}
          {!hasVoted && selectedOptionId[poll.id] && (
            <p
              className="text-center mt-1.5 text-[12px] text-gray-400 telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {totalVotes.toLocaleString('te-IN')} మంది ఓటు వేశారు
            </p>
          )}
        </div>

        {/* Share Poll Section */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-[12px] font-bold text-gray-400">
            Share Poll
          </span>
          <div className="flex gap-2">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(poll.question)}%20${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + '/?pollId=' + poll.id : '')}`}
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
              href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + '/?pollId=' + poll.id : '')}&text=${encodeURIComponent(poll.question)}`}
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
                if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(window.location.origin + '/?pollId=' + poll.id);
                  alert('Poll link copied to clipboard!');
                }
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
      </div>
    </div>
  );
}
