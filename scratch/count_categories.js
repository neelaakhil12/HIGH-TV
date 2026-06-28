require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const config = {
  host: process.env.DB_HOST || '13.201.118.106',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'hightv_user',
  password: process.env.DB_PASSWORD || 'Hightv@2026',
  database: process.env.DB_NAME || 'hightv_db',
  connectionLimit: 10,
  allowPublicKeyRetrieval: true,
};

const adapter = new PrismaMariaDb(config);
const prisma = new PrismaClient({ adapter });

async function main() {
  const counts = await prisma.article.groupBy({
    by: ['categorySlug'],
    _count: {
      _all: true
    }
  });
  console.log('Category Slug Counts:', JSON.stringify(counts, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
