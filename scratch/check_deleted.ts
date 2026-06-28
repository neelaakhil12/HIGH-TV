import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

async function main() {
  const config = {
    host: process.env.DB_HOST || '13.201.118.106',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'hightv_user',
    password: process.env.DB_PASSWORD || 'Hightv@2026',
    database: process.env.DB_NAME || 'hightv_db',
    connectionLimit: 10,
    allowPublicKeyRetrieval: true,
    connectTimeout: 30000,
    acquireTimeout: 30000,
  };

  const mariadbAdapter = new PrismaMariaDb(config);
  const prisma = new PrismaClient({
    adapter: mariadbAdapter,
  });

  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
  });

  console.log('Total articles in DB:', articles.length);
  const deleted = articles.filter(a => a.isDeleted);
  const active = articles.filter(a => !a.isDeleted);

  console.log('\n--- ACTIVE ARTICLES in DB (Top 10) ---');
  active.slice(0, 10).forEach(art => {
    console.log(`ID: ${art.id} | Slug: ${art.slug} | Title: ${art.title.substring(0, 50)} | Category: ${art.categorySlug}`);
  });

  console.log('\n--- DELETED ARTICLES in DB ---');
  deleted.forEach(art => {
    console.log(`ID: ${art.id} | Slug: ${art.slug} | Title: ${art.title.substring(0, 50)} | Category: ${art.categorySlug}`);
  });

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
