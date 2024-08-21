import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule as BaseCacheModule } from '@nestjs/cache-manager';

const redisConfig = (configService: ConfigService) => {
  return process.env.APP_ENV === 'local'
    ? {
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
      }
    : {
        url: configService.get<string>('redis.url'),
      };
};

@Global()
@Module({
  imports: [
    BaseCacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('redis.host'),
            port: configService.get<number>('redis.port'),
            password: configService.get<string | undefined>('redis.password'),
          },
        }),
      }),
    }),
  ],
})
export class CacheModule {}
