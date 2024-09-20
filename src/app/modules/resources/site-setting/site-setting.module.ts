import { Module } from '@nestjs/common';
import { SiteSettingResolver } from './site-setting.resolver';
import { SiteSettingRepoService } from '../../../repositories/site-setting/site-setting-repo.service';

@Module({
  providers: [SiteSettingResolver, SiteSettingRepoService],
  exports: [SiteSettingRepoService],
})
export class SiteSettingModule {}
