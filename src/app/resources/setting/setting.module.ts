import { Module } from '@nestjs/common';
import { SettingResolver } from './setting.resolver';
import { SettingService } from './setting.service';

@Module({
  providers: [SettingResolver, SettingService],
})
export class SettingModule {}
