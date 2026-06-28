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

const createPrismaClient = () => {
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
    maxAllowedPacket: 67108864, // 64MB max packet size for large PDF base64 payloads
    socketTimeout: 60000, // 60 seconds socket timeout
  };

  const mariadbAdapter = new PrismaMariaDb(config);
  return new PrismaClient({
    adapter: mariadbAdapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

if (!globalForPrisma.prismaV2 || process.env.NODE_ENV === 'development') {
  globalForPrisma.prismaV2 = createPrismaClient();
}

export const prisma = globalForPrisma.prismaV2;




