'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'article'>('home');

  // Form states
  const [enabled, setEnabled] = useState(true);
  const [popupType, setPopupType] = useState<'ad' | 'poll'>('ad');
  const [adImage, setAdImage] = useState('/popup-ad.png');
  const [adLink, setAdLink] = useState('#');
  const [pollQuestion, setPollQuestion] = useState('కాంగ్రెస్‌లో టీఎన్ఎస్ పార్టీని విలీనం చేస్తారని మీరు భావిస్తున్నారా?');
  const [optYes, setOptYes] = useState('అవును');
  const [optNo, setOptNo] = useState('కాదు');
  const [optUnsure, setOptUnsure] = useState('చెప్పలేం');
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load configuration from localStorage whenever activeTab changes
  useEffect(() => {
    const savedEnabled = localStorage.getItem(`promo_popup_${activeTab}_enabled`);
    const savedType = localStorage.getItem(`promo_popup_${activeTab}_type`);
    const savedAdImage = localStorage.getItem(`promo_ad_${activeTab}_image`);
    const savedAdLink = localStorage.getItem(`promo_ad_${activeTab}_link`);
    const savedPollQuestion = localStorage.getItem(`promo_poll_${activeTab}_question`);
    const savedOptYes = localStorage.getItem(`promo_poll_${activeTab}_option_yes`);
    const savedOptNo = localStorage.getItem(`promo_poll_${activeTab}_option_no`);
    const savedOptUnsure = localStorage.getItem(`promo_poll_${activeTab}_option_unsure`);

    // Default fallbacks depending on tab
    if (savedEnabled !== null) {
      setEnabled(savedEnabled === 'true');
    } else {
      setEnabled(true);
    }

    if (savedType !== null) {
      setPopupType(savedType as 'ad' | 'poll');
    } else {
      setPopupType('ad');
    }

    if (savedAdImage !== null) {
      setAdImage(savedAdImage);
    } else {
      setAdImage('/popup-ad.png');
    }

    if (savedAdLink !== null) {
      setAdLink(savedAdLink);
    } else {
      setAdLink('#');
    }

    if (savedPollQuestion !== null) {
      setPollQuestion(savedPollQuestion);
    } else {
      setPollQuestion('కాంగ్రెస్‌లో టీఎన్ఎస్ పార్టీని విలీనం చేస్తారని మీరు భావిస్తున్నారా?');
    }

    if (savedOptYes !== null) {
      setOptYes(savedOptYes);
    } else {
      setOptYes('అవును');
    }

    if (savedOptNo !== null) {
      setOptNo(savedOptNo);
    } else {
      setOptNo('కాదు');
    }

    if (savedOptUnsure !== null) {
      setOptUnsure(savedOptUnsure);
    } else {
      setOptUnsure('చెప్పలేం');
    }
  }, [activeTab]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');

    localStorage.setItem(`promo_popup_${activeTab}_enabled`, String(enabled));
    localStorage.setItem(`promo_popup_${activeTab}_type`, popupType);
    localStorage.setItem(`promo_ad_${activeTab}_image`, adImage);
    localStorage.setItem(`promo_ad_${activeTab}_link`, adLink);
    localStorage.setItem(`promo_poll_${activeTab}_question`, pollQuestion);
    localStorage.setItem(`promo_poll_${activeTab}_option_yes`, optYes);
    localStorage.setItem(`promo_poll_${activeTab}_option_no`, optNo);
    localStorage.setItem(`promo_poll_${activeTab}_option_unsure`, optUnsure);

    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  const resetSessionAndPreview = () => {
    sessionStorage.removeItem(`hasSeenPromoPopup_${activeTab}`);
    alert(`Popup show state reset for ${activeTab === 'home' ? 'Homepage' : 'Article page'}!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-12 px-4 select-none font-sans">
      <div className="max-w-[700px] w-full flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              ⚙️ High TV Admin Panel
            </h1>
            <p className="text-slate-400 text-sm mt-1">Configure Promotion Popups for Homepage and Article Pages independently.</p>
          </div>
          <Link 
            href="/"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors border border-slate-700 shadow-sm"
          >
            ← Homepage
          </Link>
        </div>

        {/* Scope Selector Tabs */}
        <div className="flex bg-slate-900/60 p-1 border border-slate-800 rounded-xl select-none">
          <button 
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex-1 text-center py-2.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'home' ? 'bg-[#02599c] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏠 Homepage Popup
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('article')}
            className={`flex-1 text-center py-2.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'article' ? 'bg-[#02599c] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📄 Article Page Popup
          </button>
        </div>

        {/* Config Container */}
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 animate-fade-in">
          
          <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800/50">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-extrabold text-white">Enable popup for {activeTab === 'home' ? 'Homepage' : 'Articles'}</span>
              <span className="text-xs text-slate-400">Toggle whether this popup is active.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={enabled} 
                onChange={(e) => setEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02599c]"></div>
            </label>
          </div>

          {enabled && (
            <>
              {/* Type Select */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Popup Content Style</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPopupType('ad')}
                    className={`py-3.5 px-4 rounded-xl border-2 font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      popupType === 'ad'
                        ? 'border-[#02599c] bg-[#02599c]/10 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    📢 Advertisement Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setPopupType('poll')}
                    className={`py-3.5 px-4 rounded-xl border-2 font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      popupType === 'poll'
                        ? 'border-[#02599c] bg-[#02599c]/10 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    📊 Voting Poll Card
                  </button>
                </div>
              </div>

              <div className="h-px bg-slate-800/80 my-2" />

              {popupType === 'ad' ? (
                /* ══════════════ AD SETTINGS ══════════════ */
                <div className="flex flex-col gap-4 animate-fade-in">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    📢 Advertisement Settings ({activeTab === 'home' ? 'Homepage' : 'Articles'})
                  </h3>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Ad Image URL</label>
                    <input 
                      type="text" 
                      value={adImage}
                      onChange={(e) => setAdImage(e.target.value)}
                      className="bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      placeholder="e.g. /popup-ad.png"
                    />
                    <span className="text-[10px] text-slate-500">Relative path (like <code>/popup-ad.png</code>) or an external image link.</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Ad Redirect Link</label>
                    <input 
                      type="text" 
                      value={adLink}
                      onChange={(e) => setAdLink(e.target.value)}
                      className="bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      placeholder="e.g. https://hightv.in"
                    />
                    <span className="text-[10px] text-slate-500">Redirect target when users click on the banner. Use <code>#</code> to disable redirect.</span>
                  </div>
                </div>
              ) : (
                /* ══════════════ POLL SETTINGS ══════════════ */
                <div className="flex flex-col gap-4 animate-fade-in">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    📊 Voting Poll Settings ({activeTab === 'home' ? 'Homepage' : 'Articles'})
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Poll Question (Telugu/English)</label>
                    <textarea 
                      rows={2}
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      placeholder="Enter the question text..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Option 1 Label</label>
                      <input 
                        type="text" 
                        value={optYes}
                        onChange={(e) => setOptYes(e.target.value)}
                        className="bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-2 text-sm outline-none transition-colors telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Option 2 Label</label>
                      <input 
                        type="text" 
                        value={optNo}
                        onChange={(e) => setOptNo(e.target.value)}
                        className="bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-2 text-sm outline-none transition-colors telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Option 3 Label</label>
                      <input 
                        type="text" 
                        value={optUnsure}
                        onChange={(e) => setOptUnsure(e.target.value)}
                        className="bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-2 text-sm outline-none transition-colors telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-850">
            <button
              type="button"
              onClick={resetSessionAndPreview}
              className="w-full md:w-auto text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 px-4 rounded-xl transition-all border border-slate-700 cursor-pointer text-center"
            >
              🔄 Reset Popup Show Session for {activeTab === 'home' ? 'Homepage' : 'Articles'}
            </button>
            <button
              type="submit"
              disabled={saveStatus === 'saving'}
              className={`w-full md:w-auto font-black text-sm py-3 px-6 rounded-xl transition-all cursor-pointer shadow-md text-center flex items-center justify-center min-w-[150px] ${
                saveStatus === 'saved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#02599c] hover:bg-[#024a82] text-white'
              }`}
            >
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'saved' && '✓ Configuration Saved!'}
              {saveStatus === 'idle' && 'Save Configurations'}
            </button>
          </div>

        </form>

        {/* Instructions Footer */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 text-xs text-slate-500 leading-relaxed">
          <p className="font-extrabold text-slate-400 mb-1">💡 Developer Instructions</p>
          <p>
            The Configurations for the <b>Homepage</b> and <b>Article Page</b> are isolated. You can configure one to show an ad and the other to show a poll. Use the selector tabs above to configure each view, and make sure to hit <b>Save Configurations</b> for each tab independently.
          </p>
        </div>

      </div>
    </div>
  );
}
