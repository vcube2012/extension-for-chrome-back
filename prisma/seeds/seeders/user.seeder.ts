import { PrismaClient } from '@prisma/client';
import { ISeeder } from '../ISeeder';

export class UserSeeder implements ISeeder {
  async run(prisma: PrismaClient) {
    await prisma.user.upsert({
      where: { email: 'emexesemexes@gmail.com' },
      update: {},
      create: {
        email: 'emexesemexes@gmail.com',
      },
    });
  }
}
