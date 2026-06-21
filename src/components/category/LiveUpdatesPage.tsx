'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  RefreshCw, 
  Clock, 
  AlertCircle,
  Volume2,
  VolumeX,
  Zap,
  ChevronRight
} from 'lucide-react';
import RightSidebar from '@/components/layout/RightSidebar';
import BackButton from '@/components/layout/BackButton';

interface LiveUpdateItem {
  id: string;
  timestamp: string;
  timeOnly: string;
  title: string;
  category: 'politics' | 'ap' | 'telangana' | 'national' | 'international' | 'sports' | 'general';
  bullets: string[];
  image?: string;
  isImportant?: boolean;
}

interface ListingItem {
  id: string;
  title: string;
  description: string;
  date: string;
  slug: string;
}

const listingItems: ListingItem[] = [
  {
    id: 'list-1',
    title: 'హై టీవీ ఫ్లాష్ న్యూస్',
    description: 'ప్రపంచ వ్యాప్తంగా జరిగే వివిధ సంఘటనల అప్‌డేట్స్‌ను ఎప్పటికప్పుడు ఇక్కడ చదవండి..',
    date: '21 జూన్ 2026',
    slug: '21st-june-2026'
  },
  {
    id: 'list-2',
    title: 'హై టీవీ ఫ్లాష్ న్యూస్',
    description: '20 జూన్ 2026 నాటి ఏపీ, తెలంగాణ మరియు జాతీయ అంతర్జాతీయ రాజకీయ పరిణామాల లైవ్ అప్‌డేట్స్.',
    date: '20 జూన్ 2026',
    slug: '20th-june-2026'
  },
  {
    id: 'list-3',
    title: 'హై టీవీ ఫ్లాష్ న్యూస్',
    description: '19 జూన్ 2026 నాటి ప్రధాన క్రీడా వార్తలు, రాజకీయ పరిణామాలు మరియు ముఖ్యాంశాలు.',
    date: '19 జూన్ 2026',
    slug: '19th-june-2026'
  },
  {
    id: 'list-4',
    title: 'హై టీవీ ఫ్లాష్ న్యూస్',
    description: '18 జూన్ 2026 నాటి వివిధ వర్గాల తాజా సమాచారం, స్థానిక మరియు అంతర్జాతీయ వార్తలు.',
    date: '18 జూన్ 2026',
    slug: '18th-june-2026'
  }
];

const initialLiveUpdates: LiveUpdateItem[] = [
  {
    id: 'lu-1',
    timestamp: 'Jun 21, 2026 13:18 IST',
    timeOnly: '13:18',
    title: 'సీఎం రేవంత్‌రెడ్డికి టీబీజేపీ చీఫ్ రాంచందర్‌రావు లేఖ',
    category: 'telangana',
    isImportant: true,
    bullets: [
      'నెరవేరని కాంగ్రెస్ గ్యారెంటీలపై వినతిపత్రం ఇచ్చేందుకు రాహుల్ అపాయింట్‌మెంట్ ఇప్పించాలని కోరుతూ లేఖ.',
      'రాహుల్ అపాయింట్‌మెంట్ కల్పించడంలో టీకాంగ్రెస్ విఫలమైతే అది తెలంగాణ ప్రజలకు మీరు చేసిన ద్రోహమని స్పష్టమవుతుంది: రాంచందర్‌రావు.',
      'హామీల అమలులో కాంగ్రెస్ విఫలమైంది: రాంచందర్‌రావు.',
      'ప్రభుత్వంపై అన్ని వర్గాల్లో తీవ్ర అసంతృప్తి ఉంది: రాంచందర్‌రావు.'
    ]
  },
  {
    id: 'lu-2',
    timestamp: 'Jun 21, 2026 12:58 IST',
    timeOnly: '12:58',
    title: 'కామారెడ్డి: అంతర్రాష్ట్ర గంజాయి ముఠా అరెస్ట్',
    category: 'telangana',
    bullets: [
      'రూ.1.93కోట్ల విలువైన 387 కిలోల గంజాయి సీజ్.',
      'ముగ్గురు అరెస్ట్, వాహనం, 2 ఫోన్లు స్వాధీనం.',
      'నిందితులు కరీముల్లా, సుభాష్‌, రహీం నిజామాబాద్ వాసులు.',
      'ఒడిశా నుంచి మహారాష్ట్రకు గంజాయి తరలిస్తున్న నిందితులు.'
    ]
  },
  {
    id: 'lu-3',
    timestamp: 'Jun 21, 2026 12:29 IST',
    timeOnly: '12:29',
    title: 'విజయవాడ: సీఐ నాగరాజు నివాసానికి భారీగా వచ్చిన మద్దతుదారులు',
    category: 'ap',
    bullets: [
      'సీఐ నాగరాజుపై చర్యలు తీసుకోవద్దని నిరసన.',
      'నాగరాజు వల్లే అసాంఘిక కార్యకలాపాలకు బ్రేక్ పడిందంటున్న మద్దతుదారులు.'
    ]
  },
  {
    id: 'lu-4',
    timestamp: 'Jun 21, 2026 11:37 IST',
    timeOnly: '11:37',
    title: 'హైదరాబాద్: తన నామినేషన్ తిరస్కరణపై స్పందించిన మీనాక్షి',
    category: 'telangana',
    bullets: [
      'నామినేషన్ తిరస్కరణ అంశంపై మాట్లాడాలని నాకు ఉంది: మీనాక్షి.',
      'ఎన్నికల కమిషన్ చేసిన దుర్మార్గాన్ని తప్పకుండా మాట్లాడుతాను: మీనాక్షి.',
      'సమయం తీసుకుని తప్పకుండా మాట్లాడుతాను: మీనాక్షి.',
      'మీ అందర్నీ పిలిచి నా మనసులో ఉన్న మాటలను తప్పకుండా మాట్లాడుతాను: మీనాక్షి.',
      'నేనిప్పుడు SIR సమావేశం కోసం వచ్చాను: మీనాక్షి.'
    ]
  },
  {
    id: 'lu-5',
    timestamp: 'Jun 21, 2026 11:25 IST',
    timeOnly: '11:25',
    title: 'భారత నౌకాదళంలోకి మూడు యుద్ధ నౌకలు',
    category: 'national',
    isImportant: true,
    bullets: [
      'ఒకేసారి మూడు స్వదేశీ యుద్ధనౌకల కమిషనింగ్.',
      'ప్రధాని మోదీ చేతుల మీదుగా కమిషనింగ్.',
      'అత్యాధునిక యుద్ధనౌకలు INS దూనగిరి, INS సంశోధక్, INS అగ్రయ్‌ను దేశానికి అంకితం చేసిన ప్రధాని మోదీ.'
    ]
  },
  {
    id: 'lu-6',
    timestamp: 'Jun 21, 2026 11:22 IST',
    timeOnly: '11:22',
    title: 'ఖమ్మం: గాంధీనగర్‌లో విషాదం',
    category: 'telangana',
    bullets: [
      'ఇద్దరు పిల్లలకు విషం ఇచ్చి తల్లి ఆత్మహత్యాయత్నం.',
      'చిన్నారులు వేదిక్‌కుమార్(07), తనిష్క్(05) మృతి.',
      'తల్లి స్వాతి పరిస్థితి విషమం, ఆస్పత్రిలో చికిత్స.'
    ]
  },
  {
    id: 'lu-7',
    timestamp: 'Jun 21, 2026 11:21 IST',
    timeOnly: '11:21',
    title: 'విజయవాడ: సాయికృష్ణ కేసులో అజ్ఞాతంలోకి ఆరుగురు కానిస్టేబుళ్లు',
    category: 'ap',
    bullets: [
      'నిన్న మధ్యాహ్నం నుంచి అజ్ఞాతంలోకి వెళ్లినట్టు సమాచారం.'
    ]
  },
  {
    id: 'lu-8',
    timestamp: 'Jun 21, 2026 11:10 IST',
    timeOnly: '11:10',
    title: 'వరంగల్: కేసీఆర్ వరంగల్‌కు చేసిందేమీ లేదు - ఎమ్మెల్యే నాయిని రాజేందర్‌రెడ్డి',
    category: 'telangana',
    bullets: [
      'కల్వకుంట్ల కుటుంబం రాజకీయాన్నే వ్యాపారంగా మార్చుకుంది.',
      'బీఆర్ఎస్ నేతలు హైనాలకంటే డేంజర్: ఎమ్మెల్యే నాయిని.',
      'వరంగల్‌కు ఇచ్చిన హామీలపై కేటీఆర్‌ను ప్రజలు నిలదీయాలి: ఎమ్మెల్యే నాయిని.',
      'వరంగల్‌కు హైడ్రా లాంటి సంస్థను తీసుకొస్తాం: ఎమ్మెల్యే నాయిని.'
    ]
  },
  {
    id: 'lu-9',
    timestamp: 'Jun 21, 2026 10:53 IST',
    timeOnly: '10:53',
    title: 'ఇరాన్‌తో ఒప్పందం కుదరకపోతే హోర్ముజ్‌లో టోల్ వసూలు చేస్తాం: ట్రంప్',
    category: 'international',
    bullets: [
      'ప్రస్తుతం హోర్ముజ్‌లో 60 రోజుల పాటు స్వేచ్ఛా నౌకాయానం అమల్లో ఉంది: ట్రంప్.',
      'ప్రస్తుతం ఇరాన్ సుంకాలు వసూలు చేయడం లేదు: ట్రంప్.'
    ]
  },
  {
    id: 'lu-10',
    timestamp: 'Jun 21, 2026 10:47 IST',
    timeOnly: '10:47',
    title: 'శ్రీలంకతో ఫైనల్: వైభవ్ సూర్యవంశీ ఔట్',
    category: 'sports',
    bullets: [
      '29 బంతుల్లోనే 94 పరుగులు చేసిన సూర్యవంశీ.',
      '10 ఫోర్లు, 8 సిక్స్‌లతో చెలరేగిన వైభవ్.'
    ]
  },
  {
    id: 'lu-11',
    timestamp: 'Jun 21, 2026 10:33 IST',
    timeOnly: '10:33',
    title: 'శ్రీలంకతో ఫైనల్: వైభവ് సూర్యవంశీ విధ్వంసం',
    category: 'sports',
    bullets: [
      '11 బంతుల్లోనే వైభవ్ సూర్యవంశీ హాఫ్ సెంచరీ.',
      '5 ఫోర్లు, 5 సిక్స్‌లతో చెలరేగిన వైభవ్.'
    ]
  }
];

const simulatedUpdates: Omit<LiveUpdateItem, 'id'>[] = [
  {
    timestamp: 'Jun 21, 2026 13:35 IST',
    timeOnly: '13:35',
    title: 'అమరావతి: ఏపీ క్యాబినెట్ భేటీ ముగింపు - కీలక నిర్ణయాలకు ఆమోదం',
    category: 'ap',
    isImportant: true,
    bullets: [
      'ముఖ్యమంత్రి నారా చంద్రబాబు నాయుడు అధ్యక్షతన ముగిసిన మంత్రిమండలి సమావేశం.',
      'రైతు రుణమాఫీ నిధుల విడుదల మరియు నిరుద్యోగ భృతి పథకంపై కీలక నిర్ణయాలు.',
      'విజయవాడ నగర మెట్రో రైల్ ప్రాజెక్టు రెండో దశకు మంత్రిమండలి ఆమోదం తెలిపిందని సమాచారం.'
    ]
  }
];

export default function LiveUpdatesPage() {
  const [selectedUpdate, setSelectedUpdate] = useState<ListingItem | null>(null);
  const [updates, setUpdates] = useState<LiveUpdateItem[]>(initialLiveUpdates);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [pulse, setPulse] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Time Tick Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Flashing Badge pulse effect
  useEffect(() => {
    const pTimer = setInterval(() => setPulse((p) => !p), 800);
    return () => clearInterval(pTimer);
  }, []);

  // Simulate new live updates coming in details view
  useEffect(() => {
    if (!selectedUpdate) return;
    
    const simulateArrival = () => {
      setIsSimulating(true);
      setTimeout(() => {
        const newUpdate: LiveUpdateItem = {
          ...simulatedUpdates[0],
          id: `sim-${Date.now()}`
        };
        
        setUpdates(prev => [newUpdate, ...prev]);
        setIsSimulating(false);

        if (soundEnabled) {
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
          } catch (e) {
            console.log('Audio not allowed');
          }
        }
        showToast('తాజా బ్రేకింగ్ న్యూస్ అప్‌డేట్ చేర్చబడింది!');
      }, 3500);
    };

    const timer = setTimeout(simulateArrival, 15000);
    return () => clearTimeout(timer);
  }, [selectedUpdate, soundEnabled]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (update: LiveUpdateItem) => {
    const text = `*${update.title}*\n[అప్‌డేట్ సమయం: ${update.timestamp}]\n\n${update.bullets.map(b => `• ${b}`).join('\n')}\n\nమరిన్ని తాజా లైవ్ అప్‌డేట్స్ కోసం: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(update.id);
      showToast('వార్త కాపీ చేయబడింది!');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const shareOnWhatsApp = (update: LiveUpdateItem) => {
    const text = `*${update.title}*\n[${update.timestamp}]\n\n${update.bullets.map(b => `• ${b}`).join('\n')}\n\nమరిన్ని లైవ్ అప్‌డేట్స్ కోసం క్లిక్ చేయండి: ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = (update: LiveUpdateItem) => {
    const text = `🚨 ${update.title} - ${update.timestamp}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = (update: LiveUpdateItem) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const filteredUpdates = updates.filter(update => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'ap') return update.category === 'ap';
    if (activeFilter === 'telangana') return update.category === 'telangana';
    if (activeFilter === 'sports') return update.category === 'sports';
    if (activeFilter === 'national') return update.category === 'national';
    if (activeFilter === 'international') return update.category === 'international';
    return true;
  });

  const displayedUpdates = filteredUpdates.slice(0, visibleCount);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'ap':
        return <span className="bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded text-[11px] font-bold">ఆంధ్రప్రదేశ్</span>;
      case 'telangana':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-bold">తెలంగాణ</span>;
      case 'sports':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">క్రీడలు</span>;
      case 'national':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold">జాతీయం</span>;
      case 'international':
        return <span className="bg-cyan-100 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded text-[11px] font-bold">అంతర్జాతీయం</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 border border-gray-200 px-2 py-0.5 rounded text-[11px] font-bold">తాజా వార్త</span>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f6f8] text-left">
      
      {/* ─── DUAL-VIEW CONTAINER ────────────────────────────────────── */}
      <div className="max-w-[1050px] mx-auto bg-white px-4 py-6 shadow-md border-x border-gray-200 min-h-screen">
        
        {/* Dynamic Breadcrumbs row with Back Button on the right */}
        <div className="flex items-center justify-between gap-4 mb-6 border-b border-gray-250 pb-3 overflow-hidden">
          <div className="text-[11px] md:text-[13px] font-bold text-gray-500 font-sans uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Link href="/" className="hover:text-blue-900 transition-colors">HOME</Link> 
            <ChevronRight className="w-3.5 h-3.5 text-gray-450" />
            <Link href="/category/latest" onClick={() => setSelectedUpdate(null)} className="hover:text-blue-900 transition-colors">
              LIVE UPDATES
            </Link>
            {selectedUpdate && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-450" />
                <span className="text-gray-800 font-extrabold truncate max-w-[200px] md:max-w-[300px]">
                  {selectedUpdate.title} - {selectedUpdate.date}
                </span>
              </>
            )}
          </div>
          <div className="flex-shrink-0 pb-0.5">
            <BackButton />
          </div>
        </div>

        {/* Main Two-Column Layout (Always stays side-by-side with sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          
          {/* Left Column (70%): List View OR Detailed Article Timeline */}
          <div className="lg:col-span-7 w-full">
            
            <AnimatePresence mode="wait">
              {!selectedUpdate ? (
                
                // ─── VIEW A: CARDS LIST ────────────────────────────────
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {listingItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedUpdate(item)}
                      className="flex flex-col sm:flex-row gap-3.5 p-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer select-none group"
                    >
                      {/* Card Thumbnail in Yellow */}
                      <div className="w-full sm:w-[190px] h-[107px] flex-shrink-0 rounded-lg overflow-hidden border border-amber-300/40 relative bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 shadow-inner">
                        <div className="absolute top-0 -left-1/4 w-[150%] h-[150%] bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-12 pointer-events-none" />
                        
                        <div className="absolute top-2 right-2 bg-white rounded border border-gray-100 px-1.5 py-0.5 shadow flex items-center justify-center select-none">
                          <span className="text-[9px] font-black text-blue-900 tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                            HIGH TV
                          </span>
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1.5 select-none">
                          <span 
                            className="text-blue-950 font-black text-[23px] tracking-wider leading-none uppercase" 
                            style={{ 
                              textShadow: '0 1px 2px rgba(255, 255, 255, 0.95)'
                            }}
                          >
                            LIVE
                          </span>
                          <span 
                            className="text-blue-900 font-black text-[21px] tracking-wide leading-none uppercase mt-1" 
                            style={{ 
                              textShadow: '0 1px 2px rgba(255, 255, 255, 0.95)'
                            }}
                          >
                            UPDATES
                          </span>
                        </div>
                      </div>

                      {/* Card Texts */}
                      <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between">
                        <div>
                          <h3 
                            className="text-[17px] md:text-[18.5px] font-bold text-gray-900 group-hover:text-blue-900 leading-snug transition-colors telugu-text"
                            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                          >
                            {item.title}
                          </h3>
                          <p 
                            className="text-[13.5px] md:text-[14.5px] text-gray-600 mt-1.5 line-clamp-2 telugu-text leading-relaxed"
                            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                          >
                            {item.description}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-gray-400 mt-1.5 font-mono">
                          PUBLISHED: {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
                
              ) : (
                
                // ─── VIEW B: DETAILED ARTICLE PAGE (ABN Style) ─────────
                <motion.div
                  key="detail-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 bg-white text-left"
                >
                  
                  {/* Pulsing Live indicator */}
                  <div className="flex items-center gap-2 select-none">
                    <span className="flex items-center gap-1.5 bg-[#e60000] text-white text-[11.5px] font-black px-2.5 py-1 rounded shadow-sm">
                      <span
                        className="inline-block w-2 h-2 rounded-full bg-white animate-ping"
                        style={{ opacity: pulse ? 1 : 0.3 }}
                      />
                      LIVE NOW
                    </span>
                    {currentTime && (
                      <span className="text-gray-500 font-mono text-[12px] font-bold">
                        | Ticking: {currentTime}
                      </span>
                    )}
                  </div>

                  {/* Main Article Title */}
                  <h1 
                    className="text-[20px] md:text-[28px] font-black text-gray-900 leading-snug telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    {selectedUpdate.title} | {selectedUpdate.date} లైవ్ అప్‌డేట్స్
                  </h1>

                  {/* Author / Date Info block */}
                  <div className="flex items-center justify-between border-y border-gray-100 py-2.5 text-xs text-gray-500 select-none">
                    <div>
                      <strong>హై టీవీ డెస్క్</strong>, Publish Date: {selectedUpdate.date}
                    </div>
                    {/* Sound toggle controls */}
                    <button
                      onClick={() => {
                        setSoundEnabled(!soundEnabled);
                        showToast(soundEnabled ? 'అలర్ట్ సౌండ్ ఆఫ్ చేయబడింది.' : 'అలర్ట్ సౌండ్ ఆన్ చేయబడింది.');
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer ${
                        soundEnabled 
                          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 font-bold' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span className="text-[11px] font-bold telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                        బీప్ అలర్ట్
                      </span>
                    </button>
                  </div>

                  {/* Subtitle */}
                  <p 
                    className="text-[17px] md:text-[20px] text-gray-700 font-medium leading-relaxed telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    {selectedUpdate.description}
                  </p>

                  {/* Featured Card Image Template (Wide Banner implementation) */}
                  <div className="w-full h-[240px] md:h-[300px] rounded-xl overflow-hidden border border-amber-300/40 relative bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 shadow flex items-center justify-center select-none">
                    <div className="absolute top-0 -left-1/4 w-[150%] h-[150%] bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-12 pointer-events-none" />
                    
                    <div className="absolute top-3 right-3 bg-white rounded border border-gray-150 px-2.5 py-1 shadow flex items-center justify-center select-none">
                      <span className="text-[12px] font-black text-blue-900 tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                        HIGH TV
                      </span>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 select-none">
                      <span 
                        className="text-blue-950 font-black text-[42px] md:text-[50px] tracking-wider leading-none uppercase" 
                        style={{ 
                          textShadow: '0 2px 4px rgba(255, 255, 255, 0.95)'
                        }}
                      >
                        LIVE
                      </span>
                      <span 
                        className="text-blue-900 font-black text-[38px] md:text-[46px] tracking-wide leading-none uppercase animate-pulse mt-2" 
                        style={{ 
                          textShadow: '0 2px 4px rgba(255, 255, 255, 0.95)'
                        }}
                      >
                        UPDATES
                      </span>
                    </div>
                  </div>

                  {/* Live Blog Widget Timeline Section */}
                  <div className="pt-4">
                    <div className="flex items-center justify-between border-b-2 border-blue-900 pb-2 mb-4">
                      <h2 className="text-lg md:text-xl font-black text-gray-900 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                        Live Updates Feed
                      </h2>
                      {isSimulating && (
                        <div className="flex items-center gap-1.5 text-xs text-yellow-600 font-bold select-none">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>తాజా అప్‌డేట్ లోడ్ అవుతోంది...</span>
                        </div>
                      )}
                    </div>



                    {/* Timeline Blog Stack */}
                    <div className="space-y-5">
                      <AnimatePresence initial={false}>
                        {displayedUpdates.map((update, idx) => {
                          const isFirst = idx === 0;
                          return (
                            <motion.div
                              key={update.id}
                              initial={isFirst ? { opacity: 0, y: -20 } : { opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.3 }}
                              className="border-b border-gray-150 pb-5 last:border-b-0"
                            >
                              {/* Header: Timestamp + Share Toolbar */}
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="bg-red-50 text-red-600 font-extrabold px-2.5 py-1 rounded border border-red-100 font-mono text-[11px] tracking-wider select-none">
                                    {update.timeOnly} IST
                                  </span>
                                  <span className="font-bold font-mono hidden sm:inline text-gray-400">
                                    {update.timestamp.split(' ').slice(0, 3).join(' ')}
                                  </span>
                                  {getCategoryBadge(update.category)}
                                </div>
                                <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => shareOnWhatsApp(update)}
                                    className="p-1 rounded-md hover:bg-emerald-50 text-emerald-600 transition-colors cursor-pointer"
                                    title="Share on WhatsApp"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => shareOnTwitter(update)}
                                    className="p-1 rounded-md hover:bg-sky-50 text-sky-600 transition-colors cursor-pointer"
                                  >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => copyToClipboard(update)}
                                    className="p-1 rounded-md hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                                  >
                                    {copiedId === update.id ? <Check className="w-4 h-4 text-emerald-600 animate-pulse" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>

                              {/* Title in RED (Authentic ABN style) */}
                              <h3 
                                className="text-[19px] md:text-[22px] font-black text-[#e60000] leading-snug telugu-text mb-2.5"
                                style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                              >
                                {update.title}
                              </h3>

                              {/* Bullet Details */}
                              <ul className="space-y-2 pl-1 select-text">
                                {update.bullets.map((bullet, bIdx) => (
                                  <li 
                                    key={bIdx}
                                    className="flex items-start gap-2 text-[17px] md:text-[19px] leading-loose text-gray-800 telugu-text"
                                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                                  >
                                    <span className="w-2 h-2 rounded-full bg-[#e60000] mt-3 flex-shrink-0" />
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>

                    {/* Pagination */}
                    {visibleCount < filteredUpdates.length && (
                      <div className="pt-6 flex justify-center">
                        <button
                          onClick={() => setVisibleCount(prev => prev + 6)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold px-6 py-2.5 rounded-lg border border-gray-200 text-[13px] md:text-sm transition-all telugu-text cursor-pointer active:scale-95 flex items-center gap-2"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        >
                          మరిన్ని లైవ్ అప్‌డేట్స్ లోడ్ చేయండి
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>

          {/* Right Column (30%): Sidebar Ads (Stays visible in both states) */}
          <div className="lg:col-span-3 w-full">
            <RightSidebar />
          </div>

        </div>

      </div>

      {/* Floating Toast Notification overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-blue-950 text-yellow-300 text-xs md:text-sm font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2"
            style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
          >
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 animate-bounce" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
