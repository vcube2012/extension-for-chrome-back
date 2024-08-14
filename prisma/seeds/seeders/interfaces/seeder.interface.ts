import { PrismaClient } from '@prisma/client';

export interface SeederInterface {
  run(prisma: PrismaClient): void;
}

export interface SeederInterface2 {
  runs(prisma: PrismaClient): void;
}
