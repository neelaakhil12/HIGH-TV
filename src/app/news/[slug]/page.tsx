import { Suspense } from 'react';
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
  'videos': 'Videos',
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
  'citizen-reporter': 'Citizen Reporter'
};

export async function generateStaticParams() {
  return allNews.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = allNews.find((n) => n.slug === slug);
  return {
    title: article ? `${article.title} | హై టీవీ` : 'వార్త | హై టీవీ',
    description: article?.description,
    openGraph: {
      title: article?.title,
      description: article?.description,
      images: article?.image ? [article.image] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = allNews.find((n) => n.slug === slug) || allNews[0];
  const reporter = getReporterByAuthor(article.author);

  // Other news for bottom grid (excluding current)
  const otherNews = allNews
    .filter((n) => n.id !== article.id)
    .slice(0, 9);

  // Trending for in-text promo links
  const trendingNews = allNews
    .filter((n) => n.id !== article.id)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 8);

  // Latest news for sidebar
  const latestNews = allNews
    .filter((n) => n.id !== article.id)
    .slice(0, 8);

  // District news
  const apDistrictNews = districtNews.filter((n) => n.categorySlug === 'andhra-pradesh').slice(0, 5);
  const tgDistrictNews = districtNews.filter((n) => n.categorySlug === 'telangana').slice(0, 5);

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
