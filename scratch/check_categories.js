const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const config = {
  host: process.env.DB_HOST || '13.201.118.106',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'hightv_user',
  password: process.env.DB_PASSWORD || 'Hightv@2026',
  database: process.env.DB_NAME || 'hightv_db',
  connectionLimit: 1,
};

const adapter = new PrismaMariaDb(config);
const prisma = new PrismaClient({ adapter });

async function main() {
  const res = await prisma.article.findMany({
    where: {
      OR: [
        { title: { contains: 'సీఎం' } },
        { title: { contains: 'విజయ్' } },
        { title: { contains: 'భారతి' } },
      ]
    },
    select: { id: true, title: true, categorySlug: true }
  });
  console.log(JSON.stringify(res, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
