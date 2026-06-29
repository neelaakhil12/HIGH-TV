'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import RightSidebar from '@/components/layout/RightSidebar';

// Astrological Zodiac Glyphs (SVGs)
export function ZodiacIcon({ id, className = 'w-6 h-6' }: { id: string; className?: string }) {
  switch (id) {
    case 'aries':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21V9a4 4 0 0 0-4-4 4 4 0 0 0-4 4M12 9a4 4 0 0 1 4-4 4 4 0 0 1 4 4" />
        </svg>
      );
    case 'taurus':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="14" r="5" />
          <path d="M6 4a6 6 0 0 1 12 0" />
        </svg>
      );
    case 'gemini':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 4v16M15 4v16M5 4h14M5 20h14" />
        </svg>
      );
    case 'cancer':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="8" r="3" />
          <path d="M10 8h10a4 4 0 0 1 0 8H10" />
          <circle cx="17" cy="16" r="3" />
          <path d="M14 16H4a4 4 0 0 1 0-8h10" />
        </svg>
      );
    case 'leo':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="16" r="3" />
          <path d="M8.5 14c.5-2.5 1.5-5.5 4.5-5.5s4 3.5 6 3.5 3-1.5 3-3" />
        </svg>
      );
    case 'virgo':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4v12a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V4M11 4v12a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V8" />
          <path d="M17 12a3 3 0 0 1 3 3v2c0 1.5-1 2-2 2" />
        </svg>
      );
    case 'libra':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19h14M12 5v10M9 10h6M5 15a7 7 0 0 1 14 0" />
        </svg>
      );
    case 'scorpio':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4v10a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V4M11 4v10a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V8" />
          <path d="M17 14a3 3 0 0 1 3 3v2M22 17l-2 2.5-2-2.5" />
        </svg>
      );
    case 'sagittarius':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19L19 5M14 5h5v5M9 9l-4 4M15 15l-4 4" />
        </svg>
      );
    case 'capricorn':
    case 'makar':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14a3 3 0 0 1 3-3h2M9 11v8M9 11c1-4 4-6 7-3s-1 8-3 8a3 3 0 0 1-3-3" />
          <circle cx="18" cy="17" r="2" />
        </svg>
      );
    case 'aquarius':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8q3-3 6 0t6 0 6 0M4 14q3-3 6 0t6 0 6 0" />
        </svg>
      );
    case 'pisces':
    case 'meen':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16M7 4a12 12 0 0 1 0 16M17 4a12 12 0 0 0 0 16" />
        </svg>
      );
    default:
      return null;
  }
}

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

const DEFAULT_HOROSCOPE_PANCHANGAM = 'శ్రీ పరాభవ నామ సంవత్సరం; ఉత్తరాయణం; గ్రీష్మరుతువు, నిజ జ్యేష్ఠ మాసం, శుక్ల పక్షం ఏకాదశి: రా. 9-15 తదుపరి ద్వాదశి; స్వాతి: సా. 6-18 తదుపరి విశాఖ వర్జ్యం: రా. 12-23 నుంచి 2-07 వరకు; అమృత ఘడియలు: ఉ. 8-54 నుంచి 10-36 వరకు; దుర్ముహూర్తం: ఉ. 9-52 నుంచి 10-44 వరకు; తిరిగి మ. 3-05 నుంచి 3-57 వరకు; రాహుకాలం: మ. 1-30 నుంచి 3-00 వరకు; సూర్యోదయం: ఉ.5.31; సూర్యాస్తమయం: సా.6.34 నిర్జల ఏకాదశి';

const DEFAULT_HOROSCOPE_PREDICTIONS = [
  { id: 'aries',       name: 'మేషం',      englishName: 'Aries',       dateRange: 'మార్చి 21 - ఏప్రిల్ 19',    prediction: 'శుభఫలితాలు కనిపిస్తున్నాయి. ప్రారంభించిన పనులు సాఫీగా పూర్తవుతాయి. మీ నిర్ణయాలు విజయానికి దారి తీస్తాయి. కుటుంబ సభ్యుల సహకారం లభిస్తుంది. గురు ధ్యానం శుభప్రదం.',       weeklyPrediction: 'అనుకూలమైన యోగాలు ఉన్నాయి. ప్రణాళికాబద్ధంగా ముందుకు సాగితే ఆశించిన ఫలితాలు పొందుతారు. ఉద్యోగంలో గుర్తింపు, ప్రోత్సాహం లభిస్తాయి. ఆర్థిక సంబంధ విషయాలు సంతృప్తికరంగా ఉంటాయి. గృహ, వాహన సంబంధ అంశాల్లో శుభ ఫలితాలు కనిపిస్తున్నాయి. వ్యాపారంలో జాగ్రత్తగా వ్యవహరించాలి. కుటుంబ సభ్యుల సహకారం మేలు చేస్తుంది. వారం మధ్యలో ఎదురయ్యే ఒక సమస్యకు తెలివిగా పరిష్కారం కనుగొంటారు.',  color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
  { id: 'taurus',      name: 'వృషభం',     englishName: 'Taurus',      dateRange: 'ఏప్రిల్ 20 - మే 20',        prediction: 'కుటుంబ సభ్యులతో ఆనందంగా గడుపుతారు. నూతన వస్తు ఆభరణాలు కొనుగోలు చేస్తారు. వ్యాపార లావాదేవీలు లాభసాటిగా సాగుతాయి. ఆరోగ్యం పట్ల శ్రద్ధ వహించండి.',         weeklyPrediction: 'ఈ వారం ఆర్థికంగా మంచి సమయం. పొదుపు ప్రణాళికలు ఫలించనున్నాయి. వ్యాపార భాగస్వాములతో సంప్రదింపులు సానుకూలంగా ముగుస్తాయి. ప్రేమ సంబంధాలు మెరుగుపడతాయి. ఆరోగ్యం విషయంలో జాగ్రత్త అవసరం. వారాంతంలో కుటుంబంతో సమయం గడపడం మేలు.',   color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
  { id: 'gemini',      name: 'మిథునం',     englishName: 'Gemini',      dateRange: 'మే 21 - జూన్ 20',           prediction: 'ఆర్థిక పరిస్థితి మెరుగ్గా ఉంటుంది. మిత్రుల సహాయంతో ముఖ్యమైన సమస్యలు పరిష్కరించుకుంటారు. సమాజంలో గౌరవ మర్యాదలు పెరుగుతాయి. ప్రయాణాలు అనుకూలిస్తాయి.',  weeklyPrediction: 'ఈ వారం కొత్త అవకాశాలు వస్తాయి. నూతన పరిచయాలు ఉపయోగకరంగా ఉంటాయి. సృజనాత్మక పనులలో విజయం. ఒత్తిళ్ళకు లోనుకావద్దు. కోపాన్ని నియంత్రించుకోవడం మంచిది. ఉద్యోగ మార్పు ఆలోచిస్తే ఈ వారం అనుకూలం.',                                                                                color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
  { id: 'cancer',      name: 'కర్కాటకం',  englishName: 'Cancer',      dateRange: 'జూన్ 21 - జూలై 22',         prediction: 'పనులలో నిర్లక్ష్యం తగదు. సహోద్యోగులతో వివాదాలకు దూరంగా ఉండండి. ఖర్చులు పెరిగే అవకాశం ఉంది. క్రమశిక్షణతో వ్యవహరిస్తే అనుకూల ఫలితాలు సాధించవచ్చు.',   weeklyPrediction: 'భావోద్వేగాలను అదుపులో ఉంచుకోవడం మంచిది. కుటుంబంలో కొంత ఉద్రిక్తత ఉండవచ్చు. ఓర్పుతో వ్యవహరించడం అవసరం. ఆర్థిక విషయాల్లో జాగ్రత్త వహించండి. ఆరోగ్యం సాధారణంగా ఉంటుంది.',                                                                              color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
  { id: 'leo',         name: 'సింహం',      englishName: 'Leo',         dateRange: 'జూలై 23 - ఆగస్టు 22',       prediction: 'నూతన కార్యకలాపాలకు శ్రీకారం చుడతారు. సమాజంలో ఉన్నత వ్యక్తుల పరిచయాలు ఏర్పడతాయి. ఆదాయ మార్గాలు పెరుగుతాయి. శుభవార్తలు వింటారు.',                    weeklyPrediction: 'ఈ వారం మీకు చాలా అనుకూలం. నాయకత్వ లక్షణాలు బయటపడతాయి. కళా రంగంలో ఉన్నవారికి గుర్తింపు లభిస్తుంది. ప్రేమ జీవితం ప్రకాశవంతంగా ఉంటుంది. ఆర్థికంగా లాభదాయక నిర్ణయాలు తీసుకుంటారు.',                                                        color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
  { id: 'virgo',       name: 'కన్య',       englishName: 'Virgo',       dateRange: 'ఆగస్టు 23 - సెప్టెంబర్ 22', prediction: 'కష్టానికి తగిన ప్రతిఫలం దక్కుతుంది. వృత్తి రంగంలో ఒత్తిడి అధిగమిస్తారు. కుటుంబంలో ప్రశాంతత నెలకొంటుంది. ఆధ్యాత్మిక సేవా కార్యక్రమాల్లో పాల్గొంటారు.',weeklyPrediction: 'విశ్లేషణాత్మక దృష్టితో సమస్యలు పరిష్కరిస్తారు. పని స్థలంలో సహోద్యోగులతో సహకారం మేలు. ఆరోగ్య విషయాల్లో శ్రద్ధ అవసరం. పొదుపు అలవాటు ఈ వారం మరింత ముఖ్యమవుతుంది.',                                                                     color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
  { id: 'libra',       name: 'తుల',        englishName: 'Libra',       dateRange: 'సెప్టెంబర్ 23 - అక్టోబర్ 22',prediction: 'కళా, సాంకేతిక రంగాల వారికి అనుకూల సమయం. వ్యాపార విస్తరణ ప్రయత్నాలు ఫలించవు. ఆర్థిక విషయాల్లో ఆచితూచి అడుగులు వేయడం అవసరం. దైవ దర్శనం చేసుకుంటారు.',weeklyPrediction: 'న్యాయం పక్షాన నిలిచే గుణం మీ పలుకుబడి పెంచుతుంది. సమతుల్యంగా నిర్ణయాలు తీసుకుంటారు. కళాత్మక కార్యకలాపాలలో విజయం. ప్రేమ సంబంధాలు సానుకూలంగా ఉంటాయి.',                                                                            color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
  { id: 'scorpio',     name: 'వృశ్చికం',   englishName: 'Scorpio',     dateRange: 'అక్టోబర్ 23 - నవంబర్ 21',   prediction: 'ఆకస్మిక ధనలాభం సూచిస్తోంది. కోర్టు వ్యవహారాలు మీకు అనుకూలంగా పరిష్కారమవుతాయి. సంతోషకరమైన వార్తలు వింటారు. విందు వినోదాలలో పాల్గొంటారు.',          weeklyPrediction: 'సంకల్ప శక్తి మీకు అనుకూలంగా పనిచేస్తుంది. రహస్య శత్రువులు తమంతట తాముగా బహిర్గతమవుతారు. ఆర్థిక లాభాలు కనిపిస్తున్నాయి. పాత స్నేహితులతో పునర్మిలనం జరగవచ్చు.',                                                                       color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
  { id: 'sagittarius', name: 'ధనుస్సు',    englishName: 'Sagittarius', dateRange: 'నవంబర్ 22 - డిసెంబర్ 21',   prediction: 'చేపట్టిన పనులు సకాలంలో పూర్తవుతాయి. ఉన్నతాధికారుల మద్దతు లభిస్తుంది. బంధువులతో ఏర్పడిన విభేదాలు తొలగిపోతాయి. మానసిక ఉల్లాసం కలుగుతుంది.',          weeklyPrediction: 'ఉత్సాహంగా కొత్త సాహసాలకు పూనుకుంటారు. విద్యా, ఉద్యోగ అవకాశాలు లభిస్తాయి. విదేశీ సంపర్కాలతో కొత్త వ్యాపార అవకాశాలు తెరుచుకుంటాయి. ఆరోగ్యం సంతోషకరంగా ఉంటుంది.',                                                                      color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
  { id: 'makar',       name: 'మకరం',      englishName: 'Makar',       dateRange: 'డిసెంబర్ 22 - జనవరి 19',    prediction: 'ధనవ్యయం అధికంగా ఉంటుంది. శారీరక శ్రమ, అలసట ఎక్కువగా ఉండవచ్చు. వ్యాపారంలో నష్టాలు రాకుండా జాగ్రత్త పడండి. ఎవరికీ హామీలు ఇవ్వవద్దు.',              weeklyPrediction: 'క్రమశిక్షణతో లక్ష్యాలు సాధించుకుంటారు. ఆర్థికంగా జాగ్రత్తగా ఉండటం మంచిది. పెద్దవారి సలహాలు పాటించడం ఉపయుక్తంగా ఉంటుంది. వ్యాపారంలో అనుభవం ఫలించనున్నది.',                                                                            color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
  { id: 'aquarius',    name: 'కుంభం',     englishName: 'Aquarius',    dateRange: 'జనవరి 20 - ఫిబ్రవరి 18',    prediction: 'సమాజంలో పలుకుబడి పెరుగుతుంది. స్థిరాస్తి వివాదాలు పరిష్కారమవుతాయి. ఆశించిన పనులు నెరవేరుతాయి. రుణ బాధల నుండి విముక్తి కలుగుతుంది.',            weeklyPrediction: 'మానవతా విలువలను కాపాడుకుంటారు. సామాజిక సేవా కార్యకలాపాలలో పాల్గొనే అవకాశం. నూతన ఆవిష్కరణలు మీ ఆలోచనలలో రూపుదిద్దుకుంటాయి. స్నేహ సంబంధాలు దృఢపడతాయి.',                                                                         color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
  { id: 'meen',        name: 'మీనం',       englishName: 'Pisces',      dateRange: 'ఫిబ్రవరి 19 - మార్చి 20',   prediction: 'నూతన ఉద్యోగ అవకాశాలు లభిస్తాయి. గతంలో నిలిచిపోయిన పనులు సాఫీగా సాగుతాయి. ఆర్థిక విజయం మీ సొంతమవుతుంది. ఆత్మీయుల నుండి బహుమతులు పొందుతారు.',   weeklyPrediction: 'అంతర్ జ్ఞానం మీకు సరైన నిర్ణయాలు తీసుకునేలా సహాయపడుతుంది. ఆధ్యాత్మిక చింతన పెరుగుతుంది. కళాత్మక ప్రతిభ వ్యక్తమవుతుంది. వ్యక్తిగత సంబంధాలు మెరుగుపడతాయి.',                                                                          color: '#dbeafe', bgClass: 'bg-blue-50 border-blue-200 text-blue-800', pillBgClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe]' },
];

// Parse manual date string to Date object
function parseDateFromStr(dateStr: string): Date {
  if (!dateStr) return new Date();
  // Match DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
  const matchDMY = dateStr.match(/(\d{2})[./-](\d{2})[./-](\d{4})/);
  if (matchDMY) {
    const [_, d, m, y] = matchDMY;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  // Match YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const matchYMD = dateStr.match(/(\d{4})[./-](\d{2})[./-](\d{2})/);
  if (matchYMD) {
    const [_, y, m, d] = matchYMD;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  return new Date();
}

// Compute weekly date range based on a base date (current week Mon-Sun)
function getWeeklyDateRange(baseDate: Date): string {
  const day = baseDate.getDay(); // 0=Sun
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const mon = new Date(baseDate);
  mon.setDate(baseDate.getDate() + diffToMon);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  return `${fmt(mon)} - ${fmt(sun)}`;
}

// Get short date based on a base date
function getTodayDateStr(baseDate: Date): string {
  return `${String(baseDate.getDate()).padStart(2, '0')}-${String(baseDate.getMonth() + 1).padStart(2, '0')}-${baseDate.getFullYear()}`;
}

const DAYS_TE = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];

export default function HoroscopePageClient() {
  const [horoscopeDate, setHoroscopeDate] = useState('');
  const [horoscopeWeeklyRange, setHoroscopeWeeklyRange] = useState('');
  const [horoscopePanchangam, setHoroscopePanchangam] = useState('');
  const [horoscopePredictions, setHoroscopePredictions] = useState<any[]>([]);
  // null = show the "all rashis" grid; string id = show that rashi's detail page
  const [selectedRashiId, setSelectedRashiId] = useState<string | null>(null);
  // Font size multiplier: 1 = base, 1.15 = medium, 1.3 = large
  const [fontScale, setFontScale] = useState<1 | 1.15 | 1.3>(1);

  useEffect(() => {
    const handleResolveHoroscope = (horoscopeData: string | null) => {
      try {
        if (horoscopeData) {
          const parsed = JSON.parse(horoscopeData);
          setHoroscopeDate(parsed.date || '');
          setHoroscopeWeeklyRange(parsed.weeklyRange || '');
          setHoroscopePanchangam(parsed.panchangam || '');
          const loadedPreds = parsed.predictions || [];
          const merged = DEFAULT_HOROSCOPE_PREDICTIONS.map((def) => {
            const matched = loadedPreds.find((p: any) => p.id === def.id);
            return {
              ...def,
              prediction: matched?.prediction ?? def.prediction,
              weeklyPrediction: matched?.weeklyPrediction ?? def.weeklyPrediction,
            };
          });
          setHoroscopePredictions(merged);
        } else {
          const now = new Date();
          setHoroscopeDate(`తేది: ${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}, ${DAYS_TE[now.getDay()]}`);
          setHoroscopeWeeklyRange('');
          setHoroscopePanchangam(DEFAULT_HOROSCOPE_PANCHANGAM);
          setHoroscopePredictions(DEFAULT_HOROSCOPE_PREDICTIONS);
        }
      } catch {
        setHoroscopeDate('');
        setHoroscopeWeeklyRange('');
        setHoroscopePanchangam(DEFAULT_HOROSCOPE_PANCHANGAM);
        setHoroscopePredictions(DEFAULT_HOROSCOPE_PREDICTIONS);
      }
    };

    fetch('/api/settings?key=horoscope_daily_data&t=' + Date.now())
      .then(res => res.ok ? res.json() : {})
      .then((data: any) => {
        const horoscopeVal = data.horoscope_daily_data || null;
        handleResolveHoroscope(horoscopeVal);
      })
      .catch(() => {
        handleResolveHoroscope(null);
      });
  }, []);

  const panchangamItems = splitPanchangam(horoscopePanchangam);

  const selectedRashi = horoscopePredictions.find(r => r.id === selectedRashiId);
  const defaultStyleInfo = DEFAULT_HOROSCOPE_PREDICTIONS.find(d => d.id === selectedRashiId);

  const baseDate = parseDateFromStr(horoscopeDate);
  const todayDateStr = horoscopeDate ? horoscopeDate.replace('తేది:', '').replace('తేదీ:', '').trim() : getTodayDateStr(baseDate);
  const weeklyRange = horoscopeWeeklyRange ? horoscopeWeeklyRange.trim() : getWeeklyDateRange(baseDate);

  // Font scale label
  const fontLabel = fontScale === 1 ? 'Aa' : fontScale === 1.15 ? 'Aa+' : 'AA+';
  const basePredFont = fontScale === 1 ? 'text-[15px] md:text-[17px]' : fontScale === 1.15 ? 'text-[17px] md:text-[19px]' : 'text-[19px] md:text-[21px]';

  return (
    <div className="max-w-[1050px] mx-auto px-4 py-4 md:py-6 select-none">

      {/* Breadcrumbs */}
      <div className="text-xs text-gray-500 font-semibold mb-4 text-left">
        <button type="button" onClick={() => setSelectedRashiId(null)} className="hover:text-[#02599c]">హోమ్</button>
        <span className="mx-2 font-normal text-gray-300">/</span>
        <button type="button" onClick={() => setSelectedRashiId(null)} className="hover:text-[#02599c]">శుభఫలాలు</button>
        {selectedRashi && (
          <>
            <span className="mx-2 font-normal text-gray-300">/</span>
            <span className="text-[#02599c] font-bold" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>{selectedRashi.name}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Page header */}
          <div className="border-b-2 border-red-600 pb-2 text-left">
            <h1 className="text-xl md:text-3xl font-extrabold text-red-600 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              గ్రహం అనుగ్రహం - Rashi Phalalu
            </h1>
          </div>

          {/* ─── RASHI DETAIL VIEW ─── */}
          {selectedRashi ? (
            <div className="space-y-4 animate-fade-in">

              {/* Header bar: icon + rashi name | astrologer */}
              <div
                className="flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm border"
                style={{
                  background: defaultStyleInfo?.color ?? '#cbffc1',
                  borderColor: 'transparent',
                }}
              >
                {/* Left: icon + name */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center shadow-sm text-gray-800">
                    <ZodiacIcon id={selectedRashi.id} className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h2
                    className="text-xl md:text-2xl font-extrabold text-gray-800 telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                  >
                    {selectedRashi.name}
                  </h2>
                </div>


              </div>

              {/* Font size controls + social icons */}
              <div className="flex items-center justify-end gap-2">
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  {([1, 1.15, 1.3] as const).map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => setFontScale(scale)}
                      className={`px-2 py-1 rounded text-xs font-black transition-all ${fontScale === scale ? 'bg-white shadow text-[#02599c]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {scale === 1 ? 'Aa' : scale === 1.15 ? 'Aa+' : 'AA+'}
                    </button>
                  ))}
                </div>
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">FONT SIZE</span>
              </div>

              {/* Prediction card */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden text-left">
                {/* Daily section */}
                <div className="p-5 md:p-6 border-b border-gray-100">
                  <h3
                    className="font-extrabold text-gray-900 mb-3 telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif', fontSize: `${1 * fontScale}rem` }}
                  >
                    ఈరోజు ({todayDateStr})
                  </h3>
                  <p
                    className={`${basePredFont} font-semibold text-gray-800 leading-relaxed telugu-text`}
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: '2' }}
                    dangerouslySetInnerHTML={{ __html: selectedRashi.prediction || 'నేటి రాశి ఫలితాలు అందుబాటులో లేవు.' }}
                  />
                </div>

                {/* Weekly section */}
                <div className="p-5 md:p-6">
                  <h3
                    className="font-extrabold text-gray-900 mb-3 telugu-text"
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif', fontSize: `${1 * fontScale}rem` }}
                  >
                    ఈవారం ({weeklyRange})
                  </h3>
                  <p
                    className={`${basePredFont} font-semibold text-gray-800 leading-relaxed telugu-text`}
                    style={{ fontFamily: 'Noto Sans Telugu, sans-serif', lineHeight: '2' }}
                    dangerouslySetInnerHTML={{ __html: selectedRashi.weeklyPrediction || 'వారం రాశి ఫలితాలు అందుబాటులో లేవు.' }}
                  />
                </div>
              </div>

              {/* "మీ రాశి" quick-nav grid */}
              <div className="space-y-3 text-left pt-2">
                <h2 className="text-lg font-extrabold text-gray-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  మీ రాశి
                </h2>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {horoscopePredictions.map((rashi) => {
                      const style = DEFAULT_HOROSCOPE_PREDICTIONS.find(d => d.id === rashi.id);
                      const isActive = rashi.id === selectedRashiId;
                      return (
                        <button
                          key={rashi.id}
                          type="button"
                          onClick={() => {
                            setSelectedRashiId(rashi.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${style?.pillBgClass ?? 'bg-[#cbffc1]'} ${isActive ? 'ring-2 ring-[#02599c]/50 scale-[1.03]' : 'border-transparent'}`}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-gray-800 transition-all shadow-sm">
                            <ZodiacIcon id={rashi.id} className="w-4 h-4 stroke-[2]" />
                          </div>
                          <span className="text-[14px] md:text-[15px] font-black telugu-text text-gray-800" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                            {rashi.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* ─── ALL RASHIS OVERVIEW ─── */
            <div className="space-y-6 animate-fade-in">

              {/* Panchangam banner */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-5 flex flex-col gap-4 relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="flex items-center gap-4 z-10">
                  <div className="w-[110px] h-[110px] shrink-0 relative flex items-center justify-center bg-black/35 rounded-full border border-indigo-500/20 shadow-inner overflow-hidden">
                    <div className="absolute w-[80%] h-[80%] border border-dashed border-indigo-500/30 rounded-full animate-spin" style={{ animationDuration: '40s' }} />
                    <div className="absolute w-[60%] h-[60%] border border-dashed border-purple-500/20 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
                    <div className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_0_20px_#f59e0b] animate-pulse" />
                    <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '15s' }}>
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 shadow-sm" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {panchangamItems[0] && (
                      <p 
                        className="text-amber-400 font-extrabold text-[14px] md:text-[16px] telugu-text leading-snug" 
                        style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: panchangamItems[0] }}
                      />
                    )}
                    {horoscopeDate && (
                      <span className="bg-rose-600/15 border border-rose-500/30 text-rose-400 text-xs font-black px-3 py-1.5 rounded-xl self-start">
                        {horoscopeDate}
                      </span>
                    )}
                  </div>
                </div>
                {panchangamItems.length > 1 && (
                  <div className="flex flex-wrap gap-1.5 z-10 pt-1 border-t border-white/10">
                    {panchangamItems.slice(1).map((item, idx) => {
                      const plainText = item.replace(/<[^>]*>/g, '');
                      const isTiming = plainText.includes('నుంచి') || plainText.includes('వరకు') || plainText.includes(':') || plainText.includes('ఉ.') || plainText.includes('సా.') || plainText.includes('మ.');
                      return (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] md:text-[12.5px] telugu-text ${isTiming ? 'bg-indigo-950/40 border-indigo-500/20 text-indigo-300' : 'bg-slate-900/60 border-slate-800 text-gray-300'}`}
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Zodiac grid heading */}
              <div className="space-y-3 text-left">
                <h2 className="text-lg md:text-xl font-extrabold text-gray-800 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  మీ రాశి (Choose Your Rashi)
                </h2>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {horoscopePredictions.map((rashi) => {
                      const style = DEFAULT_HOROSCOPE_PREDICTIONS.find(d => d.id === rashi.id);
                      return (
                        <button
                          key={rashi.id}
                          type="button"
                          onClick={() => {
                            setSelectedRashiId(rashi.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border-transparent shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${style?.pillBgClass ?? 'bg-[#cbffc1]'} group`}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center group-hover:bg-white text-gray-800 transition-all shadow-sm">
                            <ZodiacIcon id={rashi.id} className="w-4 h-4 stroke-[2]" />
                          </div>
                          <span className="text-[14px] md:text-[16px] font-black telugu-text text-gray-800" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                            {rashi.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-1">
          <RightSidebar categorySlug="rasipalalu" />
        </div>
      </div>
    </div>
  );
}
