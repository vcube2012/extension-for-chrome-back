import { Logger, Module } from '@nestjs/common';
import { SeedCommand } from './commands/seed.command';
import { ScrapeCommand } from './commands/scrape.command';

@Module({
  providers: [SeedCommand, ScrapeCommand, Logger],
})
export class ConsoleModule {}
