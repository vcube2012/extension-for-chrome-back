import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './modules/common/common.module';
import { GraphqlModule } from './modules/common/graphql/graphql.module';
import configs from './config';
import { ResourceModule } from './modules/resources/resource.module';

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
  ],
})
export class AppModule {}
