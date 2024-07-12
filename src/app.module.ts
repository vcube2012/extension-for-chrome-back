import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { ZipCodeModule } from './app/modules/zip-code/zip-code.module';
import { SettingModule } from './app/modules/setting/setting.module';
import { AddressModule } from './app/modules/address/address.module';
import { UserModule } from './app/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ZipCodeModule,
    SettingModule,
    AddressModule,
    UserModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
