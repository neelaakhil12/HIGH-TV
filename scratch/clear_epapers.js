const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing Epaper table...');
  const result = await prisma.epaper.deleteMany({});
  console.log(`Deleted ${result.count} epapers from the database.`);
}

main()
  .catch(err => {
    console.error('Error clearing epapers:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
