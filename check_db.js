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
  const epapers = await prisma.epaper.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log('Epaper entries found:', epapers.length);
  for (const ep of epapers) {
    console.log(`- ID: ${ep.id}\n  Title: ${ep.title}\n  Date: ${ep.date}\n  Section: ${ep.section}\n  pdfUrl: ${ep.pdfUrl}\n`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
