import { MetropolitanSeeder } from '../prisma/seeds/seeders/metropolitan.seeder';
import { PrismaClient } from '@prisma/client';
import { StateSeeder } from '../prisma/seeds/seeders/state.seeder';
import { CountySeeder } from '../prisma/seeds/seeders/county.seeder';
import { ZipCodeSeeder } from '../prisma/seeds/seeders/zip-code.seeder';

const prisma = new PrismaClient();

(async () => {
  await new MetropolitanSeeder().run(prisma);
  await new StateSeeder().run(prisma);
  await new CountySeeder().run(prisma);
  await new ZipCodeSeeder().run(prisma);
})();
