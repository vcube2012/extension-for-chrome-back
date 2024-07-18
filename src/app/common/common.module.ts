import { Module } from '@nestjs/common';
import { ScraperModule } from './scraper/scraper.module';
import { DatabaseModule } from './database/database.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [ScraperModule, DatabaseModule, GraphqlModule],
})
export class CommonModule {}
