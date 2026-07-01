'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Trash2, 
  Plus, 
  Video, 
  Megaphone, 
  FileText, 
  Image as ImageIcon, 
  BarChart3, 
  LogOut, 
  Settings, 
  Tv, 
  Info,
  LayoutDashboard,
  Upload,
  Calendar,
  User,
  Users,
  Eye,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Pencil,
  ArrowLeft,
  Search,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Eraser,
  Type,
  Maximize2,
  Globe,
  Sliders,
  FileCheck,
  TrendingUp,
  CloudSun,
  Sparkles,
  Layers,
  ArrowUp,
  ArrowDown,
  MapPin,
  MonitorSmartphone,
  ToggleLeft,
  ToggleRight,
  Link2,
  ImagePlay,
  Zap,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

import { 
  politicsNews,
  entertainmentNews,
  sportsNews,
  technologyNews,
  businessNews,
  healthNews,
  viralNews,
  rasipalaluNews,
  adyathmikamNews,
  sampadakiyamNews,
  womenNews,
  lifestyleNews,
  districtNews,
  vidyaNews,
  admissionsNews,
  currentAffairsNews,
  upadiNews,
  notificationNews,
  webstoriesNews,
  antharmadanamNews,
  getMergedArticles,
  apDistricts,
  tgDistricts,
  featuredNews,
  videoNews
} from '@/lib/mockData';

import { ZodiacIcon } from '@/components/astrology/HoroscopePageClient';

// Main 22 Pages/Categories List (excluding subpages and editorial which has its own tab)
const MAIN_CATEGORIES_LIST = [
  { slug: 'latest', name: 'బ్రేకింగ్ న్యూస్ (Breaking)' },
  { slug: 'trending', name: 'ట్రెండింగ్ వార్తలు (Trending)' },
  { slug: 'featured', name: 'ముఖ్య వార్తలు (Featured)' },
  { slug: 'politics', name: 'పాలిటిక్స్ (Politics)' },
  { slug: 'national', name: 'నేషనల్ (National)' },
  { slug: 'international', name: 'వరల్డ్ (World)' },
  { slug: 'business', name: 'బిజినెస్ (Business)' },
  { slug: 'entertainment', name: 'ఫిల్మ్ (Entertainment)' },
  { slug: 'sports', name: 'స్పోర్ట్స్ (Sports)' },
  { slug: 'technology', name: 'టెక్నాలజీ (Technology)' },
  { slug: 'viral', name: 'వైరల్ (Viral)' },
  { slug: 'lifestyle', name: 'లైఫ్ స్టైల్ (Lifestyle)' },
  { slug: 'rasipalalu', name: 'శుభఫలాలు (Astrology)' },
  { slug: 'webstories', name: 'వెబ్ స్టోరీస్ (Web Stories)' },
  { slug: 'women', name: 'ఆమె (Women)' },
  { slug: 'antharmadanam', name: 'వ్యక్తిత్వ వికాసం (Opinion)' },
  { slug: 'adyathmikam', name: 'దైవం (Devotional)' },
  { slug: 'citizen-reporter', name: 'సిటిజన్ రిపోర్టర్' },
  { slug: 'weather', name: 'వెదర్' },
  { slug: 'epaper', name: 'ఈ-పేపర్' },
];

function MiniWysiwygToolbar({ editorRef }: { editorRef: React.RefObject<HTMLDivElement | null> }) {
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
          savedRangeRef.current = range.cloneRange();
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [editorRef]);

  const restoreSelection = () => {
    if (!savedRangeRef.current) return;
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(savedRangeRef.current);
    }
  };

  const handleFormatCmd = (command: string, value: string = '') => {
    restoreSelection();
    document.execCommand(command, false, value);
    // Maintain selection tracking after text change
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
    editorRef.current?.focus();
  };

  const handleFontSizeCmd = (size: string) => {
    if (!size) return;
    restoreSelection();
    applySelectedFontSize(editorRef.current, size);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
    editorRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 border-b-0 rounded-t-xl px-2.5 py-1.5 flex-wrap select-none">
      {/* Format block select */}
      <select
        onChange={(e) => {
          handleFormatCmd('formatBlock', e.target.value);
          e.target.value = '';
        }}
        className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-650 outline-none cursor-pointer"
      >
        <option value="">Format</option>
        <option value="p">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      {/* Font Size select */}
      <select
        onChange={(e) => {
          handleFontSizeCmd(e.target.value);
          e.target.value = '';
        }}
        className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-650 outline-none cursor-pointer"
      >
        <option value="">Size</option>
        <option value="12px">12 px</option>
        <option value="14px">14 px</option>
        <option value="16px">16 px</option>
        <option value="18px">18 px</option>
        <option value="20px">20 px</option>
        <option value="24px">24 px</option>
      </select>

      <div className="w-px h-4 bg-slate-200 mx-0.5" />

      {/* Formatting buttons */}
      <button type="button" onClick={() => handleFormatCmd('bold')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-600" title="Bold"><Bold className="w-3 h-3" /></button>
      <button type="button" onClick={() => handleFormatCmd('italic')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-600" title="Italic"><Italic className="w-3 h-3" /></button>
      <button type="button" onClick={() => handleFormatCmd('underline')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-600" title="Underline"><Underline className="w-3 h-3" /></button>
      <button type="button" onClick={() => handleFormatCmd('strikeThrough')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-600" title="Strikethrough"><Strikethrough className="w-3 h-3" /></button>

      <div className="w-px h-4 bg-slate-200 mx-0.5" />

      {/* Lists */}
      <button type="button" onClick={() => handleFormatCmd('insertUnorderedList')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-600" title="Bullet List"><List className="w-3 h-3" /></button>
      <button type="button" onClick={() => handleFormatCmd('insertOrderedList')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-600" title="Number List"><ListOrdered className="w-3 h-3" /></button>

      <div className="w-px h-4 bg-slate-200 mx-0.5" />

      {/* Alignment */}
      <button type="button" onClick={() => handleFormatCmd('justifyLeft')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-600" title="Align Left"><AlignLeft className="w-3 h-3" /></button>
      <button type="button" onClick={() => handleFormatCmd('justifyCenter')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-600" title="Align Center"><AlignCenter className="w-3 h-3" /></button>
      <button type="button" onClick={() => handleFormatCmd('justifyRight')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-600" title="Align Right"><AlignRight className="w-3 h-3" /></button>

      <div className="w-px h-4 bg-slate-200 mx-0.5" />

      {/* Text Colors */}
      <button type="button" onClick={() => handleFormatCmd('foreColor', '#000000')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-black font-black text-[11.5px]" title="Text Color Black">A</button>
      <button type="button" onClick={() => handleFormatCmd('foreColor', '#e11d48')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-rose-600 font-black text-[11.5px]" title="Text Color Red">A</button>
      <button type="button" onClick={() => handleFormatCmd('foreColor', '#02599c')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-blue-600 font-black text-[11.5px]" title="Text Color Blue">A</button>
      <button type="button" onClick={() => handleFormatCmd('foreColor', '#16a34a')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-green-600 font-black text-[11.5px]" title="Text Color Green">A</button>
      <button type="button" onClick={() => handleFormatCmd('foreColor', '#9333ea')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-purple-600 font-black text-[11.5px]" title="Text Color Purple">A</button>
      <button type="button" onClick={() => handleFormatCmd('foreColor', '#ea580c')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-orange-600 font-black text-[11.5px]" title="Text Color Orange">A</button>
      
      {/* Custom Color Input */}
      <div className="relative flex items-center hover:bg-slate-200 rounded p-1 cursor-pointer" title="Custom Color Picker">
        <span className="font-black text-[11.5px] mr-1 text-slate-700">A</span>
        <input 
          type="color" 
          defaultValue="#000000"
          onChange={(e) => handleFormatCmd('foreColor', e.target.value)} 
          className="w-3.5 h-3.5 p-0 border-0 cursor-pointer rounded-full overflow-hidden" 
          style={{ appearance: 'none', WebkitAppearance: 'none' }}
        />
      </div>

      <div className="w-px h-4 bg-slate-200 mx-0.5" />

      {/* Clear format */}
      <button type="button" onClick={() => handleFormatCmd('removeFormat')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-500" title="Clear Formatting"><Eraser className="w-3 h-3" /></button>
    </div>
  );
}

const DEFAULT_WEATHER_DATA = [
  {
    city: 'హైదరాబాద్',
    temp: 32,
    condition: 'పాక్షికంగా మేఘావృతం',
    humidity: 60,
    wind: 12,
    high: 34,
    low: 24,
    forecast: [
      { day: 'శుక్రవారం', temp: 33, cond: 'మేఘావృతం' },
      { day: 'శనివారం', temp: 31, cond: 'ఉరుములతో కూడిన వర్షం' },
      { day: 'ఆదివారం', temp: 30, cond: 'భారీ వర్షం' },
      { day: 'సోమవారం', temp: 32, cond: 'పాక్షికంగా మేఘావృతం' }
    ]
  },
  {
    city: 'రంగారెడ్డి',
    temp: 31,
    condition: 'ఉరుములతో కూడిన వర్షం',
    humidity: 68,
    wind: 14,
    high: 33,
    low: 22,
    forecast: [
      { day: 'శుక్రవారం', temp: 32, cond: 'తేలికపాటి వర్షం' },
      { day: 'శనివారం', temp: 31, cond: 'ఉరుములతో కూడిన వర్షం' },
      { day: 'ఆదివారం', temp: 29, cond: 'భారీ వర్షం' },
      { day: 'సోమవారం', temp: 32, cond: 'పాక్షికంగా మేఘావృతం' }
    ]
  },
  {
    city: 'వరంగల్',
    temp: 33,
    condition: 'మేఘావృతం',
    humidity: 62,
    wind: 11,
    high: 35,
    low: 23,
    forecast: [
      { day: 'శుక్రవారం', temp: 32, cond: 'తేలికపాటి వర్షం' },
      { day: 'శనివారం', temp: 30, cond: 'భారీ వర్షం' },
      { day: 'ఆదివారం', temp: 31, cond: 'మేఘావృతం' },
      { day: 'సోమవారం', temp: 33, cond: 'పాక్షికంగా మేఘావృతం' }
    ]
  },
  {
    city: 'ఖమ్మం',
    temp: 35,
    condition: 'ఎండగా ఉంటుంది',
    humidity: 52,
    wind: 9,
    high: 37,
    low: 25,
    forecast: [
      { day: 'శుక్రవారం', temp: 36, cond: 'ఎండగా ఉంటుంది' },
      { day: 'శనివారం', temp: 35, cond: 'ఎండగా ఉంటుంది' },
      { day: 'ఆదివారం', temp: 34, cond: 'పాక్షికంగా మేఘావృతం' },
      { day: 'సోమవారం', temp: 34, cond: 'మేఘావృతం' }
    ]
  },
  {
    city: 'విశాఖపట్నం',
    temp: 34,
    condition: 'ఎండగా మరియు ఉక్కపోత',
    humidity: 75,
    wind: 18,
    high: 35,
    low: 27,
    forecast: [
      { day: 'శుక్రవారం', temp: 34, cond: 'ఎండగా ఉంటుంది' },
      { day: 'శనివారం', temp: 33, cond: 'పాక్షికంగా మేఘావృతం' },
      { day: 'ఆదివారం', temp: 32, cond: 'తేలికపాటి వర్షం' },
      { day: 'సోమవారం', temp: 33, cond: 'మేఘావృతం' }
    ]
  },
  {
    city: 'విజయవాడ',
    temp: 37,
    condition: 'తీవ్రమైన ఎండ',
    humidity: 50,
    wind: 10,
    high: 39,
    low: 26,
    forecast: [
      { day: 'శుక్రవారం', temp: 38, cond: 'తీవ్రమైన ఎండ' },
      { day: 'శనివారం', temp: 37, cond: 'ఎండగా ఉంటుంది' },
      { day: 'ఆదివారం', temp: 35, cond: 'పాక్షికంగా మేఘావృతం' },
      { day: 'సోమవారం', temp: 36, cond: 'ఎండగా ఉంటుంది' }
    ]
  },
  {
    city: 'తిరుపతి',
    temp: 35,
    condition: 'ఎండగా ఉంటుంది',
    humidity: 55,
    wind: 9,
    high: 37,
    low: 25,
    forecast: [
      { day: 'శుక్రవారం', temp: 36, cond: 'ఎండగా ఉంటుంది' },
      { day: 'శనివారం', temp: 35, cond: 'ఎండగా ఉంటుంది' },
      { day: 'ఆదివారం', temp: 34, cond: 'పాక్షికంగా మేఘావృతం' },
      { day: 'సోమవారం', temp: 34, cond: 'మేఘావృతం' }
    ]
  }
];

function splitPanchangam(html: string): string[] {
  if (!html) return [];
  const items: string[] = [];
  let current = '';
  let inTag = false;
  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    if (char === '<') {
      inTag = true;
    } else if (char === '>') {
      inTag = false;
    }

    if (char === ';' && !inTag) {
      items.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    items.push(current.trim());
  }
  return items.filter(Boolean);
}

function parseHtmlToBullets(html: string): string[] {
  if (!html) return [];
  if (typeof window === 'undefined') return [html];
  const div = document.createElement('div');
  div.innerHTML = html;
  
  const lis = div.getElementsByTagName('li');
  if (lis.length > 0) {
    const list: string[] = [];
    for (let i = 0; i < lis.length; i++) {
      const content = lis[i].innerHTML.trim();
      if (content) list.push(content);
    }
    return list;
  }
  
  const paragraphs = div.querySelectorAll('p, div');
  if (paragraphs.length > 0) {
    const list: string[] = [];
    paragraphs.forEach(p => {
      const content = p.innerHTML.trim();
      if (content && !p.querySelector('p, div')) {
        list.push(content);
      }
    });
    if (list.length > 0) return list;
  }
  
  const lines = html.split(/<br\s*\/?>/i).map(line => line.trim()).filter(Boolean);
  return lines.length > 0 ? lines : [html];
}

function applySelectedFontSize(editorElement: HTMLDivElement | null, size: string) {
  if (!editorElement || !size) return;
  try {
    document.execCommand('styleWithCSS', false, 'false');
  } catch (e) {}
  document.execCommand('fontSize', false, '7');
  const elements = editorElement.querySelectorAll('font, span');
  elements.forEach((el: any) => {
    if (el.getAttribute('size') === '7') {
      el.removeAttribute('size');
      el.style.fontSize = size;
    }
    const inlineFS = el.style.fontSize;
    if (inlineFS === '-webkit-xxx-large' || inlineFS === 'xxx-large' || inlineFS.includes('xxx-large')) {
      el.style.fontSize = size;
    }
  });
}

const DEFAULT_HOROSCOPE_PANCHANGAM = "శ్రీ పరాభవ నామ సంవత్సరం; ఉత్తరాయణం; గ్రీష్మరుతువు, నిజ జ్యేష్ఠ మాసం, శుక్ల పక్షం ఏకాదశి: రా. 9-15 తదుపరి ద్వాదశి; స్వాతి: సా. 6-18 తదుపరి విశాఖ వర్జ్యం: రా. 12-23 నుంచి 2-07 వరకు; అమృత ఘడియలు: ఉ. 8-54 నుంచి 10-36 వరకు; దుర్ముహూర్తం: ఉ. 9-52 నుంచి 10-44 వరకు; తిరిగి మ. 3-05 నుంచి 3-57 వరకు; రాహుకాలం: మ. 1-30 నుంచి 3-00 వరకు; సూర్యోదయం: ఉ.5.31; సూర్యాస్తమయం: సా.6.34 నిర్జల ఏకాదశి";

const DEFAULT_HOROSCOPE_PREDICTIONS = [
  { id: "aries", name: "మేషం", englishName: "Aries", dateRange: "మార్చి 21 - ఏప్రిల్ 19", prediction: "చేపట్టిన పనులలో ఆటంకాలు ఎదురైనా పట్టుదలతో పూర్తి చేస్తారు. వృత్తి ఉద్యోగాలలో మీ ప్రతిభకు గుర్తింపు లభిస్తుంది. ధనలాభం కలిగే అవకాశం ఉంది. ప్రయాణాల విరామం మంచిది." },
  { id: "taurus", name: "వృషభం", englishName: "Taurus", dateRange: "ఏప్రిల్ 20 - మే 20", prediction: "కుటుంబ సభ్యులతో ఆనందంగా గడుపుతారు. నూతన వస్తు ఆభరణాలు కొనుగోలు చేస్తారు. వ్యాపార లావాదేవీలు లాభసాటిగా సాగుతాయి. ఆరోగ్యం పట్ల శ్రద్ధ వహించండి." },
  { id: "gemini", name: "మిథునం", englishName: "Gemini", dateRange: "మే 21 - జూన్ 20", prediction: "ఆर्थिक పరిస్థితి మెరుగ్గా ఉంటుంది. మిత్రుల సహాయంతో ముఖ్యమైన సమస్యలు పరిష్కరించుకుంటారు. సమాజంలో గౌరవ मర్యాదలు పెరుగుతాయి. అనుకోని ప్రయాణాలు చేయాల్సి రావచ్చు." },
  { id: "cancer", name: "కర్కాటకం", englishName: "Cancer", dateRange: "జూన్ 21 - జూలై 22", prediction: "పనులలో నిర్లక్ష్యం తగదు. సహోద్యోగులతో వివాదాలకు దూరంగా ఉండండి. ఖర్చులు పెరిగే అవకాశం ఉంది. క్రమశిక్షణతో వ్యవహరిస్తే అనుకూల ఫలితాలు సాధించవచ్చు." },
  { id: "leo", name: "సింహం", englishName: "Leo", dateRange: "జూలై 23 - ఆగస్టు 22", prediction: "నూతన కార్యకలాపాలకు శ్రీకారం చుడతారు. సమాజంలో ఉన్నత వ్యక్తుల పరిచయాలు ఏర్పడతాయి. ఆదాయ మార్గాలు పెరుగుతాయి. శుభవార్తలు వింటారు." },
  { id: "virgo", name: "కన్య", englishName: "Virgo", dateRange: "ఆగస్టు 23 - సెప్టెంబర్ 22", prediction: "కష్టానికి తగిన ప్రతిఫలం దక్కుతుంది. వృత్తి రంగంలో ఒత్తిడి అధిగమిస్తారు. కుటుంబంలో ప్రశాంతత నెలకొంటుంది. ఆధ్యాత్మిక సేవా కార్యక్రమాల్లో పాల్గొంటారు." },
  { id: "libra", name: "తుల", englishName: "Libra", dateRange: "సెప్టెంబర్ 23 - అక్టోబర్ 22", prediction: "కళా, సాంకేతిక రంగాల వారికి అనుకూల సమయం. వ్యాపార విస్తరణ ప్రయత్నాలు ఫలించవు. ఆర్థిక విషయాల్లో ఆచితూచి అడుగులు వేయడం అవసరం. దైవ దర్శనం చేసుకుంటారు." },
  { id: "scorpio", name: "వృశ్చికం", englishName: "Scorpio", dateRange: "అక్టోబర్ 23 - నవంబర్ 21", prediction: "ఆకస్మిక ధనలాభం సూచిస్తోంది. కోర్టు వ్యవహారాలు మీకు అనుకూలంగా పరిష్కారమవుతాయి. సంతోషకరమైన వార్తలు వింటారు. విందు వినోదాలలో పాల్గొంటారు." },
  { id: "sagittarius", name: "ధనుస్సు", englishName: "Sagittarius", dateRange: "నవంబర్ 22 - డిసెంబర్ 21", prediction: "చేపట్టిన పనులు సకాలంలో పూర్తవుతాయి. ఉన్నతాధికారుల మద్దతు లభిస్తుంది. బంధువులతో ఏర్పడిన విభేదాలు తొలగిపోతాయి. మానసిక ఉల్లాసం కలుగుతుంది." },
  { id: "makar", name: "మకరం", englishName: "Makar", dateRange: "డిసెంబర్ 22 - జనవరి 19", prediction: "ధనవ్యయం అధికంగా ఉంటుంది. శారీరక శ్రమ, అలసట ఎక్కువగా ఉండవచ్చు. వ్యాపారంలో నష్టాలు రాకుండా జాగ్రత్త పడండి. ఎవరికీ హామీలు ఇవ్వవద్దు." },
  { id: "aquarius", name: "కుంభం", englishName: "Aquarius", dateRange: "జనవరి 20 - ఫిబ్రవరి 18", prediction: "సమాజంలో పలుకుబడి పెరుగుతుంది. స్థిరాస్తి వివాదాలు పరిష్కారమవుతాయి. సంతానానికి సంబంధించి శుభవార్తలు వింటారు. రుణ సమస్యలు కొంతవరకు తొలగుతాయి." },
  { id: "meen", name: "మీనం", englishName: "Pisces", dateRange: "ఫిబ్రవరి 19 - మార్చి 20", prediction: "నూతన ఉద్యోగ అవకాశాలు లభిస్తాయి. గతంలో నిలిచిపోయిన పనులు సాఫీగా సాగుతాయి. ఆర్థిక విజయం మీ సొంతమవుతుంది. ఆత్మీయుల నుండి బహుమతులు పొందుతారు." }
];


const SIDEBAR_CATEGORIES = [
  { slug: 'home', name: 'హోమ్ పేజీ (Home Page)' },
  { slug: 'latest', name: 'బ్రేకింగ్ న్యూస్ (Breaking)' },
  { slug: 'telangana', name: 'తెలంగాణ (Telangana)' },
  { slug: 'telangana-districts', name: 'తెలంగాణ జిల్లా వార్తలు' },
  { slug: 'andhra-pradesh', name: 'ఆంధ్రప్రదేశ్ (Andhra Pradesh)' },
  { slug: 'andhra-pradesh-districts', name: 'ఆంధ్రప్రదేశ్ జిల్లా వార్తలు' },
  { slug: 'politics', name: 'పాలిటిక్స్ (Politics)' },
  { slug: 'national', name: 'నేషనల్ (National)' },
  { slug: 'international', name: 'వరల్డ్ (World)' },
  { slug: 'business', name: 'బిజినెస్ (Business)' },
  { slug: 'sports', name: 'స్పోర్ట్స్ (Sports)' },
  { slug: 'entertainment', name: 'సినిమా (Film)' },
  { slug: 'technology', name: 'టెక్నాలజీ (Technology)' },
  { slug: 'health', name: 'ఆరోగ్యం (Health)' },
  { slug: 'viral', name: 'వైరల్ (Viral)' },
  { slug: 'lifestyle', name: 'లైఫ్ స్టైల్ (Lifestyle)' },
  { slug: 'women', name: 'ఆమె (Women)' },
  { slug: 'adyathmikam', name: 'దైవం (Daivam / Devotional)' },
  { slug: 'vidya', name: 'విద్య (Vidya)' },
  { slug: 'upadi', name: 'ఉపాధి (Upadi)' },
  { slug: 'rasipalalu', name: 'శుభఫలాలు (Astrology)' },
  { slug: 'weather', name: 'వెదర్ (Weather)' },
  { slug: 'sampadakiyam', name: 'ఎడిటోరియల్ (Editorial)' },
];

const getArticleCategoryName = (art: any) => {
  if (art.districtSlug) {
    const allDist = [...tgDistricts, ...apDistricts];
    const dist = allDist.find(d => d.slug === art.districtSlug);
    const engName = art.districtSlug
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return dist ? `${engName} (${dist.name})` : engName;
  }
  return art.category || art.categorySlug || 'News';
};

const formatTeluguDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const getCmsPollStatusLabel = (desc: string) => {
  try {
    const parsed = JSON.parse(desc);
    if (parsed && parsed.startDate && parsed.endDate) {
      return `${formatTeluguDate(parsed.startDate)} నుండి ${formatTeluguDate(parsed.endDate)} వరకు`;
    }
  } catch (e) {}
  return desc || 'రేపటి వరకు';
};

// Default editorial sections
const DEFAULT_EDITORIAL_SECTIONS = [
  { id: 'sec-editorial', title: 'ఎడిటోరియల్', slug: 'sampadakiyam' },
  { id: 'sec-gitanjali', title: 'గీతాంజలి', slug: 'adyathmikam' },
  { id: 'sec-kothapaluku', title: 'కొత్త పలుకు', slug: 'antharmadanam' },
];

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Dashboard navigation tab: 'dashboard', 'news', 'breaking', 'categories', 'overlays', 'epaper', 'editorial'
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // News filtering state (filters News list based on selected category in sidebar)
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Mode inside News Management: 'list', 'add', 'edit'
  const [newsViewMode, setNewsViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [isSavingArticle, setIsSavingArticle] = useState(false);
  
  // General configs states
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Form states (popups, tickers, media)
  const [customNewsList, setCustomNewsList] = useState<any[]>([]);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar category news pins
  const [sidebarCategoryPins, setSidebarCategoryPins] = useState<Record<string, { trending: string[]; breaking: string[] }>>({});
  const [activeSidebarCategory, setActiveSidebarCategory] = useState<string>('home');
  const [activeSidebarDistrict, setActiveSidebarDistrict] = useState<string>(''); // for district sub-selection
  const [sidebarNewsSearch, setSidebarNewsSearch] = useState<string>('');

  // Expandable sections for sidebar groups
  const [expandedSidebar, setExpandedSidebar] = useState<Record<string, boolean>>({
    main: false,
    ap: false,
    telangana: false,
    health: false,
    education: false,
    career: false,
  });

  // Header dropdown state
  const [activeHeaderDropdown, setActiveHeaderDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);


  // Expandable sections for add/edit classification
  const [expandedClassification, setExpandedClassification] = useState<Record<string, boolean>>({
    ap: false,
    telangana: false,
    health: false,
    education: false,
    career: false,
    others: false
  });

  // Form field states
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSlug, setNewsSlug] = useState('');
  const [newsDescription, setNewsDescription] = useState('');
  const [newsTags, setNewsTags] = useState<{ name: string; linkedArticleSlug: string | null }[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [allTagsSuggestions, setAllTagsSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tagLinkingTargetName, setTagLinkingTargetName] = useState<string | null>(null);
  const [tagLinkSearchQuery, setTagLinkSearchQuery] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [newsAuthor, setNewsAuthor] = useState('హై టీవీ డెస్క్');



  const [newsPublishedDate, setNewsPublishedDate] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsVideo, setNewsVideo] = useState('');

  // Story placement flag checkboxes
  const [isBreakingChecked, setIsBreakingChecked] = useState(false);
  const [isTrendingChecked, setIsTrendingChecked] = useState(false);
  const [isFeaturedChecked, setIsFeaturedChecked] = useState(false);

  // Homepage slider states
  const [sliderSlidesList, setSliderSlidesList] = useState<any[]>([]);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideImage, setNewSlideImage] = useState('');
  const [newSlideLink, setNewSlideLink] = useState('');
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  // Article-picker for slider: set of article IDs selected to show in the homepage slider
  const [sliderSelectedIds, setSliderSelectedIds] = useState<Set<string>>(new Set());
  const [sliderSearchQuery, setSliderSearchQuery] = useState('');

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Shorts videos states
  const [shortsFormMode, setShortsFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingShort, setEditingShort] = useState<any | null>(null);
  const [shortTitle, setShortTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [shortCoverImage, setShortCoverImage] = useState('');
  const [shortVideo, setShortVideo] = useState('');
  const shortVideoInputRef = useRef<HTMLInputElement>(null);
  const shortCoverInputRef = useRef<HTMLInputElement>(null);

  // Photo gallery states
  const [photosFormMode, setPhotosFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingPhotoAlbum, setEditingPhotoAlbum] = useState<any | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [photoImage, setPhotoImage] = useState('');
  const photoCoverInputRef = useRef<HTMLInputElement>(null);

  // Polls manager states
  const [pollsFormMode, setPollsFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingPoll, setEditingPoll] = useState<any | null>(null);
  const [cmsPollQuestion, setCmsPollQuestion] = useState('');
  const [pollStartDate, setPollStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pollEndDate, setPollEndDate] = useState(() => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [pollScope, setPollScope] = useState<'general' | 'article'>('general');
  const [pollOptions, setPollOptions] = useState([
    { id: 'a', label: '', votes: 0 },
    { id: 'b', label: '', votes: 0 },
  ]);

  // Popup Manager states (persisted to database settings API)
  
  // ════════════ LIVE UPDATES MANAGER STATES ════════════
  const [liveListings, setLiveListings] = useState<any[]>([]);
  const [selectedLiveSlug, setSelectedLiveSlug] = useState<string>('');
  const [livePosts, setLivePosts] = useState<any[]>([]);
  
  // Listing Form State ('none' | 'add' | 'edit')
  const [listingFormMode, setListingFormMode] = useState<'none' | 'add' | 'edit'>('none');
  const [editingListing, setEditingListing] = useState<any | null>(null);
  const [listingTitle, setListingTitle] = useState('హై టీవీ ఫ్లాష్ న్యూస్');
  const [listingDescription, setListingDescription] = useState('');
  const [listingDate, setListingDate] = useState('');
  const [listingSlug, setListingSlug] = useState('');

  // Post Form State ('none' | 'add' | 'edit')
  const [postFormMode, setPostFormMode] = useState<'none' | 'add' | 'edit'>('none');
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [postTime, setPostTime] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState<string>('telangana');
  const [postIsImportant, setPostIsImportant] = useState(false);
  const [postBulletsText, setPostBulletsText] = useState('');
  const [postImage, setPostImage] = useState('');
  const postImageInputRef = useRef<HTMLInputElement>(null);

  // Load Autocomplete Tags on mount
  const fetchAllTags = async () => {
    try {
      const res = await fetch('/api/tags');
      if (res.ok) {
        const data = await res.json();
        setAllTagsSuggestions(data);
      }
    } catch (e) {
      console.error('Failed to load tags:', e);
    }
  };

  useEffect(() => {
    fetchAllTags();
  }, []);

  // Load Live Updates Listings on mount
  useEffect(() => {
    fetch('/api/settings?key=live_updates_listings&t=' + Date.now())
      .then(res => res.ok ? res.json() : {})
      .then((dict: any) => {
        let list = [];
        if (dict.live_updates_listings) {
          try { list = typeof dict.live_updates_listings === 'string' ? JSON.parse(dict.live_updates_listings) : dict.live_updates_listings; } catch {}
        }
        setLiveListings(list || []);
        if (list && list.length > 0) {
          setSelectedLiveSlug(prev => prev || list[0].slug);
        }
      })
      .catch(() => {});
  }, []);

  // Load Live Update Posts when selectedLiveSlug changes
  useEffect(() => {
    if (!selectedLiveSlug) return;
    const key = `live_updates_feed_${selectedLiveSlug}`;
    fetch(`/api/settings?key=${key}&t=` + Date.now())
      .then(res => res.ok ? res.json() : {})
      .then((dict: any) => {
        let posts = [];
        if (dict[key]) {
          try { posts = typeof dict[key] === 'string' ? JSON.parse(dict[key]) : dict[key]; } catch {}
        }
        setLivePosts(posts || []);
      })
      .catch(() => {});
  }, [selectedLiveSlug]);

  // Sync Rich Text Editors for Live Updates form
  useEffect(() => {
    if (postFormMode === 'add') {
      if (postTitleEditorRef.current) postTitleEditorRef.current.innerHTML = '';
      if (postBulletsEditorRef.current) postBulletsEditorRef.current.innerHTML = '';
    } else if (postFormMode === 'edit' && editingPost) {
      if (postTitleEditorRef.current) postTitleEditorRef.current.innerHTML = editingPost.title || '';
      if (postBulletsEditorRef.current) {
        if (Array.isArray(editingPost.bullets) && editingPost.bullets.length > 0) {
          postBulletsEditorRef.current.innerHTML = '<ul>' + editingPost.bullets.map((b: string) => `<li>${b}</li>`).join('') + '</ul>';
        } else {
          postBulletsEditorRef.current.innerHTML = editingPost.title || '';
        }
      }
    }
  }, [postFormMode, editingPost]);

  const saveLiveListingsToDB = (newListings: any[]) => {
    setLiveListings(newListings);
    try { localStorage.setItem('live_updates_listings', JSON.stringify(newListings)); } catch {}
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ live_updates_listings: JSON.stringify(newListings) })
    }).catch(err => console.error('Error saving live listings:', err));
  };

  const saveLivePostsToDB = (slug: string, newPosts: any[]) => {
    setLivePosts(newPosts);
    const key = `live_updates_feed_${slug}`;
    try { localStorage.setItem(key, JSON.stringify(newPosts)); } catch {}
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: JSON.stringify(newPosts) })
    }).catch(err => console.error('Error saving live posts:', err));
  };

  type PopupId = 'home' | 'article';
  const [homePopup, setHomePopup] = useState({ enabled: true, type: 'ad' as 'ad'|'poll', adImage: '', adLink: '', adOrientation: 'horizontal' as 'horizontal'|'vertical', pollQuestion: '', pollOpts: ['అవును','కాదు'] });
  const [articlePopup, setArticlePopup] = useState({ enabled: true, type: 'ad' as 'ad'|'poll', adImage: '', adLink: '', adOrientation: 'horizontal' as 'horizontal'|'vertical', pollQuestion: '', pollOpts: ['అవును','కాదు'] });
  const [popupSaved, setPopupSaved] = useState<'home'|'article'|null>(null);

  // Load popup configs from database settings API on mount
  useEffect(() => {
    const ids: PopupId[] = ['home', 'article'];
    ids.forEach(id => {
      const keys = [
        `promo_popup_${id}_enabled`,
        `promo_popup_${id}_type`,
        `promo_ad_${id}_image`,
        `promo_ad_${id}_link`,
        `promo_ad_${id}_orientation`,
        `promo_poll_${id}_question`,
        `promo_poll_${id}_options`,
        `promo_poll_${id}_option_yes`,
        `promo_poll_${id}_option_no`,
        `promo_poll_${id}_option_unsure`,
      ];
      fetch(`/api/settings?keys=${keys.join(',')}&t=` + Date.now())
        .then(res => res.ok ? res.json() : {})
        .then((dbSettings: any) => {
          const get = (key: string, def: string = '') => dbSettings[key] ?? def;
          let pollOpts: string[] = ['అవును', 'కాదు'];
          const savedOptions = get(`promo_poll_${id}_options`);
          if (savedOptions) {
            try { pollOpts = JSON.parse(savedOptions); } catch {}
          } else {
            const yes = get(`promo_poll_${id}_option_yes`);
            const no = get(`promo_poll_${id}_option_no`);
            const unsure = get(`promo_poll_${id}_option_unsure`);
            if (yes || no || unsure) {
              pollOpts = [];
              if (yes) pollOpts.push(yes);
              if (no) pollOpts.push(no);
              if (unsure) pollOpts.push(unsure);
            }
          }
          const config = {
            enabled: get(`promo_popup_${id}_enabled`) !== 'false',
            type: (get(`promo_popup_${id}_type`) || 'ad') as 'ad' | 'poll',
            adImage: get(`promo_ad_${id}_image`),
            adLink: get(`promo_ad_${id}_link`),
            adOrientation: (get(`promo_ad_${id}_orientation`) || 'horizontal') as 'horizontal' | 'vertical',
            pollQuestion: get(`promo_poll_${id}_question`),
            pollOpts,
          };
          if (id === 'home') setHomePopup(config as any);
          else setArticlePopup(config as any);
        })
        .catch(err => console.error(`Error loading popup config for ${id}:`, err));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savePopupConfig = (id: PopupId, config: typeof homePopup) => {
    const payload: Record<string, string> = {
      [`promo_popup_${id}_enabled`]: String(config.enabled),
      [`promo_popup_${id}_type`]: config.type,
      [`promo_ad_${id}_image`]: config.adImage,
      [`promo_ad_${id}_link`]: config.adLink,
      [`promo_ad_${id}_orientation`]: config.adOrientation,
      [`promo_poll_${id}_question`]: config.pollQuestion,
      [`promo_poll_${id}_options`]: JSON.stringify(config.pollOpts),
      [`promo_poll_${id}_option_yes`]: config.pollOpts[0] || '',
      [`promo_poll_${id}_option_no`]: config.pollOpts[1] || '',
      [`promo_poll_${id}_option_unsure`]: config.pollOpts[2] || '',
    };
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(() => {
      setPopupSaved(id);
      setTimeout(() => setPopupSaved(null), 2500);
    })
    .catch(err => {
      console.error(`Error saving popup config for ${id}:`, err);
      alert('Failed to save popup config to server.');
    });
  };

  // Team Manager states
  const [teamFormMode, setTeamFormMode] = useState<'list' | 'add-member' | 'edit-member' | 'add-section' | 'edit-section'>('list');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // Dependent dropdown state for article author selection
  const [selectedAuthorSection, setSelectedAuthorSection] = useState<string>('custom');
  const [selectedReporterId, setSelectedReporterId] = useState<string>('');

  useEffect(() => {
    if (teamMembers.length > 0) {
      const authorVal = newsAuthor || '';
      const matchedMember = teamMembers.find(m => m.title === authorVal);
      if (matchedMember) {
        setSelectedAuthorSection(matchedMember.body || 'reporters');
        setSelectedReporterId(matchedMember.title);
      } else {
        setSelectedAuthorSection('custom');
        setSelectedReporterId('');
      }
    } else {
      setSelectedAuthorSection('custom');
      setSelectedReporterId('');
    }
  }, [newsAuthor, teamMembers]);
  const [teamSections, setTeamSections] = useState<any[]>([]);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [editingSection, setEditingSection] = useState<any | null>(null);

  // Member fields
  const [memberName, setMemberName] = useState('');
  const [memberSlug, setMemberSlug] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberBio, setMemberBio] = useState('');
  const [memberImage, setMemberImage] = useState('');
  const [memberSectionId, setMemberSectionId] = useState('');

  // Section fields
  const [sectionName, setSectionName] = useState('');
  const [sectionSlug, setSectionSlug] = useState('');
  const [isSavingTeam, setIsSavingTeam] = useState(false);

  // Team Banner States
  const [teamBannerBadge, setTeamBannerBadge] = useState('హై టీవీ బృందం');
  const [teamBannerTitle, setTeamBannerTitle] = useState('మా వార్తా ప్రతినిధులు');
  const [teamBannerDesc, setTeamBannerDesc] = useState('సమాజంలోని నిజాలను నిర్భయంగా వెలుగులోకి తెచ్చే నిష్పక్షపాత విలేకరులు, నిపుణులైన విశ్లేషకులు మరియు సంపాదక బృందం.');
  const [isSavingTeamBanner, setIsSavingTeamBanner] = useState(false);

  const fetchTeamData = () => {
    fetch('/api/articles?category=team-member&limit=100&t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTeamMembers(data);
        }
      })
      .catch(err => console.error('Error loading team members:', err));

    fetch('/api/articles?category=team-section&limit=50&t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTeamSections(data);
        }
      })
      .catch(err => console.error('Error loading team sections:', err));

    fetch('/api/settings?t=' + Date.now())
      .then(res => res.ok ? res.json() : {})
      .then((dbSettings: any) => {
        if (dbSettings) {
          setTeamBannerBadge(dbSettings['team_banner_badge'] || 'హై టీవీ బృందం');
          setTeamBannerTitle(dbSettings['team_banner_title'] || 'మా వార్తా ప్రతినిధులు');
          setTeamBannerDesc(dbSettings['team_banner_desc'] || 'సమాజంలోని నిజాలను నిర్భయంగా వెలుగులోకి తెచ్చే నిష్పక్షపాత విలేకరులు, నిపుణులైన విశ్లేషకులు మరియు సంపాదక బృందం.');
        }
      })
      .catch(err => console.error('Error loading team banner settings:', err));
  };

  const handleSaveTeamBanner = async () => {
    setIsSavingTeamBanner(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_banner_badge: teamBannerBadge,
          team_banner_title: teamBannerTitle,
          team_banner_desc: teamBannerDesc,
        }),
      });
      if (response.ok) {
        alert('Team banner settings saved successfully!');
      } else {
        alert('Failed to save team banner settings.');
      }
    } catch (err: any) {
      console.error('Error saving team banner settings:', err);
      alert('Error saving team banner settings: ' + (err.message || String(err)));
    } finally {
      setIsSavingTeamBanner(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'team-manager' || activeTab === 'news' || activeTab === 'weather') {
      fetchTeamData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Sidebar Ads Manager states
  const [adFormMode, setAdFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [adActiveSubTab, setAdActiveSubTab] = useState<'category' | 'article-left' | 'article-right' | 'header-ad' | 'epaper-left' | 'epaper-right' | 'epaper-header' | 'epaper-mobile'>('category');
  const [sidebarAds, setSidebarAds] = useState<any[]>([]);
  const [editingAd, setEditingAd] = useState<any | null>(null);

  // Ad fields
  const [sidebarAdTitle, setSidebarAdTitle] = useState('');
  const [sidebarAdLink, setSidebarAdLink] = useState('');
  const [sidebarAdImage, setSidebarAdImage] = useState('');
  const [sidebarAdStatus, setSidebarAdStatus] = useState<'active' | 'inactive'>('active');
  const [sidebarAdLocation, setSidebarAdLocation] = useState<'category' | 'article-left' | 'article-right' | 'both' | 'header-ad' | 'epaper-left' | 'epaper-right' | 'epaper-header' | 'epaper-mobile'>('category');
  const [isSavingSidebarAd, setIsSavingSidebarAd] = useState(false);

  const fetchAdsData = () => {
    Promise.all([
      fetch('/api/articles?category=sidebar-ad-category&limit=50&t=' + Date.now()).then(r => r.json()),
      fetch('/api/articles?category=sidebar-ad-article-left&limit=50&t=' + Date.now()).then(r => r.json()),
      fetch('/api/articles?category=sidebar-ad-article-right&limit=50&t=' + Date.now()).then(r => r.json()),
      fetch('/api/articles?category=sidebar-ad-both&limit=50&t=' + Date.now()).then(r => r.json()),
      fetch('/api/articles?category=header-ad&limit=10&t=' + Date.now()).then(r => r.json()),
      fetch('/api/articles?category=sidebar-ad-epaper-left&limit=10&t=' + Date.now()).then(r => r.json()),
      fetch('/api/articles?category=sidebar-ad-epaper-right&limit=10&t=' + Date.now()).then(r => r.json()),
      fetch('/api/articles?category=sidebar-ad-epaper-header&limit=10&t=' + Date.now()).then(r => r.json()),
      fetch('/api/articles?category=sidebar-ad-epaper-mobile&limit=10&t=' + Date.now()).then(r => r.json())
    ])
      .then(([catAds, leftAds, rightAds, bothAds, headerAds, epaperLeftAds, epaperRightAds, epaperHeaderAds, epaperMobileAds]) => {
        if (
          Array.isArray(catAds) && 
          Array.isArray(leftAds) && 
          Array.isArray(rightAds) && 
          Array.isArray(bothAds) && 
          Array.isArray(headerAds) &&
          Array.isArray(epaperLeftAds) &&
          Array.isArray(epaperRightAds) &&
          Array.isArray(epaperHeaderAds) &&
          Array.isArray(epaperMobileAds)
        ) {
          setSidebarAds([...catAds, ...leftAds, ...rightAds, ...bothAds, ...headerAds, ...epaperLeftAds, ...epaperRightAds, ...epaperHeaderAds, ...epaperMobileAds]);
        }
      })
      .catch(err => console.error('Error loading ads data:', err));
  };

  useEffect(() => {
    if (activeTab === 'sidebar-ads') {
      fetchAdsData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'high-tv-videos') {
      fetch('/api/latest-videos?t=' + Date.now())
        .then(res => res.ok ? res.json() : [])
        .then(dbVideos => {
          if (Array.isArray(dbVideos)) {
            setVideosList(dbVideos);
          }
        })
        .catch(err => console.error("Error loading latest videos:", err));
    }
  }, [activeTab]);

  const handleSaveAd = async () => {
    if (!sidebarAdTitle.trim()) {
      alert('Ad Title is required!');
      return;
    }
    if (!sidebarAdImage) {
      alert('Please upload an image for the ad!');
      return;
    }

    setIsSavingSidebarAd(true);
    const catSlug = sidebarAdLocation === 'category' 
      ? 'sidebar-ad-category' 
      : sidebarAdLocation === 'article-left' 
        ? 'sidebar-ad-article-left' 
        : sidebarAdLocation === 'article-right'
          ? 'sidebar-ad-article-right'
          : sidebarAdLocation === 'header-ad'
            ? 'header-ad'
            : sidebarAdLocation === 'epaper-left'
              ? 'sidebar-ad-epaper-left'
              : sidebarAdLocation === 'epaper-right'
                ? 'sidebar-ad-epaper-right'
                : sidebarAdLocation === 'epaper-header'
                  ? 'sidebar-ad-epaper-header'
                  : sidebarAdLocation === 'epaper-mobile'
                    ? 'sidebar-ad-epaper-mobile'
                    : 'sidebar-ad-both';
    const cleanSlug = adFormMode === 'edit' && editingAd ? editingAd.slug : `ad-${catSlug.slice(-3)}-${Date.now().toString().slice(-6)}`;
    
    const adData = {
      title: sidebarAdTitle.trim(),
      slug: cleanSlug,
      categorySlug: catSlug,
      category: sidebarAdStatus,
      body: sidebarAdLink.trim(),
      image: sidebarAdImage,
      author: 'హై టీవీ డెస్క్',
      isBreaking: false,
      isTrending: false,
      isFeatured: false,
    };

    try {
      const url = adFormMode === 'edit' && editingAd ? `/api/articles/${editingAd.id}` : '/api/articles';
      const method = adFormMode === 'edit' && editingAd ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adData),
      });

      if (res.ok) {
        setAdFormMode('list');
        setEditingAd(null);
        setSidebarAdTitle('');
        setSidebarAdLink('');
        setSidebarAdImage('');
        setSidebarAdStatus('active');
        setSidebarAdLocation('category');
        fetchAdsData();
      } else {
        const errorRes = await res.json();
        alert(errorRes.error || 'Failed to save ad!');
      }
    } catch (err) {
      console.error('Error saving ad:', err);
      alert('An error occurred while saving the ad.');
    } finally {
      setIsSavingSidebarAd(false);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdsData();
      } else {
        alert('Failed to delete ad!');
      }
    } catch (err) {
      console.error('Error deleting ad:', err);
    }
  };

  const handleToggleAdStatus = async (ad: any) => {
    const newStatus = ad.category === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/articles/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newStatus }),
      });
      if (res.ok) {
        fetchAdsData();
      } else {
        alert('Failed to update status!');
      }
    } catch (err) {
      console.error('Error toggling ad status:', err);
    }
  };

  const handleSaveTeamMember = async () => {
    if (!memberName.trim()) {
      alert('Member Name is required!');
      return;
    }
    if (!memberSectionId) {
      alert('Please select a section for this member!');
      return;
    }

    setIsSavingTeam(true);
    const mSlug = memberSlug.trim() || `member-${Date.now().toString().slice(-6)}`;
    const memberData = {
      title: memberName.trim(),
      slug: (teamFormMode === 'edit-member' && editingMember) ? editingMember.slug : mSlug,
      categorySlug: 'team-member',
      category: memberRole.trim(),
      description: memberBio.trim(),
      body: memberSectionId,
      image: memberImage || '',
      author: 'హై టీవీ డెస్క్',
      isBreaking: false,
      isTrending: false,
      isFeatured: false,
      publishedAt: new Date().toISOString(),
    };

    try {
      if (teamFormMode === 'add-member') {
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData),
        });
        if (response.ok) {
          alert('Team member added successfully!');
        } else {
          alert('Failed to add team member.');
        }
      } else if (teamFormMode === 'edit-member' && editingMember) {
        const response = await fetch(`/api/articles/${editingMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData),
        });
        if (response.ok) {
          alert('Team member updated successfully!');
        } else {
          alert('Failed to update team member.');
        }
      }
      setTeamFormMode('list');
      setEditingMember(null);
      setMemberName('');
      setMemberRole('');
      setMemberBio('');
      setMemberImage('');
      setMemberSectionId('');
      fetchTeamData();
    } catch (err: any) {
      console.error(err);
      alert('Error saving team member: ' + (err.message || String(err)));
    } finally {
      setIsSavingTeam(false);
    }
  };

  const handleSaveSection = async () => {
    if (!sectionName.trim()) {
      alert('Section Name is required!');
      return;
    }

    setIsSavingTeam(true);
    const sSlug = sectionSlug.trim() || `section-${Date.now().toString().slice(-6)}`;
    const sectionData = {
      title: sectionName.trim(),
      slug: (teamFormMode === 'edit-section' && editingSection) ? editingSection.id : sSlug,
      categorySlug: 'team-section',
      author: 'హై టీవీ డెస్క్',
      isBreaking: false,
      isTrending: false,
      isFeatured: false,
      publishedAt: new Date().toISOString(),
    };

    try {
      if (teamFormMode === 'edit-section' && editingSection) {
        const response = await fetch(`/api/articles/${editingSection.idDB}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sectionData),
        });
        if (response.ok) {
          alert('Section updated successfully!');
        } else {
          alert('Failed to update section.');
        }
      } else {
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sectionData),
        });
        if (response.ok) {
          alert('Section added successfully!');
        } else {
          alert('Failed to add section.');
        }
      }
      setSectionName('');
      setSectionSlug('');
      setEditingSection(null);
      setTeamFormMode('list');
      fetchTeamData();
    } catch (err: any) {
      console.error(err);
      alert('Error saving section: ' + (err.message || String(err)));
    } finally {
      setIsSavingTeam(false);
    }
  };

  const handleDeleteTeamItem = async (id: string, type: 'member' | 'section') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert(`${type === 'member' ? 'Team member' : 'Section'} deleted successfully!`);
        fetchTeamData();
      } else {
        alert(`Failed to delete ${type}.`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error deleting ${type}`);
    }
  };

  // Weather page states
  const [weatherReports, setWeatherReports] = useState<any[]>([]);
  const [selectedWeatherCityIndex, setSelectedWeatherCityIndex] = useState<number>(0);
  const [weatherArticleFormMode, setWeatherArticleFormMode] = useState<'list' | 'add' | 'edit'>('list');

  // Horoscope page states
  const [horoscopeDate, setHoroscopeDate] = useState('');
  const [horoscopeWeeklyRange, setHoroscopeWeeklyRange] = useState('');
  const [horoscopePanchangamTitle, setHoroscopePanchangamTitle] = useState('');
  const [horoscopePanchangam, setHoroscopePanchangam] = useState('');
  const [horoscopePredictions, setHoroscopePredictions] = useState<any[]>([]);
  const [selectedHoroscopeIndex, setSelectedHoroscopeIndex] = useState<number>(0);
  const [horoscopeFormMode, setHoroscopeFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [horoscopeEditIdx, setHoroscopeEditIdx] = useState<number | null>(null);
  const [horoscopeFormRashiId, setHoroscopeFormRashiId] = useState('aries');
  const [horoscopeFormDaily, setHoroscopeFormDaily] = useState('');
  const [horoscopeFormWeekly, setHoroscopeFormWeekly] = useState('');
  const [horoscopeBoxRows, setHoroscopeBoxRows] = useState<number>(4);

  // Web stories states
  const [webStoriesList, setWebStoriesList] = useState<any[]>([]);
  const [webStoryFormMode, setWebStoryFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingWebStory, setEditingWebStory] = useState<any | null>(null);
  const [webStoryTitle, setWebStoryTitle] = useState('');
  const [webStoryCoverImage, setWebStoryCoverImage] = useState('');
  const [webStoryCoverTitle, setWebStoryCoverTitle] = useState('');
  const [webStoryCoverStyle, setWebStoryCoverStyle] = useState<'red-white' | 'white-black'>('red-white');
  const [webStorySlides, setWebStorySlides] = useState<any[]>([{ image: '', text: '', textStyle: 'red-white' }]);

  // ── Editorial Page Manager states ──────────────────────────────────────────
  const [editorialSections, setEditorialSections] = useState<{ id: string; title: string; slug: string }[]>(DEFAULT_EDITORIAL_SECTIONS);
  const [editorialActiveSection, setEditorialActiveSection] = useState<string>('sampadakiyam');
  const [editorialFormMode, setEditorialFormMode] = useState<'none' | 'add-section' | 'edit-section' | 'add-article' | 'edit-article' | 'add-image' | 'edit-image'>('none');
  const [editorialEditingSection, setEditorialEditingSection] = useState<{ id: string; title: string; slug: string } | null>(null);
  const [editorialEditingArticle, setEditorialEditingArticle] = useState<any | null>(null);
  const [editorialSectionTitle, setEditorialSectionTitle] = useState('');
  const [editorialSectionSlug, setEditorialSectionSlug] = useState('');
  const [editorialArticleTitle, setEditorialArticleTitle] = useState('');
  const [editorialArticleSlug, setEditorialArticleSlug] = useState('');
  const [editorialArticleImage, setEditorialArticleImage] = useState('');
  const editorialEditorRef = useRef<HTMLDivElement>(null);
  const editorialImageInputRef = useRef<HTMLInputElement>(null);
  const [isSavingEditorialArticle, setIsSavingEditorialArticle] = useState(false);
  const pendingAddCategoryRef = useRef<string | null>(null);

  // Editorial Image Link states
  const [editorialImageCaption, setEditorialImageCaption] = useState('');
  const [editorialImageFile, setEditorialImageFile] = useState('');
  const [editorialImageLinkSlug, setEditorialImageLinkSlug] = useState('');
  const [editorialSearchQuery, setEditorialSearchQuery] = useState('');
  const [showEditorialArticlePicker, setShowEditorialArticlePicker] = useState(false);

  // Pinned District News states
  const [pinnedApNews, setPinnedApNews] = useState<any[]>([]);
  const [pinnedTgNews, setPinnedTgNews] = useState<any[]>([]);
  const [districtSearchQuery, setDistrictSearchQuery] = useState('');
  const [districtActiveSubTab, setDistrictActiveSubTab] = useState<'tg' | 'ap'>('tg');

  // WYSIWYG Editor references
  const editorRef = useRef<HTMLDivElement>(null);
  const newsTitleRef = useRef<HTMLDivElement>(null);
  const newsDescriptionRef = useRef<HTMLDivElement>(null);
  const weatherTitleRef = useRef<HTMLDivElement>(null);
  const weatherDescriptionRef = useRef<HTMLDivElement>(null);
  const horoscopePanchangamRef = useRef<HTMLDivElement>(null);
  const horoscopeDailyRef = useRef<HTMLDivElement>(null);
  const horoscopeWeeklyRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const newsVideoInputRef = useRef<HTMLInputElement>(null);
  const postTitleEditorRef = useRef<HTMLDivElement>(null);
  const postBulletsEditorRef = useRef<HTMLDivElement>(null);

  // Image Resizer overlay state
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [resizerStyle, setResizerStyle] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const resizeDragRef = useRef<{ startX: number; startY: number; startW: number; startH: number; handle: string } | null>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  // General Banners / Ad configs
  const [customAds, setCustomAds] = useState<Record<string, { enabled: boolean; image: string; link: string }>>({});
  const [activeAdSpot, setActiveAdSpot] = useState<'leaderboard' | 'sidebar' | 'rectangle' | 'mobile_leaderboard' | 'mobile_sidebar' | 'mobile_rectangle'>('leaderboard');
  const [adSpotEnabled, setAdSpotEnabled] = useState(false);
  const [adSpotImage, setAdSpotImage] = useState('');
  const [adSpotLink, setAdSpotLink] = useState('#');

  // Flash News (Marquee) config
  const [flashNewsList, setFlashNewsList] = useState<{ text: string; link: string }[]>([]);
  const [flashNewsLabel, setFlashNewsLabel] = useState('Flash News');
  const [newNewsText, setNewNewsText] = useState('');
  const [newNewsLink, setNewNewsLink] = useState('');
  const [editingFlashIndex, setEditingFlashIndex] = useState<number | null>(null);
  const [showFlashArticlePicker, setShowFlashArticlePicker] = useState(false);
  const [flashArticleSearch, setFlashArticleSearch] = useState('');

  // Trending News Ticker config
  const [trendingNewsList, setTrendingNewsList] = useState<{ text: string; link: string }[]>([]);
  const [newTrendingText, setNewTrendingText] = useState('');
  const [newTrendingLink, setNewTrendingLink] = useState('');
  const [editingTrendingIndex, setEditingTrendingIndex] = useState<number | null>(null);
  const [showTrendingArticlePicker, setShowTrendingArticlePicker] = useState(false);
  const [trendingArticleSearch, setTrendingArticleSearch] = useState('');

  // Homepage Settings: youtube list
  const [videosList, setVideosList] = useState<{ id: string; title: string; thumbnail: string }[]>([]);

  // Popups config
  const [popupScope, setPopupScope] = useState<'home' | 'article'>('home');
  const [popupEnabled, setPopupEnabled] = useState(true);
  const [popupType, setPopupType] = useState<'ad' | 'poll'>('ad');
  const [adImage, setAdImage] = useState('/popup-ad.png');
  const [adLink, setAdLink] = useState('#');
  const [pollQuestion, setPollQuestion] = useState('కాంగ్రెస్‌లో టీఎన్ఎస్ పార్టీని విలీనం చేస్తారని మీరు భావిస్తున్నారా?');
  const [optYes, setOptYes] = useState('అవును');
  const [optNo, setOptNo] = useState('కాదు');
  const [optUnsure, setOptUnsure] = useState('చెప్పలేం');

  // Inline Image Config
  const [inlineImageEnabled, setInlineImageEnabled] = useState(false);
  const [inlineImageData, setInlineImageData] = useState('');
  const [inlineImageCaption, setInlineImageCaption] = useState('యోగ ఆసనాలు వేస్తున్న మోదీ..');
  
  // Inline Article Promo Config
  const [inlinePromosEnabled, setInlinePromosEnabled] = useState(true);

  // Rich Text Editor Related News Inserter Modal Config
  const [showPromoLinkModal, setShowPromoLinkModal] = useState(false);
  const [promoSearchQuery, setPromoSearchQuery] = useState('');
  const [customPromoTitle, setCustomPromoTitle] = useState('');
  const [customPromoSlug, setCustomPromoSlug] = useState('');
  const savedSelectionRangeRef = useRef<Range | null>(null);
  const [selectedPromoBox, setSelectedPromoBox] = useState<HTMLDivElement | null>(null);
  const [promoBoxStyle, setPromoBoxStyle] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // Track cursor selection inside news article editor
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
          savedSelectionRangeRef.current = range.cloneRange();
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Close header dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveHeaderDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // E-Paper PDF Config
  const [epapersList, setEpapersList] = useState<{ id: string; title: string; date: string; pdfUrl: string; section: string }[]>([]);
  const [epaperTitle, setEpaperTitle] = useState('');
  const [epaperDate, setEpaperDate] = useState('');
  const [epaperPdf, setEpaperPdf] = useState('');
  const [epaperSection, setEpaperSection] = useState('main');
  const [customEpaperSection, setCustomEpaperSection] = useState('');
  const [epaperDistrict, setEpaperDistrict] = useState('');
  const [editingEpaperId, setEditingEpaperId] = useState<string | null>(null);
  const [isSavingEpaper, setIsSavingEpaper] = useState(false);
  const [epaperSections, setEpaperSections] = useState<{ id: string; name: string; key: string }[]>([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionKey, setNewSectionKey] = useState('');
  const [isSavingSection, setIsSavingSection] = useState(false);

  const fetchEpapersData = () => {
    fetch('/api/epapers?t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEpapersList(data);
        }
      })
      .catch(err => console.error('Error fetching epapers:', err));
  };

  const fetchEpaperSections = () => {
    fetch('/api/epapers/sections?t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEpaperSections(data);
          if (data.length > 0) {
            setEpaperSection(data[0].key);
          }
        }
      })
      .catch(err => console.error('Error fetching epaper sections:', err));
  };

  useEffect(() => {
    if (activeTab === 'epaper') {
      fetchEpapersData();
      fetchEpaperSections();
    }
  }, [activeTab]);

  // Authorization Check
  useEffect(() => {
    const authSession = localStorage.getItem('high_tv_admin_session');
    if (authSession !== 'authenticated') {
      router.push('/superadminlogin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Load custom list and configs on load/refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load Custom News Articles from Database API
    fetch('/api/articles?limit=500&t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCustomNewsList(data);

            // Fetch slides from API and match them to loaded articles
            fetch('/api/slides?t=' + Date.now())
              .then(res => res.ok ? res.json() : [])
              .then(dbSlides => {
                if (Array.isArray(dbSlides) && dbSlides.length > 0) {
                  const matchedSlides = dbSlides.map(slide => {
                    const article = data.find((art: any) => {
                      const expectedLink = `/news/${art.slug}`;
                      return slide.link === expectedLink || slide.title === art.title;
                    });
                    return {
                      title: slide.title,
                      image: slide.image,
                      link: slide.link || '',
                      articleId: article ? String(article.id) : undefined
                    };
                  });
                  setSliderSlidesList(matchedSlides);
                  const selectedIds = new Set(matchedSlides.map(s => s.articleId).filter(Boolean) as string[]);
                  setSliderSelectedIds(selectedIds);
                }
              })
              .catch(err => console.error("Error fetching slides from DB:", err));

            // Fetch Flash News from API
            fetch('/api/flash-news?t=' + Date.now())
              .then(res => res.ok ? res.json() : [])
              .then(dbFlash => {
                if (Array.isArray(dbFlash) && dbFlash.length > 0) {
                  setFlashNewsList(dbFlash.map((item: any) => ({ text: item.text, link: item.link })));
                }
              })
              .catch(err => console.error("Error fetching flash news from DB:", err));

            // Fetch Trending News from API
            fetch('/api/trending-news?t=' + Date.now())
              .then(res => res.ok ? res.json() : [])
              .then(dbTrending => {
                if (Array.isArray(dbTrending) && dbTrending.length > 0) {
                  setTrendingNewsList(dbTrending.map((item: any) => ({ text: item.text, link: item.link })));
                }
              })
              .catch(err => console.error("Error fetching trending news from DB:", err));
        }
      })
      .catch(err => console.error('Error loading articles in admin:', err));


    // Load Flash news
    try {
      const savedTicker = localStorage.getItem('flash_news_items');
      if (savedTicker) {
        setFlashNewsList(JSON.parse(savedTicker));
      } else {
        const defaults = [
          { text: "ముంబై ఎయిర్‌పోర్ట్‌లో భారీగా బంగారం పట్టివేత", link: "/search?q=బంగారం" },
          { text: "నేడు ఏపీ కేబినెట్‌ కీలక భేటీ.. పలు కీలక నిర్ణయాలు తీసుకునే అవకాశం", link: "/search?q=ఏపీ కేబినెట్‌" },
          { text: "తెలంగాణలో రాబోయే రెండు రోజుల్లో భారీ వర్షాలు కురిసే అవకాశం", link: "/search?q=వర్షాలు" },
          { text: "భారత క్రికెట్ జట్టు సంచలన విజయం.. సిరీస్ సొంతం చేసుకున్న టీమిండియా", link: "/search?q=క్రికెట్" }
        ];
        setFlashNewsList(defaults);
      }
      const savedLabel = localStorage.getItem('flash_news_label');
      if (savedLabel) {
        setFlashNewsLabel(savedLabel);
      }
    } catch {
      setFlashNewsList([]);
    }

    // Load Trending news ticker items
    try {
      const savedTrending = localStorage.getItem('trending_news_items');
      if (savedTrending) {
        setTrendingNewsList(JSON.parse(savedTrending));
      } else {
        const trendingDefaults = [
          { text: "ఎన్నికల ఫలితాలు", link: "/search?q=ఎన్నికల ఫలితాలు" },
          { text: "ఆంధ్రప్రదేశ్‌లో భారీ వర్షాలు", link: "/search?q=వర్షాలు" },
          { text: "హైదరాబాద్ మెట్రో విస్తరణ", link: "/search?q=మెట్రో" },
          { text: "బంగారం ధరలు నేటి అప్‌డేట్స్", link: "/search?q=బంగారం" },
          { text: "టీమిండియా వన్డే సిరీస్ విజయం", link: "/search?q=క్రికెట్" },
          { text: "నేటి రాశిఫలాలు", link: "/search?q=రాశిఫలాలు" },
          { text: "వెబ్ స్టోరీస్ గ్యాలరీ", link: "/category/webstories" }
        ];
        setTrendingNewsList(trendingDefaults);
      }
    } catch {
      setTrendingNewsList([]);
    }

    // Load E-paper list
    fetchEpapersData();

    // Fetch unified database settings
    fetch('/api/settings?t=' + Date.now())
      .then(res => res.ok ? res.json() : {})
      .then((dbSettings: any) => {
        const getSetting = (key: string, defaultValue: string = '') => {
          if (dbSettings[key] !== undefined && dbSettings[key] !== null) return dbSettings[key];
          return defaultValue;
        };

        // 1. Web Stories list
        const storiesVal = getSetting('custom_web_stories');
        if (storiesVal) {
          try { setWebStoriesList(JSON.parse(storiesVal)); } catch {}
        } else {
          setWebStoriesList([]);
        }

        // 2. Category Sidebar news pins
        const pinsVal = getSetting('sidebar_category_pins');
        if (pinsVal) {
          try { setSidebarCategoryPins(JSON.parse(pinsVal)); } catch {}
        }

        // 3. Weather Reports data
        const weatherVal = getSetting('weather_page_reports_data');
        if (weatherVal) {
          try { setWeatherReports(JSON.parse(weatherVal)); } catch {}
        } else {
          setWeatherReports(DEFAULT_WEATHER_DATA);
        }

        // 4. Horoscope daily data
        const horoscopeVal = getSetting('horoscope_daily_data');
        if (horoscopeVal) {
          try {
            const parsed = JSON.parse(horoscopeVal);
            setHoroscopeDate(parsed.date || '');
            setHoroscopeWeeklyRange(parsed.weeklyRange || '');
            const rawPanchangam = parsed.panchangam || '';
            const parts = splitPanchangam(rawPanchangam);
            setHoroscopePanchangamTitle(parts[0] || '');
            setHoroscopePanchangam(parts.slice(1).join('; '));
            setHoroscopePredictions(parsed.predictions || DEFAULT_HOROSCOPE_PREDICTIONS);
          } catch {}
        } else {
          const days = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
          const now = new Date();
          const formattedDate = `తేది: ${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}, ${days[now.getDay()]}`;
          setHoroscopeDate(formattedDate);
          setHoroscopeWeeklyRange('');
          const parts = splitPanchangam(DEFAULT_HOROSCOPE_PANCHANGAM);
          setHoroscopePanchangamTitle(parts[0] || '');
          setHoroscopePanchangam(parts.slice(1).join('; '));
          setHoroscopePredictions(DEFAULT_HOROSCOPE_PREDICTIONS);
        }

        // 5. Custom Ads
        const adsVal = getSetting('custom_ads_config');
        if (adsVal) {
          try {
            const parsedAds = JSON.parse(adsVal);
            setCustomAds(parsedAds);
            const activeAd = parsedAds[activeAdSpot] || { enabled: false, image: '', link: '#' };
            setAdSpotEnabled(activeAd.enabled);
            setAdSpotImage(activeAd.image);
            setAdSpotLink(activeAd.link);
          } catch {}
        } else {
          setCustomAds({});
        }

        // 6. Popups/Polls
        const savedEnabled = getSetting(`promo_popup_${popupScope}_enabled`);
        const savedType = getSetting(`promo_popup_${popupScope}_type`);
        const savedAdImage = getSetting(`promo_ad_${popupScope}_image`);
        const savedAdLink = getSetting(`promo_ad_${popupScope}_link`);
        const savedPollQuestion = getSetting(`promo_poll_${popupScope}_question`);
        const savedOptYes = getSetting(`promo_poll_${popupScope}_option_yes`);
        const savedOptNo = getSetting(`promo_poll_${popupScope}_option_no`);
        const savedOptUnsure = getSetting(`promo_poll_${popupScope}_option_unsure`);

        setPopupEnabled(savedEnabled === null ? true : savedEnabled === 'true');
        setPopupType((savedType as 'ad' | 'poll') || 'ad');
        setAdImage(savedAdImage || '/popup-ad.png');
        setAdLink(savedAdLink || '#');
        setPollQuestion(savedPollQuestion || 'కాంగ్రెస్‌లో టీఎన్ఎస్ పార్టీని విలీనం చేస్తారని మీరు భావిస్తున్నారా?');
        setOptYes(savedOptYes || 'అవును');
        setOptNo(savedOptNo || 'కాదు');
        setOptUnsure(savedOptUnsure || 'చెప్పలేం');

        // 7. Inline Image & Promos
        setInlineImageEnabled(getSetting('inline_article_image_enabled') === 'true');
        setInlineImageData(getSetting('inline_article_image_data') || '');
        setInlineImageCaption(getSetting('inline_article_image_caption') || 'యోగ ఆసనాలు వేస్తున్న మోదీ..');
        const savedInlinePromos = getSetting('inline_article_promos_enabled', 'true');
        setInlinePromosEnabled(savedInlinePromos === null ? true : savedInlinePromos === 'true');

        // 8. Homepage banner slides fallback
        const savedSlides = getSetting('homepage_banner_slides');
        if (savedSlides) {
          try { setSliderSlidesList(JSON.parse(savedSlides)); } catch {}
        } else {
          const defaults = featuredNews.map(item => ({
            title: item.title,
            image: item.image,
            link: `/news/${item.slug}`
          }));
          setSliderSlidesList(defaults);
        }
        const savedSliderIds = getSetting('homepage_slider_article_ids');
        if (savedSliderIds) {
          try { setSliderSelectedIds(new Set(JSON.parse(savedSliderIds))); } catch {}
        }
        // Load latest videos from server on mount
        fetch('/api/latest-videos?t=' + Date.now())
          .then(res => res.ok ? res.json() : [])
          .then(dbVideos => {
            if (Array.isArray(dbVideos)) {
              setVideosList(dbVideos);
            }
          })
          .catch(err => console.error("Error fetching latest videos:", err));
      })
      .catch(err => console.error("Error loading unified settings:", err));
  }, [isAuthenticated, popupScope, activeAdSpot, refreshCounter]);

  // Initialize Horoscope Panchangam editor content when tab becomes active
  useEffect(() => {
    if (activeTab === 'horoscope') {
      if (horoscopePanchangamRef.current) {
        horoscopePanchangamRef.current.innerHTML = horoscopePanchangam;
      }
    }
  }, [activeTab]);

  // Clear published date when switching to add mode — it will be set automatically at publish time
  useEffect(() => {
    if (newsViewMode === 'add') {
      setNewsPublishedDate(''); // Will be auto-set to current time when Publish is clicked
      setNewsTitle('');
      setNewsSlug('');
      setNewsDescription('');
      setNewsTags([]);
      setMetaDescription('');
      setNewsImage('');
      setNewsVideo('');
      setEditingArticle(null);
      
      // Auto-check Target Placement based on current sidebar filterCategory
      setIsBreakingChecked(filterCategory === 'latest');
      setIsTrendingChecked(filterCategory === 'trending');
      setIsFeaturedChecked(filterCategory === 'featured');

      // Auto-check filterCategory in classification tree
      if (pendingAddCategoryRef.current) {
        setSelectedCategories([pendingAddCategoryRef.current]);
        pendingAddCategoryRef.current = null;
      } else if (
        filterCategory !== 'all' && 
        filterCategory !== 'latest' && 
        filterCategory !== 'trending' && 
        filterCategory !== 'featured'
      ) {
        setSelectedCategories([filterCategory]);
      } else {
        setSelectedCategories([]);
      }
      setTimeout(() => {
        if (editorRef.current) editorRef.current.innerHTML = '';
        if (newsTitleRef.current) newsTitleRef.current.innerHTML = '';
        if (newsDescriptionRef.current) newsDescriptionRef.current.innerHTML = '';
        if (weatherTitleRef.current) weatherTitleRef.current.innerHTML = '';
        if (weatherDescriptionRef.current) weatherDescriptionRef.current.innerHTML = '';
      }, 50);
    }
  }, [newsViewMode, filterCategory]);

  // Auto slug generation — produces English-only slug (strips Telugu/non-ASCII chars)
  useEffect(() => {
    if (newsViewMode === 'add' && newsTitle) {
      const cleanTitle = newsTitle.trim().toLowerCase()
        .replace(/[\u0C00-\u0C7F\u0900-\u097F\u0600-\u06FF]/g, '') // Strip Telugu, Hindi, Arabic scripts
        .replace(/[^a-z0-9\s-]/g, '')  // Keep only English letters, numbers, spaces, hyphens
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/-+/g, '-')            // Collapse multiple hyphens
        .replace(/^-|-$/g, '');         // Trim leading/trailing hyphens
      const suffix = Date.now().toString().slice(-4);
      setNewsSlug(cleanTitle ? `${cleanTitle}-${suffix}` : `article-${suffix}`);
    }
  }, [newsTitle, newsViewMode]);

  // Canvas Image Compression (rescale to max 800px width, 70% quality JPG)
  const handleCompressAndSetImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedBase64);
      };
    };
  };

  // ── Handle featured image upload
  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        setNewsImage(base64);
      });
    }
  };

  // ── Handle short video upload
  const handleNewsVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        alert('Video file is too large! Please select a file smaller than 100MB.');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setNewsVideo(reader.result as string);
      };
    }
  };

  // ── Shorts Tab Handlers
  const handleShortVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        alert('Video file is too large! Please select a file smaller than 100MB.');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setShortVideo(reader.result as string);
      };
    }
  };

  const handleShortCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        setShortCoverImage(base64);
      });
    }
  };

  // ── Photo Gallery Tab Handlers
  const handlePhotoCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        setPhotoImage(base64);
      });
    }
  };

  const handleStartEditPhoto = (art: any) => {
    setEditingPhotoAlbum(art);
    setPhotoTitle(art.title || '');
    setPhotoDescription(art.description || '');
    setPhotoImage(art.image || '');
    setPhotosFormMode('edit');
  };

  const handleSavePhotoAlbum = async () => {
    if (!photoTitle.trim() || !photoImage) {
      alert('Title/Caption and Photo Image file are required!');
      return;
    }
    
    setIsSavingArticle(true);
    
    const articleData = {
      title: photoTitle.trim(),
      slug: (photosFormMode === 'edit' && editingPhotoAlbum) ? editingPhotoAlbum.slug : `photo-${Date.now().toString().slice(-6)}`,
      categorySlug: 'photos',
      category: 'ఫోటో గ్యాలరీ',
      districtSlug: '',
      author: 'హై టీవీ డెస్క్',
      publishedAt: new Date().toISOString(),
      description: photoDescription.trim() || photoTitle.trim(),
      body: photoDescription.trim() || photoTitle.trim(),
      image: photoImage,
      isBreaking: false,
      isTrending: false,
      isFeatured: false
    };

    try {
      if (photosFormMode === 'add') {
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });
        if (response.ok) {
          const added = await response.json();
          setCustomNewsList(prev => [added, ...prev]);
          alert('Photo uploaded to gallery successfully!');
        } else {
          const errData = await response.json().catch(() => ({}));
          alert('Failed to save photo: ' + (errData.error || response.statusText || 'Unknown error'));
        }
      } else if (photosFormMode === 'edit' && editingPhotoAlbum) {
        const response = await fetch(`/api/articles/${editingPhotoAlbum.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });

        if (response.ok) {
          const updated = await response.json();
          setCustomNewsList(prev => prev.map(a => a.id === editingPhotoAlbum.id ? updated : a));
          alert('Photo Album updated successfully!');
        } else {
          alert('Failed to update photo.');
        }
      }
      setPhotosFormMode('list');
      setEditingPhotoAlbum(null);
      setPhotoTitle('');
      setPhotoDescription('');
      setPhotoImage('');
    } catch (err: any) {
      console.error(err);
      alert('Error saving photo: ' + (err.message || String(err)));
    } finally {
      setIsSavingArticle(false);
    }
  };

  // ── Polls Tab Handlers
  const handleStartEditPoll = (art: any) => {
    setEditingPoll(art);
    setCmsPollQuestion(art.title || '');
    try {
      const parsedDesc = JSON.parse(art.description || '{}');
      if (parsedDesc.startDate && parsedDesc.endDate) {
        setPollStartDate(parsedDesc.startDate);
        setPollEndDate(parsedDesc.endDate);
      } else {
        setPollStartDate(new Date(art.publishedAt || Date.now()).toISOString().split('T')[0]);
        setPollEndDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      }
    } catch (e) {
      setPollStartDate(new Date(art.publishedAt || Date.now()).toISOString().split('T')[0]);
      setPollEndDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
    setPollScope(art.districtSlug === 'article' ? 'article' : 'general');
    try {
      const parsedOptions = JSON.parse(art.body || '[]');
      // Load all existing options dynamically
      const filledOptions = parsedOptions.length >= 2
        ? parsedOptions.map((o: any, i: number) => ({
            id: o.id || String.fromCharCode(97 + i),
            label: o.label || '',
            votes: o.votes || 0,
          }))
        : [
            { id: 'a', label: '', votes: 0 },
            { id: 'b', label: '', votes: 0 },
          ];
      setPollOptions(filledOptions);
    } catch (e) {
      setPollOptions([
        { id: 'a', label: '', votes: 0 },
        { id: 'b', label: '', votes: 0 },
      ]);
    }
    setPollsFormMode('edit');
  };

  const handleSavePoll = async () => {
    if (!cmsPollQuestion.trim()) {
      alert('Poll Question is required!');
      return;
    }
    
    // Filter options that are not empty
    const activeOpts = pollOptions.filter(opt => opt.label.trim() !== '');
    if (activeOpts.length < 2) {
      alert('At least two Options are required!');
      return;
    }

    setIsSavingArticle(true);
    
    const formattedOptions = activeOpts.map((opt, idx) => ({
      id: opt.id || String.fromCharCode(97 + idx), // a, b, c, d
      label: opt.label.trim(),
      votes: opt.votes || 0
    }));

    const articleData = {
      title: cmsPollQuestion.trim(),
      slug: (pollsFormMode === 'edit' && editingPoll) ? editingPoll.slug : `poll-${Date.now().toString().slice(-6)}`,
      categorySlug: 'polls',
      category: 'పోల్స్',
      districtSlug: pollScope,
      author: 'హై టీవీ డెస్క్',
      publishedAt: new Date().toISOString(),
      description: JSON.stringify({ startDate: pollStartDate, endDate: pollEndDate }),
      body: JSON.stringify(formattedOptions),
      image: '',
      isBreaking: false,
      isTrending: false,
      isFeatured: false
    };

    try {
      if (pollsFormMode === 'add') {
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });
        if (response.ok) {
          const added = await response.json();
          setCustomNewsList(prev => [added, ...prev]);
          alert('Poll created successfully!');
        } else {
          const errData = await response.json().catch(() => ({}));
          alert('Failed to save poll: ' + (errData.error || response.statusText || 'Unknown error'));
        }
      } else if (pollsFormMode === 'edit' && editingPoll) {
        const response = await fetch(`/api/articles/${editingPoll.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });

        if (response.ok) {
          const updated = await response.json();
          setCustomNewsList(prev => prev.map(a => a.id === editingPoll.id ? updated : a));
          alert('Poll updated successfully!');
        } else {
          alert('Failed to update poll.');
        }
      }
      setPollsFormMode('list');
      setEditingPoll(null);
      setCmsPollQuestion('');
      setPollStartDate(new Date().toISOString().split('T')[0]);
      setPollEndDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setPollScope('general');
      setPollOptions([
        { id: 'a', label: '', votes: 0 },
        { id: 'b', label: '', votes: 0 },
      ]);
    } catch (err: any) {
      console.error(err);
      alert('Error saving poll: ' + (err.message || String(err)));
    } finally {
      setIsSavingArticle(false);
    }
  };

  const handleStartEditShort = (art: any) => {
    setEditingShort(art);
    setShortTitle(art.title || '');
    setShortDescription(art.description || '');
    setShortCoverImage(art.image || '');
    
    if (art.body) {
      const videoMatch = art.body.match(/<video[^>]+src=["']([^"']+)["']/i);
      if (videoMatch) {
        setShortVideo(videoMatch[1]);
      } else {
        setShortVideo('');
      }
    } else {
      setShortVideo('');
    }
    
    setShortsFormMode('edit');
  };

  const handleSaveShort = async () => {
    if (!shortTitle.trim() || !shortVideo) {
      alert('Title and Video File are required!');
      return;
    }
    
    setIsSavingArticle(true);
    
    const cleanBodyHTML = `<video src="${shortVideo}" controls class="w-full h-auto rounded-xl my-4 block"></video>`;
    
    const articleData = {
      title: shortTitle.trim(),
      slug: (shortsFormMode === 'edit' && editingShort) ? editingShort.slug : `short-${Date.now().toString().slice(-6)}`,
      categorySlug: 'shorts',
      category: 'షార్ట్స్',
      districtSlug: '',
      author: 'హై టీవీ డెస్క్',
      publishedAt: new Date().toISOString(),
      description: shortDescription.trim() || shortTitle.trim(),
      body: cleanBodyHTML,
      image: shortCoverImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop',
      isBreaking: false,
      isTrending: false,
      isFeatured: false
    };

    try {
      if (shortsFormMode === 'add') {
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });
        if (response.ok) {
          const added = await response.json();
          setCustomNewsList(prev => [added, ...prev]);
          alert('Short Video uploaded successfully!');
        } else {
          const errData = await response.json().catch(() => ({}));
          alert('Failed to save short: ' + (errData.error || response.statusText || 'Unknown error'));
        }
      } else if (shortsFormMode === 'edit' && editingShort) {
        const response = await fetch(`/api/articles/${editingShort.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });

        if (response.ok) {
          const updated = await response.json();
          setCustomNewsList(prev => prev.map(a => a.id === editingShort.id ? updated : a));
          alert('Short Video updated successfully!');
        } else {
          alert('Failed to update short.');
        }
      }
      setShortsFormMode('list');
      setEditingShort(null);
      setShortTitle('');
      setShortDescription('');
      setShortCoverImage('');
      setShortVideo('');
    } catch (err: any) {
      console.error(err);
      alert('Error saving short: ' + (err.message || String(err)));
    } finally {
      setIsSavingArticle(false);
    }
  };

  // ── WYSIWYG execCommand formatting helpers
  const restoreNewsSelection = () => {
    if (!savedSelectionRangeRef.current) return;
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelectionRangeRef.current);
    }
  };

  const handleFormat = (command: string, value: string = '') => {
    restoreNewsSelection();
    document.execCommand(command, false, value);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
    editorRef.current?.focus();
  };

  const handleFontSize = (size: string) => {
    if (!size) return;
    restoreNewsSelection();
    applySelectedFontSize(editorRef.current, size);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
    editorRef.current?.focus();
  };

  const handleEditorFormat = (ref: React.RefObject<HTMLDivElement | null>, command: string, value: string = '') => {
    document.execCommand(command, false, value);
    ref.current?.focus();
  };

  const handleEditorFontSize = (ref: React.RefObject<HTMLDivElement | null>, size: string) => {
    if (!ref.current || !size) return;
    applySelectedFontSize(ref.current, size);
    ref.current.focus();
  };

  // ── Inline Media Upload & Reference Insertion
  const handleInlineImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        try {
          const mediaLibrary = JSON.parse(localStorage.getItem('custom_media_library') || '{}');
          const mediaId = `img-${Date.now()}`;
          const mediaPath = `/uploaded-media/${mediaId}.jpg`;
          
          mediaLibrary[mediaPath] = base64;
          localStorage.setItem('custom_media_library', JSON.stringify(mediaLibrary));
          
          // Insert actual HTML image element in editor with raw base64 as src
          const imgHTML = `<img src="${base64}" class="w-full h-auto rounded-xl my-4 block" alt="inline-img" />`;
          insertElementAtCursor(imgHTML);
        } catch {
          alert('Local media library is full! Compress your image or clear browser history.');
        }
      });
    }
  };

  const handleInlineVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Video file is too large! Please select a file smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        try {
          const mediaLibrary = JSON.parse(localStorage.getItem('custom_media_library') || '{}');
          const mediaId = `vid-${Date.now()}`;
          const mediaPath = `/uploaded-media/${mediaId}.mp4`;
          
          mediaLibrary[mediaPath] = reader.result as string;
          localStorage.setItem('custom_media_library', JSON.stringify(mediaLibrary));
          
          // Insert actual video element in editor with raw dataURL as src
          const videoHTML = `<video src="${reader.result as string}" controls class="w-full h-auto rounded-xl my-4 block"></video>`;
          insertElementAtCursor(videoHTML);
        } catch {
          alert('Local media library is full! Please use shorter videos.');
        }
      };
    }
  };

  const insertElementAtCursor = (html: string) => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const div = document.createElement('div');
      div.innerHTML = html;
      const fragment = document.createDocumentFragment();
      let child;
      while ((child = div.firstChild)) {
        fragment.appendChild(child);
      }
      range.insertNode(fragment);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
      }
    }
  };

  const handleOpenPromoModal = () => {
    // Save current range before opening modal
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRangeRef.current = selection.getRangeAt(0).cloneRange();
    } else {
      savedSelectionRangeRef.current = null;
    }
    setPromoSearchQuery('');
    setCustomPromoTitle('');
    setCustomPromoSlug('');
    setShowPromoLinkModal(true);
  };

  const handleInsertPromoLink = (title: string, slug: string) => {
    const cleanSlug = slug.trim().replace(/^\//, ''); // Clean leading slash if any
    const linkUrl = cleanSlug.startsWith('http') ? cleanSlug : `/news/${cleanSlug}`;
    const promoHtml = `<div data-promo-box="true" class="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2.5 bg-red-50/50 border-l-4 border-[#e60000] rounded px-4 py-3 my-4 text-[14px] md:text-[18px] select-none" contenteditable="false" style="border-left: 4px solid #e60000; background-color: rgba(254, 242, 242, 0.5); padding: 12px 16px; margin: 16px 0; border-radius: 4px; display: flex; flex-direction: row; gap: 10px; align-items: flex-start; text-align: left;"><span class="text-[#e60000] font-black flex-shrink-0 telugu-text font-bold" style="font-family: 'Noto Sans Telugu', sans-serif; color: #e60000; font-weight: bold; flex-shrink: 0; white-space: nowrap;">ఈ వార్తా చదవండి:</span><a href="${linkUrl}" class="text-[#02599c] font-bold hover:text-[#e60000] hover:underline transition-colors telugu-text leading-snug" style="font-family: 'Noto Sans Telugu', sans-serif; color: #02599c; font-weight: bold; text-decoration: none; line-height: 1.375;">${title}</a></div>`;

    editorRef.current?.focus();
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      if (savedSelectionRangeRef.current) {
        selection.addRange(savedSelectionRangeRef.current);
      }
    }

    insertElementAtCursor(promoHtml);
    setShowPromoLinkModal(false);
  };

  // ── Image Resizer: calculate and show overlay over clicked image
  const updateResizerPosition = (img: HTMLImageElement) => {
    const wrapper = editorWrapperRef.current;
    if (!wrapper) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    setResizerStyle({
      top: imgRect.top - wrapperRect.top + wrapper.scrollTop,
      left: imgRect.left - wrapperRect.left,
      width: imgRect.width,
      height: imgRect.height,
    });
  };

  const updatePromoBoxPosition = (box: HTMLDivElement) => {
    const wrapper = editorWrapperRef.current;
    if (!wrapper) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    setPromoBoxStyle({
      top: boxRect.top - wrapperRect.top + wrapper.scrollTop,
      left: boxRect.left - wrapperRect.left,
      width: boxRect.width,
      height: boxRect.height,
    });
  };

  const handleEditorImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    // 1. Check if we clicked on or inside a related news promo box
    const promoBox = target.closest('[data-promo-box="true"]') as HTMLDivElement | null;
    if (promoBox) {
      setSelectedPromoBox(promoBox);
      updatePromoBoxPosition(promoBox);
      
      // Clear image selection
      setSelectedImage(null);
      setResizerStyle(null);
      return;
    } else {
      setSelectedPromoBox(null);
      setPromoBoxStyle(null);
    }

    // 2. Original Image Selection
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      setSelectedImage(img);
      updateResizerPosition(img);
    } else {
      // Click outside image — deselect
      setSelectedImage(null);
      setResizerStyle(null);
    }
  };

  const handleResizerMouseDown = (e: React.MouseEvent<HTMLDivElement>, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImage || !resizerStyle) return;
    resizeDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: resizerStyle.width,
      startH: resizerStyle.height,
      handle,
    };
    const onMouseMove = (ev: MouseEvent) => {
      if (!resizeDragRef.current || !selectedImage) return;
      const { startX, startY, startW, startH, handle: h } = resizeDragRef.current;
      let dx = ev.clientX - startX;
      let dy = ev.clientY - startY;
      let newW = startW;
      let newH = startH;
      const aspectRatio = startH / startW;

      if (h === 'se') { newW = Math.max(60, startW + dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 'sw') { newW = Math.max(60, startW - dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 'ne') { newW = Math.max(60, startW + dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 'nw') { newW = Math.max(60, startW - dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 'e') { newW = Math.max(60, startW + dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 'w') { newW = Math.max(60, startW - dx); newH = Math.round(newW * aspectRatio); }
      else if (h === 's') { newH = Math.max(40, startH + dy); newW = Math.round(newH / aspectRatio); }
      else if (h === 'n') { newH = Math.max(40, startH - dy); newW = Math.round(newH / aspectRatio); }

      selectedImage.style.width = `${newW}px`;
      selectedImage.style.height = `${newH}px`;
      updateResizerPosition(selectedImage);
    };
    const onMouseUp = () => {
      resizeDragRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Update resizer when window/editor scrolls
  const handleEditorScroll = () => {
    if (selectedImage) updateResizerPosition(selectedImage);
    if (selectedPromoBox) updatePromoBoxPosition(selectedPromoBox);
  };

  // ── Image Drag-to-Move handler
  const handleImageMoveStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImage) return;

    const img = selectedImage;
    const editor = editorRef.current;
    if (!editor) return;

    // Create ghost element that follows the cursor
    const ghost = document.createElement('div');
    ghost.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:9999',
      'opacity:0.55',
      'border:2px dashed #2563eb',
      'border-radius:6px',
      'background:#dbeafe',
      `width:${img.offsetWidth}px`,
      `height:${img.offsetHeight}px`,
      'transition:none',
    ].join(';');
    const ghostImg = document.createElement('img');
    ghostImg.src = img.src;
    ghostImg.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:4px;display:block;';
    ghost.appendChild(ghostImg);
    document.body.appendChild(ghost);

    // Offset so ghost is centered on cursor
    const offsetX = img.offsetWidth / 2;
    const offsetY = img.offsetHeight / 2;

    const moveGhost = (ev: MouseEvent) => {
      ghost.style.left = `${ev.clientX - offsetX}px`;
      ghost.style.top  = `${ev.clientY - offsetY}px`;
    };
    moveGhost(e.nativeEvent);

    // Show cursor drop indicator inside editor while dragging
    let dropIndicator: HTMLElement | null = null;

    const onMouseMove = (ev: MouseEvent) => {
      moveGhost(ev);

      // Highlight drop position using caret
      if (dropIndicator) { dropIndicator.remove(); dropIndicator = null; }

      const range = (() => {
        if ((document as any).caretRangeFromPoint) {
          return (document as any).caretRangeFromPoint(ev.clientX, ev.clientY) as Range | null;
        }
        if ((document as any).caretPositionFromPoint) {
          const pos = (document as any).caretPositionFromPoint(ev.clientX, ev.clientY);
          if (pos) {
            const r = document.createRange();
            r.setStart(pos.offsetNode, pos.offset);
            r.collapse(true);
            return r;
          }
        }
        return null;
      })();

      if (range && editor.contains(range.startContainer)) {
        dropIndicator = document.createElement('span');
        dropIndicator.style.cssText = 'display:inline-block;width:2px;height:1.2em;background:#2563eb;vertical-align:text-top;animation:none;pointer-events:none;border-radius:1px;';
        range.insertNode(dropIndicator);
      }
    };

    const onMouseUp = (ev: MouseEvent) => {
      ghost.remove();
      if (dropIndicator) { dropIndicator.remove(); dropIndicator = null; }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      // Find drop range in editor
      const range = (() => {
        if ((document as any).caretRangeFromPoint) {
          return (document as any).caretRangeFromPoint(ev.clientX, ev.clientY) as Range | null;
        }
        if ((document as any).caretPositionFromPoint) {
          const pos = (document as any).caretPositionFromPoint(ev.clientX, ev.clientY);
          if (pos) {
            const r = document.createRange();
            r.setStart(pos.offsetNode, pos.offset);
            r.collapse(true);
            return r;
          }
        }
        return null;
      })();

      if (!range || !editor.contains(range.startContainer)) {
        // Dropped outside editor — do nothing
        updateResizerPosition(img);
        return;
      }

      // Don't move if drop target is the image itself
      if (range.startContainer === img || img.contains(range.startContainer)) {
        updateResizerPosition(img);
        return;
      }

      // Remove the image from its current position
      const imgParent = img.parentNode;
      const imgNextSibling = img.nextSibling;
      imgParent?.removeChild(img);

      // Re-insert at drop position
      try {
        range.insertNode(img);
      } catch {
        // Fallback: restore original position
        if (imgParent) {
          if (imgNextSibling) imgParent.insertBefore(img, imgNextSibling);
          else imgParent.appendChild(img);
        }
      }

      // Update selection to new position
      setSelectedImage(img);
      setTimeout(() => updateResizerPosition(img), 30);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Compile full article listings from the live database list
  const allArticles = useMemo(() => {
    const excludeCategories = [
      'team-member',
      'team-section',
      'polls',
      'sidebar-ad-category',
      'sidebar-ad-article-left',
      'sidebar-ad-article-right',
      'sidebar-ad-both',
      'header-ad',
      'sidebar-ad-epaper-left',
      'sidebar-ad-epaper-right',
      'sidebar-ad-epaper-header',
      'sidebar-ad-epaper-mobile'
    ];
    return [...customNewsList]
      .filter((art) => !excludeCategories.includes(art.categorySlug))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [customNewsList]);


  // Filter articles based on sidebar category filter selection
  const filteredArticles = useMemo(() => {
    let result = allArticles;

    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter((art) => {
        if (filterCategory === 'latest') {
          return art.isBreaking || art.categorySlug === 'latest';
        }
        if (filterCategory === 'trending') {
          return art.isTrending || art.categorySlug === 'trending';
        }
        if (filterCategory === 'featured') {
          return art.isFeatured || art.categorySlug === 'featured';
        }
        if (filterCategory === 'telangana' || filterCategory === 'andhra-pradesh') {
          return art.categorySlug === filterCategory && !art.districtSlug;
        }
        const categoriesToCheck = [art.categorySlug, art.districtSlug].filter(Boolean);
        return categoriesToCheck.includes(filterCategory);
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          (art.description && art.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allArticles, filterCategory, searchQuery]);

  // Quick Action: Toggle flags (isBreaking, isTrending, isFeatured) directly from news list table or edit form
  const toggleArticleFlag = async (articleId: string, flag: 'isBreaking' | 'isTrending' | 'isFeatured') => {
    try {
      const art = customNewsList.find(a => a.id === articleId);
      if (!art) return;
      const updatedValue = !art[flag];
      
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [flag]: updatedValue })
      });
      
      if (response.ok) {
        const updated = await response.json();
        setCustomNewsList(prev => prev.map(a => a.id === articleId ? updated : a));
      } else {
        alert('Failed to update article flag');
      }
    } catch (e) {
      console.error('Error toggling article flag:', e);
    }
  };


  // Custom Banner Slides Configuration helpers
  const handleAddBannerSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideTitle.trim() || !newSlideImage) {
      alert('Slide Title and Image are required!');
      return;
    }
    const newSlide = {
      title: newSlideTitle.trim(),
      image: newSlideImage,
      link: newSlideLink.trim()
    };
    let updated;
    if (editingSlideIndex !== null) {
      updated = [...sliderSlidesList];
      updated[editingSlideIndex] = newSlide;
      setEditingSlideIndex(null);
      alert('Homepage banner slide updated successfully!');
    } else {
      updated = [...sliderSlidesList, newSlide];
      alert('Homepage banner slide added successfully!');
    }
    setSliderSlidesList(updated);
    localStorage.setItem('homepage_banner_slides', JSON.stringify(updated));
    setNewSlideTitle('');
    setNewSlideImage('');
    setNewSlideLink('');
  };

  const startEditingSlide = (index: number) => {
    const slide = sliderSlidesList[index];
    if (slide) {
      setNewSlideTitle(slide.title);
      setNewSlideImage(slide.image);
      setNewSlideLink(slide.link || '');
      setEditingSlideIndex(index);
    }
  };

  const handleDeleteBannerSlide = (index: number) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    const updated = sliderSlidesList.filter((_, idx) => idx !== index);
    setSliderSlidesList(updated);
    localStorage.setItem('homepage_banner_slides', JSON.stringify(updated));
    if (editingSlideIndex === index) {
      setNewSlideTitle('');
      setNewSlideImage('');
      setNewSlideLink('');
      setEditingSlideIndex(null);
    }
  };

  const handleNewSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        setNewSlideImage(base64);
      });
    }
  };

  // Toggle an article in/out of the homepage hero slider
  const toggleSliderArticle = (article: any) => {
    const id = String(article.id);
    const next = new Set(sliderSelectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSliderSelectedIds(next);

    const allArticlesForSlider = [...customNewsList];
    const selectedSlides = [...next].map(sid => {
      const art = allArticlesForSlider.find((a: any) => String(a.id) === sid);
      if (!art) return null;
      return { title: art.title, image: art.image, link: `/news/${art.slug}`, articleId: sid };
    }).filter(Boolean) as any[];

    setSliderSlidesList(selectedSlides);
    localStorage.setItem('homepage_slider_article_ids', JSON.stringify([...next]));
    localStorage.setItem('homepage_banner_slides', JSON.stringify(selectedSlides));

    fetch('/api/slides', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedSlides)
    })
      .then(res => {
        if (!res.ok) console.error('Failed to save slides in DB');
      })
      .catch(err => console.error('Error saving slides in DB:', err));
  };

  // Toggle sidebar news pin (trending or breaking) for a category
  const toggleSidebarNewsPin = (category: string, type: 'trending' | 'breaking', articleId: any) => {
    const artIdStr = String(articleId);
    setSidebarCategoryPins(prev => {
      const catPins = prev[category] || { trending: [], breaking: [] };
      const currentList = catPins[type] || [];
      let newList;
      if (currentList.includes(artIdStr)) {
        newList = currentList.filter(id => id !== artIdStr);
      } else {
        newList = [...currentList, artIdStr];
      }
      
      const updated = {
        ...prev,
        [category]: {
          ...catPins,
          [type]: newList
        }
      };
      
      localStorage.setItem('sidebar_category_pins', JSON.stringify(updated));
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sidebar_category_pins: JSON.stringify(updated) })
      }).catch(err => console.error('Failed to sync sidebar category pins:', err));
      return updated;
    });
  };


  // Sidebar dynamic navigation list builders
  const toggleSidebarGroup = (group: string) => {
    setExpandedSidebar((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  // Classification check list toggles
  const toggleClassificationGroup = (group: string) => {
    setExpandedClassification((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleCategoryCheckboxChange = (slug: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      } else {
        return [...prev, slug];
      }
    });
  };

  // Submit new news article or edit existing article details
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingArticle) return;

    const isWeather = (weatherArticleFormMode !== 'list');
    const titleHtml = (isWeather ? weatherTitleRef.current?.innerHTML : newsTitleRef.current?.innerHTML) || '';
    const descriptionHtml = (isWeather ? weatherDescriptionRef.current?.innerHTML : newsDescriptionRef.current?.innerHTML) || '';

    // Plain text conversions for checks and slug generation
    const titlePlainText = titleHtml.replace(/<[^>]*>/g, '').trim();
    const descriptionPlainText = descriptionHtml.replace(/<[^>]*>/g, '').trim();

    if (!titlePlainText || !editorRef.current?.innerHTML.trim()) {
      alert('Title and Article Body Content are required!');
      return;
    }

    setIsSavingArticle(true);
    try {

    // Determine category configurations from checked boxes
    let categorySlug = 'politics';
    if (selectedCategories.length === 0) {
      if (filterCategory === 'latest' || filterCategory === 'trending' || filterCategory === 'featured') {
        categorySlug = filterCategory;
      }
    }
    let districtSlug = '';
    
    // Auto-resolve AP/TG district names, or categories
    const isApDist = apDistricts.find(d => selectedCategories.includes(d.slug));
    const isTgDist = tgDistricts.find(d => selectedCategories.includes(d.slug));

    if (isApDist) {
      categorySlug = 'andhra-pradesh';
      districtSlug = isApDist.slug;
    } else if (isTgDist) {
      categorySlug = 'telangana';
      districtSlug = isTgDist.slug;
    } else if (selectedCategories.includes('doctors-corner')) {
      categorySlug = 'doctors-corner';
    } else if (selectedCategories.includes('admissions')) {
      categorySlug = 'admissions';
    } else if (selectedCategories.includes('current-affairs')) {
      categorySlug = 'current-affairs';
    } else if (selectedCategories.includes('notification')) {
      categorySlug = 'notification';
    } else if (selectedCategories.length > 0) {
      categorySlug = selectedCategories[0];
    }

    // Resolve Telugu category name
    const resolvedCat = MAIN_CATEGORIES_LIST.find(c => c.slug === categorySlug)?.name.split(' ')[0] || categorySlug;

    // Save the raw HTML directly — base64 images are stored as-is in the DB
    // (No placeholder conversion: images display reliably without localStorage dependency)
    let cleanBodyHTML = editorRef.current.innerHTML;
    
    if (selectedCategories.includes('shorts')) {
      // Strip any existing video tags to avoid duplication
      cleanBodyHTML = cleanBodyHTML.replace(/<video[^>]*>([\s\S]*?)<\/video>/gi, '');
      cleanBodyHTML = cleanBodyHTML.replace(/<video[^>]*>/gi, '');
      
      if (newsVideo) {
        cleanBodyHTML = `<video src="${newsVideo}" controls class="w-full h-auto rounded-xl my-4 block"></video>` + cleanBodyHTML;
      }
    }
    const excerptText = newsDescription.trim() || descriptionPlainText || (editorRef.current ? editorRef.current.innerText.slice(0, 140).trim().replace(/<[^>]*>/g, '') + '...' : '');

    const slugToUse = newsSlug.trim() || (() => {
      const base = titlePlainText.toLowerCase()
        .replace(/[\u0C00-\u0C7F\u0900-\u097F\u0600-\u06FF]/g, '') // Strip Telugu/Hindi/Arabic
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return (base || 'article') + '-' + Date.now().toString().slice(-4);
    })();

    const articleData = {
      title: titlePlainText,
      slug: slugToUse,
      categorySlug,
      category: resolvedCat,
      districtSlug,
      author: newsAuthor.trim() || 'హై టీవీ డెస్క్',
      // For new articles: always use the exact current time when Publish is clicked
      // For edited articles: use the existing/manually set date
      publishedAt: newsViewMode === 'add'
        ? new Date().toISOString()
        : new Date(newsPublishedDate || Date.now()).toISOString(),
      description: excerptText,
      metaDescription: metaDescription.trim(),
      body: cleanBodyHTML,
      image: newsImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop',
      tags: newsTags,
      isBreaking: isBreakingChecked,
      isTrending: isTrendingChecked,
      isFeatured: isFeaturedChecked
    };

    if (newsViewMode === 'add') {
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });
        if (response.ok) {
          const added = await response.json();
          setCustomNewsList(prev => [added, ...prev]);
          alert('Article published successfully!');
          fetchAllTags();
        } else {
          const errData = await response.json().catch(() => ({}));
          alert('Failed to publish article: ' + (errData.error || response.statusText || 'Unknown error'));
        }
      } else if (newsViewMode === 'edit' && editingArticle) {
        try {
          const response = await fetch(`/api/articles/${editingArticle.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articleData)
          });

          if (response.ok) {
            const updated = await response.json();
            setCustomNewsList(prev => prev.map(a => a.id === editingArticle.id ? updated : a));
            alert('Article updated successfully!');
            fetchAllTags();
          } else {
            const errData = await response.json().catch(() => ({}));
            alert('Failed to update article: ' + (errData.details || errData.error || response.statusText));
          }
        } catch (e: any) {
          console.error('Error saving article edit:', e);
          alert('Failed to update article: ' + (e?.message || String(e)));
        }
      }

      setNewsViewMode('list');
      setRefreshCounter(prev => prev + 1);
    } catch (e) {
      console.error('Error saving article:', e);
      alert('Error saving article.');
    } finally {
      setIsSavingArticle(false);
    }
  };

  const editEditorialItem = (art: any) => {
    if (art.slug && art.slug.startsWith('editorial-img-')) {
      setEditorialEditingArticle(art);
      setEditorialImageCaption(art.title || '');
      setEditorialImageFile(art.image || '');
      const linked = art.body ? art.body.replace('[LINKED_ARTICLE_SLUG]:', '').trim() : '';
      setEditorialImageLinkSlug(linked);
      setEditorialFormMode('edit-image');
    } else {
      startEditing(art);
      setActiveTab('news');
    }
  };

  const startEditing = (art: any) => {
    setEditingArticle(art);
    setNewsTitle(art.title || '');
    setNewsSlug(art.slug || '');
    setNewsDescription(art.description || '');
    setNewsTags(art.tags ? art.tags.map((t: any) => ({ name: t.name, linkedArticleSlug: t.linkedArticleSlug || null })) : []);
    setMetaDescription(art.metaDescription || '');
    setNewsAuthor(art.author || '');
    const getLocalDatetimeString = (dateInput: any) => {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return '';
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    setNewsPublishedDate(art.publishedAt ? getLocalDatetimeString(art.publishedAt) : getLocalDatetimeString(new Date()));
    setNewsImage(art.image || '');
    
    // Resolve short video
    if (art.categorySlug === 'shorts' && art.body) {
      const videoMatch = art.body.match(/<video[^>]+src=["']([^"']+)["']/i);
      if (videoMatch) {
        setNewsVideo(videoMatch[1]);
      } else {
        setNewsVideo('');
      }
    } else {
      setNewsVideo('');
    }

    // Resolve checkbox array values
    const activeCheckboxes = [art.categorySlug];
    if (art.districtSlug) activeCheckboxes.push(art.districtSlug);
    setSelectedCategories(activeCheckboxes);

    setIsBreakingChecked(art.isBreaking || false);
    setIsTrendingChecked(art.isTrending || false);
    setIsFeaturedChecked(art.isFeatured || false);

    // Helper to resolve media library URL placeholders to raw base64 for local editor view
    const convertPlaceholdersToBase64 = (htmlContent: string) => {
      if (!htmlContent) return '';
      let resolved = htmlContent;
      try {
        const mediaLibrary = JSON.parse(localStorage.getItem('custom_media_library') || '{}');
        Object.entries(mediaLibrary).forEach(([mediaPath, base64]) => {
          if (typeof base64 === 'string' && base64.startsWith('data:')) {
            resolved = resolved.split(mediaPath).join(base64);
          }
        });
      } catch (e) {
        console.error('Error loading placeholders:', e);
      }
      return resolved;
    };

    setNewsViewMode('edit');
    setTimeout(() => {
      if (newsTitleRef.current) newsTitleRef.current.innerHTML = art.title || '';
      if (newsDescriptionRef.current) newsDescriptionRef.current.innerHTML = art.description || '';
      if (weatherTitleRef.current) weatherTitleRef.current.innerHTML = art.title || '';
      if (weatherDescriptionRef.current) weatherDescriptionRef.current.innerHTML = art.description || '';

      if (editorRef.current) {
        // Resolve any old-style placeholder paths back to base64 for articles that were
        // saved before this fix, then display the body as-is for newer articles
        const rawBody = art.body || art.content || '';
        let displayBody = rawBody;
        try {
          const mediaLibrary = JSON.parse(localStorage.getItem('custom_media_library') || '{}');
          Object.entries(mediaLibrary).forEach(([mediaPath, base64]) => {
            if (typeof base64 === 'string' && base64.startsWith('data:')) {
              displayBody = displayBody.split(mediaPath).join(base64);
            }
          });
        } catch (e) {
          console.error('Error resolving old placeholders:', e);
        }
        editorRef.current.innerHTML = displayBody;
      }
    }, 100);
  };



  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setCustomNewsList(prev => prev.filter(art => art.id !== articleId));
        alert('Article deleted successfully!');
      } else {
        alert('Failed to delete article.');
      }
    } catch (e: any) {
      console.error('Error deleting article:', e);
      alert('Failed to delete article: ' + (e.message || String(e)));
    }
  };

  const resetWebStoryForm = () => {
    setWebStoryTitle('');
    setWebStoryCoverImage('');
    setWebStoryCoverTitle('');
    setWebStoryCoverStyle('red-white');
    setWebStorySlides([{ image: '', text: '', textStyle: 'red-white' }]);
    setEditingWebStory(null);
  };

  const handleSaveWebStory = () => {
    if (!webStoryTitle.trim() || !webStoryCoverTitle.trim() || !webStoryCoverImage) {
      alert('Title, Cover Title, and Cover Image are required!');
      return;
    }
    // Check if slides are populated
    const validSlides = webStorySlides.filter(s => s.image && s.text.trim());
    if (validSlides.length === 0) {
      alert('At least one valid slide with an image and text description is required!');
      return;
    }

    let updatedList = [...webStoriesList];
    if (webStoryFormMode === 'edit' && editingWebStory) {
      const idx = updatedList.findIndex(story => story.id === editingWebStory.id);
      if (idx !== -1) {
        updatedList[idx] = {
          ...editingWebStory,
          title: webStoryTitle.trim(),
          coverImage: webStoryCoverImage,
          coverTitle: webStoryCoverTitle.trim(),
          coverStyle: webStoryCoverStyle,
          slides: validSlides
        };
      }
      alert('Web Story updated successfully!');
    } else {
      const newStory = {
        id: `story-custom-${Date.now()}`,
        title: webStoryTitle.trim(),
        coverImage: webStoryCoverImage,
        coverTitle: webStoryCoverTitle.trim(),
        coverStyle: webStoryCoverStyle,
        slides: validSlides
      };
      updatedList = [newStory, ...updatedList];
      alert('Web Story created successfully!');
    }

    setWebStoriesList(updatedList);
    localStorage.setItem('custom_web_stories', JSON.stringify(updatedList));
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ custom_web_stories: JSON.stringify(updatedList) })
    }).catch(err => console.error('Failed to sync web stories:', err));
    setWebStoryFormMode('list');
    resetWebStoryForm();
  };

  const handleDeleteWebStory = (id: string) => {
    if (!confirm('Are you sure you want to delete this Web Story?')) return;
    const updatedList = webStoriesList.filter(story => story.id !== id);
    setWebStoriesList(updatedList);
    localStorage.setItem('custom_web_stories', JSON.stringify(updatedList));
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ custom_web_stories: JSON.stringify(updatedList) })
    }).catch(err => console.error('Failed to sync web stories:', err));
    alert('Web Story deleted successfully!');
  };

  const handleStartEditWebStory = (story: any) => {
    setEditingWebStory(story);
    setWebStoryTitle(story.title || '');
    setWebStoryCoverImage(story.coverImage || '');
    setWebStoryCoverTitle(story.coverTitle || '');
    setWebStoryCoverStyle(story.coverStyle || 'red-white');
    setWebStorySlides(story.slides && story.slides.length > 0 ? story.slides : [{ image: '', text: '', textStyle: 'red-white' }]);
    setWebStoryFormMode('edit');
  };

  const handleStartEditEpaper = (paper: { id: string; title: string; date: string; pdfUrl: string; section: string }) => {
    setEditingEpaperId(paper.id);
    setEpaperTitle(paper.title);
    setEpaperDate(paper.date);
    setEpaperPdf(paper.pdfUrl);

    const sec = paper.section || 'main';
    if (sec === 'main' || sec === 'general-main' || sec === 'telangana-main' || sec === 'ap-main' || sec === 'hyderabad-main') {
      setEpaperSection('main');
      setEpaperDistrict(sec === 'main' ? '' : sec);
    } else if (sec.startsWith('telangana-')) {
      setEpaperSection('telangana');
      setEpaperDistrict(sec.replace('telangana-', ''));
    } else if (sec.startsWith('ap-')) {
      setEpaperSection('ap');
      setEpaperDistrict(sec.replace('ap-', ''));
    } else {
      setEpaperSection(sec);
      setEpaperDistrict('');
    }

    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCancelEditEpaper = () => {
    setEditingEpaperId(null);
    setEpaperTitle('');
    setEpaperDate('');
    setEpaperPdf('');
    setEpaperSection('main');
    setCustomEpaperSection('');
    setEpaperDistrict('');
  };

  // Save configurations helper (Popups, ads ticker)
  const handleSaveConfigs = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');

    const settingsObj: Record<string, string> = {};

    if (activeTab === 'overlays') {
      // Save Overlays
      localStorage.setItem(`promo_popup_${popupScope}_enabled`, String(popupEnabled));
      localStorage.setItem(`promo_popup_${popupScope}_type`, popupType);
      localStorage.setItem(`promo_ad_${popupScope}_image`, adImage);
      localStorage.setItem(`promo_ad_${popupScope}_link`, adLink);
      localStorage.setItem(`promo_poll_${popupScope}_question`, pollQuestion);
      localStorage.setItem(`promo_poll_${popupScope}_option_yes`, optYes);
      localStorage.setItem(`promo_poll_${popupScope}_option_no`, optNo);
      localStorage.setItem(`promo_poll_${popupScope}_option_unsure`, optUnsure);

      // Save Inline image
      localStorage.setItem('inline_article_image_enabled', String(inlineImageEnabled));
      localStorage.setItem('inline_article_image_data', inlineImageData);
      localStorage.setItem('inline_article_image_caption', inlineImageCaption);

      // Save Inline promos
      localStorage.setItem('inline_article_promos_enabled', String(inlinePromosEnabled));

      // Append to settings object
      settingsObj[`promo_popup_${popupScope}_enabled`] = String(popupEnabled);
      settingsObj[`promo_popup_${popupScope}_type`] = popupType;
      settingsObj[`promo_ad_${popupScope}_image`] = adImage;
      settingsObj[`promo_ad_${popupScope}_link`] = adLink;
      settingsObj[`promo_poll_${popupScope}_question`] = pollQuestion;
      settingsObj[`promo_poll_${popupScope}_option_yes`] = optYes;
      settingsObj[`promo_poll_${popupScope}_option_no`] = optNo;
      settingsObj[`promo_poll_${popupScope}_option_unsure`] = optUnsure;
      settingsObj['inline_article_image_enabled'] = String(inlineImageEnabled);
      settingsObj['inline_article_image_data'] = inlineImageData;
      settingsObj['inline_article_image_caption'] = inlineImageCaption;
      settingsObj['inline_article_promos_enabled'] = String(inlinePromosEnabled);

    } else if (activeTab === 'weather') {
      // Save weather reports
      localStorage.setItem('weather_page_reports_data', JSON.stringify(weatherReports));
      settingsObj['weather_page_reports_data'] = JSON.stringify(weatherReports);
    } else if (activeTab === 'high-tv-videos') {
      localStorage.setItem('latest_videos', JSON.stringify(videosList));
      try {
        await fetch('/api/latest-videos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(videosList),
        });
      } catch (err) {
        console.error("Failed to sync videos list to DB:", err);
      }
    } else if (activeTab === 'categories' || activeTab === 'mobile-ads') {
      // Save General banners
      const updatedAds = {
        ...customAds,
        [activeAdSpot]: {
          enabled: adSpotEnabled,
          image: adSpotImage,
          link: adSpotLink
        }
      };
      setCustomAds(updatedAds);
      localStorage.setItem('custom_ads_config', JSON.stringify(updatedAds));
      settingsObj['custom_ads_config'] = JSON.stringify(updatedAds);
    } else if (activeTab === 'breaking') {
      // Save Scrolling marquee items
      localStorage.setItem('flash_news_items', JSON.stringify(flashNewsList));
    }

    if (Object.keys(settingsObj).length > 0) {
      try {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsObj),
        });
      } catch (err) {
        console.error("Failed to sync settings to DB:", err);
      }
    }

    setTimeout(() => {
      setSaveStatus('saved');
      setRefreshCounter(prev => prev + 1);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  // Add/Edit marquee item
  const handleAddFlashNews = () => {
    if (!newNewsText.trim()) return;
    const item = {
      text: newNewsText.trim(),
      link: newNewsLink.trim() || `/search?q=${encodeURIComponent(newNewsText.trim())}`
    };
    let updated;
    if (editingFlashIndex !== null) {
      updated = [...flashNewsList];
      updated[editingFlashIndex] = item;
      setEditingFlashIndex(null);
      alert('Flash news ticker item updated successfully!');
    } else {
      updated = [...flashNewsList, item];
      alert('Flash news ticker item added successfully!');
    }
    setFlashNewsList(updated);
    localStorage.setItem('flash_news_items', JSON.stringify(updated));
    setNewNewsText('');
    setNewNewsLink('');

    fetch('/api/flash-news', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updated)
    })
      .then(res => {
        if (!res.ok) console.error('Failed to update flash news in DB');
      })
      .catch(err => console.error('Error updating flash news in DB:', err));
  };

  const startEditingFlashNews = (index: number) => {
    const item = flashNewsList[index];
    if (item) {
      setNewNewsText(item.text);
      setNewNewsLink(item.link || '');
      setEditingFlashIndex(index);
    }
  };

  const handleRemoveFlashNews = (idx: number) => {
    const updated = flashNewsList.filter((_, index) => index !== idx);
    setFlashNewsList(updated);
    localStorage.setItem('flash_news_items', JSON.stringify(updated));

    fetch('/api/flash-news', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updated)
    })
      .then(res => {
        if (!res.ok) console.error('Failed to update flash news in DB');
      })
      .catch(err => console.error('Error updating flash news in DB:', err));
  };

  // Add/Edit trending news item
  const handleAddTrendingNews = () => {
    if (!newTrendingText.trim()) return;
    const item = {
      text: newTrendingText.trim(),
      link: newTrendingLink.trim() || `/search?q=${encodeURIComponent(newTrendingText.trim())}`
    };
    let updated;
    if (editingTrendingIndex !== null) {
      updated = [...trendingNewsList];
      updated[editingTrendingIndex] = item;
      setEditingTrendingIndex(null);
      alert('Trending news item updated successfully!');
    } else {
      updated = [...trendingNewsList, item];
      alert('Trending news item added successfully!');
    }
    setTrendingNewsList(updated);
    localStorage.setItem('trending_news_items', JSON.stringify(updated));
    setNewTrendingText('');
    setNewTrendingLink('');

    fetch('/api/trending-news', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updated)
    })
      .then(res => {
        if (!res.ok) console.error('Failed to update trending news in DB');
      })
      .catch(err => console.error('Error updating trending news in DB:', err));
  };

  const startEditingTrendingNews = (index: number) => {
    const item = trendingNewsList[index];
    if (item) {
      setNewTrendingText(item.text);
      setNewTrendingLink(item.link || '');
      setEditingTrendingIndex(index);
    }
  };

  const handleRemoveTrendingNews = (idx: number) => {
    const updated = trendingNewsList.filter((_, index) => index !== idx);
    setTrendingNewsList(updated);
    localStorage.setItem('trending_news_items', JSON.stringify(updated));

    fetch('/api/trending-news', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updated)
    })
      .then(res => {
        if (!res.ok) console.error('Failed to update trending news in DB');
      })
      .catch(err => console.error('Error updating trending news in DB:', err));
  };

  // Handle Video fields edits
  const handleVideoFieldChange = (idx: number, field: 'id' | 'title' | 'thumbnail', val: string) => {
    const updated = [...videosList];
    if (!updated[idx]) {
      updated[idx] = { id: '', title: '', thumbnail: '' };
    }
    updated[idx] = { ...updated[idx], [field]: val };
    if (field === 'id') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = val.match(regExp);
      const ytId = (match && match[2].length === 11) ? match[2] : val.trim();
      updated[idx].thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    setVideosList(updated);
  };

  // Handle Ad banner upload
  const handleAdSpotImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        setAdSpotImage(base64);
      });
    }
  };

  // Handle category specific banners
  const handleCatAdBannerUpload = (categoryKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCompressAndSetImage(file, (base64) => {
        const parsedAds = { ...customAds };
        parsedAds[categoryKey] = {
          enabled: true,
          image: base64,
          link: (parsedAds[categoryKey] as any)?.link || '#'
        };
        setCustomAds(parsedAds);
        localStorage.setItem('custom_ads_config', JSON.stringify(parsedAds));
      });
    }
  };

  const handleCatAdBannerLinkChange = (categoryKey: string, link: string) => {
    const parsedAds = { ...customAds };
    parsedAds[categoryKey] = {
      enabled: (parsedAds[categoryKey] as any)?.enabled || false,
      image: (parsedAds[categoryKey] as any)?.image || '',
      link: link
    };
    setCustomAds(parsedAds);
    localStorage.setItem('custom_ads_config', JSON.stringify(parsedAds));
  };

  const toggleCatAdBannerStatus = (categoryKey: string, enabled: boolean) => {
    const parsedAds = { ...customAds };
    parsedAds[categoryKey] = {
      enabled: enabled,
      image: (parsedAds[categoryKey] as any)?.image || '',
      link: (parsedAds[categoryKey] as any)?.link || '#'
    };
    setCustomAds(parsedAds);
    localStorage.setItem('custom_ads_config', JSON.stringify(parsedAds));
  };

  // E-Paper publishing
  const handleAddEpaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epaperTitle.trim() || !epaperDate || !epaperPdf) {
      alert('Please fill out all E-Paper fields!');
      return;
    }
    let finalSection = epaperSection === 'custom' ? customEpaperSection.trim().toLowerCase() : epaperSection;
    if (epaperDistrict) {
      if (epaperSection === 'main') {
        finalSection = epaperDistrict;
      } else if (epaperSection === 'telangana' || epaperSection === 'ap') {
        finalSection = `${epaperSection}-${epaperDistrict}`;
      }
    }
    if (!finalSection) {
      alert('Please enter a section name!');
      return;
    }
    setIsSavingEpaper(true);
    try {
      const method = editingEpaperId ? 'PUT' : 'POST';
      const payload: any = {
        title: epaperTitle.trim(),
        date: epaperDate,
        pdfUrl: epaperPdf,
        section: finalSection,
      };
      if (editingEpaperId) {
        payload.id = editingEpaperId;
      }

      const res = await fetch('/api/epapers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditingEpaperId(null);
        setEpaperTitle('');
        setEpaperDate('');
        setEpaperPdf('');
        setEpaperSection('main');
        setCustomEpaperSection('');
        setEpaperDistrict('');
        fetchEpapersData();
        alert(editingEpaperId ? 'E-Paper edition updated successfully!' : 'E-Paper edition added successfully!');
      } else {
        const errText = await res.text();
        alert('Failed to save E-Paper! Server details: ' + errText);
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while publishing E-Paper.');
    } finally {
      setIsSavingEpaper(false);
    }
  };

  const handleDeleteEpaper = async (id: string) => {
    if (!confirm('Are you sure you want to delete this E-Paper?')) return;
    try {
      const res = await fetch(`/api/epapers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEpapersData();
        alert('E-Paper deleted successfully!');
      } else {
        alert('Failed to delete E-Paper!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEpaperSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim() || !newSectionKey.trim()) {
      alert('Please fill out all Section fields!');
      return;
    }
    setIsSavingSection(true);
    try {
      const res = await fetch('/api/epapers/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSectionName.trim(),
          key: newSectionKey.trim()
        })
      });
      if (res.ok) {
        setNewSectionName('');
        setNewSectionKey('');
        fetchEpaperSections();
        alert('Section added successfully!');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to add Section!');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while adding Section.');
    } finally {
      setIsSavingSection(false);
    }
  };

  const handleDeleteEpaperSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Section? E-papers published under this section key will remain in database but will not be grouped.')) return;
    try {
      const res = await fetch(`/api/epapers/sections?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEpaperSections();
        alert('Section deleted successfully!');
      } else {
        alert('Failed to delete Section!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('high_tv_admin_session');
    router.push('/superadminlogin');
  };

  // Loading Screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans">
        <svg className="animate-spin h-8 w-8 text-rose-600 mb-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Connecting High TV Core CMS Gate...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans admin-theme-wrapper">
      
      {/* ── STICKY LEFT SIDEBAR (Balagam TV Theme) ────────────────────────── */}
      <aside className="w-64 border-r border-slate-900 bg-[#0b1329] flex flex-col shrink-0 sticky top-0 h-screen select-none">
        
        {/* Branding header area */}
        <div className="p-5 border-b border-slate-900 flex items-center gap-3 shrink-0">
          <Link href="/" className="block max-w-[45px]">
            <img src="/logo.png" alt="High TV" className="w-full h-auto object-contain" />
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white leading-tight telugu-text">హై టీవీ</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">CMS Panel</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 flex flex-col gap-1 overflow-y-auto flex-1 hide-scrollbar">
          
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 pl-2">System Configs</span>
                    <button
            onClick={() => { setActiveTab('dashboard'); setNewsViewMode('list'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'dashboard' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-450 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('news'); setNewsViewMode('list'); setFilterCategory('all'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'news' && filterCategory === 'all' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>News Management</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('breaking'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'breaking' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4" />
              <span>Flash News Ticker</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('trending'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'trending' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Ticker</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('slider'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'slider' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4" />
              <span>Homepage Slides</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('sidebar-news'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'sidebar-news' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-4 h-4" />
              <span>Sidebar News Config</span>
            </div>
          </button>


          <button
            onClick={() => { setActiveTab('epaper'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'epaper' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tv className="w-4 h-4" />
              <span>E-Paper editions</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('weather'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'weather' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CloudSun className="w-4 h-4" />
              <span>Weather Page Details</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('horoscope'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'horoscope' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4" />
              <span>శుభఫలాలు (Horoscope)</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('webstories');
              setWebStoryFormMode('list');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'webstories' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>వెబ్ స్టోరీస్ (Web Stories)</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('shorts-videos');
              setShortsFormMode('list');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'shorts-videos' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4" />
              <span>షార్ట్స్ వీడియోలు (Upload Videos)</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('high-tv-videos');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'high-tv-videos' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tv className="w-4 h-4" />
              <span>హై టీవీ వీడియోస్ (High TV Videos)</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('photos-gallery');
              setPhotosFormMode('list');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'photos-gallery' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4" />
              <span>ఫోటో గ్యాలరీ (Upload Photos)</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('polls-manager');
              setPollsFormMode('list');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'polls-manager' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4" />
              <span>పోల్స్ మేనేజర్ (Manage Polls)</span>
            </div>
          </button>

                    <button
            onClick={() => {
              setActiveTab('team-manager');
              setTeamFormMode('list');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'team-manager' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>మా టీమ్ (Our Team Manager)</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('sidebar-ads');
              setAdFormMode('list');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'sidebar-ads' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4" />
              <span>సైడ్‌బార్ యాడ్స్ (Sidebar Ads Manager)</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('mobile-ads');
              setActiveAdSpot('mobile_leaderboard');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'mobile-ads' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MonitorSmartphone className="w-4 h-4" />
              <span>మొబైల్ యాడ్స్ (Mobile Ads Manager)</span>
            </div>
          </button>

<button
            onClick={() => {
              setActiveTab('editorial');
              setEditorialFormMode('none');
              // Load sections from localStorage if available
              try {
                const saved = localStorage.getItem('editorial_sections_config');
                if (saved) {
                  const parsed = JSON.parse(saved);
                  const migrated = parsed.map((s: any) => {
                    if (s.slug === 'sampadakiyam' && s.title === 'సంపాదకీయం') {
                      return { ...s, title: 'ఎడిటోరియల్' };
                    }
                    return s;
                  });
                  setEditorialSections(migrated);
                  localStorage.setItem('editorial_sections_config', JSON.stringify(migrated));
                }
              } catch {}
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'editorial' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>ఎడిటోరియల్ పేజీ (Editorial Manager)</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('popup-manager'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'popup-manager' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MonitorSmartphone className="w-4 h-4" />
              <span>పాప్‌అప్ మేనేజర్ (Popup Manager)</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('jilla-sidebar'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'jilla-sidebar' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>జిల్లా వార్తలు సైడ్‌బార్ (District Sidebar)</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('live-updates'); setListingFormMode('none'); setPostFormMode('none'); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'live-updates' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-455 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>లైవ్ అప్‌డేట్స్ (Live Updates)</span>
            </div>
          </button>



        </nav>

        {/* Profile and Logout area at bottom of sidebar */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40 shrink-0 space-y-3">
          <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white text-xs font-black">
              S
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-white truncate">Super Admin</span>
              <span className="text-[10px] text-slate-500 truncate">admin@hightv.in</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-955/20 hover:bg-red-955/40 text-red-200 text-xs font-bold cursor-pointer transition-all border border-red-900/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Account</span>
          </button>
        </div>

      </aside>

      {/* ── MAIN WORKSPACE AREA ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden min-w-0 bg-[#f8fafc] text-slate-700">
        
        {/* Workspace Top Header (Navy Blue Category Navigation Bar) */}
        <div className="flex bg-[#0b1329] border-b border-slate-900 select-none z-30 relative items-center justify-between py-3 px-6 md:px-8 flex-wrap gap-4" ref={dropdownRef}>
          
          {/* Left: Website Pages Navigation */}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Website Pages:</span>
            
            {/* 1. Main Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveHeaderDropdown(activeHeaderDropdown === 'main' ? null : 'main')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                  activeTab === 'news' && MAIN_CATEGORIES_LIST.some(c => c.slug === filterCategory && c.slug !== 'rasipalalu' && c.slug !== 'weather' && c.slug !== 'webstories')
                    ? 'bg-rose-600 border-rose-500 text-white font-black'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>Main Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeHeaderDropdown === 'main' ? 'rotate-180' : ''}`} />
              </button>
              {activeHeaderDropdown === 'main' && (
                <div className="absolute left-0 mt-2 z-50 bg-[#0b1329] border border-slate-800 rounded-2xl shadow-2xl p-4 w-[480px]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[300px] overflow-y-auto admin-scrollbar">
                    {MAIN_CATEGORIES_LIST
                      .filter((cat) => cat.slug !== 'rasipalalu' && cat.slug !== 'weather' && cat.slug !== 'webstories')
                      .map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => {
                            setActiveTab('news');
                            setFilterCategory(cat.slug);
                            setNewsViewMode('list');
                            setActiveHeaderDropdown(null);
                          }}
                          className={`text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all telugu-text truncate ${
                            activeTab === 'news' && filterCategory === cat.slug
                              ? 'bg-rose-950/50 text-white font-extrabold border-l-2 border-rose-600'
                              : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Andhra Pradesh Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveHeaderDropdown(activeHeaderDropdown === 'ap' ? null : 'ap')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                  activeTab === 'news' && (filterCategory === 'andhra-pradesh' || apDistricts.some(d => d.slug === filterCategory))
                    ? 'bg-rose-600 border-rose-500 text-white font-black'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>ఆంధ్రప్రదేశ్ (AP News)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeHeaderDropdown === 'ap' ? 'rotate-180' : ''}`} />
              </button>
              {activeHeaderDropdown === 'ap' && (
                <div className="absolute left-0 mt-2 z-50 bg-[#0b1329] border border-slate-800 rounded-2xl shadow-2xl p-4 w-[320px]">
                  <div className="grid grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto admin-scrollbar">
                    <button
                      onClick={() => {
                        setActiveTab('news');
                        setFilterCategory('andhra-pradesh');
                        setNewsViewMode('list');
                        setActiveHeaderDropdown(null);
                      }}
                      className={`col-span-2 text-left py-2 px-2.5 rounded-lg text-[13px] font-extrabold transition-all border-b border-slate-800/60 pb-1.5 ${
                        activeTab === 'news' && filterCategory === 'andhra-pradesh'
                          ? 'bg-rose-950/50 text-white border-l-2 border-rose-600'
                          : 'text-amber-400 hover:text-white hover:bg-slate-900/50'
                      }`}
                    >
                      🌅 ఏపీ హోమ్ (AP State)
                    </button>
                    {apDistricts.map((dist) => (
                      <button
                        key={dist.slug}
                        onClick={() => {
                          setActiveTab('news');
                          setFilterCategory(dist.slug);
                          setNewsViewMode('list');
                          setActiveHeaderDropdown(null);
                        }}
                        className={`text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all telugu-text truncate ${
                          activeTab === 'news' && filterCategory === dist.slug
                            ? 'bg-rose-950/50 text-white font-extrabold border-l-2 border-rose-600'
                            : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                        }`}
                      >
                        {dist.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Telangana Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveHeaderDropdown(activeHeaderDropdown === 'telangana' ? null : 'telangana')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                  activeTab === 'news' && (filterCategory === 'telangana' || tgDistricts.some(d => d.slug === filterCategory))
                    ? 'bg-rose-600 border-rose-500 text-white font-black'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>తెలంగాణ (Telangana News)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeHeaderDropdown === 'telangana' ? 'rotate-180' : ''}`} />
              </button>
              {activeHeaderDropdown === 'telangana' && (
                <div className="absolute left-0 mt-2 z-50 bg-[#0b1329] border border-slate-800 rounded-2xl shadow-2xl p-4 w-[320px]">
                  <div className="grid grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto admin-scrollbar">
                    <button
                      onClick={() => {
                        setActiveTab('news');
                        setFilterCategory('telangana');
                        setNewsViewMode('list');
                        setActiveHeaderDropdown(null);
                      }}
                      className={`col-span-2 text-left py-2 px-2.5 rounded-lg text-[13px] font-extrabold transition-all border-b border-slate-800/60 pb-1.5 ${
                        activeTab === 'news' && filterCategory === 'telangana'
                          ? 'bg-rose-950/50 text-white border-l-2 border-rose-600'
                          : 'text-amber-400 hover:text-white hover:bg-slate-900/50'
                      }`}
                    >
                      🍇 తెలంగాణ హోమ్ (TG State)
                    </button>
                    {tgDistricts.map((dist) => (
                      <button
                        key={dist.slug}
                        onClick={() => {
                          setActiveTab('news');
                          setFilterCategory(dist.slug);
                          setNewsViewMode('list');
                          setActiveHeaderDropdown(null);
                        }}
                        className={`text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all telugu-text truncate ${
                          activeTab === 'news' && filterCategory === dist.slug
                            ? 'bg-rose-950/50 text-white font-extrabold border-l-2 border-rose-600'
                            : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                        }`}
                      >
                        {dist.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Health Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveHeaderDropdown(activeHeaderDropdown === 'health' ? null : 'health')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                  activeTab === 'news' && (filterCategory === 'health' || filterCategory === 'doctors-corner')
                    ? 'bg-rose-600 border-rose-500 text-white font-black'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>హెల్త్ (Health)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeHeaderDropdown === 'health' ? 'rotate-180' : ''}`} />
              </button>
              {activeHeaderDropdown === 'health' && (
                <div className="absolute left-0 mt-2 z-50 bg-[#0b1329] border border-slate-800 rounded-xl shadow-2xl p-2 w-[200px] flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setActiveTab('news');
                      setFilterCategory('health');
                      setNewsViewMode('list');
                      setActiveHeaderDropdown(null);
                    }}
                    className={`text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all ${
                      activeTab === 'news' && filterCategory === 'health'
                        ? 'bg-rose-950/50 text-white font-extrabold border-l-2 border-rose-600'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    🩺 ஹெల్త్ హోమ్
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('news');
                      setFilterCategory('doctors-corner');
                      setNewsViewMode('list');
                      setActiveHeaderDropdown(null);
                    }}
                    className={`text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all ${
                      activeTab === 'news' && filterCategory === 'doctors-corner'
                        ? 'bg-rose-950/50 text-white font-extrabold border-l-2 border-rose-600'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    🥼 డాక్టర్స్ కార్నర్
                  </button>
                </div>
              )}
            </div>

            {/* 5. Education Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveHeaderDropdown(activeHeaderDropdown === 'education' ? null : 'education')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                  activeTab === 'news' && (filterCategory === 'vidya' || filterCategory === 'admissions' || filterCategory === 'current-affairs')
                    ? 'bg-rose-600 border-rose-500 text-white font-black'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>విద్య (Education)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeHeaderDropdown === 'education' ? 'rotate-180' : ''}`} />
              </button>
              {activeHeaderDropdown === 'education' && (
                <div className="absolute left-0 mt-2 z-50 bg-[#0b1329] border border-slate-800 rounded-xl shadow-2xl p-2 w-[200px] flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setActiveTab('news');
                      setFilterCategory('vidya');
                      setNewsViewMode('list');
                      setActiveHeaderDropdown(null);
                    }}
                    className={`text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all ${
                      activeTab === 'news' && filterCategory === 'vidya'
                        ? 'bg-rose-950/50 text-white font-extrabold border-l-2 border-rose-600'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    🎓 విద్య హోమ్
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('news');
                      setFilterCategory('admissions');
                      setNewsViewMode('list');
                      setActiveHeaderDropdown(null);
                    }}
                    className={`text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all ${
                      activeTab === 'news' && filterCategory === 'admissions'
                        ? 'bg-rose-950/50 text-white font-extrabold border-l-2 border-rose-600'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    🏫 అడ్మిషన్స్
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('news');
                      setFilterCategory('current-affairs');
                      setNewsViewMode('list');
                      setActiveHeaderDropdown(null);
                    }}
                    className={`text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all ${
                      activeTab === 'news' && filterCategory === 'current-affairs'
                        ? 'bg-rose-950/50 text-white font-extrabold border-l-2 border-rose-600'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    📖 కరెంట్ అఫైర్స్
                  </button>
                </div>
              )}
            </div>

            {/* 6. Career Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveHeaderDropdown(activeHeaderDropdown === 'career' ? null : 'career')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                  activeTab === 'news' && (filterCategory === 'upadi' || filterCategory === 'notification')
                    ? 'bg-rose-600 border-rose-500 text-white font-black'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>ఉపాధి (Career)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeHeaderDropdown === 'career' ? 'rotate-180' : ''}`} />
              </button>
              {activeHeaderDropdown === 'career' && (
                <div className="absolute left-0 mt-2 z-50 bg-[#0b1329] border border-slate-800 rounded-xl shadow-2xl p-2 w-[200px] flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setActiveTab('news');
                      setFilterCategory('upadi');
                      setNewsViewMode('list');
                      setActiveHeaderDropdown(null);
                    }}
                    className={`text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all ${
                      activeTab === 'news' && filterCategory === 'upadi'
                        ? 'bg-rose-950/50 text-white font-extrabold border-l-2 border-rose-600'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    👔 ఉపాధి హోమ్
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('news');
                      setFilterCategory('notification');
                      setNewsViewMode('list');
                      setActiveHeaderDropdown(null);
                    }}
                    className={`text-left py-2 px-2.5 rounded-lg text-[13px] font-bold transition-all ${
                      activeTab === 'news' && filterCategory === 'notification'
                        ? 'bg-rose-950/50 text-white font-extrabold border-l-2 border-rose-600'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    📢 నోటిఫికేషన్స్
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right: Visit Live Website link */}
          <div className="flex items-center shrink-0">
            <Link 
              href="/"
              target="_blank"
              className="text-xs bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white font-bold py-2 px-3.5 rounded-xl transition-all border border-slate-800 flex items-center gap-1.5"
            >
              <span>Visit Live Website</span>
              <Globe className="w-3.5 h-3.5" />
            </Link>
          </div>
          
        </div>

        {/* Scrollable Workspace Container */}
        <div className="flex-1 p-6 md:p-8 max-w-[1440px] w-full min-w-0 mx-auto">
          
          {/* ══════════════ VIEW: DASHBOARD OVERVIEW ══════════════ */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Overview Dashboard</h2>
                <p className="text-slate-500 text-xs mt-0.5">High TV Content Management System status metrics.</p>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Articles</span>
                  <span className="text-2xl font-bold text-slate-800">{allArticles.length}</span>
                  <span className="text-[10px] text-[#02599c] font-bold mt-1">Staged in CMS</span>
                </div>
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticker Headlines</span>
                  <span className="text-2xl font-bold text-slate-800">{flashNewsList.length}</span>
                  <span className="text-[10px] text-[#02599c] font-bold mt-1">Marquee tickers</span>
                </div>
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-Paper Editions</span>
                  <span className="text-2xl font-bold text-slate-800">{epapersList.length}</span>
                  <span className="text-[10px] text-[#02599c] font-bold mt-1">PDFs uploaded</span>
                </div>
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">General Advertisements</span>
                  <span className="text-2xl font-bold text-slate-800">
                    {Object.values(customAds).filter((ad: any) => ad?.enabled).length}
                  </span>
                  <span className="text-[10px] text-[#02599c] font-bold mt-1">Active banners</span>
                </div>
              </div>

              {/* Overview instruction helper */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <Info className="w-5 h-5 text-rose-600" />
                  <span>Welcome to Super Admin Dashboard</span>
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">
                  Use the left sidebar navigation to select any tab or subpage to update its content, upload custom news articles, or configure page-specific ad banner overrides. All changes are stored locally and will reflect immediately across your navigation panels and article views.
                </p>
                <div className="h-px bg-slate-100" />
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>22 Collapsible Pages Configured</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Rich Text WYSIWYG Editor Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Featured Image compression enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ VIEW: NEWS MANAGEMENT (Articles grid) ══════════════ */}
          {activeTab === 'news' && newsViewMode === 'list' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              
              {/* Heading */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-800">News Management</h2>
                    <span className="bg-rose-50 text-rose-700 text-xs font-black px-3 py-1 rounded-full border border-rose-100 shadow-sm flex items-center gap-1">
                      <span>{filteredArticles.length}</span>
                      {filteredArticles.length !== allArticles.length && (
                        <span className="text-rose-450 font-medium">/ {allArticles.length}</span>
                      )}
                      <span className="text-[10px] text-rose-450 uppercase tracking-wider ml-0.5">Articles</span>
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs">Review and manage all news articles.</p>
                </div>
                <button
                  onClick={() => setNewsViewMode('add')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 px-5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 self-start md:self-auto hover:scale-[1.01]"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Article</span>
                </button>
              </div>

              {/* Search & filter area */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles by title or keyword..."
                    className="w-full bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-colors text-slate-800"
                  />
                </div>
                
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 shrink-0">
                  <span>Filtering:</span>
                  <span className="text-[#02599c] capitalize">{filterCategory.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Table list */}
              <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black">
                        <th className="p-4 text-[10px] uppercase tracking-wider">Article Info</th>
                        <th className="p-4 text-[10px] uppercase tracking-wider">Category</th>
                        <th className="p-4 text-[10px] uppercase tracking-wider">Author</th>
                        <th className="p-4 text-[10px] uppercase tracking-wider text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredArticles.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-10 text-center text-slate-400 font-bold">
                            No articles found matching filters. Select a different category or add one above!
                          </td>
                        </tr>
                      ) : (
                        filteredArticles.map((art) => (
                          <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3.5 min-w-[320px]">
                                <img
                                  src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&fit=crop'}
                                  alt={art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''}
                                  className="w-14 h-9 object-cover rounded-lg border border-slate-200 shrink-0"
                                />
                                <div className="flex flex-col min-w-0 gap-0.5">
                                  <span className="text-xs font-black text-slate-800 telugu-text truncate" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                    {art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(art.publishedAt).toLocaleDateString()} at {new Date(art.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 capitalize">
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200/50">
                                {art.districtSlug
                                  ? getArticleCategoryName(art)
                                  : (filterCategory === 'latest' 
                                      ? 'Breaking News' 
                                      : filterCategory === 'trending' 
                                        ? 'Trending News' 
                                        : filterCategory === 'featured' 
                                          ? 'Featured News' 
                                          : (art.category || art.categorySlug))}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 font-bold capitalize">
                              {art.author}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Link
                                  href={`/news/${art.slug}`}
                                  target="_blank"
                                  className="text-slate-500 hover:text-slate-800 p-2 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-slate-100"
                                  title="View Public Link"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => startEditing(art)}
                                  className="text-slate-500 hover:text-rose-600 p-2 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-slate-100"
                                  title="Edit News Article"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteArticle(art.id)}
                                  className="text-slate-500 hover:text-red-600 p-2 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-slate-100"
                                  title="Delete Article"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ══════════════ VIEW: ADD / EDIT NEWS ARTICLE (2-Column Workspace) ══════════════ */}
          {activeTab === 'news' && (newsViewMode === 'add' || newsViewMode === 'edit') && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              
              {/* Back breadcrumb and Actions */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setNewsViewMode('list')}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-black cursor-pointer bg-white border border-slate-200/60 rounded-xl px-3.5 py-2.5 transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to news list</span>
                </button>

                <h2 className="text-lg font-black text-slate-800">
                  {newsViewMode === 'add' ? 'Add New Article' : 'Edit News Article'}
                </h2>

                <button
                  type="button"
                  disabled={isSavingArticle}
                  onClick={handleSaveArticle}
                  className={`${
                    isSavingArticle ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 cursor-pointer hover:scale-[1.01]'
                  } text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-1.5`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>
                    {isSavingArticle 
                      ? (newsViewMode === 'add' ? 'Publishing...' : 'Updating...') 
                      : (newsViewMode === 'add' ? 'Publish Review' : 'Update Details')}
                  </span>
                </button>
              </div>

              {/* Two Column Grid */}
              <form onSubmit={handleSaveArticle} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (Inputs and WYSIWYG) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Headline Block */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Headline (Telugu/English)</label>
                    <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <MiniWysiwygToolbar editorRef={newsTitleRef} />
                      <div
                        contentEditable
                        ref={newsTitleRef}
                        suppressContentEditableWarning
                        onInput={(e) => setNewsTitle(e.currentTarget.innerText)}
                        data-placeholder="Enter a catchy headline..."
                        className="wysiwyg-editor-mini w-full bg-slate-50 border-t border-slate-200/60 focus:bg-white px-4 py-3.5 text-base font-bold outline-none transition-colors telugu-text text-slate-800"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Slug Block */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">URL Slug (English - Mandatory)</label>
                    <input
                      type="text"
                      required
                      value={newsSlug}
                      onChange={(e) => setNewsSlug(e.target.value)}
                      placeholder="e.g. hyderabad-metro-news-update"
                      className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs font-mono outline-none transition-colors text-slate-800"
                    />
                    <span className="text-[10px] text-slate-400">Slug is mandatory for the URL. Strictly use alphanumeric English characters and hyphens.</span>
                  </div>

                  {/* Short Summary (Excerpt) Block */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Short Summary (Excerpt - Optional)</label>
                    <textarea
                      rows={2}
                      value={newsDescription}
                      onChange={(e) => setNewsDescription(e.target.value)}
                      placeholder="Enter a brief summary snippet to display on article list pages and cards..."
                      className="w-full bg-slate-50 border border-slate-200/60 focus:bg-white focus:border-rose-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors telugu-text text-slate-800 resize-y"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />
                    <span className="text-[10px] text-slate-400">This snippet is displayed on homepage categories, search pages, and article index card listings.</span>
                  </div>

                  {/* Meta Description Block */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Meta Description (SEO Summary - Optional)</label>
                      <span className="text-[10px] font-bold text-slate-400">{metaDescription.length}/160 chars</span>
                    </div>
                    <textarea
                      rows={3}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Enter concise, engaging meta description for Search Engines (Google) and Social Media sharing..."
                      className="w-full bg-slate-50 border border-slate-200/60 focus:bg-white focus:border-rose-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors telugu-text text-slate-800 resize-y"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />
                    <span className="text-[10px] text-slate-400">This text appears as the snippet under your article title on Google search results and WhatsApp shares.</span>
                  </div>

                  {/* Tags Block */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Tags / Keywords</label>
                    
                    {/* Added Tags Chips Container */}
                    {newsTags.length > 0 && (
                      <div className="flex flex-col gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Link Tags to Specific Articles:</span>
                        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                          {newsTags.map((tagObj, idx) => {
                            const name = typeof tagObj === 'string' ? tagObj : tagObj.name;
                            const linkedArticleSlug = typeof tagObj === 'string' ? null : (tagObj.linkedArticleSlug || null);
                            const linkedArt = allArticles.find((a: any) => a.slug === linkedArticleSlug);
                            
                            const getCatLabel = (slug: string) => {
                              const mappings: Record<string, string> = {
                                'latest': 'Breaking News',
                                'telangana': 'Telangana News',
                                'andhra-pradesh': 'Andhra Pradesh News',
                                'national': 'National News',
                                'international': 'International News',
                                'business': 'Business News',
                                'politics': 'Politics News',
                                'sports': 'Sports News',
                                'entertainment': 'Entertainment News',
                                'technology': 'Technology News',
                                'health': 'Health News',
                                'doctors-corner': "Doctor's Corner",
                                'viral': 'Viral News',
                                'rasipalalu': 'Astrology News',
                                'photos': 'Photo Gallery',
                                'shorts': 'Shorts News',
                                'webstories': 'Web Stories',
                                'antharmadanam': 'Opinion News',
                                'adyathmikam': 'Devotional News',
                                'sampadakiyam': 'Editorial News',
                                'women': 'Women News',
                                'lifestyle': 'Lifestyle News',
                                'vidya': 'Education News',
                                'admissions': 'Admissions News',
                                'current-affairs': 'Current Affairs',
                                'upadi': 'Employment News',
                                'notification': 'Notification News',
                                'citizen-reporter': 'Citizen Reporter',
                                'weather': 'Weather News'
                              };
                              return mappings[slug] || slug;
                            };
                            
                            const categoryLabel = linkedArt ? getCatLabel(linkedArt.categorySlug) : '';

                            return (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/50 p-3 rounded-2xl shadow-sm hover:shadow transition-shadow">
                                <div className="flex items-center gap-2">
                                  <span className="bg-blue-50 text-[#02599c] text-xs font-black px-3 py-1.5 rounded-xl border border-blue-100/50 select-none">
                                    #{name}
                                  </span>
                                </div>
                                <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
                                  <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 flex items-center gap-2 max-w-full sm:max-w-[320px]">
                                    <span className="text-slate-400 shrink-0">Redirects to:</span>
                                    {linkedArt ? (
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="bg-rose-50 text-rose-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                                          {categoryLabel}
                                        </span>
                                        <span className="font-semibold text-slate-800 truncate telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                          {linkedArt.title.replace(/<[^>]*>/g, '')}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="font-extrabold text-slate-400">Related News (Default)</span>
                                    )}
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTagLinkingTargetName(name);
                                      setTagLinkSearchQuery('');
                                    }}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-750 text-[11px] font-extrabold px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                                  >
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    Choose Article
                                  </button>
                                  
                                  {linkedArticleSlug && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setNewsTags(newsTags.map(t => (typeof t === 'string' ? t : t.name) === name ? { name, linkedArticleSlug: null } : t));
                                      }}
                                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-extrabold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
                                      title="Clear Link"
                                    >
                                      Clear Link
                                    </button>
                                  )}
                                  
                                  <button
                                    type="button"
                                    onClick={() => setNewsTags(newsTags.filter(t => (typeof t === 'string' ? t : t.name) !== name))}
                                    className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 font-bold w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-base shrink-0 cursor-pointer border border-transparent hover:border-rose-100"
                                    title="Remove Tag"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Tag Input Field & Dropdown suggestions */}
                    <div className="relative">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => {
                          setTagInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = tagInput.trim().replace(/,/g, '');
                            if (val && !newsTags.some(t => (typeof t === 'string' ? t : t.name) === val)) {
                              setNewsTags([...newsTags, { name: val, linkedArticleSlug: null }]);
                            }
                            setTagInput('');
                          }
                        }}
                        onKeyUp={(e) => {
                          if (e.key === ',' || e.key === 'Enter') {
                            const val = tagInput.trim().replace(/,/g, '');
                            if (val && !newsTags.some(t => (typeof t === 'string' ? t : t.name) === val)) {
                              setNewsTags([...newsTags, { name: val, linkedArticleSlug: null }]);
                            }
                            setTagInput('');
                          }
                        }}
                        placeholder="Type a tag and press Enter or Comma..."
                        className="w-full bg-slate-50 border border-slate-200/60 focus:bg-white focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800"
                      />

                      {/* Suggestions list */}
                      {showSuggestions && tagInput.trim() && (
                        (() => {
                          const query = tagInput.toLowerCase();
                          const matches = allTagsSuggestions.filter(
                            t => t.name.toLowerCase().includes(query) && !newsTags.some(nt => (typeof nt === 'string' ? nt : nt.name) === t.name)
                          );
                          if (matches.length === 0) return null;
                          return (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 shadow-xl rounded-xl max-h-[160px] overflow-y-auto z-50">
                              {matches.map((match, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onMouseDown={() => {
                                    if (!newsTags.some(nt => (typeof nt === 'string' ? nt : nt.name) === match.name)) {
                                      setNewsTags([...newsTags, { name: match.name, linkedArticleSlug: match.linkedArticleSlug || null }]);
                                    }
                                    setTagInput('');
                                    setShowSuggestions(false);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between border-b border-slate-100 last:border-0 cursor-pointer"
                                >
                                  <span>#{match.name}</span>
                                  <span className="text-[9px] text-[#02599c] font-black uppercase tracking-wider">Select</span>
                                </button>
                              ))}
                            </div>
                          );
                        })()
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Type any tag name and press Enter or Comma to save. Autocomplete suggestions will appear if the tag was previously used.</span>
                  </div>

                  {/* Article Content WYSIWYG Editor Block */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Article Content</label>
                    
                    {/* Rich toolbar options */}
                    <div className="bg-slate-100 border border-slate-200 rounded-xl p-2 flex flex-wrap gap-1.5 items-center select-none text-slate-600">
                      
                      {/* Style normal header dropdown mockup */}
                      <div className="relative">
                        <select 
                          onChange={(e) => handleFormat('formatBlock', e.target.value)}
                          className="bg-white border border-slate-200 text-[10px] font-black rounded-lg px-2 py-1 outline-none cursor-pointer"
                        >
                          <option value="p">Normal</option>
                          <option value="h1">Heading 1</option>
                          <option value="h2">Heading 2</option>
                          <option value="h3">Heading 3</option>
                        </select>
                      </div>

                      <div className="relative">
                        <select 
                          onChange={(e) => handleFontSize(e.target.value)}
                          className="bg-white border border-slate-200 text-[10px] font-black rounded-lg px-2 py-1 outline-none cursor-pointer text-slate-700"
                          defaultValue=""
                        >
                          <option value="" disabled>Size</option>
                          <option value="12px">12 px</option>
                          <option value="14px">14 px</option>
                          <option value="16px">16 px</option>
                          <option value="18px">18 px</option>
                          <option value="20px">20 px</option>
                          <option value="22px">22 px</option>
                          <option value="24px">24 px</option>
                          <option value="28px">28 px</option>
                          <option value="32px">32 px</option>
                          <option value="36px">36 px</option>
                        </select>
                      </div>

                      <div className="w-px h-5 bg-slate-200 my-1 mx-0.5" />

                      <button type="button" onClick={() => handleFormat('bold')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleFormat('italic')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleFormat('underline')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleFormat('strikeThrough')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Strikethrough"><Strikethrough className="w-3.5 h-3.5" /></button>
                      
                      <div className="w-px h-5 bg-slate-200 my-1 mx-0.5" />

                      <button type="button" onClick={() => handleFormat('insertUnorderedList')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleFormat('insertOrderedList')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Number List"><ListOrdered className="w-3.5 h-3.5" /></button>
                      
                      <div className="w-px h-5 bg-slate-200 my-1 mx-0.5" />

                      {/* Color Picker helper */}
                      <button type="button" onClick={() => handleFormat('foreColor', '#000000')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-black font-black text-xs" title="Text Color Black">A</button>
                      <button type="button" onClick={() => handleFormat('foreColor', '#e11d48')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-rose-600 font-black text-xs" title="Text Color Red">A</button>
                      <button type="button" onClick={() => handleFormat('foreColor', '#02599c')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-blue-600 font-black text-xs" title="Text Color Blue">A</button>
                      <button type="button" onClick={() => handleFormat('foreColor', '#16a34a')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-green-600 font-black text-xs" title="Text Color Green">A</button>
                      <button type="button" onClick={() => handleFormat('foreColor', '#9333ea')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-purple-600 font-black text-xs" title="Text Color Purple">A</button>
                      <button type="button" onClick={() => handleFormat('foreColor', '#ea580c')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-orange-600 font-black text-xs" title="Text Color Orange">A</button>
                      
                      <div className="relative flex items-center hover:bg-slate-200 rounded p-1 cursor-pointer" title="Custom Color Picker">
                        <span className="font-black text-xs mr-1 text-slate-700">A</span>
                        <input 
                          type="color" 
                          defaultValue="#000000"
                          onChange={(e) => handleFormat('foreColor', e.target.value)} 
                          className="w-3.5 h-3.5 p-0 border-0 cursor-pointer rounded-full overflow-hidden" 
                          style={{ appearance: 'none', WebkitAppearance: 'none' }}
                        />
                      </div>

                      <div className="w-px h-5 bg-slate-200 my-1 mx-0.5" />

                      <button type="button" onClick={() => {
                        const url = prompt('Enter the link destination URL:');
                        if (url) handleFormat('createLink', url);
                      }} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Insert Link"><LinkIcon className="w-3.5 h-3.5" /></button>
                      
                      {/* Hidden File Inputs for Inline Media */}
                      <input 
                        type="file" 
                        ref={imageInputRef} 
                        accept="image/*" 
                        onChange={handleInlineImageUpload} 
                        className="hidden" 
                      />
                      <input 
                        type="file" 
                        ref={videoInputRef} 
                        accept="video/*" 
                        onChange={handleInlineVideoUpload} 
                        className="hidden" 
                      />

                      <button type="button" onClick={() => imageInputRef.current?.click()} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Upload Inline Image"><ImageIcon className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => videoInputRef.current?.click()} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Upload Inline Video"><Video className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={handleOpenPromoModal} className="p-1.5 hover:bg-rose-100 text-[#e60000] rounded-lg border border-red-200/50 bg-red-50/30 cursor-pointer flex items-center gap-1" title="Insert Related Article (ఈ వార్తా చదవండి)">
                        <Tv className="w-3.5 h-3.5 text-[#cc0000]" />
                        <span className="text-[9px] font-bold select-none telugu-text text-[#cc0000]" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>ఈ వార్తా చదవండి</span>
                      </button>
                      <button type="button" onClick={() => handleFormat('removeFormat')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Clear Formatting"><Eraser className="w-3.5 h-3.5" /></button>
                    </div>

                    {/* contenteditable editing panel + image resizer overlay wrapper */}
                    <div ref={editorWrapperRef} className="relative" onScroll={handleEditorScroll}>
                      <div 
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="వార్త పూర్తి సమాచారాన్ని ఇక్కడ రాయండి..."
                        className="wysiwyg-editor w-full bg-slate-50 border border-slate-200/60 focus:bg-white focus:border-rose-500 rounded-2xl p-5 text-sm outline-none transition-all text-slate-800 overflow-y-auto leading-relaxed telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        onClick={handleEditorImageClick}
                      />

                      {/* ── Blue Image Resizer Overlay ── */}
                      {resizerStyle && selectedImage && (
                        <div
                          ref={resizerRef}
                          style={{
                            position: 'absolute',
                            top: resizerStyle.top,
                            left: resizerStyle.left,
                            width: resizerStyle.width,
                            height: resizerStyle.height,
                            pointerEvents: 'none',
                            zIndex: 50,
                          }}
                        >
                          {/* ── Floating Toolbar above image ── */}
                          <div style={{
                            position: 'absolute',
                            top: -42,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: 8,
                            padding: '4px 6px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                            pointerEvents: 'all',
                            whiteSpace: 'nowrap',
                          }}>
                            {/* Align Left */}
                            <button
                              type="button"
                              title="Align Left"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!selectedImage) return;
                                const parent = selectedImage.parentElement;
                                if (parent && (parent.dataset.imgAlign === 'true')) {
                                  parent.style.textAlign = 'left';
                                } else {
                                  selectedImage.style.display = 'block';
                                  selectedImage.style.marginLeft = '0';
                                  selectedImage.style.marginRight = 'auto';
                                  if (parent) { parent.style.textAlign = 'left'; }
                                }
                                updateResizerPosition(selectedImage);
                              }}
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#94a3b8', padding: '2px 6px', borderRadius: 4,
                                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3,
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
                              Left
                            </button>

                            <div style={{ width: 1, height: 18, background: '#334155' }} />

                            {/* Align Center */}
                            <button
                              type="button"
                              title="Align Center"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!selectedImage) return;
                                selectedImage.style.display = 'block';
                                selectedImage.style.marginLeft = 'auto';
                                selectedImage.style.marginRight = 'auto';
                                const parent = selectedImage.parentElement;
                                if (parent) parent.style.textAlign = 'center';
                                updateResizerPosition(selectedImage);
                              }}
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#60a5fa', padding: '2px 6px', borderRadius: 4,
                                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3,
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
                              Center
                            </button>

                            <div style={{ width: 1, height: 18, background: '#334155' }} />

                            {/* Align Right */}
                            <button
                              type="button"
                              title="Align Right"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!selectedImage) return;
                                selectedImage.style.display = 'block';
                                selectedImage.style.marginLeft = 'auto';
                                selectedImage.style.marginRight = '0';
                                const parent = selectedImage.parentElement;
                                if (parent) parent.style.textAlign = 'right';
                                updateResizerPosition(selectedImage);
                              }}
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#94a3b8', padding: '2px 6px', borderRadius: 4,
                                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3,
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
                              Right
                            </button>

                            <div style={{ width: 1, height: 18, background: '#334155' }} />

                            {/* Full Width */}
                            <button
                              type="button"
                              title="Full Width"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!selectedImage) return;
                                selectedImage.style.width = '100%';
                                selectedImage.style.height = 'auto';
                                selectedImage.style.display = 'block';
                                selectedImage.style.marginLeft = '0';
                                selectedImage.style.marginRight = '0';
                                updateResizerPosition(selectedImage);
                              }}
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#94a3b8', padding: '2px 6px', borderRadius: 4,
                                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3,
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 8 3 12 8 16"/><polyline points="16 8 21 12 16 16"/></svg>
                              Full
                            </button>

                            <div style={{ width: 1, height: 18, background: '#334155' }} />

                            {/* Deselect / Close */}
                            <button
                              type="button"
                              title="Deselect Image"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSelectedImage(null);
                                setResizerStyle(null);
                              }}
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#f87171', padding: '2px 5px', borderRadius: 4,
                                fontSize: 13, fontWeight: 900,
                              }}
                            >✕</button>
                          </div>

                          {/* Blue selection border */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            border: '2px solid #2563eb',
                            borderRadius: 2,
                            boxShadow: '0 0 0 1px rgba(37,99,235,0.25)',
                            pointerEvents: 'none',
                          }} />

                          {/* ── Full-image drag-to-move area ── */}
                          <div
                            title="Drag to move image"
                            onMouseDown={handleImageMoveStart}
                            style={{
                              position: 'absolute', inset: 0,
                              cursor: 'grab',
                              pointerEvents: 'all',
                              zIndex: 2,
                              borderRadius: 2,
                              // Subtle blue tint only on hover (via inline hover workaround)
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(37,99,235,0.07)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                          >
                            {/* Move icon badge in the center */}
                            <div style={{
                              position: 'absolute',
                              top: '50%', left: '50%',
                              transform: 'translate(-50%, -50%)',
                              background: 'rgba(30,41,59,0.82)',
                              border: '1px solid rgba(255,255,255,0.18)',
                              borderRadius: 8,
                              padding: '5px 10px',
                              display: 'flex', alignItems: 'center', gap: 5,
                              pointerEvents: 'none',
                              color: '#e2e8f0',
                              fontSize: 11, fontWeight: 700,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                              whiteSpace: 'nowrap',
                            }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/>
                                <polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/>
                                <line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
                              </svg>
                              Drag to Move
                            </div>
                          </div>

                          {/* Image size badge */}
                          <div style={{
                            position: 'absolute', bottom: -26, left: 0,
                            background: '#2563eb', color: '#fff',
                            fontSize: 10, fontWeight: 700, padding: '2px 8px',
                            borderRadius: 4, whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}>
                            {Math.round(resizerStyle.width)} × {Math.round(resizerStyle.height)} px
                          </div>

                          {/* Drag handles — 8 positions */}
                          {(['nw','n','ne','e','se','s','sw','w'] as const).map((handle) => {
                            const isCorner = ['nw','ne','se','sw'].includes(handle);
                            const posStyle: React.CSSProperties = {
                              position: 'absolute', width: 10, height: 10,
                              background: '#2563eb', border: '1.5px solid #fff',
                              borderRadius: isCorner ? 2 : 3,
                              pointerEvents: 'all',
                              cursor:
                                handle === 'nw' || handle === 'se' ? 'nwse-resize' :
                                handle === 'ne' || handle === 'sw' ? 'nesw-resize' :
                                handle === 'n' || handle === 's' ? 'ns-resize' : 'ew-resize',
                              transform: 'translate(-50%, -50%)',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                              top:
                                handle.includes('n') ? 0 :
                                handle.includes('s') ? '100%' : '50%',
                              left:
                                handle.includes('w') ? 0 :
                                handle.includes('e') ? '100%' : '50%',
                            };
                            return (
                              <div
                                key={handle}
                                style={posStyle}
                                onMouseDown={(e) => handleResizerMouseDown(e, handle)}
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* ── Floating Delete Button for Promo Box ── */}
                      {promoBoxStyle && selectedPromoBox && (
                        <div
                          style={{
                            position: 'absolute',
                            top: promoBoxStyle.top,
                            left: promoBoxStyle.left,
                            width: promoBoxStyle.width,
                            height: promoBoxStyle.height,
                            pointerEvents: 'none',
                            zIndex: 50,
                          }}
                        >
                          <div style={{
                            position: 'absolute',
                            top: -42,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: 8,
                            padding: '4px 6px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                            pointerEvents: 'all',
                            whiteSpace: 'nowrap',
                          }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (selectedPromoBox) {
                                  selectedPromoBox.remove();
                                  setSelectedPromoBox(null);
                                  setPromoBoxStyle(null);
                                }
                              }}
                              className="text-white hover:bg-red-750 bg-red-600 font-black text-[10px] px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer border-none"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-white" />
                              <span>Remove Promo Link</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedPromoBox(null);
                                setPromoBoxStyle(null);
                              }}
                              className="text-slate-400 hover:text-white font-black text-[10px] px-2 py-1.5 rounded-md transition-colors cursor-pointer border-none bg-transparent"
                            >
                              Cancel
                            </button>
                          </div>
                          {/* Dotted highlight border around the promo box */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            border: '2px dashed #ef4444',
                            borderRadius: 4,
                            pointerEvents: 'none',
                          }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata fields (Author and date) */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Select Author Section */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Author Section / Category</label>
                      <select
                        value={selectedAuthorSection}
                        onChange={(e) => {
                          const sec = e.target.value;
                          setSelectedAuthorSection(sec);
                          if (sec === 'custom') {
                            setNewsAuthor('హై టీవీ డెస్క్');
                            setSelectedReporterId('');
                          } else {
                            // Automatically select first reporter in this section if available
                            const members = teamMembers.filter(m => (m.body || 'reporters') === sec);
                            if (members.length > 0) {
                              setSelectedReporterId(members[0].title);
                              setNewsAuthor(members[0].title);
                            } else {
                              setSelectedReporterId('');
                              setNewsAuthor('');
                            }
                          }
                        }}
                        className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold cursor-pointer"
                      >
                        <option value="custom">Default / Custom (మ్యాన్యువల్)</option>
                        {(() => {
                          const sections = teamSections.length > 0
                            ? teamSections.map(s => ({ id: s.slug, name: s.title }))
                            : [
                                { id: 'reporters', name: 'HighTV Reporters' },
                                { id: 'desk', name: 'HighTV Desk' }
                              ];
                          return sections.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ));
                        })()}
                      </select>
                    </div>

                    {/* Dependent Author Name Input or Dropdown */}
                    {selectedAuthorSection === 'custom' ? (
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Reporter / Author Name</label>
                        <input
                          type="text"
                          value={newsAuthor}
                          onChange={(e) => setNewsAuthor(e.target.value)}
                          placeholder="Reporter name"
                          className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                          style={{ textIndent: '6px' }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Select Team Member / Reporter</label>
                        <select
                          value={selectedReporterId}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedReporterId(val);
                            setNewsAuthor(val);
                          }}
                          className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold cursor-pointer"
                        >
                          <option value="">-- రిపోర్టర్ ని ఎంచుకోండి --</option>
                          {teamMembers
                            .filter(m => (m.body || 'reporters') === selectedAuthorSection)
                            .map(m => (
                              <option key={m.id} value={m.title}>{m.title}</option>
                            ))
                          }
                        </select>
                      </div>
                    )}

                    {/* Published Date (Auto-managed) */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest flex items-center gap-2">
                        Publish Date &amp; Time
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full normal-case tracking-normal">
                          Auto
                        </span>
                      </label>
                      <div className="bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2 select-none">
                        {newsViewMode === 'add' ? (
                          <span>Auto-set to current time when published</span>
                        ) : (
                          <span>Keeps original publish time (Updated time will auto-update to edited time)</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column (Featured Image and Categories Checklist) */}
                <div className="space-y-6">
                  
                  {/* Featured Image Box */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">Featured Image</label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-rose-500 rounded-2xl p-4 bg-slate-50 text-center relative cursor-pointer min-h-[160px] flex items-center justify-center transition-colors">
                      <input
                        type="file"
                        ref={featuredImageInputRef}
                        accept="image/*"
                        onChange={handleFeaturedImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {!newsImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-6 h-6 text-slate-400" />
                          <span className="text-xs font-bold text-slate-500">Click to upload featured image</span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider">Rescaled to max 800px width</span>
                        </div>
                      ) : (
                        <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-200">
                          <img src={newsImage} alt="Featured cover" className="w-full h-auto object-cover max-h-[160px] block" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setNewsImage('');
                            }}
                            className="absolute top-2 right-2 bg-black/60 hover:bg-black/90 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Short Video File Box (Only for Shorts category) */}
                  {selectedCategories.includes('shorts') && (
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
                      <label className="text-[11px] font-black text-[#f43f5e] uppercase tracking-widest">Short Video File</label>
                      <div className="border-2 border-dashed border-slate-200 hover:border-[#f43f5e] rounded-2xl p-4 bg-slate-50 text-center relative cursor-pointer min-h-[160px] flex items-center justify-center transition-colors">
                        <input
                          type="file"
                          ref={newsVideoInputRef}
                          accept="video/*"
                          onChange={handleNewsVideoChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        {!newsVideo ? (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-6 h-6 text-slate-400" />
                            <span className="text-xs font-bold text-slate-500">Click to upload short video file</span>
                            <span className="text-[9px] text-slate-400 uppercase tracking-wider">Max 100MB file size</span>
                          </div>
                        ) : (
                          <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-200 p-2">
                            <video 
                              src={newsVideo} 
                              controls 
                              className="w-full h-auto max-h-[160px] block rounded-lg object-contain bg-black" 
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setNewsVideo('');
                              }}
                              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors cursor-pointer shadow-md"
                              title="Delete Video"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

              </form>
            </div>
          )}

          {/* ══════════════ VIEW: BREAKING NEWS TICKER ══════════════ */}
          {activeTab === 'breaking' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800 font-sans">Breaking News Config</h2>
                <p className="text-slate-500 text-xs">Configure scrolling flash marquee headlines appearing on the website header ticker.</p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm">
                
                {/* Flash News Label Editor */}
                <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-2xl flex flex-col gap-4">
                  <span className="text-[11px] font-black text-[#02599c] uppercase tracking-widest">
                    Flash News Label Text
                  </span>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={flashNewsLabel}
                      onChange={(e) => setFlashNewsLabel(e.target.value)}
                      placeholder="e.g. Flash News, Breaking, Live..."
                      className="flex-1 bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const lbl = flashNewsLabel.trim() || 'Flash News';
                        fetch('/api/settings', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ flash_news_label: lbl })
                        })
                        .then(() => alert('Label saved to AWS Live Server!'))
                        .catch(err => {
                          console.error("Error saving label:", err);
                          alert('Failed to save label to server.');
                        });
                      }}
                      className="bg-[#02599c] hover:bg-[#024a82] text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
                    >
                      Save Label
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">This changes the red label shown in the ticker bar on the website header.</span>
                </div>

                {/* Form to append Headline */}
                <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-2xl flex flex-col gap-4">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    {editingFlashIndex !== null ? '✍️ Edit scrolling headline' : 'Add scrolling headline'}
                  </span>
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      type="text"
                      value={newNewsText}
                      onChange={(e) => setNewNewsText(e.target.value)}
                      placeholder="e.g. నేడు హైదరాబాద్‌లో భారీ వర్షం..."
                      className="flex-1 bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />

                    {/* Article Picker — replaces URL input */}
                    <div className="flex-1 flex items-center gap-2">
                      {newNewsLink ? (
                        // Show selected article link as badge
                        <div className="flex-1 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 min-w-0">
                          <span className="text-[10px] font-bold text-blue-700 truncate flex-1 font-mono">{newNewsLink}</span>
                          <button
                            type="button"
                            onClick={() => setNewNewsLink('')}
                            className="text-blue-400 hover:text-red-500 flex-shrink-0 cursor-pointer transition-colors"
                            title="Clear selected article"
                          >
                            <span className="text-sm font-black">✕</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setShowFlashArticlePicker(true); setFlashArticleSearch(''); }}
                          className="flex-1 bg-white border border-dashed border-slate-300 hover:border-[#02599c] hover:bg-blue-50 text-slate-500 hover:text-[#02599c] font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span>Select Article to Link</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFlashNews}
                      className="bg-[#02599c] hover:bg-[#024a82] text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {editingFlashIndex !== null ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{editingFlashIndex !== null ? 'Update item' : 'Add item'}</span>
                    </button>
                    {editingFlashIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewNewsText('');
                          setNewNewsLink('');
                          setEditingFlashIndex(null);
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Flash News Article Picker Modal */}
                {showFlashArticlePicker && (() => {
                  const filteredFlashArticles = flashArticleSearch.trim()
                    ? allArticles.filter((a: any) =>
                        a.title?.toLowerCase().includes(flashArticleSearch.toLowerCase()) ||
                        a.category?.toLowerCase().includes(flashArticleSearch.toLowerCase()) ||
                        a.categorySlug?.toLowerCase().includes(flashArticleSearch.toLowerCase())
                      )
                    : allArticles;

                  return (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
                      <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh] animate-scale-up text-left">
                        {/* Modal Header */}
                        <div className="bg-[#02599c] text-white p-5 flex items-center justify-between flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            <h3 className="font-black text-sm">Select Article to Link Flash Headline</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowFlashArticlePicker(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors font-bold"
                          >✕</button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-slate-100 flex-shrink-0">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              autoFocus
                              value={flashArticleSearch}
                              onChange={e => setFlashArticleSearch(e.target.value)}
                              placeholder="Search by title or category..."
                              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-[#02599c] rounded-xl outline-none text-slate-800"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-2 font-bold">
                            {filteredFlashArticles.length} articles found. Click any article to set it as the redirect destination.
                          </p>
                        </div>

                        {/* Articles List */}
                        <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                          {filteredFlashArticles.length === 0 ? (
                            <div className="p-10 text-center text-slate-400 font-bold text-sm">No articles found.</div>
                          ) : (
                            filteredFlashArticles.map((art: any) => (
                              <button
                                key={art.id}
                                type="button"
                                onClick={() => {
                                  setNewNewsLink(`/news/${art.slug}`);
                                  // Auto-fill headline text if empty
                                  if (!newNewsText.trim()) {
                                    setNewNewsText(art.title);
                                  }
                                  setShowFlashArticlePicker(false);
                                }}
                                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors text-left group"
                              >
                                {/* Thumbnail */}
                                <div className="w-16 h-11 flex-shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200">
                                  <img
                                    src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=120&fit=crop'}
                                    alt={art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0 py-0.5">
                                  <p
                                    className="text-xs font-bold text-slate-800 group-hover:text-[#02599c] telugu-text line-clamp-2 leading-relaxed transition-colors"
                                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                  >
                                    {art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-slate-400 font-bold">{getArticleCategoryName(art)}</span>
                                    {art.publishedAt && (
                                      <span className="text-[10px] text-slate-350">• {new Date(art.publishedAt).toLocaleDateString('te-IN')}</span>
                                    )}
                                    <span className="text-[10px] font-mono text-slate-300">• /news/{art.slug}</span>
                                  </div>
                                </div>
                                <span className="flex-shrink-0 text-[10px] font-bold text-[#02599c] bg-blue-50 group-hover:bg-[#02599c] group-hover:text-white px-2 py-1 rounded-lg transition-colors mt-0.5">
                                  Select
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}


                <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black">
                        <th className="p-3 text-[10px] uppercase tracking-wider">#</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">Headline Text (Telugu)</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">Redirect Link</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {flashNewsList.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-450 font-bold">
                            No ticker headlines configured. Add one above!
                          </td>
                        </tr>
                      ) : (
                        flashNewsList.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-slate-400 font-bold">{index + 1}</td>
                            <td className="p-3 font-bold text-slate-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                              {item.text}
                            </td>
                            <td className="p-3 font-mono text-[10px] text-slate-400 truncate max-w-[200px]">{item.link}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => startEditingFlashNews(index)}
                                  className="text-slate-500 hover:text-rose-600 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-slate-100"
                                  title="Edit item"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFlashNews(index)}
                                  className="text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-red-500/10"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* ══════════════ VIEW: TRENDING NEWS TICKER ══════════════ */}
          {activeTab === 'trending' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800 font-sans">Trending News Config</h2>
                <p className="text-slate-500 text-xs">Configure the rotating trending headlines displayed in the website&apos;s top header TRENDING bar.</p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm">

                {/* Form to append Trending Headline */}
                <div className="bg-amber-50 p-4 border border-amber-200/60 rounded-2xl flex flex-col gap-4">
                  <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest">
                    {editingTrendingIndex !== null ? '✍️ Edit trending headline' : '📈 Add trending headline'}
                  </span>
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      type="text"
                      value={newTrendingText}
                      onChange={(e) => setNewTrendingText(e.target.value)}
                      placeholder="e.g. హైదరాబాద్‌లో నేడు భారీ ట్రాఫిక్ జామ్..."
                      className="flex-1 bg-white border border-slate-200/60 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />

                    {/* Article Picker — replaces URL input */}
                    <div className="flex-1 flex items-center gap-2">
                      {newTrendingLink ? (
                        <div className="flex-1 flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 min-w-0">
                          <span className="text-[10px] font-bold text-amber-700 truncate flex-1 font-mono">{newTrendingLink}</span>
                          <button
                            type="button"
                            onClick={() => setNewTrendingLink('')}
                            className="text-amber-400 hover:text-red-500 flex-shrink-0 cursor-pointer transition-colors"
                            title="Clear selected article"
                          >
                            <span className="text-sm font-black">✕</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setShowTrendingArticlePicker(true); setTrendingArticleSearch(''); }}
                          className="flex-1 bg-white border border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50 text-amber-500 hover:text-amber-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span>Select Article to Link</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTrendingNews}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {editingTrendingIndex !== null ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{editingTrendingIndex !== null ? 'Update item' : 'Add item'}</span>
                    </button>
                    {editingTrendingIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewTrendingText('');
                          setNewTrendingLink('');
                          setEditingTrendingIndex(null);
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Trending Article Picker Modal */}
                {showTrendingArticlePicker && (() => {
                  const filteredTrendingArticles = trendingArticleSearch.trim()
                    ? allArticles.filter((a: any) =>
                        a.title?.toLowerCase().includes(trendingArticleSearch.toLowerCase()) ||
                        a.category?.toLowerCase().includes(trendingArticleSearch.toLowerCase()) ||
                        a.categorySlug?.toLowerCase().includes(trendingArticleSearch.toLowerCase())
                      )
                    : allArticles;

                  return (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
                      <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh] animate-scale-up text-left">
                        {/* Modal Header */}
                        <div className="bg-amber-500 text-white p-5 flex items-center justify-between flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            <h3 className="font-black text-sm">Select Article to Link Trending Headline</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowTrendingArticlePicker(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors font-bold"
                          >✕</button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-slate-100 flex-shrink-0">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              autoFocus
                              value={trendingArticleSearch}
                              onChange={e => setTrendingArticleSearch(e.target.value)}
                              placeholder="Search by title or category..."
                              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl outline-none text-slate-800"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-2 font-bold">
                            {filteredTrendingArticles.length} articles found. Click any article to set it as the redirect destination.
                          </p>
                        </div>

                        {/* Articles List */}
                        <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                          {filteredTrendingArticles.length === 0 ? (
                            <div className="p-10 text-center text-slate-400 font-bold text-sm">No articles found.</div>
                          ) : (
                            filteredTrendingArticles.map((art: any) => (
                              <button
                                key={art.id}
                                type="button"
                                onClick={() => {
                                  setNewTrendingLink(`/news/${art.slug}`);
                                  if (!newTrendingText.trim()) {
                                    setNewTrendingText(art.title);
                                  }
                                  setShowTrendingArticlePicker(false);
                                }}
                                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-amber-50 cursor-pointer transition-colors text-left group"
                              >
                                <div className="w-16 h-11 flex-shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200">
                                  <img
                                    src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=120&fit=crop'}
                                    alt={art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 py-0.5">
                                  <p
                                    className="text-xs font-bold text-slate-800 group-hover:text-amber-700 telugu-text line-clamp-2 leading-relaxed transition-colors"
                                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                  >
                                    {art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-slate-400 font-bold">{getArticleCategoryName(art)}</span>
                                    {art.publishedAt && (
                                      <span className="text-[10px] text-slate-350">• {new Date(art.publishedAt).toLocaleDateString('te-IN')}</span>
                                    )}
                                    <span className="text-[10px] font-mono text-slate-300">• /news/{art.slug}</span>
                                  </div>
                                </div>
                                <span className="flex-shrink-0 text-[10px] font-bold text-amber-600 bg-amber-50 group-hover:bg-amber-500 group-hover:text-white px-2 py-1 rounded-lg transition-colors mt-0.5">
                                  Select
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Grid Table lists */}

                <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-50 border-b border-amber-100 text-slate-400 font-black">
                        <th className="p-3 text-[10px] uppercase tracking-wider">#</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">Trending Headline Text (Telugu)</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">Redirect Link</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {trendingNewsList.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-450 font-bold">
                            No trending headlines configured. Add one above!
                          </td>
                        </tr>
                      ) : (
                        trendingNewsList.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-slate-400 font-bold">{index + 1}</td>
                            <td className="p-3 font-bold text-slate-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                              {item.text}
                            </td>
                            <td className="p-3 font-mono text-[10px] text-slate-400 truncate max-w-[200px]">{item.link}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => startEditingTrendingNews(index)}
                                  className="text-slate-500 hover:text-amber-600 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-amber-50"
                                  title="Edit item"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTrendingNews(index)}
                                  className="text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-red-500/10"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* ══════════════ VIEW: CATEGORIES & BANNERS ══════════════ */}
          {/* ══════════════ VIEW: MOBILE ADS MANAGER ══════════════ */}
          {activeTab === 'mobile-ads' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">మొబైల్ యాడ్స్ మేనేజర్ (Mobile Ads Manager)</h2>
                <p className="text-slate-500 text-xs">వెబ్‌సైట్ మొబైల్ వ్యూ కోసం ప్రత్యేకంగా ప్రకటనలను ఇక్కడ జోడించండి (Configure mobile-specific leaderboard, square sidebar, and feed rectangle ads).</p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm mt-2">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  📱 Select Mobile Banner Position
                </h3>

                <div className="flex bg-slate-100 p-1 rounded-xl gap-1.5 select-none w-full md:max-w-md">
                  {[
                    { key: 'mobile_leaderboard', label: 'Leaderboard (Top)' },
                    { key: 'mobile_sidebar', label: 'Sidebar (Square)' },
                    { key: 'mobile_rectangle', label: 'Rectangle (Feed)' }
                  ].map((spot) => (
                    <button
                      key={spot.key}
                      type="button"
                      onClick={() => setActiveAdSpot(spot.key as any)}
                      className={`flex-1 text-center py-2.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                        activeAdSpot === spot.key ? 'bg-[#02599c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {spot.label}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-850">Activate this custom mobile banner</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adSpotEnabled}
                        onChange={(e) => setAdSpotEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#02599c]"></div>
                    </label>
                  </div>

                  {adSpotEnabled && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image Media</label>
                        <div className="border border-dashed border-slate-200 bg-white hover:border-[#02599c] rounded-xl p-4 text-center relative cursor-pointer min-h-[100px] flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAdSpotImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          {!adSpotImage ? (
                            <span className="text-xs text-slate-400 font-bold">Select image banner file</span>
                          ) : (
                            <div className="relative max-w-[280px]">
                              <img src={adSpotImage} alt="ad" className="max-h-[120px] w-auto rounded border border-slate-200" />
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setAdSpotImage(''); }}
                                className="absolute -top-2 -right-2 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                              >✕</button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click URL Link</label>
                        <input
                          type="text"
                          value={adSpotLink}
                          onChange={(e) => setAdSpotLink(e.target.value)}
                          placeholder="e.g. https://www.godaddy.com"
                          className="bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs font-mono outline-none text-slate-850"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions submit buttons */}
              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  onClick={handleSaveConfigs}
                  disabled={saveStatus === 'saving'}
                  className={`w-full md:w-auto font-black text-xs py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md text-center flex items-center justify-center min-w-[150px] ${
                    saveStatus === 'saved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {saveStatus === 'saving' && 'Saving configurations...'}
                  {saveStatus === 'saved' && '✓ Configuration Saved!'}
                  {saveStatus === 'idle' && 'Save Configurations'}
                </button>
              </div>

            </div>
          )}

          {/* ══════════════ VIEW: HIGH TV VIDEOS ══════════════ */}
          {activeTab === 'high-tv-videos' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">హై టీవీ వీడియోలు (High TV Videos)</h2>
                <p className="text-slate-500 text-xs">వెబ్‌సైట్ సైడ్‌బార్‌లో కనిపించే యూట్యూబ్ వీడియోల లింక్‌లు మరియు వివరాలను ఇక్కడ జోడించండి.</p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <Tv className="w-4 h-4 text-rose-500" /> సైడ్‌బార్ వీడియోల మేనేజర్ (Sidebar Videos Manager)
                </h3>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, idx) => {
                    const video = videosList[idx] || { id: '', title: '', thumbnail: '' };
                    return (
                      <div key={idx} className="bg-slate-50 p-4 border border-slate-200/60 rounded-xl flex flex-col md:flex-row gap-4">
                        <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-mono font-bold text-xs shrink-0 shadow-inner">
                          {idx + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">యూట్యూబ్ లింక్ లేదా ఐడీ (YouTube Link / ID)</label>
                            <input
                              type="text"
                              value={video.id}
                              onChange={(e) => handleVideoFieldChange(idx, 'id', e.target.value)}
                              placeholder="e.g. https://www.youtube.com/watch?v=q6h3C_s8sSw"
                              className="bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-mono font-bold"
                              style={{ lineHeight: 'normal' }}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-455 uppercase tracking-wide">వీడియో శీర్షిక (Video Title)</label>
                            <input
                              type="text"
                              value={video.title}
                              onChange={(e) => handleVideoFieldChange(idx, 'title', e.target.value)}
                              placeholder="e.g. దేవర పార్ట్-1 అఫీషియల్ ట్రైలర్..."
                              className="bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl pl-5 pr-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-semibold telugu-text"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: 'normal' }}
                            />
                          </div>
                          
                        </div>
                        <div className="w-full md:w-[130px] aspect-video border border-slate-200/80 rounded-xl overflow-hidden bg-black flex items-center justify-center shrink-0">
                          {video.id ? (
                            <img
                              src={video.thumbnail || `https://img.youtube.com/vi/${(() => {
                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                                const match = video.id.match(regExp);
                                return (match && match[2].length === 11) ? match[2] : video.id.trim();
                              })()}/hqdefault.jpg`}
                              alt="Video Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[9px] font-bold text-slate-400 uppercase">No video</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions submit button */}
              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  onClick={handleSaveConfigs}
                  disabled={saveStatus === 'saving'}
                  className={`w-full md:w-auto font-black text-xs py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md text-center flex items-center justify-center min-w-[150px] ${
                    saveStatus === 'saved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {saveStatus === 'saving' && 'Saving configurations...'}
                  {saveStatus === 'saved' && '✓ Configuration Saved!'}
                  {saveStatus === 'idle' && 'Save Configurations'}
                </button>
              </div>

            </div>
          )}

          {/* ══════════════ VIEW: OVERLAYS CONFIGS ══════════════ */}
          {activeTab === 'overlays' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Overlay Configuration</h2>
                <p className="text-slate-500 text-xs">Manage popup cards and inline article graphics configurations.</p>
              </div>

              {/* 1. Modal Promo Popups */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  📢 Global Promotional Popups
                </h3>

                <div className="flex bg-slate-100 p-1 rounded-xl gap-1.5 select-none w-full md:max-w-md text-xs font-black">
                  <button
                    type="button"
                    onClick={() => setPopupScope('home')}
                    className={`flex-1 text-center py-2 rounded-lg transition-all cursor-pointer ${
                      popupScope === 'home' ? 'bg-[#02599c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🏠 Homepage Popup
                  </button>
                  <button
                    type="button"
                    onClick={() => setPopupScope('article')}
                    className={`flex-1 text-center py-2 rounded-lg transition-all cursor-pointer ${
                      popupScope === 'article' ? 'bg-[#02599c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    📄 Article View Popup
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-850">Enable popup for {popupScope === 'home' ? 'Homepage' : 'Articles'}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={popupEnabled}
                        onChange={(e) => setPopupEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#02599c]"></div>
                    </label>
                  </div>

                  {popupEnabled && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between bg-slate-100/50 p-3 rounded-xl border border-slate-200/40">
                        <span className="text-xs font-black text-slate-700">
                          {popupType === 'poll' ? '📊 Show Poll inside Popup (పోల్‌ను పాప్‌అప్‌గా చూపించు - Active)' : '📢 Show Ad inside Popup (యాడ్‌ను పాప్‌అప్‌గా చూపించు - Active)'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={popupType === 'poll'}
                            onChange={(e) => setPopupType(e.target.checked ? 'poll' : 'ad')}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#02599c]"></div>
                        </label>
                      </div>

                      <div className="h-px bg-slate-200 my-1" />

                      {popupType === 'ad' ? (
                        <div className="space-y-4 animate-fade-in">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ad Banner Image URL</label>
                            <input
                              type="text"
                              value={adImage}
                              onChange={(e) => setAdImage(e.target.value)}
                              className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-850"
                              placeholder="/popup-ad.png"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Redirect URL Link</label>
                            <input
                              type="text"
                              value={adLink}
                              onChange={(e) => setAdLink(e.target.value)}
                              className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-850"
                              placeholder="#"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-fade-in">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Voting Question (Telugu/English)</label>
                            <textarea
                              rows={2}
                              value={pollQuestion}
                              onChange={(e) => setPollQuestion(e.target.value)}
                              className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none resize-none text-slate-850 font-bold telugu-text"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider">Option 1</label>
                              <input
                                type="text"
                                value={optYes}
                                onChange={(e) => setOptYes(e.target.value)}
                                className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-2 py-1.5 text-xs outline-none text-slate-850 telugu-text font-bold"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider">Option 2</label>
                              <input
                                type="text"
                                value={optNo}
                                onChange={(e) => setOptNo(e.target.value)}
                                className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-2 py-1.5 text-xs outline-none text-slate-850 telugu-text font-bold"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider">Option 3</label>
                              <input
                                type="text"
                                value={optUnsure}
                                onChange={(e) => setOptUnsure(e.target.value)}
                                className="bg-white border border-slate-200 focus:border-rose-500 rounded-xl px-2 py-1.5 text-xs outline-none text-slate-850 telugu-text font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Inline Image in Articles */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm mt-2">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  🖼️ Inline Graphic Overlay
                </h3>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black text-slate-850">Activate inline graphics</span>
                      <span className="text-[10px] text-slate-400">Renders this inline graphic image inside all article content details views.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inlineImageEnabled}
                        onChange={(e) => setInlineImageEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#02599c]"></div>
                    </label>
                  </div>

                  {inlineImageEnabled && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Graphic Image</label>
                        <div className="border border-dashed border-slate-200 bg-white hover:border-[#02599c] rounded-xl p-4 text-center relative cursor-pointer min-h-[100px] flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleCompressAndSetImage(file, (base64) => {
                                  setInlineImageData(base64);
                                });
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          {!inlineImageData ? (
                            <span className="text-xs text-slate-400 font-bold">Select image file</span>
                          ) : (
                            <div className="relative max-w-[200px]">
                              <img src={inlineImageData} alt="inline" className="max-h-[100px] w-auto rounded border border-slate-200" />
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setInlineImageData(''); }}
                                className="absolute -top-2 -right-2 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                              >✕</button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image Caption (Telugu/English)</label>
                        <input
                          type="text"
                          value={inlineImageCaption}
                          onChange={(e) => setInlineImageCaption(e.target.value)}
                          placeholder="e.g. యోగ ఆసనాలు వేస్తున్న మోదీ.."
                          className="bg-white border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none text-slate-850 font-bold telugu-text"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Related News Promo Box Toggle */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm mt-2">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  🔗 Inner Article Related Promos ("ఈ వార్తా చదవండి :")
                </h3>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black text-slate-850">Enable Related News Promos</span>
                      <span className="text-[10px] text-slate-400">Dynamically inserts related news suggestion boxes inside the article body text.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inlinePromosEnabled}
                        onChange={(e) => setInlinePromosEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#02599c]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Submit */}
              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  onClick={handleSaveConfigs}
                  disabled={saveStatus === 'saving'}
                  className={`w-full md:w-auto font-black text-xs py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md text-center flex items-center justify-center min-w-[150px] ${
                    saveStatus === 'saved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {saveStatus === 'saving' && 'Saving configurations...'}
                  {saveStatus === 'saved' && '✓ Configuration Saved!'}
                  {saveStatus === 'idle' && 'Save Configurations'}
                </button>
              </div>

            </div>
          )}

          {/* ══════════════ VIEW: E-PAPER EDITIONS ══════════════ */}
          {activeTab === 'epaper' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">E-Paper Editions Manager</h2>
                <p className="text-slate-500 text-xs">Publish and delete e-paper PDF issues displayed in the E-Paper page.</p>
              </div>

              {/* Upload E-Paper Form */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  Publish New E-Paper
                </h3>
                <form onSubmit={handleAddEpaper} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-Paper Edition Title (Telugu/English)</label>
                    <input
                      type="text"
                      required
                      value={epaperTitle}
                      onChange={(e) => setEpaperTitle(e.target.value)}
                      placeholder="e.g. నేటి ఈ-పేపర్ ఎడిషన్"
                      className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs outline-none font-bold text-slate-800 telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Edition Date</label>
                    <input
                      type="date"
                      required
                      value={epaperDate}
                      onChange={(e) => setEpaperDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs outline-none text-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section / Category</label>
                    <select
                      value={epaperSection}
                      onChange={(e) => setEpaperSection(e.target.value)}
                      className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none font-bold text-slate-800 cursor-pointer"
                    >
                      {epaperSections.map((sec) => (
                        <option key={sec.id} value={sec.key}>
                          {sec.name}
                        </option>
                      ))}
                      <option value="custom">Other / Custom Section (ఇతర విభాగాలు)</option>
                    </select>
                  </div>

                  {/* Sub-edition selector for Main Editions */}
                  {epaperSection === 'main' && (
                    <div className="flex flex-col gap-1 animate-fade-in">
                      <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1">
                        <span>Select Main Edition Type</span>
                        <span className="text-slate-400 font-normal">(ప్రధాన సంచిక విభాగం)</span>
                      </label>
                      <select
                        value={epaperDistrict}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEpaperDistrict(val);
                          if (val === 'telangana-main') setEpaperTitle('తెలంగాణ ప్రధాన సంచిక');
                          else if (val === 'ap-main') setEpaperTitle('ఆంధ్రప్రదేశ్ ప్రధాన సంచిక');
                          else if (val === 'hyderabad-main') setEpaperTitle('హైదరాబాద్ ప్రధాన సంచిక');
                          else if (val === 'general-main') setEpaperTitle('నేటి ప్రధాన సంచిక');
                        }}
                        className="bg-rose-50/50 border border-rose-200 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none font-bold text-slate-800 cursor-pointer telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      >
                        <option value="">జనరల్ ప్రధాన సంచిక (General Main Edition)</option>
                        <option value="telangana-main">తెలంగాణ ప్రధాన సంచిక (Telangana Main)</option>
                        <option value="ap-main">ఆంధ్రప్రదేశ్ ప్రధాన సంచిక (Andhra Pradesh Main)</option>
                        <option value="hyderabad-main">హైదరాబాద్ ప్రధాన సంచిక (Hyderabad Main)</option>
                      </select>
                    </div>
                  )}

                  {/* District selector for Telangana and AP */}
                  {(epaperSection === 'telangana' || epaperSection === 'ap') && (
                    <div className="flex flex-col gap-1 animate-fade-in">
                      <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1">
                        <span>Select Specific District</span>
                        <span className="text-slate-400 font-normal">(జిల్లాను ఎంచుకోండి)</span>
                      </label>
                      <select
                        value={epaperDistrict}
                        onChange={(e) => {
                          const distSlug = e.target.value;
                          setEpaperDistrict(distSlug);
                          if (distSlug) {
                            const distObj = (epaperSection === 'telangana' ? tgDistricts : apDistricts).find(d => d.slug === distSlug);
                            if (distObj && (!epaperTitle || epaperTitle === 'నేటి ఈ-పేపర్ ఎడిషన్')) {
                              setEpaperTitle(`${distObj.name} జిల్లా ఎడిషన్`);
                            }
                          }
                        }}
                        className="bg-rose-50/50 border border-rose-200 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none font-bold text-slate-800 cursor-pointer telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      >
                        <option value="">మొత్తం రాష్ట్రీయ ఎడిషన్ (Statewide Main)</option>
                        {(epaperSection === 'telangana' ? tgDistricts : apDistricts).map((d) => (
                          <option key={d.slug} value={d.slug}>
                            {d.name} ({d.slug})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PDF E-Paper File <strong className="text-rose-500">*</strong></label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="epaper-pdf-input"
                        className="hidden"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 50 * 1024 * 1024) {
                              alert('PDF file is too large! Please select a file smaller than 50MB.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                              setEpaperPdf(reader.result as string);
                            };
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('epaper-pdf-input')?.click()}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>PDF ఫైల్ ఎంచుకోండి (Choose PDF)</span>
                      </button>
                      {epaperPdf && (
                        <div className="flex items-center gap-1 text-[11.5px] text-emerald-600 font-bold">
                          <span>✓ PDF Loaded</span>
                          <button
                            type="button"
                            onClick={() => setEpaperPdf('')}
                            className="text-rose-500 hover:text-rose-700 ml-1 underline cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
                  </div>                  {epaperSection === 'custom' && (
                    <div className="md:col-span-4 flex flex-col gap-1 animate-fade-in">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Section Name / Key <strong className="text-rose-500">*</strong></label>
                      <input
                        type="text"
                        required
                        value={customEpaperSection}
                        onChange={(e) => setCustomEpaperSection(e.target.value)}
                        placeholder="e.g. editorial, special-editions, etc."
                        className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs outline-none font-bold text-slate-800"
                      />
                    </div>
                  )}

                  <div className="md:col-span-4 flex items-center justify-end gap-2">
                    {editingEpaperId && (
                      <button
                        type="button"
                        onClick={handleCancelEditEpaper}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSavingEpaper}
                      className={`${editingEpaperId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'} disabled:bg-slate-350 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1 hover:scale-[1.01]`}
                    >
                      {editingEpaperId ? (
                        <>
                          <Pencil className="w-4 h-4" />
                          <span>{isSavingEpaper ? 'Updating...' : 'Update E-Paper Edition'}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>{isSavingEpaper ? 'Publishing...' : 'Publish E-Paper'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Dynamic Section Category Manager */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-1">
                
                {/* Add New Section Form */}
                <div className="md:col-span-1 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col gap-3.5">
                  <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-rose-500" />
                    Add E-Paper Section
                  </h3>
                  <form onSubmit={handleAddEpaperSection} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Display Name <strong className="text-rose-500">*</strong></label>
                      <input
                        type="text"
                        required
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        placeholder="e.g. Hyderabad Metro"
                        className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none font-bold text-slate-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Key / Slug <strong className="text-rose-500">*</strong></label>
                      <input
                        type="text"
                        required
                        value={newSectionKey}
                        onChange={(e) => setNewSectionKey(e.target.value)}
                        placeholder="e.g. hyd-metro (lowercase)"
                        className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs font-mono outline-none text-slate-800"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSavingSection}
                      className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-350 text-white font-black text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-sm text-center mt-1"
                    >
                      {isSavingSection ? 'Adding...' : 'Add Section'}
                    </button>
                  </form>
                </div>

                {/* Current Dynamic Sections List */}
                <div className="md:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                  <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                    Manage Sections / Sub-sections ({epaperSections.length})
                  </h3>
                  <div className="border border-slate-150 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black">
                          <th className="p-2.5 text-[9px] uppercase tracking-wider">Display Name</th>
                          <th className="p-2.5 text-[9px] uppercase tracking-wider">Section Key</th>
                          <th className="p-2.5 text-[9px] uppercase tracking-wider text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {epaperSections.map((sec) => (
                          <tr key={sec.id} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-bold text-slate-700">{sec.name}</td>
                            <td className="p-2.5 font-mono text-[11px] text-slate-500">{sec.key}</td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteEpaperSection(sec.id)}
                                className="text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                        {epaperSections.length === 0 && (
                          <tr>
                            <td colSpan={3} className="p-4 text-center text-slate-400 font-bold">
                              No categories configured yet. Default ones will load automatically.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Stored E-Papers Grid */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4 mt-2">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  Published Issues ({epapersList.length})
                </h3>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black">
                        <th className="p-3 text-[10px] uppercase tracking-wider">Date</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">Edition Title</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">Section</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider">File Path</th>
                        <th className="p-3 text-[10px] uppercase tracking-wider text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {epapersList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-450 font-bold">
                            No custom epapers uploaded. Add one above!
                          </td>
                        </tr>
                      ) : (
                        epapersList.map((paper) => (
                          <tr key={paper.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono font-bold text-slate-650">{paper.date}</td>
                            <td className="p-3 font-bold text-slate-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                              {paper.title}
                            </td>
                            <td className="p-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-100">
                                {paper.section || 'main'}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-[10px] text-slate-400 truncate max-w-[200px]">{paper.pdfUrl}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditEpaper(paper)}
                                  className="text-amber-600 hover:text-amber-800 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-amber-500/10"
                                  title="Edit E-Paper Edition"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEpaper(paper.id)}
                                  className="text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-lg hover:bg-red-500/10"
                                  title="Delete E-Paper"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ══════════════ VIEW: WEATHER PAGE CONFIG ══════════════ */}
          {activeTab === 'weather' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Weather Page Manager</h2>
                <p className="text-slate-500 text-xs">Configure daily weather reports for cities and manage weather articles.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: City reports editor */}
                <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      🌤️ Edit City Weather Data
                    </h3>
                    {weatherReports.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const currentCityName = weatherReports[selectedWeatherCityIndex]?.city;
                          if (confirm(`Are you sure you want to delete ${currentCityName}?`)) {
                            setWeatherReports(prev => prev.filter((_, idx) => idx !== selectedWeatherCityIndex));
                            setSelectedWeatherCityIndex(0);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-red-50 px-2 py-1 rounded-lg border border-red-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete City</span>
                      </button>
                    )}
                  </div>

                  {/* City selector tabs */}
                  <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-xl gap-1 items-center">
                    {weatherReports.map((report, idx) => (
                      <button
                        key={report.city}
                        type="button"
                        onClick={() => setSelectedWeatherCityIndex(idx)}
                        className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer telugu-text ${
                          selectedWeatherCityIndex === idx ? 'bg-[#02599c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {report.city}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const cityName = prompt('Enter new city name (Telugu or English):');
                        if (!cityName || !cityName.trim()) return;
                        if (weatherReports.some(r => r.city.toLowerCase() === cityName.trim().toLowerCase())) {
                          alert('City already exists!');
                          return;
                        }
                        const newCity = {
                          city: cityName.trim(),
                          temp: 30,
                          condition: 'పాక్షికంగా మేఘావృతం',
                          humidity: 60,
                          wind: 10,
                          high: 33,
                          low: 22,
                          forecast: [
                            { day: 'శుక్రవారం', temp: 31, cond: 'మేఘావృతం' },
                            { day: 'శనివారం', temp: 30, cond: 'తేలికపాటి వర్షం' },
                            { day: 'ఆదివారం', temp: 29, cond: 'భారీ వర్షం' },
                            { day: 'సోమవారం', temp: 31, cond: 'పాక్షికంగా మేఘావృతం' }
                          ]
                        };
                        setWeatherReports(prev => [...prev, newCity]);
                        setSelectedWeatherCityIndex(weatherReports.length);
                      }}
                      className="px-3 py-1.5 text-xs font-black rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add City</span>
                    </button>
                  </div>

                  {/* Selected City Details Form */}
                  {weatherReports[selectedWeatherCityIndex] && (() => {
                    const report = weatherReports[selectedWeatherCityIndex];
                    return (
                      <div className="space-y-4 animate-fade-in pt-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temperature (°C)</label>
                            <input
                              type="number"
                              value={report.temp}
                              onChange={(e) => {
                                setWeatherReports(prev => {
                                  const updated = [...prev];
                                  updated[selectedWeatherCityIndex] = {
                                    ...updated[selectedWeatherCityIndex],
                                    temp: Number(e.target.value)
                                  };
                                  return updated;
                                });
                              }}
                              className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-800 font-bold"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Condition (Telugu/English)</label>
                            <input
                              type="text"
                              value={report.condition}
                              onChange={(e) => {
                                setWeatherReports(prev => {
                                  const updated = [...prev];
                                  updated[selectedWeatherCityIndex] = {
                                    ...updated[selectedWeatherCityIndex],
                                    condition: e.target.value
                                  };
                                  return updated;
                                });
                              }}
                              className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-800 font-bold telugu-text"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Humidity (%)</label>
                            <input
                              type="number"
                              value={report.humidity}
                              onChange={(e) => {
                                setWeatherReports(prev => {
                                  const updated = [...prev];
                                  updated[selectedWeatherCityIndex] = {
                                    ...updated[selectedWeatherCityIndex],
                                    humidity: Number(e.target.value)
                                  };
                                  return updated;
                                });
                              }}
                              className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-800 font-bold"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wind Speed (km/h)</label>
                            <input
                              type="number"
                              value={report.wind}
                              onChange={(e) => {
                                setWeatherReports(prev => {
                                  const updated = [...prev];
                                  updated[selectedWeatherCityIndex] = {
                                    ...updated[selectedWeatherCityIndex],
                                    wind: Number(e.target.value)
                                  };
                                  return updated;
                                });
                              }}
                              className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-800 font-bold"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">High Temperature (°C)</label>
                            <input
                              type="number"
                              value={report.high}
                              onChange={(e) => {
                                setWeatherReports(prev => {
                                  const updated = [...prev];
                                  updated[selectedWeatherCityIndex] = {
                                    ...updated[selectedWeatherCityIndex],
                                    high: Number(e.target.value)
                                  };
                                  return updated;
                                });
                              }}
                              className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-800 font-bold"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low Temperature (°C)</label>
                            <input
                              type="number"
                              value={report.low}
                              onChange={(e) => {
                                setWeatherReports(prev => {
                                  const updated = [...prev];
                                  updated[selectedWeatherCityIndex] = {
                                    ...updated[selectedWeatherCityIndex],
                                    low: Number(e.target.value)
                                  };
                                  return updated;
                                });
                              }}
                              className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-800 font-bold"
                            />
                          </div>
                        </div>

                        {/* Forecast Section */}
                        <div className="border-t border-slate-100 pt-4 mt-2">
                          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
                            🔮 4-Day Forecast
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {report.forecast.map((forecastItem: any, forecastIdx: number) => (
                              <div key={forecastIdx} className="bg-slate-50/50 border border-slate-200/50 rounded-xl p-3 flex flex-col gap-2">
                                <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Day {forecastIdx + 1}</span>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="flex flex-col gap-1 col-span-1">
                                    <label className="text-[9px] font-bold text-slate-400">Day Name</label>
                                    <input
                                      type="text"
                                      value={forecastItem.day}
                                      onChange={(e) => {
                                        setWeatherReports(prev => {
                                          const updated = [...prev];
                                          const updatedForecast = [...updated[selectedWeatherCityIndex].forecast];
                                          updatedForecast[forecastIdx] = {
                                            ...updatedForecast[forecastIdx],
                                            day: e.target.value
                                          };
                                          updated[selectedWeatherCityIndex] = {
                                            ...updated[selectedWeatherCityIndex],
                                            forecast: updatedForecast
                                          };
                                          return updated;
                                        });
                                      }}
                                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] outline-none text-slate-800 font-bold telugu-text"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1 col-span-1">
                                    <label className="text-[9px] font-bold text-slate-400">Temp (°C)</label>
                                    <input
                                      type="number"
                                      value={forecastItem.temp}
                                      onChange={(e) => {
                                        setWeatherReports(prev => {
                                          const updated = [...prev];
                                          const updatedForecast = [...updated[selectedWeatherCityIndex].forecast];
                                          updatedForecast[forecastIdx] = {
                                            ...updatedForecast[forecastIdx],
                                            temp: Number(e.target.value)
                                          };
                                          updated[selectedWeatherCityIndex] = {
                                            ...updated[selectedWeatherCityIndex],
                                            forecast: updatedForecast
                                          };
                                          return updated;
                                        });
                                      }}
                                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] outline-none text-slate-800 font-bold"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1 col-span-1">
                                    <label className="text-[9px] font-bold text-slate-400">Condition</label>
                                    <input
                                      type="text"
                                      value={forecastItem.cond}
                                      onChange={(e) => {
                                        setWeatherReports(prev => {
                                          const updated = [...prev];
                                          const updatedForecast = [...updated[selectedWeatherCityIndex].forecast];
                                          updatedForecast[forecastIdx] = {
                                            ...updatedForecast[forecastIdx],
                                            cond: e.target.value
                                          };
                                          updated[selectedWeatherCityIndex] = {
                                            ...updated[selectedWeatherCityIndex],
                                            forecast: updatedForecast
                                          };
                                          return updated;
                                        });
                                      }}
                                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] outline-none text-slate-800 font-bold telugu-text"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Save button for weather report */}
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={handleSaveConfigs}
                      disabled={saveStatus === 'saving'}
                      className={`w-full md:w-auto font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md text-center ${
                        saveStatus === 'saved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      {saveStatus === 'saving' && 'Saving Weather Reports...'}
                      {saveStatus === 'saved' && '✓ Weather Saved!'}
                      {saveStatus === 'idle' && 'Save Weather Reports'}
                    </button>
                  </div>
                </div>

                {/* Right Column: Weather Articles Manager */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      📰 {weatherArticleFormMode !== 'list' ? (weatherArticleFormMode === 'add' ? 'Add Weather Article' : 'Edit Weather Article') : 'Weather Articles'}
                    </h3>
                    {weatherArticleFormMode === 'list' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFilterCategory('weather');
                          setSelectedCategories(['weather']);
                          setNewsViewMode('add');
                          setNewsTitle('');
                          setNewsSlug('');
                          setNewsDescription('');
                          setNewsTags([]);
                          setMetaDescription('');
                          setNewsImage('');
                          setNewsAuthor('హై టీవీ డెస్క్');
                          setIsBreakingChecked(false);
                          setIsTrendingChecked(false);
                          setIsFeaturedChecked(false);
                          setEditingArticle(null);
                          setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = ''; }, 50);
                          setWeatherArticleFormMode('add');
                        }}
                        className="bg-[#02599c] hover:bg-[#013f70] text-white font-black text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Article</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setWeatherArticleFormMode('list')}
                        className="text-slate-400 hover:text-slate-800 font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all cursor-pointer bg-slate-100 hover:bg-slate-200"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to list</span>
                      </button>
                    )}
                  </div>

                  {weatherArticleFormMode === 'list' ? (
                    /* List of articles belonging to the "weather" category */
                    (() => {
                      const weatherArticles = allArticles.filter(art => art.categorySlug === 'weather' || art.category === 'weather');
                      return (
                        <div className="flex-1 overflow-y-auto max-h-[480px] divide-y divide-slate-50 pr-1 admin-scrollbar">
                          {weatherArticles.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs">
                              <p className="font-bold">No weather articles found.</p>
                              <p className="text-[10px] text-slate-350 mt-1">Publish weather news using the button above.</p>
                            </div>
                          ) : (
                            weatherArticles.map((art) => (
                              <div key={art.id} className="flex items-center gap-3 py-2.5 text-left">
                                <img
                                  src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&fit=crop'}
                                  alt=""
                                  className="w-10 h-7 object-cover rounded bg-slate-100 border border-slate-200 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4
                                    className="text-[11px] font-bold text-slate-800 line-clamp-1 telugu-text"
                                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                  >
                                    {art.title}
                                  </h4>
                                  <span className="text-[9px] font-mono text-slate-400 truncate block">{art.slug}</span>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      startEditing(art);
                                      setSelectedCategories(['weather']);
                                      setFilterCategory('weather');
                                      setNewsViewMode('edit');
                                      setWeatherArticleFormMode('edit');
                                    }}
                                    className="text-slate-500 hover:text-slate-850 p-1 hover:bg-slate-100 rounded transition-all cursor-pointer"
                                    title="Edit"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteArticle(art.id)}
                                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    /* Inline Weather Article Form */
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1 admin-scrollbar">
                      {/* Title */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-[#02599c] uppercase tracking-widest">Headline (Telugu/English)</label>
                        <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                          <MiniWysiwygToolbar editorRef={weatherTitleRef} />
                          <div
                            contentEditable
                            ref={weatherTitleRef}
                            suppressContentEditableWarning
                            onInput={(e) => setNewsTitle(e.currentTarget.innerText)}
                            data-placeholder="Enter headline..."
                            className="wysiwyg-editor-mini w-full bg-slate-50 border-t border-slate-200/60 focus:bg-white px-4 py-2.5 text-sm font-bold outline-none transition-colors telugu-text text-slate-800"
                            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                          />
                        </div>
                      </div>

                      {/* Slug */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-[#02599c] uppercase tracking-widest">URL Slug (English)</label>
                        <input
                          type="text"
                          value={newsSlug}
                          onChange={(e) => setNewsSlug(e.target.value)}
                          placeholder="e.g. weather-update-hyderabad-2024"
                          className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2 text-xs font-mono outline-none transition-colors text-slate-800"
                        />
                      </div>

                      {/* Meta Description Block */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-[#02599c] uppercase tracking-widest">Meta Description (SEO)</label>
                          <span className="text-[9px] font-bold text-slate-400">{newsDescription.length}/160</span>
                        </div>
                        <textarea
                          rows={2}
                          value={newsDescription}
                          onChange={(e) => {
                            setNewsDescription(e.target.value);
                            if (weatherDescriptionRef.current) weatherDescriptionRef.current.innerText = e.target.value;
                          }}
                          placeholder="Brief summary for Google search and social shares..."
                          className="w-full bg-slate-50 border border-slate-200/60 focus:bg-white focus:border-rose-500 rounded-xl px-4 py-2 text-xs outline-none transition-colors telugu-text text-slate-800 resize-y"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        />
                      </div>

                      {/* Featured Image */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-[#02599c] uppercase tracking-widest">Featured Image</label>
                        <div className="border-2 border-dashed border-slate-200 hover:border-rose-500 rounded-xl p-3 bg-slate-50 text-center relative cursor-pointer min-h-[100px] flex items-center justify-center transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFeaturedImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          {!newsImage ? (
                            <div className="flex flex-col items-center gap-1.5">
                              <Upload className="w-5 h-5 text-slate-400" />
                              <span className="text-xs font-bold text-slate-500">Click to upload image</span>
                            </div>
                          ) : (
                            <div className="relative w-full overflow-hidden rounded-lg bg-slate-900 border border-slate-200">
                              <img src={newsImage} alt="Featured cover" className="w-full h-auto object-cover max-h-[100px] block" />
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setNewsImage(''); }}
                                className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full w-4 h-4 flex items-center justify-center transition-colors text-[10px]"
                              >✕</button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Article Body */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-[#02599c] uppercase tracking-widest">Article Content</label>
                        <div className="bg-slate-100 border border-slate-200 rounded-xl p-1.5 flex flex-wrap gap-1 items-center select-none text-slate-600 text-xs">
                          <button type="button" onClick={() => handleFormat('bold')} className="p-1 hover:bg-slate-200 rounded cursor-pointer font-bold" title="Bold">B</button>
                          <button type="button" onClick={() => handleFormat('italic')} className="p-1 hover:bg-slate-200 rounded cursor-pointer italic" title="Italic">I</button>
                          <button type="button" onClick={() => handleFormat('underline')} className="p-1 hover:bg-slate-200 rounded cursor-pointer underline" title="Underline">U</button>
                          <button type="button" onClick={() => handleFormat('insertUnorderedList')} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="List"><List className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => { const url = prompt('Enter URL:'); if (url) handleFormat('createLink', url); }} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Link"><LinkIcon className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => imageInputRef.current?.click()} className="p-1 hover:bg-slate-200 rounded cursor-pointer" title="Image"><ImageIcon className="w-3.5 h-3.5" /></button>
                          
                          <div className="w-px h-4 bg-slate-300 mx-0.5" />
                          <button type="button" onClick={() => handleFormat('foreColor', '#000000')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-black font-black text-xs" title="Text Color Black">A</button>
                          <button type="button" onClick={() => handleFormat('foreColor', '#e11d48')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-rose-600 font-black text-xs" title="Text Color Red">A</button>
                          <button type="button" onClick={() => handleFormat('foreColor', '#02599c')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-blue-600 font-black text-xs" title="Text Color Blue">A</button>
                          <button type="button" onClick={() => handleFormat('foreColor', '#16a34a')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-green-600 font-black text-xs" title="Text Color Green">A</button>
                          <button type="button" onClick={() => handleFormat('foreColor', '#9333ea')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-purple-600 font-black text-xs" title="Text Color Purple">A</button>
                          <button type="button" onClick={() => handleFormat('foreColor', '#ea580c')} className="p-1 hover:bg-slate-200 rounded cursor-pointer text-orange-600 font-black text-xs" title="Text Color Orange">A</button>
                          
                          <div className="relative flex items-center hover:bg-slate-200 rounded p-1 cursor-pointer" title="Custom Color Picker">
                            <span className="font-black text-xs mr-1 text-slate-700">A</span>
                            <input 
                              type="color" 
                              defaultValue="#000000"
                              onChange={(e) => handleFormat('foreColor', e.target.value)} 
                              className="w-3.5 h-3.5 p-0 border-0 cursor-pointer rounded-full overflow-hidden" 
                              style={{ appearance: 'none', WebkitAppearance: 'none' }}
                            />
                          </div>
                        </div>
                        <div
                          ref={editorRef}
                          contentEditable
                          suppressContentEditableWarning
                          className="min-h-[160px] bg-white border border-slate-200/60 rounded-xl p-4 text-sm outline-none focus:border-rose-500 transition-colors text-slate-800 telugu-text"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: '1.8' }}
                        />
                      </div>

                      {/* Author */}
                      {/* Select Author Section */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-[#02599c] uppercase tracking-widest">Author Section / Category</label>
                        <select
                          value={selectedAuthorSection}
                          onChange={(e) => {
                            const sec = e.target.value;
                            setSelectedAuthorSection(sec);
                            if (sec === 'custom') {
                              setNewsAuthor('హై టీవీ డెస్క్');
                              setSelectedReporterId('');
                            } else {
                              // Automatically select first reporter in this section if available
                              const members = teamMembers.filter(m => (m.body || 'reporters') === sec);
                              if (members.length > 0) {
                                setSelectedReporterId(members[0].title);
                                setNewsAuthor(members[0].title);
                              } else {
                                setSelectedReporterId('');
                                setNewsAuthor('');
                              }
                            }
                          }}
                          className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold cursor-pointer"
                        >
                          <option value="custom">Default / Custom (మ్యాన్యువల్)</option>
                          {(() => {
                            const sections = teamSections.length > 0
                              ? teamSections.map(s => ({ id: s.slug, name: s.title }))
                              : [
                                  { id: 'reporters', name: 'HighTV Reporters' },
                                  { id: 'desk', name: 'HighTV Desk' }
                                ];
                            return sections.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ));
                          })()}
                        </select>
                      </div>

                      {/* Dependent Author Name Input or Dropdown */}
                      {selectedAuthorSection === 'custom' ? (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-[#02599c] uppercase tracking-widest">Reporter / Author Name</label>
                          <input
                            type="text"
                            value={newsAuthor}
                            onChange={(e) => setNewsAuthor(e.target.value)}
                            placeholder="Reporter name"
                            className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-[#02599c] uppercase tracking-widest">Select Team Member / Reporter</label>
                          <select
                            value={selectedReporterId}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedReporterId(val);
                              setNewsAuthor(val);
                            }}
                            className="bg-slate-50 border border-slate-200/60 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold cursor-pointer"
                          >
                            <option value="">-- రిపోర్టర్ ని ఎంచుకోండి --</option>
                            {teamMembers
                              .filter(m => (m.body || 'reporters') === selectedAuthorSection)
                              .map(m => (
                                <option key={m.id} value={m.title}>{m.title}</option>
                              ))
                            }
                          </select>
                        </div>
                      )}

                      {/* Target Placements */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-[#02599c] uppercase tracking-widest">Target Placements</label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                          <input type="checkbox" checked={isBreakingChecked} onChange={(e) => setIsBreakingChecked(e.target.checked)} className="w-3.5 h-3.5" />
                          Breaking News
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                          <input type="checkbox" checked={isTrendingChecked} onChange={(e) => setIsTrendingChecked(e.target.checked)} className="w-3.5 h-3.5" />
                          Trending News
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                          <input type="checkbox" checked={isFeaturedChecked} onChange={(e) => setIsFeaturedChecked(e.target.checked)} className="w-3.5 h-3.5" />
                          Featured News
                        </label>
                      </div>

                      {/* Save Button */}
                      <button
                        type="button"
                        disabled={isSavingArticle}
                        onClick={async () => {
                          // Auto-fill body from description if editor is empty
                          if (editorRef.current && !editorRef.current.innerHTML.trim() && newsDescription.trim()) {
                            editorRef.current.innerHTML = `<p>${newsDescription.trim()}</p>`;
                          }
                          await handleSaveArticle(new Event('submit') as any);
                          setWeatherArticleFormMode('list');
                        }}
                        className={`w-full font-black text-xs py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 ${
                          isSavingArticle ? 'bg-rose-400 cursor-not-allowed text-white' : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer hover:scale-[1.01]'
                        }`}
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>{isSavingArticle ? (weatherArticleFormMode === 'add' ? 'Publishing...' : 'Updating...') : (weatherArticleFormMode === 'add' ? 'Publish Article' : 'Update Article')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ VIEW: HOMEPAGE SLIDES ══════════════ */}
          {activeTab === 'slider' && (() => {
            const sliderArticles = allArticles; // all articles from DB + local
            const filteredSliderArticles = sliderSearchQuery.trim()
              ? sliderArticles.filter((a: any) =>
                  a.title?.toLowerCase().includes(sliderSearchQuery.toLowerCase()) ||
                  a.category?.toLowerCase().includes(sliderSearchQuery.toLowerCase())
                )
              : sliderArticles;

            return (
              <div className="flex flex-col gap-6 animate-fade-in text-left">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Homepage Slider Picker</h2>
                    <p className="text-slate-500 text-xs mt-1">
                      Tick the checkbox on any article to add it to the home page hero slider. Uncheck to remove.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 flex-shrink-0">
                    <CheckCircle className="w-4 h-4" />
                    <span>{sliderSelectedIds.size} selected</span>
                  </div>
                </div>

                {/* Info banner */}
                <div className="bg-blue-50 border border-blue-200/60 rounded-2xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-700 leading-relaxed">
                    <span className="font-extrabold text-blue-900 block mb-1">How it works:</span>
                    Select articles below using the checkbox. Selected articles automatically appear in the homepage hero slider. The slider updates instantly — no save button needed.
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* LEFT: Article picker list */}
                  <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    {/* Search bar */}
                    <div className="p-4 border-b border-slate-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={sliderSearchQuery}
                          onChange={e => setSliderSearchQuery(e.target.value)}
                          placeholder="Search articles by title or category..."
                          className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-rose-400 rounded-xl outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Articles list */}
                    <div className="overflow-y-auto max-h-[560px] divide-y divide-slate-50">
                      {filteredSliderArticles.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 font-bold text-sm">
                          No articles found.
                        </div>
                      ) : (
                        filteredSliderArticles.map(art => {
                          const isSelected = sliderSelectedIds.has(String(art.id));
                          return (
                            <label
                              key={art.id}
                              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-[#02599c]' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                            >
                              {/* Checkbox */}
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSliderArticle(art)}
                                className="w-4 h-4 accent-[#02599c] flex-shrink-0 cursor-pointer rounded"
                              />
                              {/* Thumbnail */}
                              <div className="w-16 h-11 flex-shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200">
                                <img
                                  src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=120&fit=crop'}
                                  alt={art.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-xs font-bold text-slate-800 telugu-text line-clamp-2 leading-relaxed"
                                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                >
                                  {art.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-slate-400 font-bold">{getArticleCategoryName(art)}</span>
                                  {art.publishedAt && (
                                    <span className="text-[10px] text-slate-350">• {new Date(art.publishedAt).toLocaleDateString('te-IN')}</span>
                                  )}
                                </div>
                              </div>
                              {/* Selected badge */}
                              {isSelected && (
                                <span className="flex-shrink-0 text-[10px] font-black text-white bg-[#02599c] px-2 py-0.5 rounded-full">
                                  In Slider ✓
                                </span>
                              )}
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Selected slides preview */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                      <h3 className="text-sm font-black text-slate-800">
                        Slider Preview ({sliderSelectedIds.size})
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Articles selected for the hero slider</p>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 max-h-[520px]">
                      {sliderSelectedIds.size === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <div className="text-3xl mb-2">🖼️</div>
                          <p className="text-xs font-bold">No articles selected yet.</p>
                          <p className="text-[11px] text-slate-350 mt-1">Tick checkboxes on the left to add articles.</p>
                        </div>
                      ) : (
                        sliderSlidesList.map((slide, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-3 hover:bg-slate-50">
                            <img
                              src={slide.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&fit=crop'}
                              alt={slide.title}
                              className="w-14 h-10 object-cover rounded border border-slate-200 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-[11px] font-bold text-slate-700 telugu-text line-clamp-2 leading-relaxed"
                                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                              >
                                {slide.title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{slide.link}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const art = allArticles.find((a: any) => String(a.id) === String(slide.articleId));
                                if (art) toggleSliderArticle(art);
                              }}
                              className="text-red-400 hover:text-red-600 p-1 flex-shrink-0 cursor-pointer"
                              title="Remove from slider"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    {sliderSelectedIds.size > 0 && (
                      <div className="p-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            if (!confirm('Remove ALL articles from the slider?')) return;
                            setSliderSelectedIds(new Set());
                            setSliderSlidesList([]);
                            localStorage.setItem('homepage_slider_article_ids', '[]');
                            localStorage.setItem('homepage_banner_slides', '[]');
                            fetch('/api/slides', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify([])
                            })
                              .then(res => {
                                if (!res.ok) console.error('Failed to clear slides in DB');
                              })
                              .catch(err => console.error('Error clearing slides in DB:', err));
                          }}
                          className="w-full text-[11px] font-bold text-red-500 hover:text-red-700 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Clear All Slider Articles
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ══════════════ VIEW: SIDEBAR NEWS CONFIG ══════════════ */}
          {activeTab === 'sidebar-news' && (() => {
            // Find articles belonging to the selected sidebar category
            // Determine the effective district list for the dropdown
            const isDistrictCat = activeSidebarCategory === 'telangana-districts' || activeSidebarCategory === 'andhra-pradesh-districts';
            const districtListForDropdown = activeSidebarCategory === 'telangana-districts' ? tgDistricts
              : activeSidebarCategory === 'andhra-pradesh-districts' ? apDistricts
              : [];
            // Effective pin key: if a district is selected use district-{slug}, else use the category slug
            const effectivePinKey = (isDistrictCat && activeSidebarDistrict)
              ? `district-${activeSidebarDistrict}`
              : activeSidebarCategory;

            const catArticles = (activeSidebarCategory === 'home' || activeSidebarCategory === 'latest')
              ? allArticles
              : activeSidebarCategory === 'telangana-districts'
              ? (activeSidebarDistrict
                  ? allArticles.filter((art: any) => art.categorySlug === 'telangana' && art.districtSlug === activeSidebarDistrict)
                  : allArticles.filter((art: any) => art.categorySlug === 'telangana' && art.districtSlug))
              : activeSidebarCategory === 'andhra-pradesh-districts'
              ? (activeSidebarDistrict
                  ? allArticles.filter((art: any) => art.categorySlug === 'andhra-pradesh' && art.districtSlug === activeSidebarDistrict)
                  : allArticles.filter((art: any) => art.categorySlug === 'andhra-pradesh' && art.districtSlug))
              : allArticles.filter((art: any) => {
                  const matchesCategory = art.categorySlug === activeSidebarCategory || art.category?.toLowerCase() === activeSidebarCategory.toLowerCase();
                  if (activeSidebarCategory === 'telangana' || activeSidebarCategory === 'andhra-pradesh') {
                    return matchesCategory && !art.districtSlug;
                  }
                  return matchesCategory;
                });

            // Filter these category articles based on search query
            const filteredCatArticles = sidebarNewsSearch.trim()
              ? catArticles.filter((a: any) =>
                  a.title?.toLowerCase().includes(sidebarNewsSearch.toLowerCase())
                )
              : catArticles;

            // Get pins for the effective key (either district-specific or category)
            const pins = sidebarCategoryPins[effectivePinKey] || { trending: [], breaking: [] };

            return (
              <div className="flex flex-col gap-6 animate-fade-in text-left">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Sidebar News Configuration</h2>
                  <p className="text-slate-500 text-xs mt-1">
                    Select a category page from the list below, then pin specific articles to its sidebar's Trending or Breaking sections.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left Column: Pages List */}
                  <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                      Select Page (Category)
                    </h3>
                    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[500px] pr-1">
                      {SIDEBAR_CATEGORIES.map((cat) => {
                        const catPins = sidebarCategoryPins[cat.slug] || { trending: [], breaking: [] };
                        const tCount = catPins.trending?.length || 0;
                        const bCount = catPins.breaking?.length || 0;
                        const isActive = activeSidebarCategory === cat.slug;

                        return (
                          <button
                            key={cat.slug}
                            type="button"
                            onClick={() => {
                              setActiveSidebarCategory(cat.slug);
                              setActiveSidebarDistrict('');
                              setSidebarNewsSearch('');
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
                              isActive
                                ? 'bg-[#02599c] text-white shadow-md font-black scale-[1.01]'
                                : 'hover:bg-slate-50 text-slate-700 font-semibold'
                            }`}
                          >
                            <span className="text-xs telugu-text font-sans pl-1 pr-1 leading-relaxed">
                              {cat.name.split(' ')[0]}
                            </span>
                            {(tCount > 0 || bCount > 0) && (
                              <div className="flex items-center gap-1 shrink-0">
                                {tCount > 0 && (
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-black ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                                    {tCount}T
                                  </span>
                                )}
                                {bCount > 0 && (
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-black ${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-800'}`}>
                                    {bCount}B
                                  </span>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Article Selector & Pin Buttons */}
                  <div className="lg:col-span-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 telugu-text">
                          {SIDEBAR_CATEGORIES.find(c => c.slug === activeSidebarCategory)?.name}
                          {isDistrictCat && activeSidebarDistrict && (
                            <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              📍 {districtListForDropdown.find(d => d.slug === activeSidebarDistrict)?.name}
                            </span>
                          )}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Configure custom sidebar news for this page. (Unpinned items default to normal sorting)
                        </p>
                        {/* District dropdown — only shown for district categories */}
                        {isDistrictCat && (
                          <div className="mt-2">
                            <select
                              value={activeSidebarDistrict}
                              onChange={e => { setActiveSidebarDistrict(e.target.value); setSidebarNewsSearch(''); }}
                              className="w-full md:w-72 text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:border-[#02599c] outline-none cursor-pointer"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                            >
                              <option value="">-- అన్ని జిల్లాలు (All Districts) --</option>
                              {districtListForDropdown.map(d => {
                                const dPins = sidebarCategoryPins[`district-${d.slug}`] || { trending: [], breaking: [] };
                                const dT = dPins.trending?.length || 0;
                                const dB = dPins.breaking?.length || 0;
                                return (
                                  <option key={d.slug} value={d.slug}>
                                    {d.name}{dT > 0 || dB > 0 ? ` (T:${dT} B:${dB})` : ''}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={sidebarNewsSearch}
                          onChange={e => setSidebarNewsSearch(e.target.value)}
                          placeholder="Search this page's articles..."
                          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 focus:border-[#02599c] rounded-xl outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Articles list */}
                    <div className="overflow-y-auto divide-y divide-slate-50 max-h-[500px]">
                      {filteredCatArticles.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">
                          <div className="text-3xl mb-2">📰</div>
                          <p className="text-xs font-bold">No articles found in this category.</p>
                          <p className="text-[11px] text-slate-350 mt-1">
                            Create news articles classified under this page first.
                          </p>
                        </div>
                      ) : (
                        filteredCatArticles.map((art) => {
                          const artId = String(art.id);
                          const isTrendingPinned = pins.trending.includes(artId);
                          const isBreakingPinned = pins.breaking.includes(artId);

                          return (
                            <div
                              key={art.id}
                              className={`flex flex-col md:flex-row md:items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors ${
                                isTrendingPinned || isBreakingPinned ? 'bg-blue-50/30' : ''
                              }`}
                            >
                              {/* Thumbnail */}
                              <div className="w-16 h-11 flex-shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200">
                                <img
                                  src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&fit=crop'}
                                  alt={art.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <h4
                                  className="text-xs font-bold text-slate-800 telugu-text line-clamp-2 leading-relaxed"
                                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                >
                                  {art.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-400 font-bold">
                                  <span>ID: {art.id.slice(0, 8)}...</span>
                                  {art.publishedAt && (
                                    <span>• {new Date(art.publishedAt).toLocaleString('te-IN')}</span>
                                  )}
                                  {(art.categorySlug || art.districtSlug) && (
                                    <span className="bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                                      {getArticleCategoryName(art)}
                                    </span>
                                  )}
                                  {isTrendingPinned && (
                                    <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-1.5 py-0.5 rounded-md">
                                      Trending Sidebar Pin
                                    </span>
                                  )}
                                  {isBreakingPinned && (
                                    <span className="bg-red-100 text-red-800 text-[8px] font-black px-1.5 py-0.5 rounded-md">
                                      Breaking Sidebar Pin
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Buttons */}
                              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                                <button
                                  type="button"
                                  onClick={() => toggleSidebarNewsPin(effectivePinKey, 'trending', art.id)}
                                  className={`text-[10px] font-black py-2 px-3 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1 ${
                                    isTrendingPinned
                                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                      : 'bg-white hover:bg-amber-50 border border-amber-300 text-amber-600 hover:text-amber-800'
                                  }`}
                                >
                                  <span>🔥 {isTrendingPinned ? 'Trending (Pinned)' : 'Add to Trending'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleSidebarNewsPin(effectivePinKey, 'breaking', art.id)}
                                  className={`text-[10px] font-black py-2 px-3 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1 ${
                                    isBreakingPinned
                                      ? 'bg-red-600 hover:bg-red-700 text-white'
                                      : 'bg-white hover:bg-red-50 border border-red-300 text-red-600 hover:text-red-800'
                                  }`}
                                >
                                  <span>🚨 {isBreakingPinned ? 'Breaking (Pinned)' : 'Add to Breaking'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ══════════════ VIEW: HOROSCOPE MANAGER ══════════════ */}
          {activeTab === 'horoscope' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Horoscope / Shubhaphalalu Page Details</h2>
                <p className="text-slate-500 text-xs">Configure the daily date, Panchangam text, and predictions for the 12 Zodiac signs.</p>
              </div>

              {/* Date & Panchangam Editor */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                  📅 Daily Date & Panchangam Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Date String (తేదీ)</label>
                    <input
                      type="text"
                      value={horoscopeDate}
                      onChange={(e) => setHoroscopeDate(e.target.value)}
                      placeholder="e.g. తేదీ: 25-06-2026, గురువారం"
                      className="bg-slate-50 border border-slate-200/60 focus:border-[#02599c] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Date Range (ఈవారం పరిధి)</label>
                    <input
                      type="text"
                      value={horoscopeWeeklyRange}
                      onChange={(e) => setHoroscopeWeeklyRange(e.target.value)}
                      placeholder="e.g. 22-06-2026 - 28-06-2026"
                      className="bg-slate-50 border border-slate-200/60 focus:border-[#02599c] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Panchangam Header / Year Title (పంచాంగం శీర్షిక)</label>
                    <input
                      type="text"
                      value={horoscopePanchangamTitle}
                      onChange={(e) => setHoroscopePanchangamTitle(e.target.value)}
                      placeholder="e.g. శ్రీ పరాభవ నామ సంవత్సరం"
                      className="bg-slate-50 border border-slate-200/60 focus:border-[#02599c] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-3 max-w-4xl">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Panchangam Details Text (ఇతర వివరాలు - Semicolon-separated)</label>
                      <span className="text-[9px] text-[#02599c] font-black">ఉదాహరణ: ఉత్తరాయణం; గ్రీష్మరుతువు, నిజ జ్యేష్ఠ మాసం; ...</span>
                    </div>
                    <div className="flex flex-col border border-slate-200/60 rounded-xl overflow-hidden shadow-sm">
                      <MiniWysiwygToolbar editorRef={horoscopePanchangamRef} />
                      <div
                        ref={horoscopePanchangamRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="ఉత్తరాయణం; గ్రీష్మరుతువు, నిజ జ్యేష్ఠ మాసం, శుక్ల పక్షం..."
                        className="w-full bg-slate-50 border-t border-slate-200/60 focus:bg-white p-4 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text leading-relaxed min-h-[140px] overflow-y-auto"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rashi Predictions Editor */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-2.5 gap-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-800">
                      🔮 Zodiac Signs Predictions (12 రాశులు)
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      Manage predictions individually. Remember to click "Save Horoscope" at the bottom to apply changes to the live site.
                    </p>
                  </div>
                  {horoscopeFormMode === 'list' && (
                    <button
                      type="button"
                      onClick={() => {
                        setHoroscopeFormRashiId('aries');
                        setHoroscopeFormDaily('');
                        setHoroscopeFormWeekly('');
                        if (horoscopeDailyRef.current) horoscopeDailyRef.current.innerHTML = '';
                        if (horoscopeWeeklyRef.current) horoscopeWeeklyRef.current.innerHTML = '';
                        setHoroscopeFormMode('add');
                      }}
                      className="bg-[#02599c] hover:bg-[#024a82] text-white font-black text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 self-start md:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Prediction</span>
                    </button>
                  )}
                </div>

                {/* VIEW MODE: LIST */}
                {horoscopeFormMode === 'list' && (
                  <div className="flex flex-col gap-4">
                    {horoscopePredictions.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <div className="text-3xl mb-2">🔮</div>
                        <p className="text-xs font-bold">No zodiac predictions published yet.</p>
                        <p className="text-[10px] text-slate-355 mt-1">Click "Add New Prediction" or restore defaults to begin.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setHoroscopePredictions(DEFAULT_HOROSCOPE_PREDICTIONS);
                          }}
                          className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-lg border border-slate-200"
                        >
                          Restore Default 12 Rashis
                        </button>
                      </div>
                    ) : (
                      <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white shadow-sm overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              <th className="px-4 py-3 w-12 text-center">#</th>
                              <th className="px-4 py-3 w-48">Zodiac Sign (రాశి)</th>
                              <th className="px-4 py-3">Daily Prediction (ఈరోజు ఫలాలు)</th>
                              <th className="px-4 py-3">Weekly Prediction (ఈవారం ఫలాలు)</th>
                              <th className="px-4 py-3 w-28 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            {horoscopePredictions.map((rashi, idx) => (
                              <tr key={rashi.id || idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3.5 text-center font-bold text-slate-400">
                                  {idx + 1}
                                </td>
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-[#02599c]/10 text-[#02599c] flex items-center justify-center shrink-0">
                                      <ZodiacIcon id={rashi.id} className="w-3.5 h-3.5 stroke-[2.5]" />
                                    </div>
                                    <div>
                                      <span className="font-extrabold text-slate-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                        {rashi.name}
                                      </span>
                                      <span className="block text-[9px] text-slate-400 font-bold font-mono">
                                        {rashi.englishName} ({rashi.dateRange})
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <div 
                                    className="line-clamp-2 text-slate-650 telugu-text max-w-xs leading-relaxed" 
                                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                    dangerouslySetInnerHTML={{ __html: rashi.prediction || '<em class="text-slate-350 font-normal">No daily prediction</em>' }}
                                  />
                                </td>
                                <td className="px-4 py-3.5">
                                  <div 
                                    className="line-clamp-2 text-slate-650 telugu-text max-w-xs leading-relaxed" 
                                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                    dangerouslySetInnerHTML={{ __html: rashi.weeklyPrediction || '<em class="text-slate-350 font-normal">No weekly prediction</em>' }}
                                  />
                                </td>
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setHoroscopeFormRashiId(rashi.id);
                                        setHoroscopeFormDaily(rashi.prediction || '');
                                        setHoroscopeFormWeekly(rashi.weeklyPrediction || '');
                                        setHoroscopeEditIdx(idx);
                                        setHoroscopeFormMode('edit');
                                        setTimeout(() => {
                                          if (horoscopeDailyRef.current) horoscopeDailyRef.current.innerHTML = rashi.prediction || '';
                                          if (horoscopeWeeklyRef.current) horoscopeWeeklyRef.current.innerHTML = rashi.weeklyPrediction || '';
                                        }, 10);
                                      }}
                                      className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-600 rounded-lg shadow-sm transition-all cursor-pointer"
                                      title="Edit Prediction"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete predictions for ${rashi.name}?`)) {
                                          const updated = horoscopePredictions.filter((_, i) => i !== idx);
                                          setHoroscopePredictions(updated);
                                        }
                                      }}
                                      className="p-2 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-red-600 rounded-lg shadow-sm transition-all cursor-pointer"
                                      title="Delete Prediction"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {horoscopePredictions.length > 0 && (
                      <div className="flex justify-start">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('This will replace all current predictions with default sample content. Proceed?')) {
                              setHoroscopePredictions(DEFAULT_HOROSCOPE_PREDICTIONS);
                            }
                          }}
                          className="text-[11px] text-red-600 hover:text-red-700 font-bold border border-red-200 bg-red-50/30 hover:bg-red-50 py-2 px-4 rounded-xl transition-all cursor-pointer"
                        >
                          Reset to Defaults
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* VIEW MODE: ADD or EDIT FORM */}
                {(horoscopeFormMode === 'add' || horoscopeFormMode === 'edit') && (
                  <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-2xl flex flex-col gap-4">
                    <div className="pb-2.5 border-b border-slate-200/60">
                      <h4 className="text-sm font-extrabold text-slate-800">
                        {horoscopeFormMode === 'add' ? '✨ Add New Zodiac Prediction' : `✍️ Edit Prediction Details`}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        Fill out the daily and weekly astrological predictions for this zodiac sign.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Rashi Select Dropdown */}
                      <div className="flex flex-col gap-1.5 md:col-span-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Zodiac Sign (రాశి)</label>
                        <select
                          value={horoscopeFormRashiId}
                          onChange={(e) => setHoroscopeFormRashiId(e.target.value)}
                          disabled={horoscopeFormMode === 'edit'}
                          className="bg-white border border-slate-200 focus:border-[#02599c] rounded-xl px-3 py-2.5 text-xs outline-none text-slate-800 font-bold cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed w-full"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        >
                          {DEFAULT_HOROSCOPE_PREDICTIONS.map((def) => (
                            <option key={def.id} value={def.id}>
                              {def.name} ({def.englishName})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Daily Date Input inside Form */}
                      <div className="flex flex-col gap-1.5 md:col-span-1">
                        <label className="text-[10px] font-black text-[#02599c] uppercase tracking-widest">Daily Date String (తేదీ)</label>
                        <input
                          type="text"
                          value={horoscopeDate}
                          onChange={(e) => setHoroscopeDate(e.target.value)}
                          placeholder="e.g. తేదీ: 25-06-2026, గురువారం"
                          className="bg-white border border-slate-200/60 focus:border-[#02599c] rounded-xl px-3 py-2.5 text-xs outline-none text-slate-850 font-bold w-full"
                        />
                      </div>

                      {/* Weekly Date Range Input inside Form */}
                      <div className="flex flex-col gap-1.5 md:col-span-1">
                        <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Weekly Date Range (ఈవారం పరిధి)</label>
                        <input
                          type="text"
                          value={horoscopeWeeklyRange}
                          onChange={(e) => setHoroscopeWeeklyRange(e.target.value)}
                          placeholder="e.g. 22-06-2026 - 28-06-2026"
                          className="bg-white border border-slate-200/60 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs outline-none text-slate-850 font-bold w-full"
                        />
                      </div>
                    </div>

                    {/* Daily Prediction Textarea */}
                    <div className="flex flex-col gap-1.5 max-w-4xl">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ఈరోజు ఫలాలు - Daily Prediction (Telugu)</label>
                      <div className="flex flex-col border border-slate-200/60 rounded-xl overflow-hidden shadow-sm">
                        <MiniWysiwygToolbar editorRef={horoscopeDailyRef} />
                        <div
                          ref={horoscopeDailyRef}
                          contentEditable
                          suppressContentEditableWarning
                          data-placeholder="నేటి రాశి ఫలితాలు రాయండి..."
                          className="w-full bg-white border-t border-slate-200/60 focus:bg-white p-4 text-xs outline-none transition-colors text-slate-800 font-semibold telugu-text leading-relaxed min-h-[140px] overflow-y-auto"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        />
                      </div>
                    </div>

                    {/* Weekly Prediction Textarea */}
                    <div className="flex flex-col gap-1.5 max-w-4xl">
                      <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest">ఈవారం ఫలాలు - Weekly Prediction (Telugu)</label>
                      <div className="flex flex-col border border-amber-200 rounded-xl overflow-hidden shadow-sm">
                        <MiniWysiwygToolbar editorRef={horoscopeWeeklyRef} />
                        <div
                          ref={horoscopeWeeklyRef}
                          contentEditable
                          suppressContentEditableWarning
                          data-placeholder="వారం రాశి ఫలితాలు రాయండి..."
                          className="w-full bg-white border-t border-amber-200 focus:bg-white p-4 text-xs outline-none transition-colors text-slate-800 font-semibold telugu-text leading-relaxed min-h-[140px] overflow-y-auto"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        />
                      </div>
                    </div>

                    {/* Form Controls */}
                    <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200/60 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setHoroscopeFormMode('list');
                          setHoroscopeEditIdx(null);
                        }}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-2 px-5 rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const dailyText = horoscopeDailyRef.current?.innerHTML || '';
                          const weeklyText = horoscopeWeeklyRef.current?.innerHTML || '';

                          if (horoscopeFormMode === 'add') {
                            const exists = horoscopePredictions.some(p => p.id === horoscopeFormRashiId);
                            if (exists && !confirm(`A prediction entry for ${horoscopeFormRashiId} already exists in the list. Do you want to add another?`)) {
                              return;
                            }

                            const selectedDef = DEFAULT_HOROSCOPE_PREDICTIONS.find(d => d.id === horoscopeFormRashiId) || {
                              id: horoscopeFormRashiId,
                              name: horoscopeFormRashiId,
                              englishName: horoscopeFormRashiId,
                              dateRange: '',
                              color: '#dbeafe',
                              bgClass: 'bg-blue-50 border-blue-200 text-blue-800',
                              pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]'
                            };

                            const newPred = {
                              ...selectedDef,
                              prediction: dailyText,
                              weeklyPrediction: weeklyText
                            };

                            setHoroscopePredictions([...horoscopePredictions, newPred]);
                          } else {
                            const updated = [...horoscopePredictions];
                            if (horoscopeEditIdx !== null) {
                              updated[horoscopeEditIdx] = {
                                ...updated[horoscopeEditIdx],
                                prediction: dailyText,
                                weeklyPrediction: weeklyText
                              };
                              setHoroscopePredictions(updated);
                            }
                          }
                          setHoroscopeFormMode('list');
                          setHoroscopeEditIdx(null);
                        }}
                        className="bg-[#02599c] hover:bg-[#024a82] text-white font-black text-xs py-2 px-6 rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        {horoscopeFormMode === 'add' ? 'Add Entry' : 'Update Entry'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const saved = localStorage.getItem('horoscope_daily_data');
                    if (saved) {
                      const parsed = JSON.parse(saved);
                      setHoroscopeDate(parsed.date || '');
                      setHoroscopeWeeklyRange(parsed.weeklyRange || '');
                      const rawPanchangam = parsed.panchangam || '';
                      const parts = splitPanchangam(rawPanchangam);
                      const pTitle = parts[0] || '';
                      const pDetails = parts.slice(1).join('; ');
                      setHoroscopePanchangamTitle(pTitle);
                      setHoroscopePanchangam(pDetails);
                      if (horoscopePanchangamRef.current) {
                        horoscopePanchangamRef.current.innerHTML = pDetails;
                      }
                      setHoroscopePredictions(parsed.predictions || DEFAULT_HOROSCOPE_PREDICTIONS);
                    } else {
                      setHoroscopeWeeklyRange('');
                      const parts = splitPanchangam(DEFAULT_HOROSCOPE_PANCHANGAM);
                      const pTitle = parts[0] || '';
                      const pDetails = parts.slice(1).join('; ');
                      setHoroscopePanchangamTitle(pTitle);
                      setHoroscopePanchangam(pDetails);
                      if (horoscopePanchangamRef.current) {
                        horoscopePanchangamRef.current.innerHTML = pDetails;
                      }
                      setHoroscopePredictions(DEFAULT_HOROSCOPE_PREDICTIONS);
                    }
                    alert('Changes reverted to saved database!');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer border border-slate-200"
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentPanchangam = horoscopePanchangamRef.current?.innerHTML || '';
                    const combinedPanchangam = [horoscopePanchangamTitle.trim(), currentPanchangam.trim()]
                      .filter(Boolean)
                      .join('; ');

                    const payload = {
                      date: horoscopeDate.trim(),
                      weeklyRange: horoscopeWeeklyRange.trim(),
                      panchangam: combinedPanchangam,
                      predictions: horoscopePredictions
                    };
                    localStorage.setItem('horoscope_daily_data', JSON.stringify(payload));
                    fetch('/api/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ horoscope_daily_data: JSON.stringify(payload) })
                    })
                      .then(() => alert('Horoscope saved to Database successfully!'))
                      .catch(err => {
                        console.error('Failed to sync horoscope data:', err);
                        alert('Horoscope saved locally, but database sync failed.');
                      });
                    setHoroscopePanchangam(currentPanchangam);
                  }}
                  className="bg-[#02599c] hover:bg-[#024a82] text-white font-black text-xs py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Save Horoscope
                </button>
              </div>
            </div>
          )}

          {/* ══════════════ VIEW: WEB STORIES MANAGER ══════════════ */}
          {activeTab === 'webstories' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">వెబ్ స్టోరీస్ మేనేజర్ (Web Stories Manager)</h2>
                <p className="text-slate-500 text-xs">వెబ్ స్టోరీస్ క్రియేట్ చేయండి లేదా ఎడిట్ చేయండి. ప్రతి స్టోరీలో కవర్ పేజీ మరియు పలు స్లైడ్‌లు (ఇమేజ్ మరియు క్యాప్షన్) ఉంటాయి.</p>
              </div>

              {webStoryFormMode === 'list' ? (
                <div className="flex flex-col gap-6">
                  {/* List Header Actions */}
                  <div className="flex justify-between items-center bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
                    <span className="text-xs font-bold text-slate-500">
                      మొత్తం కస్టమ్ వెబ్ స్టోరీస్: <strong className="text-slate-800">{webStoriesList.length}</strong>
                    </span>
                    <button
                      onClick={() => {
                        resetWebStoryForm();
                        setWebStoryFormMode('add');
                      }}
                      className="bg-[#02599c] hover:bg-[#024a82] text-white font-black text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>కొత్త వెబ్ స్టోరీ సృష్టించండి</span>
                    </button>
                  </div>

                  {/* Web Stories Grid */}
                  {webStoriesList.length === 0 ? (
                    <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-4">
                      <Layers className="w-12 h-12 text-slate-350" />
                      <div className="flex flex-col gap-1">
                        <h3 className="font-black text-slate-700 text-sm">కస్టమ్ వెబ్ స్టోరీస్ ఏవీ లేవు</h3>
                        <p className="text-xs text-slate-400 max-w-sm">మీరు ఇంకా ఏ వెబ్ స్టోరీలను సృష్టించలేదు. కొత్త వెబ్ స్టోరీని సృష్టించడానికి పైన ఉన్న బటన్‌ను క్లిక్ చేయండి.</p>
                      </div>
                      <button
                        onClick={() => {
                          resetWebStoryForm();
                          setWebStoryFormMode('add');
                        }}
                        className="bg-[#02599c] hover:bg-[#024a82] text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        + కొత్త వెబ్ స్టోరీ సృష్టించండి
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {webStoriesList.map((story) => (
                        <div key={story.id} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col group relative text-left">
                          <div className="relative aspect-[9/16] bg-slate-900 overflow-hidden">
                            {story.coverImage ? (
                              <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No Cover Image</div>
                            )}
                            {/* Cover text overlay */}
                            <div className="absolute top-[15%] left-0 right-0 px-4 text-center">
                              <span
                                className="text-[17px] font-black leading-relaxed block break-words"
                                style={{
                                  color: story.coverStyle === 'red-white' ? '#e60000' : '#ffffff',
                                  textShadow: story.coverStyle === 'red-white'
                                    ? '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 0px 2px 0 #fff, 0px -2px 0 #fff, 2px 0px 0 #fff, -2px 0px 0 #fff'
                                    : '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0px 2px 0 #000, 0px -2px 0 #000, 2px 0px 0 #000, -2px 0px 0 #000',
                                  fontFamily: 'Noto Sans Telugu, sans-serif'
                                }}
                              >
                                {story.coverTitle}
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3 bg-black/55 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              <span>{story.slides?.length || 0} స్లైడ్‌లు</span>
                            </div>
                          </div>
                          {/* Story Info and Actions */}
                          <div className="p-4 flex flex-col gap-3 flex-grow justify-between">
                            <div>
                              <h3 className="font-black text-slate-800 text-xs line-clamp-2 telugu-text mb-1" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                {story.title}
                              </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-auto">
                              <button
                                onClick={() => handleStartEditWebStory(story)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer border border-slate-200/50 text-center"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteWebStory(story.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer border border-rose-200/40 text-center"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 flex flex-col gap-6 shadow-sm">
                  {/* Form Header */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#02599c]" />
                      <span>
                        {webStoryFormMode === 'edit' ? 'వెబ్ స్టోరీని సవరించండి (Edit Web Story)' : 'కొత్త వెబ్ స్టోరీని సృష్టించండి (Create Web Story)'}
                      </span>
                    </h3>
                    <button
                      onClick={() => {
                        setWebStoryFormMode('list');
                        resetWebStoryForm();
                      }}
                      className="text-slate-400 hover:text-slate-650 text-xs font-bold transition-all cursor-pointer"
                    >
                      మొత్తం లిస్ట్ చూడండి
                    </button>
                  </div>

                  {/* Form Body - Two Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Columns: Cover configuration and Slides */}
                    <div className="lg:col-span-2 flex flex-col gap-6 text-left">
                      {/* Section A: Cover details */}
                      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/50 pb-2">
                          1. కవర్ పేజీ వివరాలు (Cover Details)
                        </h4>
                        
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Web Story Title (Admin Internal Reference)</label>
                          <input
                            type="text"
                            value={webStoryTitle}
                            onChange={(e) => setWebStoryTitle(e.target.value)}
                            placeholder="e.g. ఫ్రిజ్‌లో ఆహారం.. సరిగానే నిల్వ చేస్తున్నారా?"
                            className="bg-white border border-slate-200/80 focus:border-[#02599c] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Cover Title text on image (కవర్ శీర్షిక)</label>
                            <input
                              type="text"
                              value={webStoryCoverTitle}
                              onChange={(e) => setWebStoryCoverTitle(e.target.value)}
                              placeholder="e.g. ఫ్రిజ్‌లో ఆహారం.."
                              className="bg-white border border-slate-200/80 focus:border-[#02599c] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest">Cover Text Style Theme (కవర్ టెక్స్ట్ థీమ్)</label>
                            <select
                              value={webStoryCoverStyle}
                              onChange={(e) => setWebStoryCoverStyle(e.target.value as 'red-white' | 'white-black')}
                              className="bg-white border border-slate-200/80 focus:border-[#02599c] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold cursor-pointer"
                            >
                              <option value="red-white">ఎరుపు అక్షరాలు + వైట్ అవుట్‌లైన్ (Red text / White shadow)</option>
                              <option value="white-black">తెలుపు అక్షరాలు + బ్లాక్ అవుట్‌లైన్ (White text / Black shadow)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Section B: Slides */}
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                            2. స్లైడ్‌లు (Story Slides - {webStorySlides.length})
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setWebStorySlides([...webStorySlides, { image: '', text: '', textStyle: 'red-white' }]);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-[#02599c] font-black text-xs py-1.5 px-3.5 rounded-lg border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>స్లైడ్ జోడించండి (Add Slide)</span>
                          </button>
                        </div>

                        {/* Slides List */}
                        <div className="space-y-5">
                          {webStorySlides.map((slide, sIdx) => (
                            <div key={sIdx} className="bg-slate-55/50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 shadow-2xs relative text-left">
                              {/* Slide Header with Ordering and Delete Actions */}
                              <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                                <span className="text-xs font-black text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                                  స్లైడ్ {sIdx + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={sIdx === 0}
                                    onClick={() => {
                                      if (sIdx === 0) return;
                                      const updated = [...webStorySlides];
                                      const temp = updated[sIdx];
                                      updated[sIdx] = updated[sIdx - 1];
                                      updated[sIdx - 1] = temp;
                                      setWebStorySlides(updated);
                                    }}
                                    className={`p-1 rounded cursor-pointer ${sIdx === 0 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-200'}`}
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={sIdx === webStorySlides.length - 1}
                                    onClick={() => {
                                      if (sIdx === webStorySlides.length - 1) return;
                                      const updated = [...webStorySlides];
                                      const temp = updated[sIdx];
                                      updated[sIdx] = updated[sIdx + 1];
                                      updated[sIdx + 1] = temp;
                                      setWebStorySlides(updated);
                                    }}
                                    className={`p-1 rounded cursor-pointer ${sIdx === webStorySlides.length - 1 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-200'}`}
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = webStorySlides.filter((_, i) => i !== sIdx);
                                      setWebStorySlides(updated.length > 0 ? updated : [{ image: '', text: '', textStyle: 'red-white' }]);
                                    }}
                                    className="p-1 rounded hover:bg-rose-100 text-rose-500 transition-colors cursor-pointer"
                                    title="Delete Slide"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Slide Content layout */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Left md:col-span-2: Inputs for Caption description and Text style */}
                                <div className="md:col-span-2 flex flex-col gap-3">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Slide description (స్లైడ్ వివరణ - తెలుగు)</label>
                                    <textarea
                                      value={slide.text}
                                      onChange={(e) => {
                                        const updated = [...webStorySlides];
                                        updated[sIdx].text = e.target.value;
                                        setWebStorySlides(updated);
                                      }}
                                      placeholder="స్లైడ్‌పై వచ్చే వివరణ టెక్స్ట్ రాయండి..."
                                      rows={2}
                                      className="bg-white border border-slate-200/80 focus:border-[#02599c] rounded-xl px-3 py-2 text-xs outline-none text-slate-800 font-bold telugu-text resize-none"
                                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                    />
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Text Style theme (అక్షరాల శైలి)</label>
                                    <select
                                      value={slide.textStyle}
                                      onChange={(e) => {
                                        const updated = [...webStorySlides];
                                        updated[sIdx].textStyle = e.target.value as 'red-white' | 'white-black';
                                        setWebStorySlides(updated);
                                      }}
                                      className="bg-white border border-slate-200/80 focus:border-[#02599c] rounded-xl px-3 py-1.5 text-xs outline-none text-slate-800 font-bold cursor-pointer"
                                    >
                                      <option value="red-white">ఎరుపు అక్షరాలు + వైట్ అవుట్‌లైన్</option>
                                      <option value="white-black">తెలుపు అక్షరాలు + బ్లాక్ అవుట్‌లైన్</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Right: File Image Upload Box */}
                                <div className="flex flex-col gap-1.5 md:col-span-1">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Slide Image (స్లైడ్ ఇమేజ్)</label>
                                  <div className="border border-dashed border-slate-300 hover:border-[#02599c] rounded-xl p-3 bg-white text-center relative cursor-pointer min-h-[110px] flex items-center justify-center transition-colors">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleCompressAndSetImage(e.target.files[0], (base64) => {
                                            const updated = [...webStorySlides];
                                            updated[sIdx].image = base64;
                                            setWebStorySlides(updated);
                                          });
                                        }
                                      }}
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    {!slide.image ? (
                                      <div className="flex flex-col items-center gap-1">
                                        <Upload className="w-5 h-5 text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-500">Upload Image</span>
                                      </div>
                                    ) : (
                                      <div className="relative w-full h-full overflow-hidden rounded bg-slate-900 border border-slate-100">
                                        <img src={slide.image} alt={`Slide ${sIdx + 1}`} className="w-full h-auto object-cover max-h-[90px] block mx-auto" />
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            const updated = [...webStorySlides];
                                            updated[sIdx].image = '';
                                            setWebStorySlides(updated);
                                          }}
                                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/90 text-white rounded-full w-4 h-4 flex items-center justify-center transition-colors text-[9px]"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Live Cover Image Preview */}
                    <div className="lg:col-span-1">
                      <div className="sticky top-6 flex flex-col gap-4 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                          Cover Preview (లైవ్ కవర్ ప్రివ్యూ)
                        </label>
                        <div className="border border-slate-200 rounded-3xl p-4 bg-slate-50 flex items-center justify-center">
                          <div className="relative aspect-[9/16] w-full max-w-[240px] bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-slate-200">
                            {webStoryCoverImage ? (
                              <img src={webStoryCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-500 text-[10px] font-bold">
                                <ImageIcon className="w-8 h-8 text-slate-400" />
                                <span>కవర్ ఫోటో ప్రివ్యూ</span>
                              </div>
                            )}

                            {/* Overlaid Cover Title text */}
                            {webStoryCoverTitle && (
                              <div className="absolute top-[15%] left-0 right-0 px-4 text-center">
                                <span
                                  className="text-[16px] font-black leading-relaxed block break-words"
                                  style={{
                                    color: webStoryCoverStyle === 'red-white' ? '#e60000' : '#ffffff',
                                    textShadow: webStoryCoverStyle === 'red-white'
                                      ? '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 0px 2px 0 #fff, 0px -2px 0 #fff, 2px 0px 0 #fff, -2px 0px 0 #fff'
                                      : '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0px 2px 0 #000, 0px -2px 0 #000, 2px 0px 0 #000, -2px 0px 0 #000',
                                    fontFamily: 'Noto Sans Telugu, sans-serif'
                                  }}
                                >
                                  {webStoryCoverTitle}
                                </span>
                              </div>
                            )}

                            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                              Cover Page
                            </div>
                          </div>
                        </div>

                        {/* Image upload widget for Cover */}
                        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 shadow-2xs flex flex-col gap-3">
                          <label className="text-[10px] font-black text-[#02599c] uppercase tracking-widest text-left">
                            Cover Image (కవర్ ఇమేజ్)
                          </label>
                          <div className="border-2 border-dashed border-slate-200 hover:border-rose-500 rounded-xl p-4 bg-white text-center relative cursor-pointer min-h-[130px] flex items-center justify-center transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleCompressAndSetImage(e.target.files[0], (base64) => {
                                    setWebStoryCoverImage(base64);
                                  });
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            {!webStoryCoverImage ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <Upload className="w-5 h-5 text-slate-400" />
                                <span className="text-xs font-bold text-slate-550">Upload Cover Image</span>
                                <span className="text-[8px] text-slate-400 uppercase">Max 800px width</span>
                              </div>
                            ) : (
                              <div className="relative w-full overflow-hidden rounded bg-slate-900 border border-slate-100">
                                <img src={webStoryCoverImage} alt="Cover Preview" className="w-full h-auto object-cover max-h-[100px] block mx-auto" />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setWebStoryCoverImage('');
                                  }}
                                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/90 text-white rounded-full w-4 h-4 flex items-center justify-center transition-colors text-[9px]"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Footer Actions */}
                  <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setWebStoryFormMode('list');
                        resetWebStoryForm();
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer border border-slate-200"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveWebStory}
                      className="bg-[#02599c] hover:bg-[#024a82] text-white font-black text-xs py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      Save Web Story
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ VIEW: SHORTS VIDEOS MANAGER ══════════════ */}
          {activeTab === 'shorts-videos' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">షార్ట్స్ వీడియోల మేనేజర్ (Shorts Videos Manager)</h2>
                <p className="text-slate-500 text-xs">షార్ట్స్ వీడియోలు అప్‌లోడ్ చేయండి. ఇవి షార్ట్స్ విభాగంలో మొబైల్ స్టేటస్ తరహాలో ప్లే అవుతాయి.</p>
              </div>

              {shortsFormMode === 'list' ? (
                <div className="flex flex-col gap-6">
                  {/* List Header Actions */}
                  <div className="flex justify-between items-center bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
                    <span className="text-xs font-bold text-slate-500">
                      మొత్తం షార్ట్స్ వీడియోలు: <strong className="text-slate-800">{allArticles.filter(art => art.categorySlug === 'shorts').length}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setEditingShort(null);
                        setShortTitle('');
                        setShortDescription('');
                        setShortCoverImage('');
                        setShortVideo('');
                        setShortsFormMode('add');
                      }}
                      className="bg-[#f43f5e] hover:bg-[#e11d48] text-white font-black text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>కొత్త షార్ట్ జోడించండి</span>
                    </button>
                  </div>

                  {/* Shorts Grid */}
                  {allArticles.filter(art => art.categorySlug === 'shorts').length === 0 ? (
                    <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-4">
                      <Video className="w-12 h-12 text-slate-350" />
                      <div className="flex flex-col gap-1">
                        <h3 className="font-black text-slate-700 text-sm">షార్ట్స్ వీడియోలు ఏవీ లేవు</h3>
                        <p className="text-xs text-slate-400 max-w-sm">మీరు ఇంకా ఏ షార్ట్స్ వీడియోలను అప్‌లోడ్ చేయలేదు. కొత్త షార్ట్‌ను జోడించడానికి పైన ఉన్న బటన్‌ను క్లిక్ చేయండి.</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingShort(null);
                          setShortTitle('');
                          setShortDescription('');
                          setShortCoverImage('');
                          setShortVideo('');
                          setShortsFormMode('add');
                        }}
                        className="bg-[#f43f5e] hover:bg-[#e11d48] text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        + కొత్త షార్ట్ జోడించండి
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {allArticles.filter(art => art.categorySlug === 'shorts').map((art) => (
                        <div key={art.id} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col group relative text-left">
                          <div className="relative aspect-[9/16] bg-slate-900 overflow-hidden">
                            {art.image ? (
                              <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No Cover Image</div>
                            )}
                            {/* Title overlay */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-12 pb-4 px-4">
                              <span
                                className="text-[14px] font-black text-white telugu-text line-clamp-3"
                                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                              >
                                {art.title}
                              </span>
                            </div>
                            {/* Play icon overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                              <div className="w-10 h-10 bg-[#f43f5e] rounded-full flex items-center justify-center text-white shadow-md">
                                <svg className="w-4.5 h-4.5 fill-white text-white ml-0.5" viewBox="0 0 24 24">
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          {/* Actions Panel */}
                          <div className="p-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
                            <button
                              onClick={() => handleStartEditShort(art)}
                              className="bg-white hover:bg-slate-100 text-slate-650 p-2 rounded-lg border border-slate-200/60 transition-all cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                              title="Edit Short"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>సవరించు</span>
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg border border-rose-200/40 transition-all cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                              title="Delete Short"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>తొలగించు</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 flex flex-col gap-6 shadow-sm">
                  {/* Form Header */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#f43f5e]" />
                      <span>
                        {shortsFormMode === 'edit' ? 'షార్ట్ వీడియోను సవరించండి (Edit Short Video)' : 'కొత్త షార్ట్ వీడియోను అప్‌లోడ్ చేయండి (Upload Short Video)'}
                      </span>
                    </h3>
                    <button
                      onClick={() => {
                        setShortsFormMode('list');
                        setEditingShort(null);
                      }}
                      className="text-slate-400 hover:text-slate-650 text-xs font-bold transition-all cursor-pointer"
                    >
                      మొత్తం లిస్ట్ చూడండి
                    </button>
                  </div>

                  {/* Form Body - Two Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Columns: Inputs */}
                    <div className="lg:col-span-2 flex flex-col gap-6 text-left">
                      {/* Section 1: Title and Description */}
                      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/50 pb-2">
                          1. శీర్షిక & వివరణ (Title & Description)
                        </h4>
                        
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest">శీర్షిక (Short Video Title)</label>
                          <input
                            type="text"
                            value={shortTitle}
                            onChange={(e) => setShortTitle(e.target.value)}
                            placeholder="e.g. సినిమాను తలపించిన పోలీస్ చేజింగ్ వీడియో వైరల్!"
                            className="bg-white border border-slate-200/80 focus:border-[#f43f5e] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest">వివరణ (Description / Subtitle)</label>
                          <textarea
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            placeholder="ఈ షార్ట్ వీడియోకి సంబంధించిన చిన్న వివరణ రాయండి..."
                            rows={3}
                            className="bg-white border border-slate-200/80 focus:border-[#f43f5e] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text resize-none"
                            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                          />
                        </div>
                      </div>

                      {/* Section 2: Video File */}
                      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/50 pb-2">
                          2. వీడియో ఫైల్ (Video File)
                        </h4>

                        <div className="border border-dashed border-slate-300 hover:border-[#f43f5e] rounded-xl p-6 bg-white text-center relative cursor-pointer min-h-[140px] flex items-center justify-center transition-colors">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleShortVideoChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          {!shortVideo ? (
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="w-6 h-6 text-slate-400" />
                              <span className="text-xs font-bold text-slate-500">వీడియో ఫైల్ ఎంచుకోండి (Select Video File)</span>
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider">Max 100MB file size</span>
                            </div>
                          ) : (
                            <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-250 p-2">
                              <video 
                                src={shortVideo} 
                                controls 
                                className="w-full h-auto max-h-[160px] block rounded-lg object-contain bg-black mx-auto" 
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShortVideo('');
                                }}
                                className="absolute top-4 right-4 bg-black/75 hover:bg-black/90 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors cursor-pointer shadow-md"
                                title="Delete Video"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Cover image upload & Preview */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                      {/* Section 3: Cover Image Upload */}
                      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 md:p-5 flex flex-col gap-4 text-left">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/50 pb-2">
                          3. కవర్ ఫోటో (Cover Image)
                        </h4>

                        <div className="border border-dashed border-slate-300 hover:border-[#f43f5e] rounded-xl p-3 bg-white text-center relative cursor-pointer min-h-[110px] flex items-center justify-center transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleShortCoverChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          {!shortCoverImage ? (
                            <div className="flex flex-col items-center gap-1">
                              <Upload className="w-5 h-5 text-slate-400" />
                              <span className="text-[10px] font-bold text-slate-500">కవర్ ఇమేజ్ అప్‌లోడ్</span>
                            </div>
                          ) : (
                            <div className="relative w-full overflow-hidden rounded bg-slate-900 border border-slate-100">
                              <img src={shortCoverImage} alt="Cover" className="w-full h-auto object-cover max-h-[90px] block mx-auto" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShortCoverImage('');
                                }}
                                className="absolute top-1 right-1 bg-black/60 hover:bg-black/90 text-white rounded-full w-4 h-4 flex items-center justify-center transition-colors text-[9px]"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cover Preview Card */}
                      <div className="sticky top-6 flex flex-col gap-4 text-left">
                        <label className="text-[10px] font-black text-slate-405 uppercase tracking-widest">
                          Cover Preview (లైవ్ కవర్ ప్రివ్యూ)
                        </label>
                        <div className="border border-slate-200 rounded-3xl p-4 bg-slate-50 flex items-center justify-center">
                          <div className="relative aspect-[9/16] w-full max-w-[200px] bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-slate-200">
                            {shortCoverImage ? (
                              <img src={shortCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-500 text-[10px] font-bold">
                                <ImageIcon className="w-8 h-8 text-slate-400" />
                                <span>కవర్ ఫోటో ప్రివ్యూ</span>
                              </div>
                            )}

                            {/* Overlaid Cover Title text */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pt-12 pb-3 px-3 text-left">
                              <span
                                className="text-[12px] font-black text-white leading-snug line-clamp-3 telugu-text"
                                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                              >
                                {shortTitle || 'శీర్షిక ఇక్కడ వస్తుంది...'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Footer Actions */}
                  <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShortsFormMode('list');
                        setEditingShort(null);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer border border-slate-200"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveShort}
                      disabled={isSavingArticle}
                      className="bg-[#f43f5e] hover:bg-[#e11d48] text-white font-black text-xs py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isSavingArticle ? 'Saving...' : 'Save Video Short'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ VIEW: PHOTO GALLERY MANAGER ══════════════ */}
          {activeTab === 'photos-gallery' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">ఫోటో గ్యాలరీ మేనేజర్ (Photo Gallery Manager)</h2>
                <p className="text-slate-500 text-xs">ఫోటో గ్యాలరీలోకి చిత్రాలు అప్‌లోడ్ చేయండి. ఇవి వెబ్‌సైట్ ఫోటో గ్యాలరీ విభాగంలో ప్రదర్శించబడతాయి.</p>
              </div>

              {photosFormMode === 'list' ? (
                <div className="flex flex-col gap-6">
                  {/* List Header Actions */}
                  <div className="flex justify-between items-center bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
                    <span className="text-xs font-bold text-slate-500">
                      మొత్తం గ్యాలరీ ఫోటోలు: <strong className="text-slate-800">{allArticles.filter(art => art.categorySlug === 'photos').length}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setEditingPhotoAlbum(null);
                        setPhotoTitle('');
                        setPhotoDescription('');
                        setPhotoImage('');
                        setPhotosFormMode('add');
                      }}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-black text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>కొత్త ఫోటో జోడించండి</span>
                    </button>
                  </div>

                  {/* Photos Grid */}
                  {allArticles.filter(art => art.categorySlug === 'photos').length === 0 ? (
                    <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-4">
                      <ImageIcon className="w-12 h-12 text-slate-350" />
                      <div className="flex flex-col gap-1">
                        <h3 className="font-black text-slate-700 text-sm">గ్యాలరీ ఫోటోలు ఏవీ లేవు</h3>
                        <p className="text-xs text-slate-400 max-w-sm">మీరు ఇంకా ఏ ఫోటోలను అప్‌లోడ్ చేయలేదు. కొత్త ఫోటోను జోడించడానికి పైన ఉన్న బటన్‌ను క్లిక్ చేయండి.</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingPhotoAlbum(null);
                          setPhotoTitle('');
                          setPhotoDescription('');
                          setPhotoImage('');
                          setPhotosFormMode('add');
                        }}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        + కొత్త ఫోటో జోడించండి
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {allArticles.filter(art => art.categorySlug === 'photos').map((art) => (
                        <div key={art.id} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col group relative text-left">
                          <div className="relative aspect-square bg-slate-900 overflow-hidden">
                            {art.image ? (
                              <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No Image</div>
                            )}
                            {/* Title overlay */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-10 pb-3 px-3">
                              <span
                                className="text-[12px] font-black text-white telugu-text line-clamp-2"
                                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                              >
                                {art.title}
                              </span>
                            </div>
                          </div>
                          
                          {/* Actions Panel */}
                          <div className="p-2 border-t border-slate-100 flex items-center justify-end gap-1.5 bg-slate-50">
                            <button
                              onClick={() => handleStartEditPhoto(art)}
                              className="bg-white hover:bg-slate-100 text-slate-650 p-1.5 rounded-lg border border-slate-200/60 transition-all cursor-pointer inline-flex items-center gap-0.5 text-[10px] font-bold"
                              title="Edit Photo"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>సవరించు</span>
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 rounded-lg border border-rose-200/40 transition-all cursor-pointer inline-flex items-center gap-0.5 text-[10px] font-bold"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>తొలగించు</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 flex flex-col gap-6 shadow-sm">
                  {/* Form Header */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-sky-600" />
                      <span>
                        {photosFormMode === 'edit' ? 'ఆల్బమ్ ఫోటోను సవరించండి (Edit Album Photo)' : 'కొత్త ఫోటోను అప్‌లోడ్ చేయండి (Upload New Photo)'}
                      </span>
                    </h3>
                    <button
                      onClick={() => {
                        setPhotosFormMode('list');
                        setEditingPhotoAlbum(null);
                      }}
                      className="text-slate-400 hover:text-slate-650 text-xs font-bold transition-all cursor-pointer"
                    >
                      మొత్తం లిస్ట్ చూడండి
                    </button>
                  </div>

                  {/* Form Body */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Inputs */}
                    <div className="lg:col-span-2 flex flex-col gap-6 text-left">
                      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/50 pb-2">
                          1. శీర్షిక & వివరణ (Title & Caption)
                        </h4>
                        
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest">శీర్షిక / క్యాప్షన్ (Photo Caption / Title)</label>
                          <input
                            type="text"
                            value={photoTitle}
                            onChange={(e) => setPhotoTitle(e.target.value)}
                            placeholder="e.g. హైదరాబాద్‌లో ఘనంగా అంతర్జాతీయ పతంగుల పండుగ"
                            className="bg-white border border-slate-200/80 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest">వివరణ (Description / Subtitle)</label>
                          <textarea
                            value={photoDescription}
                            onChange={(e) => setPhotoDescription(e.target.value)}
                            placeholder="ఈ ఫోటోకి సంబంధించిన చిన్న వివరణ లేదా వివరాలను రాయండి..."
                            rows={4}
                            className="bg-white border border-slate-200/80 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text resize-none"
                            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                          />
                        </div>
                      </div>

                      {/* Image Upload Box */}
                      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/50 pb-2">
                          2. చిత్రం ఎంచుకోండి (Image File)
                        </h4>

                        <div className="border border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-6 bg-white text-center relative cursor-pointer min-h-[160px] flex items-center justify-center transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoCoverChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          {!photoImage ? (
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="w-6 h-6 text-slate-400" />
                              <span className="text-xs font-bold text-slate-500">చిత్రం అప్‌లోడ్ చేయండి (Select Image)</span>
                            </div>
                          ) : (
                            <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-200 p-2">
                              <img 
                                src={photoImage} 
                                alt="Preview" 
                                className="w-full h-auto max-h-[180px] block rounded-lg object-contain bg-black mx-auto" 
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPhotoImage('');
                                }}
                                className="absolute top-4 right-4 bg-black/75 hover:bg-black/90 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors cursor-pointer shadow-md"
                                title="Delete Image"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Live Card Preview */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                      <div className="sticky top-6 flex flex-col gap-4 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Preview (లైవ్ గ్యాలరీ కార్డ్ ప్రివ్యూ)
                        </label>
                        <div className="border border-slate-200 rounded-3xl p-4 bg-slate-50 flex items-center justify-center">
                          <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs w-full max-w-[220px] flex flex-col">
                            <div className="relative aspect-video w-full overflow-hidden bg-gray-50 border-b border-gray-100">
                              {photoImage ? (
                                <img src={photoImage} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Image Preview</div>
                              )}
                            </div>
                            <div className="p-3 bg-gray-50/50 text-center">
                              <p className="text-[12px] font-bold text-gray-800 telugu-text truncate" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                {photoTitle || 'శీర్షిక ఇక్కడ వస్తుంది...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPhotosFormMode('list');
                        setEditingPhotoAlbum(null);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer border border-slate-200"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePhotoAlbum}
                      disabled={isSavingArticle}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-black text-xs py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isSavingArticle ? 'Saving...' : 'Save Photo Album'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ VIEW: POLLS MANAGER ══════════════ */}
          {activeTab === 'polls-manager' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">తాజా పోల్స్ మేనేజర్ (Manage Polls)</h2>
                <p className="text-slate-500 text-xs">ఇక్కడ మీరు కొత్త పోల్స్‌ను సృష్టించవచ్చు, సవరించవచ్చు లేదా తొలగించవచ్చు.</p>
              </div>

              {pollsFormMode === 'list' ? (
                <div className="flex flex-col gap-6">
                  {/* List Header Actions */}
                  <div className="flex justify-between items-center bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
                    <span className="text-xs font-bold text-slate-500">
                      మొత్తం పోల్స్: <strong className="text-slate-800">{allArticles.filter(art => art.categorySlug === 'polls').length}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setEditingPoll(null);
                        setCmsPollQuestion('');
                        setPollStartDate(new Date().toISOString().split('T')[0]);
                        setPollEndDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                        setPollOptions([
                          { id: 'a', label: '', votes: 0 },
                          { id: 'b', label: '', votes: 0 },
                        ]);
                        setPollsFormMode('add');
                      }}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-black text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>కొత్త పోల్ సృష్టించండి</span>
                    </button>
                  </div>

                  {/* Polls Listing Grid */}
                  {allArticles.filter(art => art.categorySlug === 'polls').length === 0 ? (
                    <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-4">
                      <BarChart3 className="w-12 h-12 text-slate-350" />
                      <div className="flex flex-col gap-1">
                        <h3 className="font-black text-slate-700 text-sm">పోల్స్ ఏవీ లేవు</h3>
                        <p className="text-xs text-slate-400 max-w-sm">మీరు ఇంకా ఏ పోల్స్ సృష్టించలేదు. కొత్త పోల్ సృష్టించడానికి పైన ఉన్న బటన్‌ను క్లిక్ చేయండి.</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingPoll(null);
                          setCmsPollQuestion('');
                          setPollStartDate(new Date().toISOString().split('T')[0]);
                          setPollEndDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                          setPollOptions([
                            { id: 'a', label: '', votes: 0 },
                            { id: 'b', label: '', votes: 0 },
                          ]);
                          setPollsFormMode('add');
                        }}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        + కొత్త పోల్ సృష్టించండి
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {allArticles.filter(art => art.categorySlug === 'polls').map((art) => {
                        let parsedOptions: any[] = [];
                        try {
                          parsedOptions = JSON.parse(art.body || '[]');
                        } catch (e) {}
                        const totalV = parsedOptions.reduce((acc, curr) => acc + (curr.votes || 0), 0);

                        return (
                          <div key={art.id} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between text-left">
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                <div className="flex gap-1.5 items-center">
                                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                                    {art.description || 'ముగిసింది'}
                                  </span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                                    art.districtSlug === 'article' ? 'bg-amber-100 text-amber-750' : 'bg-blue-100 text-blue-750'
                                  }`}>
                                    {art.districtSlug === 'article' ? 'వార్తా కథనాలు' : 'సాధారణం'}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">
                                  ఓట్లు: <strong className="text-slate-700">{totalV}</strong>
                                </span>
                              </div>
                              <h3 className="text-sm font-black text-slate-800 telugu-text leading-relaxed" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                {art.title}
                              </h3>
                              
                              {/* Preview of options */}
                              <div className="flex flex-col gap-1.5 mt-2">
                                {parsedOptions.map((opt: any) => {
                                  const pct = totalV > 0 ? Math.round((opt.votes / totalV) * 100) : 0;
                                  return (
                                    <div key={opt.id} className="text-xs flex items-center justify-between text-slate-600 border border-slate-100 rounded px-2.5 py-1 bg-slate-50/50">
                                      <span className="telugu-text font-medium">{opt.label}</span>
                                      <span className="font-bold text-slate-500">{opt.votes} ({pct}%)</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Actions panel */}
                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 mt-4">
                              <button
                                onClick={() => handleStartEditPoll(art)}
                                className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl border border-slate-200/80 transition-all cursor-pointer inline-flex items-center gap-1.5"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>సవరించు</span>
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs py-2 px-4 rounded-xl border border-rose-200/40 transition-all cursor-pointer inline-flex items-center gap-1.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>తొలగించు</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 flex flex-col gap-6 shadow-sm">
                  {/* Form Header */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-sky-600" />
                      <span>
                        {pollsFormMode === 'edit' ? 'పోల్‌ను సవరించండి (Edit Poll Question)' : 'కొత్త పోల్ సృష్టించండి (Create New Poll)'}
                      </span>
                    </h3>
                    <button
                      onClick={() => {
                        setPollsFormMode('list');
                        setEditingPoll(null);
                      }}
                      className="text-slate-400 hover:text-slate-650 text-xs font-bold transition-all cursor-pointer"
                    >
                      మొత్తం పోల్స్ లిస్ట్ చూడండి
                    </button>
                  </div>

                  {/* Form Body */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Inputs */}
                    <div className="lg:col-span-2 flex flex-col gap-6 text-left">
                      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/50 pb-2">
                          1. పోల్ ప్రశ్న & ముగింపు సమయం (Question & Duration)
                        </h4>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest">పోల్ ప్రశ్న (Poll Question)</label>
                          <textarea
                            value={cmsPollQuestion}
                            onChange={(e) => setCmsPollQuestion(e.target.value)}
                            placeholder="e.g. 2024 ఎన్నికల్లో తెలంగాణలో అధికారంలోకి ఎవరు వస్తారని మీరు అనుకుంటున్నారు?"
                            rows={3}
                            className="bg-white border border-slate-200/80 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text resize-none"
                            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest">ప్రారంభ తేదీ (Start Date)</label>
                            <input
                              type="date"
                              value={pollStartDate}
                              onChange={(e) => setPollStartDate(e.target.value)}
                              className="bg-white border border-slate-200/80 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest">ముగింపు తేదీ (End Date)</label>
                            <input
                              type="date"
                              value={pollEndDate}
                              onChange={(e) => setPollEndDate(e.target.value)}
                              className="bg-white border border-slate-200/80 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest">పోల్ ప్రదర్శించే స్థానం (Poll Scope / Placement)</label>
                          <div className="grid grid-cols-2 gap-3 mt-1">
                            <button
                              type="button"
                              onClick={() => setPollScope('general')}
                              className={`py-2 px-3 rounded-xl border-2 font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
                                pollScope === 'general'
                                  ? 'border-[#02599c] bg-[#02599c]/10 text-[#02599c] shadow-sm'
                                  : 'border-slate-200 bg-white text-slate-450 hover:text-slate-700'
                              }`}
                            >
                              🌐 General Poll (సాధారణ పోల్)
                            </button>
                            <button
                              type="button"
                              onClick={() => setPollScope('article')}
                              className={`py-2 px-3 rounded-xl border-2 font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
                                pollScope === 'article'
                                  ? 'border-[#02599c] bg-[#02599c]/10 text-[#02599c] shadow-sm'
                                  : 'border-slate-200 bg-white text-slate-455 hover:text-slate-700'
                              }`}
                            >
                              📄 Article Page (వార్తా కథనాలు)
                            </button>
                          </div>
                        </div>
                      </div>
                          {/* Scope hint */}
                          <div className={`mt-2 px-3 py-2 rounded-lg text-[10px] font-bold border ${pollScope === 'general' ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                            {pollScope === 'general' ? '🌐 ఈ పోల్ అన్ని పేజీల సైడ్‌బార్‌లో కనిపిస్తుంది (హోమ్, కేటగరీ పేజీలు)' : '📄 ఈ పోల్ కేవలం వార్తా కథన పేజీలలో మాత్రమే కనిపిస్తుంది'}
                          </div>

                      {/* Options Input Fields — Dynamic */}
                       <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
                         <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                           <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                             2. పోల్ ఆప్షన్స్ (Poll Options)
                           </h4>
                           <button
                             type="button"
                             onClick={() => {
                               const nextId = String.fromCharCode(97 + pollOptions.length);
                               setPollOptions(prev => [...prev, { id: nextId, label: '', votes: 0 }]);
                             }}
                             disabled={pollOptions.length >= 8}
                             className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-[10px] font-black px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                           >
                             <Plus className="w-3 h-3" />
                             ఆప్షన్ జోడించు
                           </button>
                         </div>

                         {pollOptions.map((opt, idx) => (
                           <div key={opt.id} className="flex items-end gap-2">
                             <div className="flex-1 flex flex-col gap-1">
                               <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider flex justify-between">
                                 <span>
                                   ఆప్షన్ {opt.id.toUpperCase()}
                                   {idx < 2
                                     ? <strong className="text-rose-500 ml-1">*</strong>
                                     : <span className="text-slate-400 ml-1">(Optional)</span>
                                   }
                                 </span>
                                 {pollsFormMode === 'edit' && <span className="text-slate-400">ఓట్లు: {opt.votes}</span>}
                               </label>
                               <input
                                 type="text"
                                 value={opt.label}
                                 onChange={(e) => {
                                   const val = e.target.value;
                                   setPollOptions(prev => prev.map(o => o.id === opt.id ? { ...o, label: val } : o));
                                 }}
                                 placeholder={`ఆప్షన్ ${opt.id.toUpperCase()} నమోదు చేయండి...`}
                                 className="bg-white border border-slate-200/80 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold telugu-text"
                                 style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                               />
                             </div>
                             {idx >= 2 && (
                               <button
                                 type="button"
                                 onClick={() => setPollOptions(prev => prev.filter((_, i) => i !== idx))}
                                 className="mb-0.5 p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 transition-all cursor-pointer flex-shrink-0"
                                 title="ఆప్షన్ తొలగించు"
                               >
                                 <Trash2 className="w-3.5 h-3.5" />
                               </button>
                             )}
                           </div>
                         ))}

                         <p className="text-[10px] text-slate-400 font-bold">
                           కనీసం 2 ఆప్షన్లు తప్పనిసరి • గరిష్టం 8 ఆప్షన్లు
                         </p>
                       </div>
                     </div>

                     {/* Right Live Preview Card */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                      <div className="sticky top-6 flex flex-col gap-4 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Preview (లైవ్ పోల్ కార్డ్ ప్రివ్యూ)
                        </label>
                        
                        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col gap-4 w-full">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs bg-red-650 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">తాజా పోల్</span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {formatTeluguDate(pollStartDate)} - {formatTeluguDate(pollEndDate)}
                            </span>
                          </div>
                          
                          <h3 className="text-xs font-black text-slate-800 leading-relaxed telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                            {cmsPollQuestion || 'మీ ప్రశ్న ఇక్కడ కనిపిస్తుంది?'}
                          </h3>

                          <div className="flex flex-col gap-2">
                            {pollOptions.filter(o => o.label.trim() !== '').map((opt) => (
                              <div key={opt.id} className="border border-slate-200/80 rounded-xl p-3 flex items-center gap-3 bg-slate-50/50">
                                <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center" />
                                <span className="text-xs font-black text-slate-650 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                  {opt.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPollsFormMode('list');
                        setEditingPoll(null);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer border border-slate-200"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePoll}
                      disabled={isSavingArticle}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-black text-xs py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isSavingArticle ? 'Saving...' : 'Save Poll'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ VIEW: POPUP MANAGER ══════════════ */}
          {activeTab === 'popup-manager' && (
            <div className="flex flex-col gap-8 animate-fade-in text-left">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-black text-slate-800">పాప్‌అప్ మేనేజర్ (Popup Manager)</h2>
                <p className="text-slate-500 text-xs mt-1">వెబ్‌సైట్‌లో కనిపించే పాప్‌అప్‌లను ఇక్కడ నుండి నిర్వహించవచ్చు. ప్రతి పాప్‌అప్‌కు విజ్ఞాపనం (Ad) లేదా పోల్ చూపించే విధంగా సెట్ చేయవచ్చు.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* ── HOME POPUP CARD ── */}
                {([
                  { id: 'home' as const, label: 'హోమ్ పాప్‌అప్', sublabel: 'Home Page Popup', config: homePopup, setConfig: setHomePopup },
                  { id: 'article' as const, label: 'ఆర్టికల్ పాప్‌అప్', sublabel: 'Article Page Popup', config: articlePopup, setConfig: setArticlePopup },
                ]).map(({ id, label, sublabel, config, setConfig }) => (
                  <div key={id} className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${config.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <div>
                          <h3 className="text-sm font-black text-slate-800">{label}</h3>
                          <p className="text-[10px] text-slate-400 font-bold">{sublabel}</p>
                        </div>
                      </div>
                      {/* Enable/Disable Toggle */}
                      <button
                        type="button"
                        onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                        className="flex items-center gap-2 cursor-pointer"
                        title={config.enabled ? 'పాప్‌అప్ నిలిపివేయుటకు క్లిక్ చేయండి' : 'పాప్‌అప్ ప్రారంభించుటకు క్లిక్ చేయండి'}
                      >
                        <span className={`text-[10px] font-black ${config.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {config.enabled ? 'ON' : 'OFF'}
                        </span>
                        {config.enabled
                          ? <ToggleRight className="w-8 h-8 text-emerald-500" />
                          : <ToggleLeft className="w-8 h-8 text-slate-300" />
                        }
                      </button>
                    </div>

                    <div className="p-5 flex flex-col gap-5">
                      {/* Mode selector: Ad vs Poll */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">పాప్‌అప్ రకం (Popup Mode)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setConfig(prev => ({ ...prev, type: 'ad' }))}
                            className={`py-2.5 rounded-xl border-2 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                              config.type === 'ad'
                                ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            <ImagePlay className="w-3.5 h-3.5" />
                            విజ్ఞాపనం (Ad)
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfig(prev => ({ ...prev, type: 'poll' }))}
                            className={`py-2.5 rounded-xl border-2 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                              config.type === 'poll'
                                ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            <BarChart3 className="w-3.5 h-3.5" />
                            పోల్ (Poll)
                          </button>
                        </div>
                        <div className={`px-3 py-2 rounded-lg text-[10px] font-bold border ${
                          config.type === 'ad' ? 'bg-violet-50 border-violet-200 text-violet-700' : 'bg-sky-50 border-sky-200 text-sky-700'
                        }`}>
                          {config.type === 'ad'
                            ? '🖼️ పాప్‌అప్‌లో ఒక విజ్ఞాపన చిత్రం మరియు లింక్ చూపిస్తుంది'
                            : '📊 పాప్‌అప్‌లో ఒక పోల్ ప్రశ్న మరియు ఓటింగ్ చూపిస్తుంది'
                          }
                        </div>
                      </div>

                      {/* ── AD Fields ── */}
                      {config.type === 'ad' && (
                        <div className="flex flex-col gap-4 bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">విజ్ఞాపన వివరాలు (Ad Details)</h4>
                          {/* Image Upload instead of URL */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-455 uppercase tracking-wide flex items-center justify-between gap-1 w-full">
                              <span className="flex items-center gap-1">
                                <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> విజ్ఞాపన చిత్రం (Ad Image)
                              </span>
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="file"
                                id={`popup-image-input-${id}`}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleCompressAndSetImage(file, (base64) => {
                                      setConfig(prev => {
                                        const updated = { ...prev, adImage: base64 };
                                        savePopupConfig(id, updated);
                                        return updated;
                                      });
                                    });
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => document.getElementById(`popup-image-input-${id}`)?.click()}
                                className="bg-sky-600 hover:bg-sky-700 text-white font-black text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                చిత్రం అప్‌లోడ్ చేయండి (Upload Image)
                              </button>
                              {config.adImage && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setConfig(prev => {
                                      const updated = { ...prev, adImage: '' };
                                      savePopupConfig(id, updated);
                                      return updated;
                                    });
                                  }}
                                  className="border border-rose-200 hover:bg-rose-50 text-rose-500 font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer"
                                >
                                  తొలగించు (Remove)
                                </button>
                              )}
                            </div>
                            
                            {config.adImage && (
                              <div className="mt-2 border border-slate-200 bg-white p-2 rounded-xl flex flex-col items-center justify-center">
                                <span className="text-[9px] font-bold text-slate-400 mb-1">Image Preview:</span>
                                <div className={`relative border border-dashed border-slate-200 overflow-hidden ${
                                  config.adOrientation === 'horizontal' ? 'w-full h-32' : 'w-28 h-40'
                                }`}>
                                  <img 
                                    src={config.adImage} 
                                    alt="Ad Preview" 
                                    className="w-full h-full object-cover" 
                                    onError={e => (e.currentTarget.style.display = 'none')} 
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Ad Orientation Select */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">విన్యాసం (Ad Orientation / Size)</label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => setConfig(prev => ({ ...prev, adOrientation: 'horizontal' }))}
                                className={`py-2 rounded-xl border font-black text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                  config.adOrientation === 'horizontal'
                                    ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-350'
                                }`}
                              >
                                Horizontal (అడ్డంగా - Wide)
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfig(prev => ({ ...prev, adOrientation: 'vertical' }))}
                                className={`py-2 rounded-xl border font-black text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                  config.adOrientation === 'vertical'
                                    ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-350'
                                }`}
                              >
                                Vertical (నిలువుగా - Tall)
                              </button>
                            </div>
                          </div>

                          {/* Ad Link URL */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide flex items-center gap-1">
                              <Link2 className="w-3 h-3 text-slate-500" /> క్లిక్ లింక్ (Ad Click Link URL)
                            </label>
                            <input
                              type="text"
                              value={config.adLink}
                              onChange={e => setConfig(prev => ({ ...prev, adLink: e.target.value }))}
                              placeholder="https://example.com/offer"
                              className="bg-white border border-slate-200/80 focus:border-violet-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                            />
                          </div>
                        </div>
                      )}

                      {/* ── POLL Fields ── */}
                      {config.type === 'poll' && (
                        <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">పోల్ వివరాలు (Poll Details)</h4>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">ప్రశ్న (Question) <strong className="text-rose-500">*</strong></label>
                            <textarea
                              value={config.pollQuestion}
                              onChange={e => setConfig(prev => ({ ...prev, pollQuestion: e.target.value }))}
                              placeholder="మీ ప్రశ్న ఇక్కడ రాయండి..."
                              rows={2}
                              className="bg-white border border-slate-200/80 focus:border-sky-500 rounded-xl pl-5 pr-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-semibold resize-none"
                              style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: 'normal' }}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide flex items-center justify-between">
                              <span>ఎంపికలు (Choices / Options)</span>
                              <span className="text-[9px] text-slate-400 font-bold">కనీసం 2, గరిష్టం 6 (Min 2, Max 6)</span>
                            </label>
                            
                            <div className="space-y-3">
                              {config.pollOpts.map((optVal, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="text-xs font-black text-slate-400 w-5 font-sans">#{i + 1}</span>
                                  <input
                                    type="text"
                                    value={optVal}
                                    onChange={e => {
                                      const newOpts = [...config.pollOpts];
                                      newOpts[i] = e.target.value;
                                      setConfig(prev => ({ ...prev, pollOpts: newOpts }));
                                    }}
                                    placeholder={`Option ${i + 1}`}
                                    className="flex-1 bg-white border border-slate-200/80 focus:border-sky-500 rounded-xl pl-5 pr-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-semibold"
                                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: 'normal' }}
                                  />
                                  {config.pollOpts.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newOpts = config.pollOpts.filter((_, idx) => idx !== i);
                                        setConfig(prev => ({ ...prev, pollOpts: newOpts }));
                                      }}
                                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-rose-100 flex items-center justify-center"
                                      title="Delete option"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>

                            {config.pollOpts.length < 6 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setConfig(prev => ({ ...prev, pollOpts: [...prev.pollOpts, ''] }));
                                }}
                                className="mt-1 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200/60 font-black text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full shadow-xs"
                              >
                                <Plus className="w-3.5 h-3.5" /> ఎంపికను జోడించండి (Add Option)
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Save Button */}
                      <button
                        type="button"
                        onClick={() => savePopupConfig(id, config)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        {popupSaved === id
                          ? <><CheckCircle className="w-4 h-4 text-emerald-400" /> సేవ్ అయింది! (Saved)</>
                          : <><Settings className="w-4 h-4" /> {label} సెట్టింగ్స్ సేవ్ చేయండి</>
                        }
                      </button>

                      {/* Disabled warning */}
                      {!config.enabled && (
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                          <span className="text-amber-600 text-[11px] font-black">⚠️ ఈ పాప్‌అప్ ప్రస్తుతం నిలిపివేయబడింది (Popup is disabled)</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-black text-blue-800">పాప్‌అప్ ఎప్పుడు కనిపిస్తుంది?</p>
                  <ul className="text-[11px] text-blue-700 font-bold space-y-0.5 list-disc list-inside">
                    <li><strong>హోమ్ పాప్‌అప్:</strong> హోమ్‌పేజ్ తెరిచిన 25 సెకన్ల తర్వాత — సెషన్‌కు ఒకసారి</li>
                    <li><strong>ఆర్టికల్ పాప్‌అప్:</strong> వార్తా కథన పేజీ తెరిచిన 25 సెకన్ల తర్వాత — ప్రతి పేజీకి ఒకసారి</li>
                    <li>సెట్టింగ్స్ సేవ్ చేసిన తర్వాత వెంటనే వెబ్‌సైట్‌లో వర్తిస్తాయి</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ VIEW: SIDEBAR ADS MANAGER ══════════════ */}
          {activeTab === 'sidebar-ads' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">సైడ్‌బార్ యాడ్స్ మేనేజర్ (Sidebar Ads Manager)</h2>
                  <p className="text-slate-500 text-xs">ఇక్కడ మీరు కేటగిరీ మరియు వార్తా కథనాల పేజీల సైడ్‌బార్‌లో ప్రదర్శించబడే యాడ్‌లను నిర్వహించవచ్చు.</p>
                </div>
                {adFormMode === 'list' && (
                  <button
                    onClick={() => {
                      setAdFormMode('add');
                      setEditingAd(null);
                      setSidebarAdTitle('');
                      setSidebarAdLink('');
                      setSidebarAdImage('');
                      setSidebarAdStatus('active');
                      setSidebarAdLocation('category');
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    కొత్త యాడ్ చేర్చండి (Add Ad)
                  </button>
                )}
              </div>

              {/* LIST MODE */}
              {adFormMode === 'list' && (
                <div className="flex flex-col gap-6">
                  {/* Tabs Toggle (Category vs Article Left vs Article Right vs Header Ads) */}
                  <div className="flex flex-wrap bg-white border border-slate-200/60 rounded-2xl p-2 gap-2 shadow-sm max-w-5xl">
                    <button
                      onClick={() => setAdActiveSubTab('category')}
                      className={`flex-1 py-2.5 px-3 text-center font-black text-xs rounded-xl transition-all cursor-pointer ${
                        adActiveSubTab === 'category'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      కేటగిరీ సైడ్‌బార్ యాడ్స్
                    </button>
                    <button
                      onClick={() => setAdActiveSubTab('article-left')}
                      className={`flex-1 py-2.5 px-3 text-center font-black text-xs rounded-xl transition-all cursor-pointer ${
                        adActiveSubTab === 'article-left'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      వార్తల ఎడమ సైడ్‌బార్ యాడ్స్
                    </button>
                    <button
                      onClick={() => setAdActiveSubTab('article-right')}
                      className={`flex-1 py-2.5 px-3 text-center font-black text-xs rounded-xl transition-all cursor-pointer ${
                        adActiveSubTab === 'article-right'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      వార్తల కుడి సైడ్‌బార్ యాడ్స్
                    </button>
                    <button
                      onClick={() => setAdActiveSubTab('epaper-left')}
                      className={`flex-1 py-2.5 px-3 text-center font-black text-xs rounded-xl transition-all cursor-pointer ${
                        adActiveSubTab === 'epaper-left'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      📰 ఈ-పేపర్ ఎడమ యాడ్
                    </button>
                    <button
                      onClick={() => setAdActiveSubTab('epaper-right')}
                      className={`flex-1 py-2.5 px-3 text-center font-black text-xs rounded-xl transition-all cursor-pointer ${
                        adActiveSubTab === 'epaper-right'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      📰 ఈ-పేపర్ కుడి యాడ్
                    </button>
                    <button
                      onClick={() => setAdActiveSubTab('epaper-header')}
                      className={`flex-1 py-2.5 px-3 text-center font-black text-xs rounded-xl transition-all cursor-pointer ${
                        adActiveSubTab === 'epaper-header'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      📰 ఈ-పేపర్ హెడర్ యాడ్
                    </button>
                    <button
                      onClick={() => setAdActiveSubTab('epaper-mobile')}
                      className={`flex-1 py-2.5 px-3 text-center font-black text-xs rounded-xl transition-all cursor-pointer ${
                        adActiveSubTab === 'epaper-mobile'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      📰 ఈ-పేపర్ మొబైల్ యాడ్
                    </button>
                    <button
                      onClick={() => setAdActiveSubTab('header-ad')}
                      className={`flex-1 py-2.5 px-3 text-center font-black text-xs rounded-xl transition-all cursor-pointer ${
                        adActiveSubTab === 'header-ad'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      🏠 హెడర్ యాడ్ (Header Ad)
                    </button>
                  </div>

                  {/* Ads list grid */}
                  {(() => {
                    const targetCategorySlug = adActiveSubTab === 'category' 
                      ? 'sidebar-ad-category' 
                      : adActiveSubTab === 'article-left'
                        ? 'sidebar-ad-article-left'
                        : adActiveSubTab === 'article-right'
                          ? 'sidebar-ad-article-right'
                          : adActiveSubTab === 'header-ad'
                            ? 'header-ad'
                            : adActiveSubTab === 'epaper-left'
                              ? 'sidebar-ad-epaper-left'
                              : adActiveSubTab === 'epaper-right'
                                ? 'sidebar-ad-epaper-right'
                                : adActiveSubTab === 'epaper-header'
                                  ? 'sidebar-ad-epaper-header'
                                  : 'sidebar-ad-epaper-mobile';
                    const activeAds = sidebarAds.filter(
                      ad => (adActiveSubTab === 'header-ad' || adActiveSubTab === 'epaper-left' || adActiveSubTab === 'epaper-right' || adActiveSubTab === 'epaper-header' || adActiveSubTab === 'epaper-mobile')
                        ? ad.categorySlug === targetCategorySlug
                        : (ad.categorySlug === targetCategorySlug || ad.categorySlug === 'sidebar-ad-both')
                    );

                    if (activeAds.length === 0) {
                      return (
                        <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center shadow-sm">
                          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-500 text-xs font-bold">ఈ సెక్షన్‌లో ఎటువంటి యాడ్‌లు లేవు (No ads in this section)</p>
                        </div>
                      );
                    }

                    return (
                      <div className="flex flex-col gap-3">
                        {activeAds.map((ad) => (
                          <div key={ad.id} className="bg-white border border-slate-200/60 rounded-2xl p-3 flex items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-all">
                            {/* Left: Thumbnail & Info */}
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Thumbnail */}
                              <div className="w-16 h-16 bg-slate-50 border border-slate-150 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                                <img src={ad.image} alt={ad.title} className="w-full h-full object-contain" />
                              </div>
                              {/* Info */}
                              <div className="min-w-0 flex flex-col gap-0.5 text-left">
                                <h4 className="text-sm font-black text-slate-800 truncate">{ad.title}</h4>
                                <p className="text-[10px] text-slate-400 font-bold truncate">Link: {ad.body || 'No Redirect Link'}</p>
                                
                                {/* Badges */}
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase text-white ${
                                    ad.category === 'active' ? 'bg-emerald-600' : 'bg-slate-400'
                                  }`}>
                                    {ad.category === 'active' ? 'Active' : 'Inactive'}
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[9px] font-black text-slate-500 bg-slate-100 border border-slate-200">
                                    {ad.categorySlug === 'sidebar-ad-category' 
                                      ? 'Category Only' 
                                      : ad.categorySlug === 'sidebar-ad-article-left' 
                                        ? 'Article Left Only' 
                                        : ad.categorySlug === 'sidebar-ad-article-right'
                                          ? 'Article Right Only'
                                          : ad.categorySlug === 'header-ad'
                                            ? '🏠 Header Banner'
                                            : ad.categorySlug === 'sidebar-ad-epaper-left'
                                              ? '📰 E-Paper Left'
                                              : ad.categorySlug === 'sidebar-ad-epaper-right'
                                                ? '📰 E-Paper Right'
                                                : ad.categorySlug === 'sidebar-ad-epaper-header'
                                                  ? '📰 E-Paper Header'
                                                  : ad.categorySlug === 'sidebar-ad-epaper-mobile'
                                                    ? '📰 E-Paper Mobile'
                                                    : 'All Sidebars'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              {/* Toggle Active Button */}
                              <button
                                onClick={() => handleToggleAdStatus(ad)}
                                className={`text-xs font-black py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                                  ad.category === 'active'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-250 hover:bg-emerald-100'
                                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {ad.category === 'active' ? 'దాచండి' : 'ప్రదర్శించండి'}
                              </button>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1.5 border-l border-slate-100 pl-3">
                                <button
                                  onClick={() => {
                                    setEditingAd(ad);
                                    setSidebarAdTitle(ad.title);
                                    setSidebarAdLink(ad.body || '');
                                    setSidebarAdImage(ad.image || '');
                                    setSidebarAdStatus(ad.category === 'active' ? 'active' : 'inactive');
                                    const loc = ad.categorySlug === 'sidebar-ad-category' 
                                      ? 'category' 
                                      : ad.categorySlug === 'sidebar-ad-article-left' 
                                        ? 'article-left' 
                                        : ad.categorySlug === 'sidebar-ad-article-right'
                                          ? 'article-right'
                                          : ad.categorySlug === 'header-ad'
                                            ? 'header-ad'
                                            : ad.categorySlug === 'sidebar-ad-epaper-left'
                                              ? 'epaper-left'
                                              : ad.categorySlug === 'sidebar-ad-epaper-right'
                                                ? 'epaper-right'
                                                : ad.categorySlug === 'sidebar-ad-epaper-header'
                                                  ? 'epaper-header'
                                                  : ad.categorySlug === 'sidebar-ad-epaper-mobile'
                                                    ? 'epaper-mobile'
                                                    : 'both';
                                    setSidebarAdLocation(loc);
                                    setAdFormMode('edit');
                                  }}
                                  className="text-sky-600 hover:text-sky-700 bg-slate-50 border border-slate-200/50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Ad"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAd(ad.id)}
                                  className="text-rose-500 hover:text-rose-600 bg-slate-50 border border-slate-200/50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Ad"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ADD / EDIT AD FORM */}
              {(adFormMode === 'add' || adFormMode === 'edit') && (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col gap-5 max-w-xl shadow-sm">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <ArrowLeft 
                      className="w-5 h-5 text-slate-500 hover:text-slate-800 cursor-pointer" 
                      onClick={() => setAdFormMode('list')}
                    />
                    <h3 className="text-lg font-black text-slate-800">
                      {adFormMode === 'add' ? 'కొత్త సైడ్‌బార్ యాడ్ చేర్చండి (Add Sidebar Ad)' : 'సైడ్‌బార్ యాడ్ సవరించండి (Edit Sidebar Ad)'}
                    </h3>
                  </div>

                  <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSaveAd(); }}>
                    {/* Ad Title */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">యాడ్ పేరు (Ad Reference Title) <strong className="text-rose-500">*</strong></label>
                      <input
                        type="text"
                        value={sidebarAdTitle}
                        onChange={(e) => setSidebarAdTitle(e.target.value)}
                        placeholder="e.g. CMR Shopping Mall Saree Ad"
                        required
                        className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                      />
                    </div>

                    {/* Ad Link */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">రీడైరెక్ట్ లింక్ (Redirect Link / Click URL)</label>
                      <input
                        type="url"
                        value={sidebarAdLink}
                        onChange={(e) => setSidebarAdLink(e.target.value)}
                        placeholder="https://example.com"
                        className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                      />
                    </div>

                    {/* Display Location Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">యాడ్ ప్రదర్శన స్థలం (Display Location) <strong className="text-rose-500">*</strong></label>
                      <select
                        value={sidebarAdLocation}
                        onChange={(e) => setSidebarAdLocation(e.target.value as 'category' | 'article-left' | 'article-right' | 'both' | 'header-ad' | 'epaper-left' | 'epaper-right' | 'epaper-header' | 'epaper-mobile')}
                        className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold cursor-pointer"
                      >
                        <option value="category">కేటగిరీ సైడ్‌బార్ మాత్రమే (Category Pages Sidebar Only)</option>
                        <option value="article-left">వార్తల ఎడమ సైడ్‌బార్ మాత్రమే (Article Page Left Sidebar Only)</option>
                        <option value="article-right">వార్తల కుడి సైడ్‌బార్ మాత్రమే (Article Page Right Sidebar Only)</option>
                        <option value="epaper-left">📰 ఈ-పేపర్ ఎడమ సైడ్ యాడ్ (E-Paper Left Side Ad)</option>
                        <option value="epaper-right">📰 ఈ-పేపర్ కుడి సైడ్ యాడ్ (E-Paper Right Side Ad)</option>
                        <option value="epaper-header">📰 ఈ-పేపర్ హెడర్ యాడ్ (E-Paper Header Ad)</option>
                        <option value="epaper-mobile">📰 ఈ-పేపర్ మొబైల్ యాడ్ (E-Paper Mobile Ad)</option>
                        <option value="header-ad">🏠 ஹெడర్ బ్యానర్ (Header Banner — Top of Page)</option>
                        <option value="both">అన్ని సైడ్‌బార్లలోనూ (All Sidebars / Combined)</option>
                      </select>
                    </div>

                    {/* Status Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">యాడ్ ప్రదర్శన స్థితి (Status) <strong className="text-rose-500">*</strong></label>
                      <select
                        value={sidebarAdStatus}
                        onChange={(e) => setSidebarAdStatus(e.target.value as 'active' | 'inactive')}
                        className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold cursor-pointer"
                      >
                        <option value="active">ప్రదర్శించండి (Active / Live)</option>
                        <option value="inactive">దాచండి (Inactive / Hidden)</option>
                      </select>
                    </div>

                    {/* Ad Image Uploader */}
                    <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> యాడ్ బ్యానర్ ఫోటో (Ad Image Banner) <strong className="text-rose-500">*</strong>
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id="ad-image-input"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleCompressAndSetImage(file, (base64) => {
                                setSidebarAdImage(base64);
                              });
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('ad-image-input')?.click()}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          చిత్రాన్ని అప్‌లోడ్ చేయండి (Upload Image)
                        </button>
                        {sidebarAdImage && (
                          <button
                            type="button"
                            onClick={() => setSidebarAdImage('')}
                            className="border border-rose-200 hover:bg-rose-50 text-rose-500 font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer"
                          >
                            తొలగించు (Remove)
                          </button>
                        )}
                      </div>
                      {sidebarAdImage && (
                        <div className="mt-2 border border-slate-200 bg-white p-2 rounded-xl max-w-xs">
                          <img src={sidebarAdImage} alt="Ad Preview" className="w-full h-auto object-contain rounded-lg" />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="submit"
                        disabled={isSavingSidebarAd}
                        className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-black text-xs py-3 px-6 rounded-xl transition-colors shadow-md cursor-pointer"
                      >
                        {isSavingSidebarAd ? 'సేవ్ అవుతోంది...' : 'యాడ్ సేవ్ చేయండి (Save Ad)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdFormMode('list')}
                        className="border border-slate-250 hover:bg-slate-50 text-slate-600 font-black text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer"
                      >
                        రద్దు చేయండి (Cancel)
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )
          }          {/* ══════════════ VIEW: TEAM MANAGER ══════════════ */}
          {activeTab === 'team-manager' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">మా టీమ్ మేనేజర్ (Our Team Manager)</h2>
                  <p className="text-slate-500 text-xs">ఇక్కడ నుండి మీరు మా టీమ్ సభ్యులను మరియు వివిధ సెక్షన్లను నిర్వహించవచ్చు.</p>
                </div>
                {teamFormMode === 'list' && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setTeamFormMode('add-member');
                        setEditingMember(null);
                        setMemberName('');
                        setMemberSlug('');
                        setMemberRole('');
                        setMemberBio('');
                        setMemberImage('');
                        setMemberSectionId(teamSections[0]?.slug || 'reporters');
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      సభ్యుడిని చేర్చండి (Add Member)
                    </button>
                    <button
                      onClick={() => {
                        setTeamFormMode('add-section');
                        setSectionName('');
                        setSectionSlug('');
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      సెక్షన్ చేర్చండి (Add Section)
                    </button>
                  </div>
                )}
              </div>

              {/* LIST MODE */}
              {teamFormMode === 'list' && (
                <div className="flex flex-col gap-8">
                  {/* Team Banner Editor Card */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col gap-4 shadow-sm text-left">
                    <h3 className="text-base font-black text-slate-800 font-sans border-b border-slate-100 pb-2 flex items-center gap-2">
                      <span>మా టీమ్ బ్యానర్ వివరాలు (Edit Team Page Banner)</span>
                    </h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveTeamBanner(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Badge Text */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">చిన్న బ్యాడ్జ్ టెక్స్ట్ (Small Badge Text)</label>
                        <input
                          type="text"
                          value={teamBannerBadge}
                          onChange={(e) => setTeamBannerBadge(e.target.value)}
                          placeholder="హై టీవీ బృందం"
                          className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        />
                      </div>
                      
                      {/* Banner Title */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">ప్రధాన శీర్షిక (Banner Title)</label>
                        <input
                          type="text"
                          value={teamBannerTitle}
                          onChange={(e) => setTeamBannerTitle(e.target.value)}
                          placeholder="మా వార్తా ప్రతినిధులు"
                          className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        />
                      </div>

                      {/* Banner Description */}
                      <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">వివరణ టెక్స్ట్ (Banner Description)</label>
                        <textarea
                          value={teamBannerDesc}
                          onChange={(e) => setTeamBannerDesc(e.target.value)}
                          placeholder="సమాజంలోని నిజాలను నిర్భయంగా వెలుగులోకి తెచ్చే నిష్పక్షపాత విలేకరులు..."
                          rows={2}
                          className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold resize-none"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        />
                      </div>

                      {/* Submit */}
                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          disabled={isSavingTeamBanner}
                          className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-black text-xs py-2 px-4 rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                          {isSavingTeamBanner ? 'సేవ్ అవుతోంది...' : 'బ్యానర్ వివరాలు సేవ్ చేయండి (Save Banner)'}
                        </button>
                      </div>
                    </form>
                  </div>
                  {/* Load dynamic sections or defaults */}
                  {(() => {
                    const sections = teamSections.length > 0 
                      ? teamSections.map(s => ({ id: s.slug, name: s.title, idDB: s.id }))
                      : [
                          { id: 'reporters', name: 'HighTV Reporters', idDB: '' },
                          { id: 'desk', name: 'HighTV Desk', idDB: '' }
                        ];

                    const members = teamMembers.map(m => ({
                      id: m.id,
                      slug: m.slug,
                      name: m.title,
                      role: m.category || '',
                      bio: m.description || '',
                      image: m.image || '',
                      sectionId: m.body || 'reporters',
                    }));

                    return sections.map((section) => {
                      const sectionMembers = members.filter(m => m.sectionId === section.id);
                      return (
                        <div key={section.id} className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm p-6 flex flex-col gap-4">
                          {/* Section Title */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                              <h3 className="text-base font-black text-slate-800 font-sans">{section.name}</h3>
                              <span className="text-[10px] text-slate-400 font-bold">Slug: {section.id}</span>
                            </div>
                            {/* Option to delete/edit custom sections */}
                            {section.idDB && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingSection(section);
                                    setSectionName(section.name);
                                    setSectionSlug(section.id);
                                    setTeamFormMode('edit-section');
                                  }}
                                  className="text-sky-600 hover:text-sky-800 hover:bg-sky-50 p-2 rounded-xl transition-all cursor-pointer text-xs font-bold flex items-center gap-1"
                                >
                                  <Pencil className="w-4 h-4" />
                                  సవరించండి (Edit Section)
                                </button>
                                <button
                                  onClick={() => handleDeleteTeamItem(section.idDB, 'section')}
                                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-xl transition-all cursor-pointer text-xs font-bold flex items-center gap-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  సెక్షన్ తొలగించండి (Delete Section)
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Section Members List */}
                          {sectionMembers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              {sectionMembers.map((member) => (
                                <div key={member.id} className="bg-slate-50 border border-slate-200/40 rounded-2xl p-4 flex gap-4 items-start relative group">
                                  {/* Photo if present */}
                                  {member.image && (
                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 shadow-xs flex-shrink-0">
                                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                  
                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-black text-slate-800 truncate telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>{member.name}</h4>
                                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wide truncate">{member.role}</p>
                                    <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>{member.bio}</p>
                                  </div>

                                  {/* Hover actions */}
                                  <div className="flex items-center gap-1.5 absolute top-3 right-3 bg-slate-50/90 pl-2 rounded-lg py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => {
                                        setEditingMember(member);
                                        setMemberName(member.name);
                                        setMemberSlug(member.slug);
                                        setMemberRole(member.role);
                                        setMemberBio(member.bio);
                                        setMemberImage(member.image);
                                        setMemberSectionId(member.sectionId);
                                        setTeamFormMode('edit-member');
                                      }}
                                      className="text-sky-600 hover:text-sky-700 bg-white hover:bg-sky-50 border border-slate-200/50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                      title="సభ్యుడిని సవరించు (Edit Member)"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    {member.id.length > 5 && (
                                      <button
                                        onClick={() => handleDeleteTeamItem(member.id, 'member')}
                                        className="text-rose-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200/50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                        title="సభ్యుడిని తొలగించు (Delete Member)"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-slate-400 border border-dashed border-slate-200/80 rounded-2xl">
                              <p className="text-xs font-bold">ఈ సెక్షన్‌లో ఎటువంటి సభ్యులు లేరు (No members in this section)</p>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* ADD / EDIT MEMBER FORM */}
              {(teamFormMode === 'add-member' || teamFormMode === 'edit-member') && (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col gap-5 max-w-2xl shadow-sm">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <ArrowLeft 
                      className="w-5 h-5 text-slate-500 hover:text-slate-800 cursor-pointer" 
                      onClick={() => setTeamFormMode('list')}
                    />
                    <h3 className="text-lg font-black text-slate-800">
                      {teamFormMode === 'add-member' ? 'టీమ్ సభ్యుడిని చేర్చండి (Add Team Member)' : 'టీమ్ సభ్యుడి వివరాలు సవరించండి (Edit Member Details)'}
                    </h3>
                  </div>

                  <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSaveTeamMember(); }}>
                    {/* Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">పేరు (Full Name) <strong className="text-rose-500">*</strong></label>
                      <input
                        type="text"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="సభ్యుడి పేరు రాయండి..."
                        required
                        className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      />
                    </div>

                    {/* Slug */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">Slug (Unique key - e.g. kalyan) <strong className="text-rose-500">*</strong></label>
                      <input
                        type="text"
                        value={memberSlug}
                        onChange={(e) => setMemberSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                        placeholder="kalyan"
                        disabled={teamFormMode === 'edit-member'}
                        required
                        className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold disabled:bg-slate-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">హోదా / పాత్ర (Role / Designation)</label>
                      <input
                        type="text"
                        value={memberRole}
                        onChange={(e) => setMemberRole(e.target.value)}
                        placeholder="స్టాఫ్ రిపోర్టర్ (Staff Reporter)"
                        className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      />
                    </div>

                    {/* Section Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">సెక్షన్ (Select Section) <strong className="text-rose-500">*</strong></label>
                      <select
                        value={memberSectionId}
                        onChange={(e) => setMemberSectionId(e.target.value)}
                        className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold cursor-pointer"
                      >
                        {(() => {
                          const sections = teamSections.length > 0
                            ? teamSections.map(s => ({ id: s.slug, name: s.title }))
                            : [
                                { id: 'reporters', name: 'HighTV Reporters' },
                                { id: 'desk', name: 'HighTV Desk' }
                              ];
                          return sections.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ));
                        })()}
                      </select>
                    </div>

                    {/* Bio */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">పరిచయం (Short Bio / Details)</label>
                      <textarea
                        value={memberBio}
                        onChange={(e) => setMemberBio(e.target.value)}
                        placeholder="పరిచయ సమాచారం ఇక్కడ రాయండి..."
                        rows={4}
                        className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold resize-none"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      />
                    </div>

                    {/* Image Upload */}
                    {memberSectionId !== 'desk' && (
                      <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
                        <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> ప్రొఫైల్ ఫోటో (Profile Photo)
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            id="member-photo-input"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleCompressAndSetImage(file, (base64) => {
                                  setMemberImage(base64);
                                });
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById('member-photo-input')?.click()}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            ఫోటో అప్‌లోడ్ చేయండి (Upload Photo)
                          </button>
                          {memberImage && (
                            <button
                              type="button"
                              onClick={() => setMemberImage('')}
                              className="border border-rose-200 hover:bg-rose-50 text-rose-500 font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer"
                            >
                              తొలగించు (Remove)
                            </button>
                          )}
                        </div>
                        {memberImage && (
                          <div className="mt-2 border border-slate-200 bg-white p-2 rounded-xl w-24 h-24">
                            <img src={memberImage} alt="Profile Preview" className="w-full h-full object-cover rounded-lg" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="submit"
                        disabled={isSavingTeam}
                        className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-black text-xs py-3 px-6 rounded-xl transition-colors shadow-md cursor-pointer"
                      >
                        {isSavingTeam ? 'సేవ్ అవుతోంది...' : 'సమాచారాన్ని సేవ్ చేయండి (Save Details)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTeamFormMode('list')}
                        className="border border-slate-250 hover:bg-slate-50 text-slate-600 font-black text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer"
                      >
                        రద్దు చేయండి (Cancel)
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ADD SECTION FORM */}
              {(teamFormMode === 'add-section' || teamFormMode === 'edit-section') && (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col gap-5 max-w-md shadow-sm">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <ArrowLeft 
                      className="w-5 h-5 text-slate-500 hover:text-slate-800 cursor-pointer" 
                      onClick={() => setTeamFormMode('list')}
                    />
                    <h3 className="text-lg font-black text-slate-800">
                      {teamFormMode === 'add-section' ? 'కొత్త సెక్షన్ చేర్చండి (Add New Section)' : 'సెక్షన్ వివరాలు సవరించండి (Edit Section Details)'}
                    </h3>
                  </div>

                  <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSaveSection(); }}>
                    {/* Section Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">సెక్షన్ పేరు (Section Name) <strong className="text-rose-500">*</strong></label>
                      <input
                        type="text"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        placeholder="HighTV Digital"
                        required
                        className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold"
                      />
                    </div>

                    {/* Section Slug */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-wide">సెక్షన్ Slug / ID (e.g. digital-team) <strong className="text-rose-500">*</strong></label>
                      <input
                        type="text"
                        value={sectionSlug}
                        onChange={(e) => setSectionSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                        placeholder="digital-team"
                        disabled={teamFormMode === 'edit-section'}
                        required
                        className="bg-white border border-slate-200/80 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors text-slate-800 font-bold disabled:bg-slate-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="submit"
                        disabled={isSavingTeam}
                        className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-black text-xs py-3 px-6 rounded-xl transition-colors shadow-md cursor-pointer"
                      >
                        {isSavingTeam ? 'సేవ్ అవుతోంది...' : (teamFormMode === 'edit-section' ? 'మార్పులను సేవ్ చేయండి (Save Changes)' : 'సెక్షన్ సృష్టించండి (Create Section)')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTeamFormMode('list')}
                        className="border border-slate-250 hover:bg-slate-50 text-slate-600 font-black text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer"
                      >
                        రద్దు చేయండి (Cancel)
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ VIEW: DISTRICT NEWS SIDEBAR MANAGER ══════════════ */}
          {activeTab === 'jilla-sidebar' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800">జిల్లా వార్తలు సైడ్‌బార్ మేనేజర్ (District News Sidebar Manager)</h2>
                <p className="text-slate-500 text-xs">ఇక్కడ మీరు పిన్ చేసిన తెలంగాణ మరియు ఆంధ్రప్రదేశ్ జిల్లా వార్తలు అన్ని వార్తా కథనాల సైడ్‌బార్‌లో ప్రదర్శించబడతాయి.</p>
              </div>

              {/* Sub-tab Toggle (TG vs AP) */}
              <div className="flex bg-white border border-slate-200/60 rounded-2xl p-2 gap-2 shadow-sm max-w-md">
                <button
                  type="button"
                  onClick={() => {
                    setDistrictActiveSubTab('tg');
                    setDistrictSearchQuery('');
                  }}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    districtActiveSubTab === 'tg'
                      ? 'bg-[#02599c] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'
                  }`}
                >
                  తెలంగాణ జిల్లా వార్తలు (Telangana)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDistrictActiveSubTab('ap');
                    setDistrictSearchQuery('');
                  }}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    districtActiveSubTab === 'ap'
                      ? 'bg-[#e60000] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'
                  }`}
                >
                  ఆంధ్రప్రదేశ్ జిల్లా వార్తలు (Andhra Pradesh)
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Currently Pinned Articles */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5 flex justify-between items-center">
                    <span>📌 ప్రస్తుతం పిన్ చేసిన వార్తలు ({districtActiveSubTab === 'tg' ? pinnedTgNews.length : pinnedApNews.length})</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Sidebar Order</span>
                  </h3>

                  {(() => {
                    const pinnedList = districtActiveSubTab === 'tg' ? pinnedTgNews : pinnedApNews;
                    const setPinnedList = districtActiveSubTab === 'tg' ? setPinnedTgNews : setPinnedApNews;

                    if (pinnedList.length === 0) {
                      return (
                        <div className="p-8 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          పిన్ చేసిన వార్తలు ఏవీ లేవు. కింద ఉన్న లభించే వార్తల లిస్ట్ నుండి పిన్ చేయండి.
                        </div>
                      );
                    }

                    return (
                      <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/30">
                        {pinnedList.map((art, idx) => (
                          <div key={art.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                            <div className="min-w-0 flex-1 flex flex-col gap-1">
                              <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                {art.title}
                              </span>
                              {art.districtName && (
                                <span className="text-[9px] text-[#02599c] font-black uppercase tracking-wider bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded w-max">
                                  {art.districtName}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const updated = [...pinnedList];
                                  const temp = updated[idx];
                                  updated[idx] = updated[idx - 1];
                                  updated[idx - 1] = temp;
                                  setPinnedList(updated);
                                  localStorage.setItem(`pinned_${districtActiveSubTab}_district_news`, JSON.stringify(updated));
                                }}
                                className={`p-1.5 rounded cursor-pointer transition-colors ${
                                  idx === 0 ? 'text-slate-250' : 'text-slate-500 hover:bg-slate-200/80'
                                }`}
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === pinnedList.length - 1}
                                onClick={() => {
                                  const updated = [...pinnedList];
                                  const temp = updated[idx];
                                  updated[idx] = updated[idx + 1];
                                  updated[idx + 1] = temp;
                                  setPinnedList(updated);
                                  localStorage.setItem(`pinned_${districtActiveSubTab}_district_news`, JSON.stringify(updated));
                                }}
                                className={`p-1.5 rounded cursor-pointer transition-colors ${
                                  idx === pinnedList.length - 1 ? 'text-slate-250' : 'text-slate-500 hover:bg-slate-200/80'
                                }`}
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = pinnedList.filter((_, i) => i !== idx);
                                  setPinnedList(updated);
                                  localStorage.setItem(`pinned_${districtActiveSubTab}_district_news`, JSON.stringify(updated));
                                }}
                                className="p-1.5 rounded hover:bg-rose-100 text-rose-500 transition-colors cursor-pointer"
                                title="Unpin Article"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Right Column: Search and Browse Available Articles */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">
                    📂 పిన్ చేయడానికి అందుబాటులో ఉన్న జిల్లా వార్తలు
                  </h3>

                  {/* Search input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={districtSearchQuery}
                      onChange={(e) => setDistrictSearchQuery(e.target.value)}
                      placeholder="శీర్షిక లేదా జిల్లా పేరుతో శోధించండి..."
                      className="w-full bg-slate-50 border border-slate-200/80 focus:border-[#02599c] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none text-slate-900 font-bold"
                    />
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  </div>

                  {/* Available list */}
                  <div className="border border-slate-200/80 rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto divide-y divide-slate-100 bg-slate-50/20 admin-scrollbar">
                    {(() => {
                      const query = districtSearchQuery.trim().toLowerCase();
                      const pinnedList = districtActiveSubTab === 'tg' ? pinnedTgNews : pinnedApNews;
                      const setPinnedList = districtActiveSubTab === 'tg' ? setPinnedTgNews : setPinnedApNews;

                      // Filter articles matching active state sub-tab (TG or AP) and districtSlug
                      const availableList = allArticles.filter((art) => {
                        const isMatchTab = art.categorySlug === (districtActiveSubTab === 'tg' ? 'telangana' : 'andhra-pradesh') && art.districtSlug;
                        const isMatchQuery = !query || 
                          art.title?.toLowerCase().includes(query) || 
                          art.districtSlug?.toLowerCase().includes(query) ||
                          art.districtName?.toLowerCase().includes(query);
                        return isMatchTab && isMatchQuery;
                      });

                      if (availableList.length === 0) {
                        return (
                          <div className="p-8 text-center text-slate-400 text-xs font-bold bg-white">
                            జిల్లా వార్తలు ఏవీ కనుగొనబడలేదు.
                          </div>
                        );
                      }

                      return availableList.map((art) => {
                        const isPinned = pinnedList.some((p) => p.id === art.id);

                        return (
                          <div key={art.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 bg-white transition-colors">
                            <div className="min-w-0 flex-1 flex flex-col gap-1">
                              <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                {art.title}
                              </span>
                              {art.districtName && (
                                <span className="text-[9px] text-[#02599c] font-black uppercase tracking-wider bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded w-max">
                                  {art.districtName}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                let updated;
                                if (isPinned) {
                                  updated = pinnedList.filter((p) => p.id !== art.id);
                                } else {
                                  const minimalArt = {
                                    id: art.id,
                                    slug: art.slug,
                                    title: art.title,
                                    image: art.image || '',
                                    districtName: art.districtName || ''
                                  };
                                  updated = [...pinnedList, minimalArt];
                                }
                                setPinnedList(updated);
                                localStorage.setItem(`pinned_${districtActiveSubTab}_district_news`, JSON.stringify(updated));
                              }}
                              className={`flex-shrink-0 text-[10px] font-black px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs border ${
                                isPinned
                                  ? 'bg-rose-50 border-rose-200/60 text-rose-600 hover:bg-rose-100/60'
                                  : 'bg-[#02599c]/5 border-[#02599c]/10 text-[#02599c] hover:bg-[#02599c] hover:text-white'
                              }`}
                            >
                              {isPinned ? 'Unpin' : 'Pin to Sidebar'}
                            </button>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ VIEW: EDITORIAL PAGE MANAGER ══════════════ */}
          {activeTab === 'editorial' && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">ఎడిటోరియల్ పేజీ మేనేజర్</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Manage Editorial page sections and articles. Changes reflect on /category/sampadakiyam.</p>
                </div>
                <button
                  onClick={() => { setEditorialSectionTitle(''); setEditorialSectionSlug(''); setEditorialFormMode('add-section'); }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 px-5 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2 self-start hover:scale-[1.01]"
                >
                  <Plus className="w-4 h-4" /><span>+ New Section</span>
                </button>
              </div>

              <div className="flex gap-5 min-h-[600px]">
                {/* Sections List (Left) */}
                <div className="w-64 shrink-0 flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-1">Sections</span>
                  {editorialSections.map((sec) => (
                    <div
                      key={sec.id}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                        editorialActiveSection === sec.slug ? 'bg-[#002f6c] text-white border-[#002f6c] shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-[#002f6c]/30 hover:bg-slate-50'
                      }`}
                      onClick={() => { setEditorialActiveSection(sec.slug); setEditorialFormMode('none'); }}
                    >
                      <span className="text-sm font-black telugu-text truncate" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>{sec.title}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
                        <button onClick={(e) => { e.stopPropagation(); setEditorialEditingSection(sec); setEditorialSectionTitle(sec.title); setEditorialSectionSlug(sec.slug); setEditorialFormMode('edit-section'); }} className="p-1 rounded-lg hover:bg-white/20 text-current" title="Edit"><Pencil className="w-3 h-3" /></button>
                        <button onClick={(e) => { e.stopPropagation(); if (!confirm(`Delete "${sec.title}"? Articles stay in DB.`)) return; const updated = editorialSections.filter(s => s.id !== sec.id); setEditorialSections(updated); fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ editorial_sections_config: JSON.stringify(updated) }) }).catch(err => console.error("Error deleting editorial section:", err)); if (editorialActiveSection === sec.slug) setEditorialActiveSection(updated[0]?.slug || 'sampadakiyam'); }} className="p-1 rounded-lg hover:bg-red-500/20 text-red-400" title="Delete"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Panel */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                  {/* Section Form */}
                  {(editorialFormMode === 'add-section' || editorialFormMode === 'edit-section') && (
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-base font-black text-slate-800 mb-4">{editorialFormMode === 'add-section' ? '+ Add New Section' : '✏️ Edit Section'}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Title</label>
                          <input type="text" value={editorialSectionTitle} onChange={(e) => setEditorialSectionTitle(e.target.value)} placeholder="e.g. కొత్త పలుకు" className="bg-slate-50 border border-slate-200 focus:border-[#02599c] rounded-xl px-3 py-2.5 text-sm outline-none text-slate-900 font-bold telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Slug</label>
                          <input type="text" value={editorialSectionSlug} onChange={(e) => setEditorialSectionSlug(e.target.value)} placeholder="e.g. antharmadanam" className="bg-slate-50 border border-slate-200 focus:border-[#02599c] rounded-xl px-3 py-2.5 text-sm outline-none text-slate-900 font-mono" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => { if (!editorialSectionTitle.trim() || !editorialSectionSlug.trim()) { alert('Title and Slug required!'); return; } let updated; if (editorialFormMode === 'add-section') { const ns = { id: `sec-${Date.now()}`, title: editorialSectionTitle.trim(), slug: editorialSectionSlug.trim() }; updated = [...editorialSections, ns]; setEditorialActiveSection(ns.slug); } else { updated = editorialSections.map(s => s.id === editorialEditingSection?.id ? { ...s, title: editorialSectionTitle.trim(), slug: editorialSectionSlug.trim() } : s); } setEditorialSections(updated); fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ editorial_sections_config: JSON.stringify(updated) }) }).catch(err => console.error("Error saving editorial section:", err)); setEditorialFormMode('none'); setEditorialEditingSection(null); }} className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm">{editorialFormMode === 'add-section' ? 'Create Section' : 'Save Changes'}</button>
                        <button onClick={() => { setEditorialFormMode('none'); setEditorialEditingSection(null); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  )}

                  {/* Image link Form */}
                  {(editorialFormMode === 'add-image' || editorialFormMode === 'edit-image') && (
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left">
                      <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5">
                        {editorialFormMode === 'add-image' ? '🖼️ Add Image Link' : '✏️ Edit Image Link'}
                      </h3>
                      
                      {/* Caption/Title */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image Caption / Title *</label>
                        <input
                          type="text"
                          value={editorialImageCaption}
                          onChange={(e) => setEditorialImageCaption(e.target.value)}
                          placeholder="చిత్రానికి శీర్షిక ఇక్కడ రాయండి..."
                          className="bg-slate-50 border border-slate-200 focus:border-[#02599c] rounded-xl px-3 py-2.5 text-sm outline-none text-slate-900 font-bold telugu-text"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        />
                      </div>

                      {/* Image Selector */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Image *</label>
                        <div className="flex items-start gap-4">
                          <button
                            type="button"
                            onClick={() => editorialImageInputRef.current?.click()}
                            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-black text-xs py-2.5 px-4 rounded-xl cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Image
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            ref={editorialImageInputRef}
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                handleCompressAndSetImage(f, setEditorialImageFile);
                              }
                            }}
                          />
                          {editorialImageFile && (
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-200">
                              <img src={editorialImageFile} alt="preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setEditorialImageFile('')}
                                className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black"
                              >
                                ×
                              </button>
                            </div>
                          )}
                          {!editorialImageFile && <span className="text-xs text-slate-400 font-bold mt-2">No image selected</span>}
                        </div>
                      </div>

                      {/* Linked Article Slug */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Related Article *</label>
                        <div className="flex gap-2">
                          {editorialImageLinkSlug ? (
                            <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5 flex items-center justify-between min-w-0">
                              <span className="text-xs font-bold text-blue-700 truncate font-mono">
                                {editorialImageLinkSlug}
                              </span>
                              <button
                                type="button"
                                onClick={() => setEditorialImageLinkSlug('')}
                                className="text-blue-400 hover:text-red-500 font-black text-sm ml-2 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setShowEditorialArticlePicker(true);
                                setEditorialSearchQuery('');
                              }}
                              className="flex-1 bg-slate-50 hover:bg-slate-100/80 border border-dashed border-slate-350 text-slate-500 font-bold text-xs py-3 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Select Related News Article to Link</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Save/Cancel Buttons */}
                      <div className="flex gap-2 mt-2">
                        <button
                          disabled={isSavingEditorialArticle}
                          onClick={async () => {
                            const caption = editorialImageCaption.trim();
                            if (!caption || !editorialImageFile || !editorialImageLinkSlug) {
                              alert('Caption, Image, and Linked Article are required!');
                              return;
                            }
                            setIsSavingEditorialArticle(true);
                            
                            const sec = editorialSections.find(s => s.slug === editorialActiveSection);
                            const imgArticleData = {
                              title: caption,
                              slug: (editorialFormMode === 'edit-image' && editorialEditingArticle)
                                ? editorialEditingArticle.slug
                                : `editorial-img-${Date.now().toString().slice(-6)}`,
                              categorySlug: editorialActiveSection,
                              category: sec?.title || 'ఎడిటోరియల్',
                              author: 'హై టీవీ డెస్క్',
                              publishedAt: new Date().toISOString(),
                              description: caption,
                              body: `[LINKED_ARTICLE_SLUG]:${editorialImageLinkSlug}`,
                              image: editorialImageFile,
                              isBreaking: false,
                              isTrending: false,
                              isFeatured: false
                            };

                            try {
                              if (editorialFormMode === 'add-image') {
                                const r = await fetch('/api/articles', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(imgArticleData)
                                });
                                if (r.ok) {
                                  const a = await r.json();
                                  setCustomNewsList(p => [a, ...p]);
                                  alert('Editorial Image Link created successfully!');
                                } else {
                                  alert('Failed to save image link.');
                                }
                              } else if (editorialEditingArticle) {
                                const r = await fetch(`/api/articles/${editorialEditingArticle.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(imgArticleData)
                                });
                                if (r.ok) {
                                  const a = await r.json();
                                  setCustomNewsList(p => p.map(x => x.id === editorialEditingArticle.id ? a : x));
                                  alert('Editorial Image Link updated successfully!');
                                } else {
                                  alert('Failed to update.');
                                }
                              }
                              setEditorialFormMode('none');
                              setEditorialEditingArticle(null);
                              setEditorialImageCaption('');
                              setEditorialImageFile('');
                              setEditorialImageLinkSlug('');
                            } catch (e: any) {
                              alert('Error: ' + e.message);
                            } finally {
                              setIsSavingEditorialArticle(false);
                            }
                          }}
                          className={`font-black text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-sm flex items-center gap-2 ${
                            isSavingEditorialArticle ? 'bg-slate-350 text-slate-500 cursor-not-allowed' : 'bg-[#02599c] hover:bg-[#024a82] text-white'
                          }`}
                        >
                          {isSavingEditorialArticle ? 'Saving...' : 'Save Image Link'}
                        </button>
                        <button
                          onClick={() => {
                            setEditorialFormMode('none');
                            setEditorialEditingArticle(null);
                            setEditorialImageCaption('');
                            setEditorialImageFile('');
                            setEditorialImageLinkSlug('');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-2.5 px-5 rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}



                  {/* Articles list */}
                  {editorialFormMode === 'none' && (() => {
                    const sec = editorialSections.find(s => s.slug === editorialActiveSection);
                    const arts = customNewsList.filter(a => a.categorySlug === editorialActiveSection);
                    return (
                      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-black text-slate-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>{sec?.title || editorialActiveSection}</h3>
                            <p className="text-xs text-slate-400 font-bold mt-0.5">{arts.length} article{arts.length !== 1 ? 's' : ''} · slug: <code className="font-mono bg-slate-100 px-1 rounded">{editorialActiveSection}</code></p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditorialImageCaption('');
                                setEditorialImageFile('');
                                setEditorialImageLinkSlug('');
                                setEditorialFormMode('add-image');
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 px-4 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm hover:scale-[1.01] transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Image</span>
                            </button>
                            <button onClick={() => { pendingAddCategoryRef.current = editorialActiveSection; setSelectedCategories([editorialActiveSection]); setIsBreakingChecked(false); setIsTrendingChecked(false); setIsFeaturedChecked(false); setNewsViewMode('add'); setActiveTab('news'); }} className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2 px-4 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm hover:scale-[1.01] transition-all"><Plus className="w-3.5 h-3.5" />Add Article</button>
                          </div>
                        </div>
                        {arts.length === 0 ? (
                          <div className="p-10 text-center text-slate-400"><FileText className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm font-bold">No articles in this section yet.</p><p className="text-xs mt-1">Click "Add Article" or "Add Image" to add the first one.</p></div>
                        ) : (
                          <div className="divide-y divide-slate-100">
                            {arts.map((art: any) => (
                              <div key={art.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors group">
                                <button
                                  type="button"
                                  onClick={() => editEditorialItem(art)}
                                  className="w-16 h-11 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 cursor-pointer hover:border-[#02599c] hover:bg-blue-50/50 transition-all flex items-center justify-center"
                                  title="Add/Edit Article Image"
                                >
                                  {art.image ? (
                                    <img src={art.image} alt={art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Plus className="w-4 h-4 text-slate-400" />
                                    </div>
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <button
                                    type="button"
                                    onClick={() => editEditorialItem(art)}
                                    className="text-left hover:text-[#02599c] cursor-pointer block"
                                  >
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-black text-slate-800 line-clamp-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                        {art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''}
                                      </p>
                                      {art.slug?.startsWith('editorial-img-') && (
                                        <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wide shrink-0">
                                          🔗 Image Link
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono truncate">{art.slug}</p>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  {art.slug?.startsWith('editorial-img-') ? (
                                    art.body && (
                                      <Link href={`/news/${art.body.replace('[LINKED_ARTICLE_SLUG]:', '').trim()}`} target="_blank" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#02599c]" title="Preview Linked Article"><Eye className="w-4 h-4" /></Link>
                                    )
                                  ) : (
                                    <Link href={`/news/${art.slug}`} target="_blank" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#02599c]" title="Preview"><Eye className="w-4 h-4" /></Link>
                                  )}
                                  <button onClick={() => editEditorialItem(art)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600" title="Edit"><Pencil className="w-4 h-4" /></button>
                                  <button onClick={async () => { if (!confirm(`Delete "${art.title}"?`)) return; try { await fetch(`/api/articles/${art.id}`, { method: 'DELETE' }); setCustomNewsList(p => p.filter(a => a.id !== art.id)); } catch { alert('Error deleting.'); } }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

        

{/* ══════════════ VIEW: LIVE UPDATES MANAGER ══════════════ */}
      {activeTab === 'live-updates' && (
        <div className="flex flex-col gap-6 animate-fade-in text-left">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                లైవ్ అప్‌డేట్స్ మేనేజర్ (Live Updates Manager)
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                లైవ్ వార్తల రోజువారీ ఫోల్డర్లు మరియు బ్రేకింగ్ పోస్ట్‌లను ఇక్కడ నిర్వర్తించండి
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const todayStr = new Date().toLocaleDateString('te-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                const slug = Date.now() + '-live';
                setListingFormMode('add');
                setEditingListing(null);
                setListingTitle('హై టీవీ ఫ్లాష్ న్యూస్');
                setListingDescription('తాజా లైవ్ అప్‌డేట్స్ మరియు ప్రధాన పరిణామాలు.');
                setListingDate(todayStr);
                setListingSlug(slug);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 px-5 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2 self-start hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4" />
              <span>+ కొత్త రోజువారీ ఫోల్డర్</span>
            </button>
          </div>

          {/* 2-Column Main Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (4/12): Day Listings Folders */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  రోజువారీ ఫోల్డర్లు ({liveListings.length})
                </h3>
              </div>

              {/* Listings Stack */}
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {liveListings.map((list) => {
                  const isSelected = selectedLiveSlug === list.slug;
                  return (
                    <div
                      key={list.id || list.slug}
                      onClick={() => {
                        setSelectedLiveSlug(list.slug);
                        setPostFormMode('none');
                      }}
                      className={"group relative p-4 rounded-xl border cursor-pointer transition-all " + (
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : "bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className={"text-xs font-black px-2 py-0.5 rounded-md " + (
                          isSelected ? "bg-amber-400 text-slate-900" : "bg-slate-200 text-slate-700"
                        )}>
                          {list.date}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingListing(list);
                              setListingTitle(list.title || '');
                              setListingDescription(list.description || '');
                              setListingDate(list.date || '');
                              setListingSlug(list.slug || '');
                              setListingFormMode('edit');
                            }}
                            className="p-1 rounded bg-white/20 hover:bg-white/40 text-current"
                            title="Edit Folder"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!confirm('డేటా తీసివేయాలా? "' + list.date + '"?')) return;
                              const updated = liveListings.filter(l => l.slug !== list.slug);
                              saveLiveListingsToDB(updated);
                              if (selectedLiveSlug === list.slug) {
                                setSelectedLiveSlug(updated[0]?.slug || '');
                              }
                            }}
                            className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300"
                            title="Delete Folder"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold telugu-text line-clamp-1" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                        {list.title}
                      </h4>
                      <p className={"text-xs mt-1 line-clamp-2 telugu-text " + (isSelected ? "text-slate-300" : "text-slate-500")} style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                        {list.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column (8/12): Posts Management inside selected day */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Add/Edit Listing Form Modal/Card */}
              {(listingFormMode === 'add' || listingFormMode === 'edit') && (
                <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-md space-y-4">
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>{listingFormMode === 'add' ? '+ కొత్త రోజువారీ ఫోల్డర్ జతచేయండి' : '✏️ ఫోల్డర్ సవరించండి'}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ఫోల్డర్ టైటిల్</label>
                      <input
                        type="text"
                        value={listingTitle}
                        onChange={(e) => setListingTitle(e.target.value)}
                        placeholder="హై టీవీ ఫ్లాష్ న్యూస్"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-amber-500 telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">తేదీ (Display Date)</label>
                      <input
                        type="text"
                        value={listingDate}
                        onChange={(e) => setListingDate(e.target.value)}
                        placeholder="22 జూన్ 2026"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-amber-500 telugu-text"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">వివరణ (Description)</label>
                    <textarea
                      value={listingDescription}
                      onChange={(e) => setListingDescription(e.target.value)}
                      rows={2}
                      placeholder="ఈ రోజు లైవ్ అప్‌డేట్స్ వివరణ..."
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:border-amber-500 telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!listingTitle.trim() || !listingDate.trim()) {
                          alert('దయచేసి టైటిల్ మరియు తేదీ నమోదు చేయండి');
                          return;
                        }
                        const slugToUse = listingSlug.trim() || (Date.now() + '-live');
                        let updated = [];
                        if (listingFormMode === 'add') {
                          const item = { id: 'list-' + Date.now(), title: listingTitle.trim(), description: listingDescription.trim(), date: listingDate.trim(), slug: slugToUse };
                          updated = [item, ...liveListings];
                          setSelectedLiveSlug(slugToUse);
                        } else {
                          updated = liveListings.map(l => l.slug === editingListing?.slug ? { ...l, title: listingTitle.trim(), description: listingDescription.trim(), date: listingDate.trim() } : l);
                        }
                        saveLiveListingsToDB(updated);
                        setListingFormMode('none');
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs py-2.5 px-6 rounded-xl cursor-pointer transition-all shadow-sm"
                    >
                      {listingFormMode === 'add' ? 'ఫోల్డర్ సృష్టించండి' : 'మార్పులు సేవ్‌ చేయండి'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setListingFormMode('none')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer"
                    >
                      రద్దు చేయండి
                    </button>
                  </div>
                </div>
              )}

              {/* Posts Workspace Header */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-wider">
                    ఎంచుకున్న ఫోల్డర్
                  </span>
                  <h3 className="text-lg font-black text-slate-800 mt-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                    {(liveListings.find(l => l.slug === selectedLiveSlug)?.title || 'లైవ్ అప్‌డేట్స్') + ' (' + selectedLiveSlug + ')'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const hours = now.getHours().toString().padStart(2, '0');
                    const mins = now.getMinutes().toString().padStart(2, '0');
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const fullTimeStr = monthNames[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear() + ' ' + hours + ':' + mins + ' IST';
                    setPostFormMode('add');
                    setEditingPost(null);
                    setPostTime(fullTimeStr);
                    setPostTitle('');
                    setPostCategory('telangana');
                    setPostIsImportant(false);
                    setPostBulletsText('');
                    setPostImage('');
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ కొత్త లైవ్ పోస్ట్ (Add Post)</span>
                </button>
              </div>

              {/* Add/Edit Live Post Form */}
              {(postFormMode === 'add' || postFormMode === 'edit') && (
                <div className="bg-white border-2 border-rose-500 rounded-2xl p-6 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-rose-600" />
                      <span>{postFormMode === 'add' ? 'కొత్త లైవ్ అప్‌డేట్ పోస్ట్ రాయండి' : 'లైవ్ పోస్ట్ సవరించండి'}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8 flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">వార్త ముఖ్యాంశం (Post Title) *</label>
                      <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                        <MiniWysiwygToolbar editorRef={postTitleEditorRef} />
                        <div
                          contentEditable
                          ref={postTitleEditorRef}
                          suppressContentEditableWarning
                          data-placeholder="ఉదా: హైదరాబాద్: వినాయక చవితి నిమజ్జనంపై సమీక్ష..."
                          className="wysiwyg-editor-mini w-full bg-slate-50 border-t border-slate-200/60 focus:bg-white px-4 py-3 text-base font-bold outline-none transition-colors telugu-text text-slate-800"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-4 flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">విభాగం (Category)</label>
                      <select
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-500"
                      >
                        <option value="telangana">తెలంగాణ (Telangana)</option>
                        <option value="ap">ఆంధ్రప్రదేశ్ (AP)</option>
                        <option value="politics">రాజకీయాలు (Politics)</option>
                        <option value="national">జాతీయ (National)</option>
                        <option value="international">అంతర్జాతీయ (International)</option>
                        <option value="sports">క్రీడలు (Sports)</option>
                        <option value="general">జనరల్ (General)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-8 flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">సమయం/Timestamp (e.g. Jun 22, 2026 14:30 IST)</label>
                      <input
                        type="text"
                        value={postTime}
                        onChange={(e) => setPostTime(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="md:col-span-4 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={postIsImportant}
                          onChange={(e) => setPostIsImportant(e.target.checked)}
                          className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                        />
                        <span className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded">
                          🔥 Flash Highlight (Important)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      వార్తా అంశాలు / బుల్లెట్ పాయింట్లు (Bullets)
                    </label>
                    <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <MiniWysiwygToolbar editorRef={postBulletsEditorRef} />
                      <div
                        contentEditable
                        ref={postBulletsEditorRef}
                        suppressContentEditableWarning
                        data-placeholder="ఒక్కో పాయింట్ కొత్త లైన్‌లో రాయండి..."
                        className="wysiwyg-editor-mini w-full bg-slate-50 border-t border-slate-200/60 focus:bg-white px-4 py-3 text-sm outline-none transition-colors telugu-text text-slate-800 min-h-[120px]"
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Image input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">చిత్రం (Optional Image URL / Upload)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={postImage}
                        onChange={(e) => setPostImage(e.target.value)}
                        placeholder="https://... లేదా ఇమేజ్ అప్‌లోడ్ చేయండి"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-rose-500"
                      />
                      <input
                        type="file"
                        ref={postImageInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => { setPostImage(ev.target?.result as string); };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => postImageInputRef.current?.click()}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-4 h-4" /> Upload
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        const titleHtml = postTitleEditorRef.current?.innerHTML.trim() || '';
                        const titleText = postTitleEditorRef.current?.innerText.trim() || '';
                        if (!titleText) {
                          alert('దయచేసి పోస్ట్ టైటిల్ నమోదు చేయండి');
                          return;
                        }
                        const bulletsHtml = postBulletsEditorRef.current?.innerHTML || '';
                        const bullets = parseHtmlToBullets(bulletsHtml);
                        const timeOnlyStr = postTime.includes('IST') ? postTime.split(' ').slice(-2, -1)[0] || '12:00' : '12:00';
                        let updated = [];
                        if (postFormMode === 'add') {
                          const newPost = {
                            id: 'lu-' + Date.now(),
                            timestamp: postTime.trim(),
                            timeOnly: timeOnlyStr,
                            title: titleHtml,
                            category: postCategory,
                            isImportant: postIsImportant,
                            bullets: bullets.length > 0 ? bullets : [titleHtml],
                            image: postImage.trim() || undefined
                          };
                          updated = [newPost, ...livePosts];
                        } else {
                          updated = livePosts.map(p => p.id === editingPost?.id ? {
                            ...p,
                            timestamp: postTime.trim(),
                            timeOnly: timeOnlyStr,
                            title: titleHtml,
                            category: postCategory,
                            isImportant: postIsImportant,
                            bullets: bullets.length > 0 ? bullets : [titleHtml],
                            image: postImage.trim() || undefined
                          } : p);
                        }
                        saveLivePostsToDB(selectedLiveSlug, updated);
                        setPostFormMode('none');
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 px-6 rounded-xl cursor-pointer transition-all shadow-sm"
                    >
                      {postFormMode === 'add' ? 'పోస్ట్ ప్రచురించండి (Publish)' : 'పోస్ట్ సేవ్‌ చేయండి'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostFormMode('none')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer"
                    >
                      రద్దు చేయండి
                    </button>
                  </div>
                </div>
              )}

              {/* Live Posts Feed Cards */}
              <div className="space-y-4">
                {livePosts.length === 0 ? (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-400">
                    <Zap className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
                    <p className="text-sm font-bold">ఈ ఫోల్డర్‌లో పోస్ట్‌లు లేవు.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        const hours = now.getHours().toString().padStart(2, '0');
                        const mins = now.getMinutes().toString().padStart(2, '0');
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        setPostFormMode('add');
                        setEditingPost(null);
                        setPostTime(monthNames[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear() + ' ' + hours + ':' + mins + ' IST');
                        setPostTitle('');
                      }}
                      className="mt-3 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      + మొదటి లైవ్ పోస్ట్ సృష్టించండి
                    </button>
                  </div>
                ) : (
                  livePosts.map((post) => (
                    <div
                      key={post.id}
                      className={"bg-white border rounded-2xl p-5 shadow-xs transition-all relative " + (
                        post.isImportant ? "border-amber-400 bg-amber-50/10" : "border-slate-200"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-900 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                            {post.timestamp || post.timeOnly}
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                            {post.category}
                          </span>
                          {post.isImportant && (
                            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                              🔥 Flash Highlight
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPost(post);
                              setPostTime(post.timestamp || '');
                              setPostTitle(post.title || '');
                              setPostCategory(post.category || 'telangana');
                              setPostIsImportant(!!post.isImportant);
                              setPostBulletsText(Array.isArray(post.bullets) ? post.bullets.join(String.fromCharCode(10)) : '');
                              setPostImage(post.image || '');
                              setPostFormMode('edit');
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                            title="Edit Post"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!confirm('ఈ లైవ్ పోస్ట్‌ను తొలగించాలా?')) return;
                              const updated = livePosts.filter(p => p.id !== post.id);
                              saveLivePostsToDB(selectedLiveSlug, updated);
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 
                        className="text-base font-black text-slate-900 telugu-text mb-3 leading-snug article-body" 
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: post.title }}
                      />

                      {post.bullets && post.bullets.length > 0 && (
                        <ul className="space-y-1.5 text-xs text-slate-700 telugu-text pl-2 border-l-2 border-slate-200 article-body" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                          {post.bullets.map((bullet: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-rose-500 font-bold">•</span>
                              <span dangerouslySetInnerHTML={{ __html: bullet }} />
                            </li>
                          ))}
                        </ul>
                      )}

                      {post.image && (
                        <div className="mt-3 max-w-md rounded-xl overflow-hidden border border-slate-200">
                          <img src={post.image} alt={post.title} className="w-full h-auto object-cover max-h-60" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      )}

</div>
      </main>

      {/* ── Related News Promos Inserter Modal ── */}
      {showPromoLinkModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-scale-up text-left">
            
            {/* Modal Header */}
            <div className="bg-[#02599c] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5" />
                <h3 className="font-black text-sm select-none">Related News Inserter (ఈ వార్తా చదవండి)</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowPromoLinkModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex flex-col gap-5">
              
              {/* Option A: Search & Select from Existing Articles */}
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Option A: Link Existing Article</h4>
                <div className="relative">
                  <input
                    type="text"
                    value={promoSearchQuery}
                    onChange={(e) => setPromoSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#02599c] focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs outline-none text-slate-900"
                    placeholder="Search articles by title or category..."
                  />
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto divide-y divide-slate-100 bg-slate-50">
                  {(() => {
                    const query = promoSearchQuery.trim().toLowerCase();
                    const list = allArticles.filter(art => 
                      !query || 
                      art.title.toLowerCase().includes(query) || 
                      (art.category && art.category.toLowerCase().includes(query))
                    );

                    if (list.length === 0) {
                      return <div className="p-5 text-center text-slate-400 text-xs font-bold">No articles match your query.</div>;
                    }

                    return list.map((art) => (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => handleInsertPromoLink(art.title, art.slug)}
                        className="w-full text-left p-3.5 hover:bg-[#02599c]/5 active:bg-[#02599c]/10 transition-colors flex items-center justify-between gap-4 cursor-pointer text-xs"
                      >
                        <span className="font-bold text-slate-800 line-clamp-2 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                          {art.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold bg-white border border-slate-200 rounded px-2 py-0.5 whitespace-nowrap">
                          {getArticleCategoryName(art)}
                        </span>
                      </button>
                    ));
                  })()}
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Option B: Enter Custom Title and Slug/URL manually */}
              <div className="flex flex-col gap-3.5">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Option B: Custom Promo Box</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Title (Telugu/English)</label>
                    <input
                      type="text"
                      value={customPromoTitle}
                      onChange={(e) => setCustomPromoTitle(e.target.value)}
                      placeholder="e.g. ఇక్కడ వేరే వార్త టైటిల్ రాయండి"
                      className="bg-slate-50 border border-slate-200 focus:border-[#02599c] focus:bg-white rounded-xl px-3 py-2.5 text-xs outline-none text-slate-900 font-bold telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Article Slug or Full URL</label>
                    <input
                      type="text"
                      value={customPromoSlug}
                      onChange={(e) => setCustomPromoSlug(e.target.value)}
                      placeholder="e.g. ap-heavy-rains-alert-2024"
                      className="bg-slate-50 border border-slate-200 focus:border-[#02599c] focus:bg-white rounded-xl px-3 py-2.5 text-xs outline-none text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!customPromoTitle.trim() || !customPromoSlug.trim()}
                  onClick={() => handleInsertPromoLink(customPromoTitle, customPromoSlug)}
                  className={`mt-1 font-black text-xs py-3 px-6 rounded-xl transition-all cursor-pointer text-center shadow-md flex items-center justify-center gap-1.5 ${
                    customPromoTitle.trim() && customPromoSlug.trim()
                      ? 'bg-rose-600 hover:bg-rose-700 text-white hover:scale-[1.01]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Custom Promo Box</span>
                </button>
                </div>

            </div>

          </div>
        </div>
      )}

      {/* ── Editorial Article Picker Modal ── */}
      {showEditorialArticlePicker && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-scale-up text-left">
            
            {/* Modal Header */}
            <div className="bg-[#02599c] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h3 className="font-black text-sm select-none">Select Related News Article to Link</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowEditorialArticlePicker(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={editorialSearchQuery}
                  onChange={(e) => setEditorialSearchQuery(e.target.value)}
                  placeholder="Type title or slug to search news articles..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-250/70 focus:border-[#02599c] rounded-xl outline-none text-slate-800"
                />
              </div>
            </div>

            {/* Articles List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 max-h-[400px]">
              {(() => {
                 const searchStr = editorialSearchQuery.trim().toLowerCase();
                 const editorialSectionSlugs = editorialSections.map(s => s.slug);
                 const filtered = customNewsList
                   .filter((a) => !a.slug?.startsWith('editorial-img-') && a.categorySlug !== 'polls')
                   .filter((a) => editorialSectionSlugs.includes(a.categorySlug))
                   .filter((a) => !searchStr || a.title?.toLowerCase().includes(searchStr) || a.slug?.toLowerCase().includes(searchStr));

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center text-slate-400 text-xs font-bold">
                      No matching news articles found.
                    </div>
                  );
                }

                return filtered.slice(0, 15).map((art) => (
                  <div key={art.id} className="p-3 flex items-center justify-between gap-4 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="min-w-0 flex-1 flex items-center gap-3">
                      <div className="w-12 h-8 rounded overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        {art.image && <img src={art.image} alt={art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''} className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-extrabold text-slate-800 line-clamp-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                          {art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5 truncate">
                          {art.slug}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditorialImageLinkSlug(art.slug);
                        setShowEditorialArticlePicker(false);
                      }}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[10px] py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                    >
                      Link This
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Tag Link Article Picker Modal ── */}
      {tagLinkingTargetName && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-scale-up text-left">
            
            {/* Modal Header */}
            <div className="bg-[#02599c] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                <h3 className="font-black text-sm select-none">Link Article to #{tagLinkingTargetName}</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setTagLinkingTargetName(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={tagLinkSearchQuery}
                  onChange={(e) => setTagLinkSearchQuery(e.target.value)}
                  placeholder="Search articles by title, page name, category, or slug..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-250/70 focus:border-[#02599c] rounded-xl outline-none text-slate-800"
                />
              </div>
            </div>

            {/* Articles List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 max-h-[400px]">
              {(() => {
                const searchStr = tagLinkSearchQuery.trim().toLowerCase();
                const filtered = allArticles
                  .filter((a) => !searchStr || a.title?.toLowerCase().includes(searchStr) || a.categorySlug?.toLowerCase().includes(searchStr) || a.category?.toLowerCase().includes(searchStr) || a.slug?.toLowerCase().includes(searchStr));

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center text-slate-400 text-xs font-bold">
                      No matching news articles found.
                    </div>
                  );
                }

                return filtered.slice(0, 30).map((art) => {
                  const getCatLabel = (slug: string) => {
                    const mappings: Record<string, string> = {
                      'latest': 'Breaking News',
                      'telangana': 'Telangana News',
                      'andhra-pradesh': 'Andhra Pradesh News',
                      'national': 'National News',
                      'international': 'International News',
                      'business': 'Business News',
                      'politics': 'Politics News',
                      'sports': 'Sports News',
                      'entertainment': 'Entertainment News',
                      'technology': 'Technology News',
                      'health': 'Health News',
                      'doctors-corner': "Doctor's Corner",
                      'viral': 'Viral News',
                      'rasipalalu': 'Astrology News',
                      'photos': 'Photo Gallery',
                      'shorts': 'Shorts News',
                      'webstories': 'Web Stories',
                      'antharmadanam': 'Opinion News',
                      'adyathmikam': 'Devotional News',
                      'sampadakiyam': 'Editorial News',
                      'women': 'Women News',
                      'lifestyle': 'Lifestyle News',
                      'vidya': 'Education News',
                      'admissions': 'Admissions News',
                      'current-affairs': 'Current Affairs',
                      'upadi': 'Employment News',
                      'notification': 'Notification News',
                      'citizen-reporter': 'Citizen Reporter',
                      'weather': 'Weather News'
                    };
                    return mappings[slug] || slug;
                  };

                  return (
                    <div key={art.id} className="p-3 flex items-center justify-between gap-4 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="min-w-0 flex-1 flex items-center gap-3">
                        <div className="w-14 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                          {art.image && <img src={art.image} alt={art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''} className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="bg-rose-50 border border-rose-100 text-rose-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider inline-block mb-1">
                            {getCatLabel(art.categorySlug)}
                          </span>
                          <span className="text-xs font-extrabold text-slate-800 line-clamp-2 telugu-text block" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                            {art.title ? art.title.replace(/<[^>]*>/g, '').trim() : ''}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewsTags(newsTags.map(t => (typeof t === 'string' ? t : t.name) === tagLinkingTargetName ? { name: tagLinkingTargetName, linkedArticleSlug: art.slug } : t));
                          setTagLinkingTargetName(null);
                        }}
                        className="bg-[#02599c] hover:bg-[#01477d] text-white font-extrabold text-[10px] py-2 px-3 rounded-lg cursor-pointer transition-colors shrink-0 shadow-sm"
                      >
                        Link Tag
                      </button>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

