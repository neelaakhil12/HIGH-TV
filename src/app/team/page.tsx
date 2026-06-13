import Header from '@/components/layout/Header';
import BackButton from '@/components/layout/BackButton';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import RightSidebar from '@/components/layout/RightSidebar';
import { reporterProfiles } from '@/lib/mockData';
import { Home, ChevronRight, Users, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'మా టీమ్ - మా వార్తా బృందం | హై టీవీ',
  description: 'హై టీవీ డిజిటల్ నెట్వర్క్ ప్రతినిధులు మరియు సంపాదక బృందం వివరాలు. నిజాయితీతో కూడిన జర్నలిజం అందించే మా ప్రతినిధులు.',
};

export default function TeamPage() {
  // Get all profiles except default
  const profiles = Object.entries(reporterProfiles)
    .filter(([key]) => key !== 'default')
    .map(([_, profile]) => profile);

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col">
      <Header />

      <main className="max-w-[1050px] mx-auto bg-white px-4 py-6 flex-1 shadow-md border-x border-gray-200 w-full">
        <BackButton />
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-3 flex-wrap font-sans">
          <Link href="/" className="hover:text-brand-blue transition-colors flex items-center gap-1 font-bold">
            <Home size={14} /> Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-bold">
            Our Team
          </span>
        </div>

        {/* 2-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
          {/* Left Content (70%) */}
          <div className="w-full lg:col-span-7">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0b2545] to-[#134074] rounded-2xl p-6 md:p-8 mb-8 text-white shadow-md select-none relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-6 translate-y-6">
                <Users size={200} />
              </div>
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-[#ffb3d1] uppercase tracking-wider telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  <Users size={12} /> హై టీవీ బృందం
                </div>
                <h1 
                  className="text-2xl md:text-3.5xl font-black telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  మా వార్తా ప్రతినిధులు
                </h1>
                <p 
                  className="text-gray-200 text-xs md:text-sm max-w-xl leading-relaxed telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  సమాజంలోని నిజాలను నిర్భయంగా వెలుగులోకి తెచ్చే నిష్పక్షపాత విలేకరులు, నిపుణులైన విశ్లేషకులు మరియు సంపాదక బృందం.
                </p>
              </div>
            </div>

            {/* Team Grid */}
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div 
                  key={profile.slug}
                  className="bg-white border border-gray-150 rounded-xl p-5 hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left group"
                >
                  {/* Photo */}
                  <Link href={`/reporter/${profile.slug}`} className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex-shrink-0 relative block img-zoom-container">
                    <img 
                      src={profile.image} 
                      alt={profile.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 space-y-2.5">
                    <div className="space-y-1">
                      <Link href={`/reporter/${profile.slug}`}>
                        <h2 
                          className="text-lg md:text-xl font-black text-gray-900 hover:text-brand-blue transition-colors telugu-text"
                          style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                        >
                          {profile.name}
                        </h2>
                      </Link>
                      <p className="text-xs font-bold text-[#0b2545] uppercase tracking-wider">
                        {profile.role}
                      </p>
                    </div>

                    <p 
                      className="text-gray-600 text-xs md:text-sm leading-relaxed telugu-text line-clamp-2"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      {profile.bio}
                    </p>

                    <Link 
                      href={`/reporter/${profile.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-blue hover:text-[#0b2545] transition-colors group/btn telugu-text"
                      style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                    >
                      వార్తలు చూడండి 
                      <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1 duration-200" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar (30%) */}
          <RightSidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
