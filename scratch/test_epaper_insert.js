const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const config = {
  host: '13.201.118.106',
  port: 3306,
  user: 'hightv_user',
  password: 'Hightv@2026',
  database: 'hightv_db',
  connectionLimit: 1,
  allowPublicKeyRetrieval: true,
};

const mariadbAdapter = new PrismaMariaDb(config);
const prisma = new PrismaClient({
  adapter: mariadbAdapter,
});

async function main() {
  try {
    const epaper = await prisma.epaper.create({
      data: {
        title: 'test-publish',
        date: '2026-06-28',
        pdfUrl: 'data:application/pdf;base64,JVBERi0xLjQK...',
        section: 'main'
      }
    });
    console.log('Successfully inserted epaper:', epaper);
    
    // clean up
    await prisma.epaper.delete({ where: { id: epaper.id } });
    console.log('Successfully cleaned up.');
  } catch (error) {
    console.error('Error inserting epaper via prisma client:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
