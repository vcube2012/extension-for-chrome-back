import { ISeeder } from './interfaces/ISeeder';
import { UserSeeder } from './user.seeder';
import { PackageSeeder } from './package.seeder';
import { MetropolitanSeeder } from './metropolitan.seeder';
import { StateSeeder } from './state.seeder';
import { CountySeeder } from './county.seeder';
import { ZipCodeSeeder } from './zip-code.seeder';

export const seeders: Array<ISeeder> = [
  new UserSeeder(),
  new PackageSeeder(),
  new MetropolitanSeeder(),
  new StateSeeder(),
  new CountySeeder(),
  new ZipCodeSeeder(),
];
