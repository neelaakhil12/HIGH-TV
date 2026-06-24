import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import * as mockData from '../src/lib/mockData';

async function main() {
  console.log('Seeding database with mock data...');
  
  // Clean existing tables first
  await prisma.article.deleteMany({});
  await prisma.flashNews.deleteMany({});
  await prisma.trendingNews.deleteMany({});
  await prisma.bannerSlide.deleteMany({});
  await prisma.epaper.deleteMany({});
  
  // 1. Gather all mock articles
  const articleLists = [
    { list: mockData.politicsNews, cat: 'politics' },
    { list: mockData.entertainmentNews, cat: 'entertainment' },
    { list: mockData.sportsNews, cat: 'sports' },
    { list: mockData.technologyNews, cat: 'technology' },
    { list: mockData.businessNews, cat: 'business' },
    { list: mockData.healthNews, cat: 'health' },
    { list: mockData.viralNews, cat: 'viral' },
    { list: mockData.featuredNews, cat: 'featured' },
    { list: mockData.rasipalaluNews, cat: 'rasipalalu' },
    { list: mockData.adyathmikamNews, cat: 'adyathmikam' },
    { list: mockData.sampadakiyamNews, cat: 'sampadakiyam' },
    { list: mockData.womenNews, cat: 'women' },
    { list: mockData.lifestyleNews, cat: 'lifestyle' },
    { list: mockData.districtNews, cat: null },
    { list: mockData.vidyaNews, cat: 'vidya' },
    { list: mockData.admissionsNews, cat: 'admissions' },
    { list: mockData.currentAffairsNews, cat: 'current-affairs' },
    { list: mockData.upadiNews, cat: 'upadi' },
    { list: mockData.notificationNews, cat: 'notification' },
    { list: mockData.webstoriesNews, cat: 'webstories' },
    { list: mockData.antharmadanamNews, cat: 'antharmadanam' }
  ];

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const { list, cat } of articleLists) {
    if (!list) continue;
    for (const art of list) {
      const cleanId = art.id.toString();
      const cleanSlug = art.slug;
      
      // Prevent duplicates by ID or Slug
      if (seenIds.has(cleanId) || seenSlugs.has(cleanSlug)) continue;
      seenIds.add(cleanId);
      seenSlugs.add(cleanSlug);

      await prisma.article.create({
        data: {
          id: cleanId,
          title: art.title,
          slug: cleanSlug,
          categorySlug: art.categorySlug || cat || 'politics',
          districtSlug: art.districtSlug || null,
          category: art.category || null,
          author: art.author || 'హై టీవీ డెస్క్',
          publishedAt: new Date(art.publishedAt || Date.now()),
          description: art.description || '',
          body: art.content || '',
          image: art.image || null,
          views: art.views || 0,
          isBreaking: art.isBreaking || false,
          isTrending: art.isTrending || false,
          isFeatured: art.isFeatured || false,
        }
      });
    }
  }

  // 2. Add FlashNews
  const flashNewsDefaults = [
    { text: "ముంబై ఎయిర్‌పోర్ట్‌లో భారీగా బంగారం పట్టివేత", link: "/search?q=బంగారం" },
    { text: "నేడు ఏపీ కేబినెట్‌ కీలక భేటీ.. పలు కీలక నిర్ణయాలు తీసుకునే అవకాశం", link: "/search?q=ఏపీ కేబినెట్‌" },
    { text: "తెలంగాణలో రాబోయే రెండు రోజుల్లో భారీ వర్షాలు కురిసే అవకాశం", link: "/search?q=వర్షాలు" },
    { text: "భారత క్రికెట్ జట్టు సంచలన విజయం.. సిరీస్ సొంతం చేసుకున్న టీమిండియా", link: "/search?q=క్రికెట్" }
  ];
  for (let i = 0; i < flashNewsDefaults.length; i++) {
    await prisma.flashNews.create({
      data: {
        text: flashNewsDefaults[i].text,
        link: flashNewsDefaults[i].link,
        sortOrder: i
      }
    });
  }

  // 3. Add TrendingNews
  const trendingNewsDefaults = [
    { text: "ఎన్నికల ఫలితాలు", link: "/search?q=ఎన్నికల ఫలితాలు" },
    { text: "ఆంధ్రప్రదేశ్‌లో భారీ వర్షాలు", link: "/search?q=వర్షాలు" },
    { text: "హైదరాబాద్ మెట్రో విస్తరణ", link: "/search?q=మెట్రో" },
    { text: "బంగారం ధరలు నేటి అప్‌డేట్స్", link: "/search?q=బంగారం" },
    { text: "టీమిండియా వన్డే సిరీస్ విజయం", link: "/search?q=క్రికెట్" },
    { text: "నేటి రాశిఫలాలు", link: "/search?q=రాశిఫలాలు" },
    { text: "వెబ్ స్టోరీస్ గ్యాలరీ", link: "/category/webstories" }
  ];
  for (let i = 0; i < trendingNewsDefaults.length; i++) {
    await prisma.trendingNews.create({
      data: {
        text: trendingNewsDefaults[i].text,
        link: trendingNewsDefaults[i].link,
        sortOrder: i
      }
    });
  }

  // 4. Add BannerSlides from featuredNews
  const bannerSlidesDefaults = mockData.featuredNews.slice(0, 5).map((item, idx) => ({
    title: item.title,
    image: item.image,
    link: `/news/${item.slug}`,
    sortOrder: idx
  }));
  for (const slide of bannerSlidesDefaults) {
    await prisma.bannerSlide.create({
      data: slide
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
