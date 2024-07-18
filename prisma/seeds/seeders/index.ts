import { ISeeder } from './interfaces/ISeeder';
import { UserSeeder } from './user.seeder';
import { PackageSeeder } from './package.seeder';

export const seeders: Array<ISeeder> = [new UserSeeder(), new PackageSeeder()];
