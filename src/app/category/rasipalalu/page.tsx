import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import HoroscopePageClient from '@/components/astrology/HoroscopePageClient';

export const metadata: Metadata = {
  title: 'Astrology - Horoscope, Daily & Weekly Predictions | High TV',
  description: 'మేషం, వృషభం, మిథునం, కర్కాటకం, సింహం, కన్య, తుల, వృశ్చికం, ధనుస్సు, మకరం, కుంభం, మీనం రాశుల తాజా దిన జాతక ఫలితాలు.',
};

export default function RasipalaluPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />
      <main className="flex-grow">
        <HoroscopePageClient />
      </main>
      <Footer />
    </div>
  );
}
