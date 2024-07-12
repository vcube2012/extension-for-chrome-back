import { PrismaClient } from '@prisma/client';
import { seeders } from './seeders';
import { ISeeder } from './seeders/interfaces/ISeeder';

const prisma = new PrismaClient();

async function main() {
  await call(seeders);
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
