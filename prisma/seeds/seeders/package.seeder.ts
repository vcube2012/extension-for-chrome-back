import { PackageType, PrismaClient } from '@prisma/client';
import { SeederInterface } from './interfaces/seeder.interface';

export default class PackageSeeder implements SeederInterface {
  async run(prisma: PrismaClient) {
    await prisma.package.upsert({
      where: {
        type_name: {
          type: PackageType.MONTHLY,
          name: 'Free',
        },
      },
      update: {},
      create: {
        type: PackageType.MONTHLY,
        name: 'Free',
        requests_limit: 100,
        price: 0,
        old_price: 9.99,
        is_active: true,
        advantages: [
          'Chrome Extension',
          'All the Pro Features',
          "Prices Won't Go Up",
          'Priority Support',
        ],
      },
    });

    await prisma.package.upsert({
      where: {
        type_name: {
          type: PackageType.MONTHLY,
          name: 'Professional',
        },
      },
      update: {},
      create: {
        type: PackageType.MONTHLY,
        name: 'Professional',
        requests_limit: 5000,
        price: 99,
        old_price: 165,
        is_active: true,
        is_bestseller: true,
        advantages: [
          'Chrome Extension',
          'All the Pro Features',
          "Prices Won't Go Up",
          'Priority Support',
        ],
      },
    });

    await prisma.package.upsert({
      where: {
        type_name: {
          type: PackageType.MONTHLY,
          name: 'Essential',
        },
      },
      update: {},
      create: {
        type: PackageType.MONTHLY,
        name: 'Essential',
        requests_limit: 1500,
        price: 30,
        old_price: 40,
        is_active: true,
        advantages: [
          'Chrome Extension',
          'All the Pro Features',
          "Prices Won't Go Up",
          'Priority Support',
        ],
      },
    });
  }
}
