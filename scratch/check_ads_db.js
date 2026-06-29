const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const ads = await prisma.article.findMany({
    where: {
      categorySlug: { in: ['sidebar-ad-category', 'sidebar-ad-article', 'sidebar-ad-both'] }
    }
  });
  console.log('ADS IN DB:', JSON.stringify(ads, null, 2));
}

check().catch(console.error);
