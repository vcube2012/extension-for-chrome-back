import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './modules/common/common.module';
import { GraphqlModule } from './modules/common/graphql/graphql.module';
import configs from './config';
import { ResourceModule } from './modules/resources/resource.module';
import { CacheModule } from '@nestjs/cache-manager';
import type { ClientOpts } from 'redis';

const redisStore = require('cache-manager-redis-store').redisStore;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
    }),
    CacheModule.register<ClientOpts>({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      port: Number(process.env.REDIS_PORT ?? 6379),
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    GraphqlModule,
    ResourceModule,
  ],
})
export class AppModule {}
