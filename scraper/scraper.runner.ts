import { seeders } from '../prisma/seeds/seeders';

async function main() {
  await call(seeders);
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
