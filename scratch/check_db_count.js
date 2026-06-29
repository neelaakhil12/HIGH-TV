const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCounts() {
  try {
    const newsCount = await prisma.news.count();
    const videoCount = await prisma.video.count();
    const epaperCount = await prisma.ePaper.count();
    console.log(`Current DB Counts: News=${newsCount}, Videos=${videoCount}, EPapers=${epaperCount}`);
    
    const latestVideos = await prisma.video.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
    console.log('Latest Videos:', JSON.stringify(latestVideos, null, 2));
  } catch (err) {
    console.error('Error querying DB:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCounts();
