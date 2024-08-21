import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './modules/common/common.module';
import { GraphqlModule } from './modules/common/graphql/graphql.module';
import configs from './config';
import { ResourceModule } from './modules/resources/resource.module';
import { GlobalModule } from './modules/globals/global.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    GraphqlModule,
    ResourceModule,
    GlobalModule,
  ],
})
export class AppModule {}
