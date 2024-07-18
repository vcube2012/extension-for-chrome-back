import { PrismaClient } from '@prisma/client';
import { seeders } from './seeders';
import { ISeeder } from './seeders/interfaces/ISeeder';
import { ScraperRunner } from '../../src/app/common/scraper/scraper.runner';

const prisma = new PrismaClient();

async function main() {
  await call(seeders);
  await new ScraperRunner().run();
}

async function call(seeders: Array<ISeeder>) {
  for (const seeder of seeders) {
    await seeder.run(prisma);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
