import { PrismaClient } from '@prisma/client';
import { SeederInterface } from './interfaces/seeder.interface';

export class UserSeeder implements SeederInterface {
  async run(prisma: PrismaClient) {
    await prisma.user.upsert({
      where: { email: 'emexesemexes@gmail.com' },
      update: {},
      create: {
        email: 'emexesemexes@gmail.com',
        name: 'Emexes Emexes',
      },
    });
  }
}
