const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const fs = require('fs');
const path = require('path');

const config = {
  host: process.env.DB_HOST || '13.201.118.106',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'hightv_user',
  password: process.env.DB_PASSWORD || 'Hightv@2026',
  database: process.env.DB_NAME || 'hightv_db',
  connectionLimit: 5,
};

const mariadbAdapter = new PrismaMariaDb(config);
const prisma = new PrismaClient({ adapter: mariadbAdapter });

async function cleanEverything() {
  console.log('Cleaning database tables...');
  try {
    const deletedArticles = await prisma.article.deleteMany({});
    console.log(`Deleted ${deletedArticles.count} articles.`);

    const deletedSlides = await prisma.bannerSlide.deleteMany({});
    console.log(`Deleted ${deletedSlides.count} banner slides.`);

    const deletedFlash = await prisma.flashNews.deleteMany({});
    console.log(`Deleted ${deletedFlash.count} flash news items.`);

    const deletedTrending = await prisma.trendingNews.deleteMany({});
    console.log(`Deleted ${deletedTrending.count} trending news items.`);

    const deletedEpapers = await prisma.epaper.deleteMany({});
    console.log(`Deleted ${deletedEpapers.count} epaper editions.`);

    console.log('Database cleaned successfully!');

    // Clean uploads directory
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'epapers');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        fs.unlinkSync(path.join(uploadsDir, file));
      }
      console.log(`Cleaned ${files.length} uploaded PDF files from disk.`);
    }
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanEverything();
