import { SeederInterface } from './interfaces/seeder.interface';
import PackageSeeder from './package.seeder';
import StaticPageSeeder from './static-page.seeder';

export const seeders: Array<SeederInterface> = [
  new PackageSeeder(),
  new StaticPageSeeder(),
];
