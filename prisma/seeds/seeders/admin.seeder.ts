import { SeederInterface } from './interfaces/seeder.interface';
import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

export default class AdminSeeder implements SeederInterface {
  async run(prisma: PrismaClient) {
    await prisma.admin.deleteMany();

    await prisma.admin.create({
      data: {
        name: 'Admin',
        email: 'tsar@gmail.com',
        password: hashSync('tsar123', 12),
      },
    });
  }
}
