const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');

const config = {
  host: '13.201.118.106',
  port: 3306,
  user: 'hightv_user',
  password: 'Hightv@2026',
  database: 'hightv_db',
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
};

const mariadbAdapter = new PrismaMariaDb(config);
const prisma = new PrismaClient({
  adapter: mariadbAdapter,
});

async function main() {
  try {
    const sections = await prisma.epaperSection.findMany();
    console.log('Current sections in database:', sections);
  } catch (error) {
    console.error('Error querying epaperSection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
