import { Logger, Module } from '@nestjs/common';
import { SeedCommand } from './commands/seed.command';

@Module({
  providers: [SeedCommand, Logger],
})
export class ConsoleModule {}
