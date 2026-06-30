import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticlePageClient from '@/components/layout/ArticlePageClient';
import {
  featuredNews,
  politicsNews,
  entertainmentNews,
  sportsNews,
  technologyNews,
  businessNews,
  healthNews,
  viralNews,
  videoNews,
  rasipalaluNews,
  womenNews,
  lifestyleNews,
  webstoriesNews,
  antharmadanamNews,
  adyathmikamNews,
  sampadakiyamNews,
  districtNews,
  getReporterByAuthor,
  vidyaNews,
  admissionsNews,
  currentAffairsNews,
  upadiNews,
  notificationNews
} from '@/lib/mockData';
import type { Metadata } from 'next';

const allNews = [
  ...featuredNews,
  ...politicsNews,
  ...entertainmentNews,
  ...sportsNews,
  ...technologyNews,
  ...businessNews,
  ...healthNews,
  ...viralNews,
  ...videoNews,
  ...rasipalaluNews,
  ...womenNews,
  ...lifestyleNews,
  ...webstoriesNews,
  ...antharmadanamNews,
  ...adyathmikamNews,
  ...sampadakiyamNews,
  ...districtNews,
  ...vidyaNews,
  ...admissionsNews,
  ...currentAffairsNews,
  ...upadiNews,
  ...notificationNews
];

const englishCategories: Record<string, string> = {
  'latest': 'Breaking News',
  'telangana': 'Telangana',
  'andhra-pradesh': 'Andhra Pradesh',
  'national': 'National',
  'international': 'International',
  'business': 'Business',
  'politics': 'పాలిటిక్స్',
  'sports': 'Sports',
  'entertainment': 'Entertainment',
  'technology': 'Technology',
  'health': 'Health',
  'doctors-corner': "Doctor's Corner",
  'viral': 'Viral',
  'rasipalalu': 'Shubhafalalu',
  'photos': 'Photos',
  'shorts': 'Shorts',
  'webstories': 'Web Stories',
  'antharmadanam': 'Vyakthithva Vikasam',
  'adyathmikam': 'Daivam',
  'sampadakiyam': 'Editorial',
  'women': 'Aamey',
  'lifestyle': 'Lifestyle',
  'epaper': 'E-Paper',
  'vidya': 'Vidya',
  'admissions': 'Admissions',
  'current-affairs': 'Current Affairs',
  'upadi': 'Upadi',
  'notification': 'Notification',
  'citizen-reporter': 'Citizen Reporter',
  'weather': 'Weather'
};

import { prisma } from '@/lib/prisma';

export async function generateStaticParams() {
  return allNews.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  let article = await prisma.article.findFirst({
    where: { slug: decodedSlug }
  });

  if (article && article.isDeleted) {
    article = null;
  }

  if (!article) {
    // Check if this static article has been deleted in the database
    const isStaticDeleted = await prisma.article.findFirst({
      where: { slug: decodedSlug, isDeleted: true }
    });
    if (!isStaticDeleted) {
      article = allNews.find((n) => n.slug === decodedSlug) as any;
    }
  }

  const imageUrl = article?.image 
    ? (article.image.startsWith('http') ? article.image : `https://hightv.in${article.image}`)
    : 'https://hightv.in/logo.png';

  const cleanTitle = article?.title ? article.title.replace(/<[^>]*>/g, '') : 'వార్త | హై టీవీ';
  const cleanDesc = article?.description ? article.description.replace(/<[^>]*>/g, '') : '';

  return {
    title: `${cleanTitle} | హై టీవీ`,
    description: cleanDesc || undefined,
    openGraph: {
      title: `${cleanTitle} | హై టీవీ`,
      description: cleanDesc || undefined,
      url: `https://hightv.in/news/${slug}`,
      siteName: 'హై టీవీ',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: cleanTitle,
        }
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cleanTitle} | హై టీవీ`,
      description: cleanDesc || undefined,
      images: [imageUrl],
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Check if article is deleted in DB
  const dbArticle = await prisma.article.findFirst({
    where: { slug: decodedSlug }
  });

  const isStaticDeleted = !dbArticle && await prisma.article.findFirst({
    where: { slug: decodedSlug, isDeleted: true }
  });

  if ((dbArticle && dbArticle.isDeleted) || isStaticDeleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 max-w-[1050px] mx-auto bg-white px-4 py-16 flex items-center justify-center border-x border-gray-200 w-full text-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-3 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              వార్త అందుబాటులో లేదు
            </h1>
            <p className="text-slate-500 mb-6 telugu-text" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              ఈ వార్తా కథనం తొలగించబడింది లేదా అందుబాటులో లేదు.
            </p>
            <Link href="/" className="bg-[#02599c] hover:bg-[#013f70] text-white font-bold py-2.5 px-6 rounded-lg transition-colors telugu-text cursor-pointer" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
              హోమ్ పేజీకి వెళ్ళండి
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 1. Fetch latest articles from the live database
  let dbArticles: any[] = [];
  let deletedArticles: any[] = [];
  try {
    [dbArticles, deletedArticles] = await Promise.all([
      prisma.article.findMany({
        where: { isDeleted: false },
        orderBy: { publishedAt: 'desc' },
        take: 100,
        select: {
          id: true,
          title: true,
          slug: true,
          categorySlug: true,
          districtSlug: true,
          category: true,
          author: true,
          publishedAt: true,
          description: true,
          image: true,
          views: true,
          isBreaking: true,
          isTrending: true,
          isFeatured: true,
          body: true
        }
      }),
      prisma.article.findMany({
        where: { isDeleted: true },
        select: { id: true, slug: true }
      })
    ]);
  } catch (e) {
    console.error('Error fetching articles for page:', e);
  }

  const deletedIds = new Set(deletedArticles.map(a => a.id));
  const deletedSlugs = new Set(deletedArticles.map(a => a.slug));

  // 2. Map database articles and combine with static mock articles
  const mappedDbArticles = dbArticles.map((art) => ({
    ...art,
    body: art.body || '',
    content: art.body || '',
    publishedAt: art.publishedAt instanceof Date ? art.publishedAt.toISOString() : art.publishedAt,
    updatedAt: art.updatedAt instanceof Date ? art.updatedAt.toISOString() : art.updatedAt,
  }));

  const filteredAllNews = allNews.filter(art => !deletedIds.has(art.id) && !deletedSlugs.has(art.slug));
  const combinedNews = [...mappedDbArticles, ...filteredAllNews];
  const seenSlugs = new Set<string>();
  const allArticles = combinedNews.filter((n) => {
    if (seenSlugs.has(n.slug)) return false;
    seenSlugs.add(n.slug);
    return true;
  });

  const article = allArticles.find((n) => n.slug === decodedSlug) || allArticles[0];

  // Find the reporter profile dynamically from the DB first (or fall back to mockData)
  let reporter: any = null;
  if (article && article.author) {
    const dbMembers = await prisma.article.findMany({
      where: { categorySlug: 'team-member', isDeleted: false }
    });
    const dbReporterMember = dbMembers.find(m => 
      article.author === m.title || 
      article.author.toLowerCase().includes(m.title.toLowerCase())
    );

    if (dbReporterMember) {
      let sectionTitle = 'హై టీవీ డెస్క్';
      if (dbReporterMember.body && dbReporterMember.body !== 'desk') {
        const dbSection = await prisma.article.findFirst({
          where: {
            categorySlug: 'team-section',
            slug: dbReporterMember.body,
            isDeleted: false
          }
        });
        if (dbSection) {
          sectionTitle = dbSection.title;
        }
      }

      reporter = {
        name: `${sectionTitle} - ${dbReporterMember.title}`,
        slug: dbReporterMember.slug,
        role: dbReporterMember.category || '',
        bio: dbReporterMember.description || '',
        image: dbReporterMember.image || ''
      };
    }
  }

  if (!reporter && article) {
    reporter = getReporterByAuthor(article.author);
  }

  // Trending for in-text promo links — filtered by article's category first, fall back to all
  const categoryArticles = allArticles.filter(
    (n) => n.id !== article.id && n.categorySlug === article.categorySlug
  );
  const trendingNews = (
    categoryArticles.length >= 3
      ? categoryArticles.sort((a, b) => (b.views || 0) - (a.views || 0))
      : allArticles.filter((n) => n.id !== article.id).sort((a, b) => (b.views || 0) - (a.views || 0))
  ).slice(0, 8);

  // Latest news for sidebar — category-filtered first, fall back to all
  const latestNews = (
    categoryArticles.length >= 3
      ? categoryArticles
      : allArticles.filter((n) => n.id !== article.id)
  ).slice(0, 8);

  // Other news for bottom grid (excluding current) — category-filtered first, fall back to all
  const otherNews = (
    categoryArticles.length > 0
      ? categoryArticles
      : allArticles.filter((n) => n.id !== article.id)
  ).slice(0, 9);

  // District news
  const apDistrictNews = allArticles.filter((n) => n.categorySlug === 'andhra-pradesh' && n.districtSlug).slice(0, 5);
  const tgDistrictNews = allArticles.filter((n) => n.categorySlug === 'telangana' && n.districtSlug).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">

      <Header />

      <Suspense fallback={null}>
        <ArticlePageClient
          article={article}
          reporter={reporter}
          trendingNews={trendingNews}
          latestNews={latestNews}
          apDistrictNews={apDistrictNews}
          tgDistrictNews={tgDistrictNews}
          otherNews={otherNews}
          englishCategories={englishCategories}
        />
      </Suspense>

      <Footer />
    </div>
  );
}
