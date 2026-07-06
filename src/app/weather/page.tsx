import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import WeatherPageClient from '@/components/weather/WeatherPageClient';

export const metadata: Metadata = {
  title: 'వాతావరణ సమాచారం - తెలుగు రాష్ట్రాల వాతావరణ అప్‌డేట్స్ | High TV',
  description: 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ నగరాల తాజా వాతావరణ నివేదికలు, ఉష్ణోగ్రతలు మరియు వర్షపాతం అంచనాలు.',
};

export default async function WeatherPage() {
  let dbArticles: any[] = [];
  try {
    dbArticles = await prisma.article.findMany({
      where: {
        categorySlug: 'weather',
        isDeleted: false,
        isApproved: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 50
    });
  } catch (e) {
    console.error('Error fetching weather articles:', e);
  }

  // Serialize Date objects to avoid SSR hydration serialization warnings
  const serializedArticles = dbArticles.map((art) => ({
    ...art,
    publishedAt: art.publishedAt ? art.publishedAt.toISOString() : null,
    createdAt: art.createdAt ? art.createdAt.toISOString() : null,
    updatedAt: art.updatedAt ? art.updatedAt.toISOString() : null,
  }));

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col">
      <Header />
      <WeatherPageClient dbArticles={serializedArticles} />
      <Footer />
    </div>
  );
}
