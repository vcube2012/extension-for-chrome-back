import { SeederInterface } from './interfaces/seeder.interface';
import { UserSeeder } from './user.seeder';
import { PackageSeeder } from './package.seeder';

export const seeders: Array<SeederInterface> = [
  new UserSeeder(),
  new PackageSeeder(),
];
