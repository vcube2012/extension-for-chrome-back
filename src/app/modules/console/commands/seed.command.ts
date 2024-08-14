import { Command, CommandRunner } from 'nest-commander';
import * as child_process from 'node:child_process';
import * as fs from 'fs';
import * as path from 'path';
import { loadDefaultClassFromFile } from '../../../../../helpers/helpers';
import { DatabaseService } from '../../globals/database/database.service';

@Command({
  name: 'db:seed',
  description: 'Run database seeder class or classes',
  arguments: '[seeder]',
})
export class SeedCommand extends CommandRunner {
  async run(passedParams: string[], options?: Record<string, any>) {
    const seeder = passedParams[0] ?? null;

    console.log('Seeding database...', '\n');

    try {
      if (!seeder) {
        await this.runAllSeeders();
      } else {
        await this.runSeeder(seeder);
      }
    } catch (error) {
      console.error(error);
      return;
    }

    console.log('\n');
    console.log('Database seeded successfully.');
  }

  private runAllSeeders() {
    child_process.exec('ts-node prisma/seeds/seed.ts');
  }

  private async runSeeder(seeder: string) {
    const rootPath = path.dirname(require.main.path);
    const seedersPath = path.join(rootPath, 'prisma/seeds/seeders');

    const files = fs.readdirSync(seedersPath);
    const filteredFiles = files.filter(
      (file: string) => file.endsWith('.seeder.ts') && file.startsWith(seeder),
    );

    const seederFile = filteredFiles[0] ?? null;

    if (!seederFile) {
      throw new Error('Undefined seeder class: ' + seeder);
    }

    const seederFilePath = path.join(seedersPath, seederFile);
    const loadedClass = await loadDefaultClassFromFile(seederFilePath);
    const seederInstance = new loadedClass();

    if ('run' in seederInstance) {
      await seederInstance.run(new DatabaseService());
    } else {
      throw Error(
        'Seeder class instance must be implement seeder.interface.ts',
      );
    }
  }
}
