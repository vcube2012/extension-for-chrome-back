import { PrismaClient } from '@prisma/client';

export interface SeederInterface {
  run(prisma: PrismaClient): void;
}
