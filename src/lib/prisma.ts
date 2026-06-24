import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

console.log('DB CONFIG IN PRISMA:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  db: process.env.DB_NAME,
});

const globalForPrisma = globalThis as unknown as {
  prismaV2: PrismaClient | undefined;
  mariadbAdapter: PrismaMariaDb | undefined;
};

if (!globalForPrisma.prismaV2) {
  const config = {
    host: process.env.DB_HOST || '13.201.118.106',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'hightv_user',
    password: process.env.DB_PASSWORD || 'Hightv@2026',
    database: process.env.DB_NAME || 'hightv_db',
    connectionLimit: 10,
    allowPublicKeyRetrieval: true,
    connectTimeout: 30000, // 30 seconds connection timeout (bypasses remote MariaDB DNS lookup delay)
    acquireTimeout: 30000, // 30 seconds pool acquire timeout
  };

  globalForPrisma.mariadbAdapter = new PrismaMariaDb(config);
  globalForPrisma.prismaV2 = new PrismaClient({
    adapter: globalForPrisma.mariadbAdapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prismaV2;




