import { Module } from '@nestjs/common';
import { ZipCodeModule } from './zip-code/zip-code.module';
import { AddressModule } from './address/address.module';
import { UserModule } from './user/user.module';
import { SettingModule } from './setting/setting.module';
import { TagModule } from './tag/tag.module';
import { PackageModule } from './package/package.module';

@Module({
  imports: [
    ZipCodeModule,
    AddressModule,
    UserModule,
    SettingModule,
    TagModule,
    PackageModule,
  ],
})
export class ResourceModule {}
