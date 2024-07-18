import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SettingModule } from './modules/setting/setting.module';
import { AddressModule } from './modules/address/address.module';
import { UserModule } from './modules/user/user.module';
import { CommonModule } from './common/common.module';
import { GraphqlModule } from './common/graphql/graphql.module';
import { ZipCodeModule } from './modules/zip-code/zip-code.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
