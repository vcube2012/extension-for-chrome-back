import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './resources/user/user.module';
import { CommonModule } from './common/common.module';
import { GraphqlModule } from './common/graphql/graphql.module';
import { ZipCodeModule } from './resources/zip-code/zip-code.module';
import configs from './config';
import { SettingModule } from './resources/setting/setting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    GraphqlModule,
    ZipCodeModule,
    UserModule,
    SettingModule,
  ],
})
export class AppModule {}
