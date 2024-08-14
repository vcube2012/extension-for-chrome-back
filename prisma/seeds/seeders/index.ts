import { SeederInterface } from './interfaces/seeder.interface';
import PackageSeeder from './package.seeder';

export const seeders: Array<SeederInterface> = [new PackageSeeder()];
