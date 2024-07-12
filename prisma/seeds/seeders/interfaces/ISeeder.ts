import { PrismaClient } from '@prisma/client';

export interface ISeeder {
  run(prisma: PrismaClient): void;
}
