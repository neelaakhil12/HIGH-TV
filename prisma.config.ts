// Prisma v7 config file
import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { createRequire } from 'module';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
