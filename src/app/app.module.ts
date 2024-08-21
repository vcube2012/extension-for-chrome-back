import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './modules/common/common.module';
import { GraphqlModule } from './modules/common/graphql/graphql.module';
import configs from './config';
import { ResourceModule } from './modules/resources/resource.module';
import { CacheModule } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-yet';

const redisConfig = (configService: ConfigService) => {
  return process.env.APP_ENV === 'local'
    ? {
        store: redisStore,
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
      }
    : {
        store: redisStore,
        url: configService.get<number>('redis.url'),
      };
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
    }),
    CacheModule.register({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...redisConfig(configService),
      }),
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    GraphqlModule,
    ResourceModule,
  ],
})
export class AppModule {}
