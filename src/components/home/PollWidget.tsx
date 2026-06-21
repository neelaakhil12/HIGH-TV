'use client';

import { useState } from 'react';

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
}

const polls: Poll[] = [
  {
    id: 'poll-1',
    question: '2024 ఎన్నికల్లో తెలంగాణలో అధికారంలోకి ఎవరు వస్తారని మీరు అనుకుంటున్నారు?',
    options: [
      { id: 'a', label: 'కాంగ్రెస్ పార్టీ', votes: 3421 },
      { id: 'b', label: 'బీఆర్ఎస్', votes: 2108 },
      { id: 'c', label: 'బీజేపీ', votes: 987 },
      { id: 'd', label: 'ఇతరులు', votes: 312 },
    ],
    totalVotes: 6828,
    endsIn: 'రేపటి వరకు',
  },
  {
    id: 'poll-2',
    question: 'హైదరాబాద్‌లో మెట్రో విస్తరణ ప్రాజెక్ట్‌ను మీరు సమర్థిస్తున్నారా?',
    options: [
      { id: 'a', label: 'అవును, తప్పకుండా', votes: 5120 },
      { id: 'b', label: 'కాదు, అవసరం లేదు', votes: 890 },
      { id: 'c', label: 'ఆలోచించాలి', votes: 1340 },
    ],
    totalVotes: 7350,
    endsIn: '2 రోజుల వరకు',
  },
];

const morePollsData: Poll[] = [
  {
    id: 'poll-3',
    question: 'ఆంధ్రప్రదేశ్ రాజధాని విషయంలో మీ అభిప్రాయం ఏమిటి?',
    options: [
      { id: 'a', label: 'అమరావతి అభివృద్ధి', votes: 4210 },
      { id: 'b', label: 'మూడు రాజధానులు', votes: 2850 },
      { id: 'c', label: 'విశాఖపట్నం', votes: 1920 },
    ],
    totalVotes: 8980,
    endsIn: '3 రోజుల వరకు',
  },
];

export default function PollWidget() {
  const [activeTab, setActiveTab] = useState<'latest' | 'more'>('latest');
  const [activePollIndex, setActivePollIndex] = useState(0);
  const [voted, setVoted] = useState<Record<string, string>>({});
  const [localVotes, setLocalVotes] = useState<Record<string, Record<string, number>>>({});

  const currentPolls = activeTab === 'latest' ? polls : morePollsData;
  const poll = currentPolls[activePollIndex] ?? currentPolls[0];

  const hasVoted = !!voted[poll.id];
  const selectedOption = voted[poll.id];

  // Merge local votes with base
  const getVotes = (optionId: string): number => {
    const base = poll.options.find(o => o.id === optionId)?.votes ?? 0;
    return base + (localVotes[poll.id]?.[optionId] ?? 0);
  };
  const getTotalVotes = (): number => {
    return poll.totalVotes + (localVotes[poll.id] ? Object.values(localVotes[poll.id]).reduce((a, b) => a + b, 0) : 0);
  };

  const handleVote = () => {
    if (!selectedOption || hasVoted) return;
    setVoted(prev => ({ ...prev, [poll.id]: selectedOption }));
    setLocalVotes(prev => ({
      ...prev,
      [poll.id]: {
        ...(prev[poll.id] ?? {}),
        [selectedOption]: ((prev[poll.id]?.[selectedOption]) ?? 0) + 1,
      },
    }));
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
            const isSelected = selectedOption === option.id;
            const isWinner = hasVoted && votes === Math.max(...poll.options.map(o => getVotes(o.id)));

            return (
              <div key={option.id}>
                {!hasVoted ? (
                  /* Voting state: radio button */
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all duration-150
                      ${isSelected
                        ? 'border-[#e60000] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="radio"
                      name={`poll-${poll.id}`}
                      value={option.id}
                      checked={isSelected}
                      onChange={() => setVoted(prev => ({ ...prev, [poll.id]: option.id }))}
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
                  /* Results state: progress bar */
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[14.5px] font-black leading-snug telugu-text ${isSelected ? 'text-[#e60000]' : 'text-gray-700'}`}
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      >
                        {option.label}
                        {isSelected && <span className="ml-1 text-[11px]">✓</span>}
                      </span>
                      <span className={`text-[14.5px] font-black ${isWinner ? 'text-[#e60000]' : 'text-gray-500'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${isSelected ? 'bg-[#e60000]' : 'bg-gray-300'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
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
              disabled={!selectedOption}
              className={`w-full py-2.5 rounded-lg text-[15px] font-black text-white transition-all duration-200 cursor-pointer
                ${selectedOption
                  ? 'bg-[#e60000] hover:bg-[#cc0000] shadow-sm hover:shadow-md active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              ఓటు వేయండి
            </button>
          ) : (
            <div className="text-center">
              <p
                className="text-[13px] text-gray-400 font-bold telugu-text"
                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
              >
                మొత్తం ఓట్లు: <span className="text-gray-600 font-black">{totalVotes.toLocaleString('te-IN')}</span>
                &nbsp;•&nbsp;{poll.endsIn}
              </p>
            </div>
          )}
          {!hasVoted && selectedOption && (
            <p
              className="text-center mt-1.5 text-[12px] text-gray-400 telugu-text"
              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
            >
              {totalVotes.toLocaleString('te-IN')} మంది ఓటు వేశారు
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
