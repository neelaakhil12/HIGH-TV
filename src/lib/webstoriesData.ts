export interface StorySlide {
  image: string;
  text: string;
  textStyle: 'red-white' | 'white-black';
}

export interface WebStory {
  id: string;
  title: string;
  coverImage: string;
  coverTitle: string;
  coverStyle: 'red-white' | 'white-black';
  slides: StorySlide[];
}

export const storiesData: WebStory[] = [
  {
    id: 'story-1',
    title: 'ఫ్రిజ్‌లో ఆహారం.. సరిగానే నిల్వ చేస్తున్నారా?',
    coverImage: '/fridge_story.png',
    coverTitle: 'ఫ్రిజ్‌లో ఆహారం.. సరిగానే నిల్వ చేస్తున్నారా?',
    coverStyle: 'red-white',
    slides: [
      {
        image: '/fridge_story.png',
        text: 'ఫ్రిజ్‌లో ఆహారం.. సరిగానే నిల్వ చేస్తున్నారా?',
        textStyle: 'red-white',
      },
      {
        image: '/fridge_story.png',
        text: 'పాలు, పాల పదార్థాలను ఎక్కువ సేపు బయట ఉంచకూడదు',
        textStyle: 'red-white',
      },
      {
        image: '/fridge_story.png',
        text: 'మిగిలిపోయిన ఆహారాన్ని మూత ఉన్న పాత్రల్లోనే భద్రపరచాలి',
        textStyle: 'red-white',
      },
      {
        image: '/fridge_story.png',
        text: 'వారానికి ఒకసారి ఫ్రిజ్‌ను పూర్తిగా శుభ్రం చేయడం అవసరం',
        textStyle: 'red-white',
      },
    ],
  },
  {
    id: 'story-2',
    title: 'బాలకృష్ణ అంటే పాజిటివిటీ.. భోళా శంకరుడు',
    coverImage: '/balayya_story.png',
    coverTitle: 'భోళా బాలయ్య..',
    coverStyle: 'white-black',
    slides: [
      {
        image: '/balayya_story.png',
        text: 'భోళా బాలయ్య.. హృదయపూర్వక పుట్టినరోజు శుభాకాంక్షలు!',
        textStyle: 'white-black',
      },
      {
        image: '/balayya_story.png',
        text: 'నటసింహం కెరీర్‌లో ఎన్నో అద్భుతమైన మైలురాళ్లు',
        textStyle: 'white-black',
      },
      {
        image: '/balayya_story.png',
        text: 'బాక్సాఫీస్ వద్ద రికార్డులను తిరగరాసే సత్తా బాలయ్య సొంతం',
        textStyle: 'white-black',
      },
      {
        image: '/balayya_story.png',
        text: 'అభిమానుల సంక్షేమం కోసం నిత్యం తపించే సహృదయుడు',
        textStyle: 'white-black',
      },
    ],
  },
  {
    id: 'story-3',
    title: 'పిల్లలలో రక్తం తక్కువగా ఉందా.. ఇలా చేయండి!',
    coverImage: '/child_health_story.png',
    coverTitle: 'పిల్లల్లో రక్తం తక్కువగా ఉందా?',
    coverStyle: 'red-white',
    slides: [
      {
        image: '/child_health_story.png',
        text: 'పిల్లల్లో రక్తం తక్కువగా ఉందా? నిర్లక్ష్యం చేయకండి!',
        textStyle: 'red-white',
      },
      {
        image: '/child_health_story.png',
        text: 'రోజువారీ డైట్‌లో దానిమ్మ పండ్లు, ఖర్జూరం చేర్చండి',
        textStyle: 'red-white',
      },
      {
        image: '/child_health_story.png',
        text: 'ఆకుకూరలు ముఖ్యంగా తోటకూర, పాలకూర తినిపించాలి',
        textStyle: 'red-white',
      },
      {
        image: '/child_health_story.png',
        text: 'వైద్యుల సలహా మేరకు ఐరన్ సిరప్ వాడటం మంచిది',
        textStyle: 'red-white',
      },
    ],
  },
  {
    id: 'story-4',
    title: 'ఆరోగ్యకరమైన చర్మం కోసం ఉదయాన్నే తీసుకోవాల్సిన హెల్తీ డ్రింక్స్ ఇవే!',
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=450&fit=crop',
    coverTitle: 'ఆరోగ్యకరమైన చర్మం కోసం..',
    coverStyle: 'white-black',
    slides: [
      {
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=450&fit=crop',
        text: 'ఆరోగ్యకరమైన చర్మం కోసం ఉదయాన్నే తీసుకోవాల్సిన హెల్తీ డ్రింక్స్ ఇవే!',
        textStyle: 'white-black',
      },
      {
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=450&fit=crop',
        text: 'తేనె-నిమ్మకాయ నీరు: ప్రతిరోజూ ఉదయం గోరువెచ్చని నీటిలో తేనె, నిమ్మరసం కలిపి తాగితే చర్మం కాంతివంతంగా మారుతుంది.',
        textStyle: 'white-black',
      },
      {
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=450&fit=crop',
        text: 'గ్రీన్ టీ: ఇందులోని యాంటీ ఆక్సిడెంట్లు చర్మకణాల క్షీణతను అడ్డుకుని ముడతలు పడకుండా కాపాడతాయి.',
        textStyle: 'white-black',
      },
      {
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=450&fit=crop',
        text: 'కలబంద రసం: అలోవెరా జ్యూస్ తాగడం వల్ల టాక్సిన్లు తొలగిపోయి చర్మం మృదువుగా తయారవుతుంది.',
        textStyle: 'white-black',
      },
    ],
  },
  {
    id: 'story-5',
    title: 'బరువు తగ్గాలనుకుంటున్నారా? ఈ సూపర్ ఫుడ్స్ మీ డైట్‌లో చేర్చుకోండి',
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop',
    coverTitle: 'బరువు తగ్గాలనుకుంటున్నారా?',
    coverStyle: 'red-white',
    slides: [
      {
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop',
        text: 'బరువు తగ్గాలనుకుంటున్నారా? ఈ సూపర్ ఫుడ్స్ మీ డైట్‌లో చేర్చుకోండి!',
        textStyle: 'red-white',
      },
      {
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop',
        text: 'ఓట్స్: ఉదయం బ్రేక్‌ఫాస్ట్‌లో ఓట్స్ తీసుకోవడం వల్ల ఎక్కువ సమయం ఆకలి వేయకుండా ఉంటుంది.',
        textStyle: 'red-white',
      },
      {
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop',
        text: 'గుడ్లు: ప్రొటీన్లు அதிகంగా ఉండే గుడ్లను ఉడికించి తీసుకోవడం బరువు తగ్గడానికి చక్కటి మార్గం.',
        textStyle: 'red-white',
      },
      {
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop',
        text: 'రాగులు, నట్స్: ఫైబర్ అధికంగా ఉండే రాగి జావ, బాదం, వాల్‌నట్స్ వంటి నట్స్ మీ డైట్‌లో భాగం చేసుకోండి.',
        textStyle: 'red-white',
      },
    ],
  },
];
