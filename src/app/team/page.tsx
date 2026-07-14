import Header from '@/components/layout/Header';
import BackButton from '@/components/layout/BackButton';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import RightSidebar from '@/components/layout/RightSidebar';
import { reporterProfiles, getReporterByAuthor } from '@/lib/mockData';
import { Home, ChevronRight, Users, ArrowRight, PenTool } from 'lucide-react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Our Team - Editorial & Reporting Staff | High TV',
  description: 'హై టీవీ డిజిటల్ నెట్వర్క్ ప్రతినిధులు మరియు సంపాదక బృందం వివరాలు. నిజాయితీతో కూడిన జర్నలిజం అందించే మా ప్రతినిధులు.',
};

export default async function TeamPage() {
  // Fetch team members, sections and settings from DB
  const [dbMembers, dbSections, dbSettings] = await Promise.all([
    prisma.article.findMany({
      where: { categorySlug: 'team-member', isDeleted: false },
      orderBy: { publishedAt: 'asc' },
    }),
    prisma.article.findMany({
      where: { categorySlug: 'team-section', isDeleted: false },
      orderBy: { publishedAt: 'asc' },
    }),
    prisma.setting.findMany()
  ]);

  const settingsMap = new Map(dbSettings.map(s => [s.key, s.value]));
  const teamBannerBadge = settingsMap.get('team_banner_badge') || 'హై టీవీ బృందం';
  const teamBannerTitle = settingsMap.get('team_banner_title') || 'మా వార్తా ప్రతినిధులు';
  const teamBannerDesc = settingsMap.get('team_banner_desc') || 'సమాజంలోని నిజాలను నిర్భయంగా వెలుగులోకి తెచ్చే నిష్పక్షపాత విలేకరులు, నిపుణులైన విశ్లేషకులు మరియు సంపాదక బృందం.';

  const sections = dbSections.length > 0 
    ? dbSections.map(s => ({ id: s.slug, name: s.title }))
    : [
        { id: 'reporters', name: 'HighTV Reporters' },
        { id: 'desk', name: 'HighTV Desk' }
      ];

  const members = dbMembers.map(m => ({
    slug: m.slug,
    name: m.title,
    role: m.category || '',
    bio: m.description || '',
    image: m.image || '',
    sectionId: m.body || 'reporters',
  }));

  // Fetch database articles to group them by reporter and display "what the news he posted"
  const dbArticles = await prisma.article.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      title: true,
      slug: true,
      author: true,
    },
    orderBy: { publishedAt: 'desc' },
  });

  // Group articles by reporter slug
  const articlesByReporter: Record<string, { title: string; slug: string }[]> = {};
  dbArticles.forEach((art) => {
    const rep = getReporterByAuthor(art.author || '');
    let matchedSlug = rep.slug;

    // Check if the author matches any reporter slug or formatted name
    const foundMember = members.find(m => m.name === art.author || art.author?.includes(m.name));
    if (foundMember) {
      matchedSlug = foundMember.slug;
    }

    if (!articlesByReporter[matchedSlug]) {
      articlesByReporter[matchedSlug] = [];
    }
    articlesByReporter[matchedSlug].push({
      title: art.title,
      slug: art.slug,
    });
  });

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
                  <Users size={12} />  {teamBannerBadge}
                </div>
                <h1 
                  className="text-2xl md:text-3.5xl font-black telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {teamBannerTitle}
                </h1>
                <p 
                  className="text-gray-200 text-xs md:text-sm max-w-xl leading-relaxed telugu-text"
                  style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}
                >
                  {teamBannerDesc}
                </p>
              </div>
            </div>

            {/* Dynamic sections rendering */}
            {sections.map((section) => {
              const sectionMembers = members.filter(m => m.sectionId === section.id);
              if (sectionMembers.length === 0) return null;

              // Check if we should show image (every section shows image except HighTV Desk 'desk')
              const showImage = section.id !== 'desk';

              return (
                <div key={section.id} className="space-y-4 mb-10 text-left">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-150">
                    {showImage ? <PenTool size={18} className="text-[#0b2545]" /> : <Users size={18} className="text-[#0b2545]" />}
                    <h2 className="text-lg font-black text-gray-900 font-sans">
                      {section.name}
                    </h2>
                  </div>

                  {showImage ? (
                    /* Image Layout (Reporters) */
                    <div className="space-y-4">
                      {sectionMembers.map((profile) => (
                        <div 
                          key={profile.slug}
                          id={profile.slug}
                          style={{ scrollMarginTop: '100px' }}
                          className="bg-white border border-gray-150 rounded-xl p-5 hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left group"
                        >
                          <Link href={`/reporter/${profile.slug}`} className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex-shrink-0 relative block img-zoom-container">
                            {profile.image ? (
                              <img src={profile.image} alt={profile.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                                {profile.name.charAt(0)}
                              </div>
                            )}
                          </Link>
                          <div className="flex-1 space-y-2.5">
                            <div className="space-y-1">
                              <Link href={`/reporter/${profile.slug}`}>
                                <h2 className="text-lg md:text-xl font-black text-gray-900 hover:text-brand-blue transition-colors telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>{profile.name}</h2>
                              </Link>
                              <p className="text-xs font-bold text-[#0b2545] uppercase tracking-wider">{profile.role}</p>
                            </div>
                            <p className="text-gray-600 text-xs md:text-sm leading-relaxed telugu-text line-clamp-2" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>{profile.bio}</p>
                            
                            {articlesByReporter[profile.slug]?.length > 0 && (
                              <div className="space-y-1 border-t border-gray-100 pt-2 w-full text-left">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">రాసిన వార్తలు (Latest News):</span>
                                <div className="flex flex-col gap-1">
                                  {articlesByReporter[profile.slug].slice(0, 3).map((art, idx) => (
                                    <Link key={idx} href={`/news/${art.slug}`} className="text-[12px] font-bold text-brand-blue hover:underline line-clamp-1 flex items-center gap-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                      <span className="text-gray-300">•</span> {art.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="pt-1">
                              <Link href={`/reporter/${profile.slug}`} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-blue hover:text-[#0b2545] transition-colors group/btn telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                వార్తలు చూడండి <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1 duration-200" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Boxy No-Image Layout (Desk) */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sectionMembers.map((profile) => (
                        <div 
                          key={profile.slug}
                          id={profile.slug}
                          style={{ scrollMarginTop: '100px' }}
                          className="bg-white border border-gray-150 rounded-xl p-5 hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col justify-between gap-3 text-left group"
                        >
                          <div className="space-y-2.5">
                            <div className="space-y-1">
                              <Link href={`/reporter/${profile.slug}`}>
                                <h3 className="text-base font-black text-gray-900 hover:text-brand-blue transition-colors telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>{profile.name}</h3>
                              </Link>
                              <p className="text-[10px] font-bold text-[#0b2545] uppercase tracking-wider">{profile.role}</p>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed telugu-text line-clamp-2" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>{profile.bio}</p>
                          </div>

                          {articlesByReporter[profile.slug]?.length > 0 ? (
                            <div className="space-y-1.5 border-t border-gray-100 pt-2.5">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">రాసిన వార్తలు (Latest News):</span>
                              <div className="flex flex-col gap-1">
                                {articlesByReporter[profile.slug].slice(0, 3).map((art, idx) => (
                                  <Link key={idx} href={`/news/${art.slug}`} className="text-[11px] font-bold text-brand-blue hover:underline line-clamp-1 flex items-center gap-1 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                    <span className="text-gray-300">•</span> {art.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Link href={`/reporter/${profile.slug}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue hover:text-[#0b2545] transition-colors telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                              వార్తలు చూడండి <ArrowRight size={10} />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {sections.filter(s => members.some(m => m.sectionId === s.id)).length === 0 && (
              <div className="text-center py-12 bg-white border border-gray-150 rounded-2xl shadow-xs">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-bold text-sm telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                  నో బృందం సభ్యులు అందుబాటులో లేరు. (No team members available.)
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar (30%) */}
          <RightSidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
