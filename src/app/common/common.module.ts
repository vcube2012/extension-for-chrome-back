import { Module } from '@nestjs/common';
import { ScraperModule } from './scraper/scraper.module';
import { DatabaseModule } from '../globals/database/database.module';
import { GraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ScraperModule, DatabaseModule, GraphqlModule, AuthModule],
})
export class CommonModule {}
