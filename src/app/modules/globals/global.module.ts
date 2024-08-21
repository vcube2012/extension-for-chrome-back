import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, CacheModule],
})
export class GlobalModule {}
