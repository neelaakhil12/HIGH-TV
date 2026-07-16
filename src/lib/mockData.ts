export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  categorySlug: string;
  categoryColor: string;
  image: string;
  author: string;
  publishedAt: string;
  isBreaking: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  views: number;
  tags: string[];
  videoUrl?: string;
  districtSlug?: string;
}

export const categories = [
  { name: 'హోమ్', slug: 'home', color: '#02599c' },
  { name: 'బ్రేకింగ్ న్యూస్', slug: 'latest', color: '#02599c' },
  { name: 'లైవ్ అప్‌డేట్స్', slug: 'live-updates', color: '#dc2626' },
  { name: 'ఈ-పేపర్', slug: 'epaper', color: '#0f766e' },
  { name: 'పాలిటిక్స్', slug: 'politics', color: '#1a6b3a' },
  { name: 'ఆంధ్రప్రదేశ్', slug: 'andhra-pradesh', color: '#d97706' },
  { name: 'తెలంగాణ', slug: 'telangana', color: '#7c3aed' },
  { name: 'నేషనల్', slug: 'national', color: '#0369a1' },
  { name: 'వరల్డ్', slug: 'international', color: '#0e7490' },
  { name: 'బిజినెస్', slug: 'business', color: '#15803d' },
  { name: 'ఫిల్మ్', slug: 'entertainment', color: '#db2777' },
  { name: 'స్పోర్ట్స్', slug: 'sports', color: '#ea580c' },
  { name: 'టెక్నాలజీ', slug: 'technology', color: '#4f46e5' },
  { name: 'హెల్త్', slug: 'health', color: '#0891b2' },
  { name: 'డాక్టర్స్ కార్నర్', slug: 'doctors-corner', color: '#0891b2' },
  { name: 'వైరల్', slug: 'viral', color: '#dc2626' },
  { name: 'లైఫ్ స్టైల్', slug: 'lifestyle', color: '#9333ea' },
  { name: 'శుభఫలాలు', slug: 'rasipalalu', color: '#b45309' },
  { name: 'ఫోటో గ్యాలరీ', slug: 'photos', color: '#64748b' },
  { name: 'వెబ్ స్టోరీస్', slug: 'webstories', color: '#ec4899' },
  { name: 'ఎడిటోరియల్', slug: 'sampadakiyam', color: '#be123c' },
  { name: 'ఎడిటోరియల్', slug: 'editorial', color: '#be123c' },
  { name: 'వైరల్ స్టోరీస్', slug: 'viral-stories', color: '#dc2626' },
  { name: 'ఆమె', slug: 'women', color: '#ec4899' },
  { name: 'షార్ట్స్', slug: 'shorts', color: '#f43f5e' },
  { name: 'వ్యక్తిత్వ వికాసం', slug: 'antharmadanam', color: '#8b5cf6' },
  { name: 'మా బృందం (Team)', slug: 'team', color: '#4b5563' },
  { name: 'దైవం', slug: 'adyathmikam', color: '#f59e0b' },
  { name: 'దైవం', slug: 'devotional', color: '#f59e0b' },
  { name: 'విద్య', slug: 'vidya', color: '#0284c7' },
  { name: 'అడ్మిషన్స్', slug: 'admissions', color: '#0369a1' },
  { name: 'కరెంట్ అఫైర్స్', slug: 'current-affairs', color: '#0e7490' },
  { name: 'ఉపాధి', slug: 'upadi', color: '#16a34a' },
  { name: 'నోటిఫికేషన్స్', slug: 'notification', color: '#15803d' },
  { name: 'సిటిజన్ రిపోర్టర్', slug: 'citizen-reporter', color: '#cc0000' },
  { name: 'ఉమా ఇన్‌సైట్స', slug: 'uma-insights', color: '#02599c' },
  { name: 'Satya Bytes', slug: 'satya-bytes', color: '#db2777' },
];


export interface District {
  slug: string;
  name: string;
}

export const apDistricts: District[] = [
  { slug: 'alluri-sitharama-raju', name: 'అల్లూరి సీతారామరాజు' },
  { slug: 'anakapalli', name: 'అనకాపల్లి' },
  { slug: 'ananthapuram', name: 'అనంతపురం' },
  { slug: 'bapatla', name: 'బాపట్ల' },
  { slug: 'chittoor', name: 'చిత్తూరు' },
  { slug: 'east-godavari', name: 'తూర్పు గోదావరి' },
  { slug: 'eluru', name: 'ఏలూరు' },
  { slug: 'guntur', name: 'గుంటూరు' },
  { slug: 'kadapa', name: 'కడప' },
  { slug: 'konaseema', name: 'కోనసీమ' },
  { slug: 'krishna', name: 'కృష్ణా' },
  { slug: 'kurnool', name: 'కర్నూలు' },
  { slug: 'manyam', name: 'మన్యం' },
  { slug: 'nandyal', name: 'నంద్యాల' },
  { slug: 'nellore', name: 'నెల్లూరు' },
  { slug: 'ntr', name: 'ఎన్టీఆర్' },
  { slug: 'palnadu', name: 'పల్నాడు' },
  { slug: 'parvathipuram-manyam', name: 'పార్వతీపురం మన్యం' },
  { slug: 'prakasam', name: 'ప్రకాశం' },
  { slug: 'rajahmundry', name: 'రాజమండ్రి' },
  { slug: 'sri-sathya-sai', name: 'శ్రీ సత్యసాయి' },
  { slug: 'srikakulam', name: 'శ్రీకాకుళం' },
  { slug: 'tirupati', name: 'తిరుపతి' },
  { slug: 'visakhapatnam', name: 'విశాఖపట్నం' },
  { slug: 'vizianagaram', name: 'విజయనగరం' },
  { slug: 'west-godavari', name: 'పశ్చిమ గోదావరి' }
];

export const tgDistricts: District[] = [
  { slug: 'adilabad', name: 'ఆదిలాబాద్' },
  { slug: 'bhadradri-kothagudem', name: 'భద్రాద్రి కొత్తగూడెం' },
  { slug: 'hanmakonda', name: 'హన్మకొండ' },
  { slug: 'hyderabad', name: 'హైదరాబాద్' },
  { slug: 'jagtial', name: 'జగిత్యాల' },
  { slug: 'jangaon', name: 'జనగామ' },
  { slug: 'jayashankar-bhupalpally', name: 'జయశంకర్ భూపాలపల్లి' },
  { slug: 'jogulamba-gadwal', name: 'జోగులాంబ గద్వాల' },
  { slug: 'kamareddy', name: 'కామారెడ్డి' },
  { slug: 'karimnagar', name: 'కరీంనగర్' },
  { slug: 'khammam', name: 'ఖమ్మం' },
  { slug: 'kumuram-bheem-asifabad', name: 'కొమురం భీమ్ ఆసిఫాబాద్' },
  { slug: 'mahabubabad', name: 'మహబూబాబాద్' },
  { slug: 'mahabubnagar', name: 'మహబూబ్‌నగర్' },
  { slug: 'mancherial', name: 'మంచిర్యాల' },
  { slug: 'medak', name: 'మెదక్' },
  { slug: 'medchal-malkajgiri', name: 'మేడ్చల్ మల్కాజ్‌గిరి' },
  { slug: 'mulugu', name: 'ములుగు' },
  { slug: 'nagarkurnool', name: 'నాగర్‌కర్నూల్' },
  { slug: 'nalgonda', name: 'నల్గొండ' },
  { slug: 'narayanpet', name: 'నారాయణపేట్' },
  { slug: 'nirmal', name: 'నిర్మల్' },
  { slug: 'nizamabad', name: 'నిజామాబాద్' },
  { slug: 'peddapalli', name: 'పెద్దపల్లి' },
  { slug: 'rajanna-sircilla', name: 'రాజన్న సిరిసిల్ల' },
  { slug: 'rangareddy', name: 'రంగారెడ్డి' },
  { slug: 'sangareddy', name: 'సంగారెడ్డి' },
  { slug: 'siddipet', name: 'సిద్దిపేట' },
  { slug: 'suryapet', name: 'సూర్యాపేట' },
  { slug: 'vikarabad', name: 'వికారాబాద్' },
  { slug: 'wanaparthy', name: 'వనపర్తి' },
  { slug: 'warangal', name: 'వరంగల్' },
  { slug: 'yadadri-bhuvanagiri', name: 'యాదాద్రి భువనగిరి' }
];

export const districtNews: NewsArticle[] = [];

export const breakingNews: string[] = [
  'ఆంధ్రప్రదేశ్‌లో భారీ వర్షాలు - జిల్లాల్లో అలర్ట్ జారీ',
  'హైదరాబాద్‌లో మెట్రో రైలు విస్తరణకు ప్రభుత్వం ఆమోదం',
  'తెలంగాణ బడ్జెట్ సమావేశాలు రేపటి నుంచి ప్రారంభం',
  'భారత క్రికెట్ జట్టు వన్డే సిరీస్‌లో విజయం - 3-0తో గెలుపు',
  'సెన్సెక్స్ 200 పాయింట్లు పెరిగింది - మార్కెట్లో ర్యాలీ',
  'రాజకీయ నాయకుడు సభలో సంచలన వ్యాఖ్యలు',
  'AI రంగంలో భారత్ అగ్రస్థానానికి చేరుకుంటుందని నిపుణుల అంచనా',
];

export const featuredNews: NewsArticle[] = [];

export const politicsNews: NewsArticle[] = [];

export const entertainmentNews: NewsArticle[] = [];

export const sportsNews: NewsArticle[] = [];

export const technologyNews: NewsArticle[] = [];

export const businessNews: NewsArticle[] = [];

export const healthNews: NewsArticle[] = [];

export const viralNews: NewsArticle[] = [];

export const videoNews: NewsArticle[] = [];

export const rasipalaluNews: NewsArticle[] = [];


export const womenNews: NewsArticle[] = [];

export const lifestyleNews: NewsArticle[] = [];

export const webstoriesNews: NewsArticle[] = [];

export const antharmadanamNews: NewsArticle[] = [];

export const adyathmikamNews: NewsArticle[] = [];

export const sampadakiyamNews: NewsArticle[] = [];

export const vidyaNews: NewsArticle[] = [];

export const admissionsNews: NewsArticle[] = [];

export const currentAffairsNews: NewsArticle[] = [];

export const upadiNews: NewsArticle[] = [];

export const notificationNews: NewsArticle[] = [];


export const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=600&h=400&fit=crop', alt: 'రాజకీయ సభ' },
  { id: 2, src: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=800&fit=crop', alt: 'క్రికెట్ మ్యాచ్' },
  { id: 3, src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', alt: 'వరదలు' },
  { id: 4, src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=600&fit=crop', alt: 'హైదరాబాద్ నగరం' },
  { id: 5, src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=400&fit=crop', alt: 'సినిమా వేడుక' },
  { id: 6, src: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=800&fit=crop', alt: 'స్టాక్ మార్కెట్' },
  { id: 7, src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop', alt: 'వంటశాల & ఆహార రుచులు' },
  { id: 8, src: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop', alt: 'నూతన సాంకేతిక ఆవిష్కరణలు' },
  { id: 9, src: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&h=400&fit=crop', alt: 'వ్యవసాయం మరియు పాడి పంటలు' },
  { id: 10, src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop', alt: 'పాఠశాల విద్యా వ్యవస్థ' },
  { id: 11, src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop', alt: 'ప్రకృతి దృశ్యాలు' },
  { id: 12, src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop', alt: 'వైద్య సేవలు - ఆరోగ్యం' },
];


export interface ReporterProfile {
  name: string;
  slug: string;
  role: string;
  bio: string;
  image: string;
}

export const reporterProfiles: Record<string, ReporterProfile> = {
  'suresh': {
    name: 'హై టీవీ రిపోర్టర్ Suresh',
    slug: 'suresh',
    role: 'జాతీయ రాజకీయాల విశ్లేషకులు & ఢిల్లీ బ్యూరో ఇన్-చార్జ్',
    bio: 'సురేష్ గారు జాతీయ రాజకీయాలు, పార్లమెంట్ వ్యవహారాలు మరియు కేంద్ర ప్రభుత్వ విధానాలపై గత 10 సంవత్సరాలుగా నిరంతరం విశ్లేషణాత్మక కథనాలు అందిస్తున్నారు.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop'
  },
  'ramesh': {
    name: 'హై టీవీ రిపోర్టర్ Ramesh',
    slug: 'ramesh',
    role: 'ముఖ్య రాజకీయ ప్రతినిధి',
    bio: 'రమేష్ గారు తెలుగు రాష్ట్రాల రాజకీయాలు, ఎన్నికల విశ్లేషణలు మరియు ప్రజా సమస్యలపై ప్రత్యేక కథనాలకు పేరుగాంచారు.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  'swapna': {
    name: 'హై టీవీ రిపోర్టర్ Swapna',
    slug: 'swapna',
    role: 'సినిమా & ఎంటర్టైన్మెంట్ రిపోర్టర్',
    bio: 'స్వప్న గారు టాలీవుడ్ చిత్ర పరిశ్రమ విశేషాలు, సినీ ప్రముఖుల ఇంటర్వ్యూలు మరియు చిత్ర సమీక్షలను వేగంగా అందిస్తారు.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
  },
  'kiran': {
    name: 'హై టీవీ రిపోర్టర్ Kiran',
    slug: 'kiran',
    role: 'క్రీడా విశ్లేషకులు',
    bio: 'కిరణ్ గారు క్రికెట్, బ్యాడ్మింటన్ మరియు ఒలింపిక్ క్రీడల వార్తలను ఎప్పటికప్పుడు పాఠకులకు విశ్లేషణాత్మకంగా చేరవేస్తారు.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  },
  'dr-sarada': {
    name: 'హై టీవీ ప్రతినిధి Dr. Sarada',
    slug: 'dr-sarada',
    role: 'ఆరోగ్య & జీవనశైలి నిపుణురాలు',
    bio: 'డా. శారద గారు ప్రజా ఆరోగ్యం, వైద్య సలహాలు, ఆహార నియమాలు మరియు యోగా విశిష్టతలపై ఉపయోగకరమైన కథనాలు రాస్తుంటారు.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
  },
  'krishnaprasad': {
    name: 'ఆచార్య Krishnaprasad',
    slug: 'krishnaprasad',
    role: 'ఆధ్యాత్మిక సిద్దాంతి',
    bio: 'కృష్ణప్రసాద్ గారు మన సంస్కృతి, పూజా విధానాలు, వ్రతాలు మరియు హిందూ పండుగల ప్రాముఖ్యతను శాస్త్రీయంగా వివరిస్తారు.',
    image: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=400&h=400&fit=crop'
  },
  'subrahmanyam': {
    name: 'సిద్ధాంతి Subrahmanya Sharma',
    slug: 'subrahmanyam',
    role: 'ప్రముఖ జ్యోతిష్య నిపుణులు',
    bio: 'సుబ్రహ్మణ్య శర్మ గారు జాతక విశ్లేషణ, గ్రహాల గోచారం మరియు రాశిఫలాలపై ఖచ్చితమైన విశ్లేషణలు అందిస్తూ ప్రజల మన్ననలు పొందారు.',
    image: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=400&h=400&fit=crop'
  },
  'default': {
    name: 'హై టీవీ రిపోర్టర్ Suresh',
    slug: 'suresh',
    role: 'స్టాఫ్ రిపోర్టర్',
    bio: 'హై టీవీ వార్తా విభాగం నిరంతరం నిజాయితీతో కూడిన వార్తలను సేకరించి ప్రజల ముందుకు తెస్తుంది.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop'
  }
};

export const authorToReporterSlugMap: Record<string, string> = {
  'ఢిల్లీ బ్యూరో': 'suresh',
  'హై టీవీ బ్యూరో': 'suresh',
  'హై టీవీ రిపోర్టర్': 'suresh',
  'రాజమండ్రి ప్రతినిధి': 'suresh',
  'నెల్లూరు రిపోర్టర్': 'suresh',
  'ఖమ్మం రిపోర్టర్': 'suresh',
  'విలేఖరి': 'suresh',
  'డిజిటల్ విలేఖరి': 'suresh',

  'రాజకీయ విభాగం': 'ramesh',
  'హై టీవీ డెస్క్': 'ramesh',
  'కర్నూలు డెస్క్': 'ramesh',
  'కడప బ్యూరో': 'ramesh',
  'గుంటూరు ప్రతినిధి': 'ramesh',
  'తిరుమల ప్రతినిధి': 'ramesh',
  'హైదరాబాద్ రిపోర్టర్': 'ramesh',
  'వరంగల్ ప్రతినిధి': 'ramesh',
  'నిజామాబాద్ బ్యూరో': 'ramesh',
  'కరీంనగర్ డెస్క్': 'ramesh',
  'సాగర్ ప్రతినిధి': 'ramesh',
  'మహబూబ్‌నగర్ ప్రతినిధి': 'ramesh',
  'ఆదిలాబాద్ బ్యూరో': 'ramesh',
  'ఎడిటోరియల్ డెస్క్': 'ramesh',
  'ప్రధాన సంపాదకుడు': 'ramesh',

  'సినిమా విభాగం': 'swapna',
  'డిజిటల్ విభాగం': 'swapna',
  'మహిళా ప్రతినిధి': 'swapna',
  'తత్వ విశ్లేషణ విభాగం': 'swapna',
  'స్ఫూర్తిదాయక బృందం': 'swapna',

  'క్రీడా విభాగం': 'kiran',
  'వైరల్': 'kiran',
  'వైరల్ విభాగం': 'kiran',
  'వీడియో విభాగం': 'kiran',

  'ఆరోగ్య విభాగం': 'dr-sarada',
  'ఆరోగ్య డెస్క్': 'dr-sarada',
  'లైఫ్ స్టైల్ డెస్క్': 'dr-sarada',
  'ఇంటీరియర్ డిజైనర్ విభాగం': 'dr-sarada',

  'ఆచార్య కృష్ణప్రసాద్': 'krishnaprasad',
  'భక్తి విభాగం': 'krishnaprasad',
  'హై టీవీ భక్తి విభాగం': 'krishnaprasad',
  'ఆచార్య కృష్ణ శాస్త్రి': 'krishnaprasad',

  'సిద్ధాంతి సుబ్రహ్మణ్య శర్మ': 'subrahmanyam',
};

export function formatAuthorName(author: string): string {
  if (!author) return 'హై టీవీ డెస్క్';
  
  const trimmed = author.trim();
  if (trimmed === 'హై టీవీ డెస్క్') return 'హై టీవీ డెస్క్';
  
  if (trimmed.startsWith('హై టీవీ డెస్క్')) {
    const suffix = trimmed.substring('హై టీవీ డెస్క్'.length).replace(/^[\s\-_:]+/, '').trim();
    return suffix ? `హై టీవీ డెస్క్ - ${suffix}` : 'హై టీవీ డెస్క్';
  }
  
  if (trimmed.startsWith('హై టీవీ')) {
    const suffix = trimmed.substring('హై టీవీ'.length).replace(/^[\s\-_:]+/, '').trim();
    return suffix ? `హై టీవీ డెస్క్ - ${suffix}` : 'హై టీవీ డెస్క్';
  }

  return `హై టీవీ డెస్క్ - ${trimmed}`;
}

export function getReporterByAuthor(authorName: string): ReporterProfile {
  const slug = authorToReporterSlugMap[authorName] || 'suresh';
  const profile = { ...(reporterProfiles[slug] || reporterProfiles['default']) };
  const formatted = formatAuthorName(authorName);
  
  if (authorName === 'హై టీవీ డెస్క్' || authorName.includes('హై టీవీ డెస్క్') || slug === 'suresh' || slug === 'ramesh') {
    profile.name = formatted;
  }
  
  return profile;
}

export function formatTimeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${mins} ${ampm}`;
}

export function getMergedArticles(staticArticles: NewsArticle[], categorySlug?: string): NewsArticle[] {
  return staticArticles;
}
