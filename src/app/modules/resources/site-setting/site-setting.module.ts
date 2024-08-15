import { Module } from '@nestjs/common';
import { SiteSettingResolver } from './site-setting.resolver';
import { SiteSettingService } from './site-setting.service';

@Module({
  providers: [SiteSettingResolver, SiteSettingService],
})
export class SiteSettingModule {}
