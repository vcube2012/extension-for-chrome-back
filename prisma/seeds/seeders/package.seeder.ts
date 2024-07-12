import { PrismaClient } from '@prisma/client';
import { ISeeder } from '../ISeeder';

export class UserSeeder implements ISeeder {
  run(prisma: PrismaClient) {
    prisma.user.upsert({
      where: { email: 'emexesemexes@gmail.com' },
      update: {},
      create: {
        email: 'emexesemexes@gmail.com',
      },
    });
  }
}
