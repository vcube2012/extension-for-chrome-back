import { PrismaClient } from '@prisma/client';
import { SeederInterface } from './interfaces/seeder.interface';

const newbie = {
  where: { type: 'newbie' },
  update: {},
  create: {
    type: 'newbie',
    name: 'Newbie',
    requests_limit: 200,
    price: 1900,
    is_active: true,
  },
};

const professional = {
  where: { type: 'professional' },
  update: {},
  create: {
    type: 'professional',
    name: 'Professional',
    requests_limit: 500,
    price: 3900,
    is_active: true,
  },
};

const expert = {
  where: { type: 'expert' },
  update: {},
  create: {
    type: 'expert',
    name: 'Expert',
    requests_limit: 1000,
    price: 6900,
    is_active: true,
  },
};

export class PackageSeeder implements SeederInterface {
  async run(prisma: PrismaClient) {
    await prisma.package.upsert(newbie);
    await prisma.package.upsert(professional);
    await prisma.package.upsert(expert);
  }
}
