import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SettingModule } from './resources/setting/setting.module';
import { AddressModule } from './resources/address/address.module';
import { UserModule } from './resources/user/user.module';
import { CommonModule } from './common/common.module';
import { GraphqlModule } from './common/graphql/graphql.module';
import { ZipCodeModule } from './resources/zip-code/zip-code.module';
import configs from './config';

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
    SettingModule,
    AddressModule,
    UserModule,
  ],
})
export class AppModule {}
