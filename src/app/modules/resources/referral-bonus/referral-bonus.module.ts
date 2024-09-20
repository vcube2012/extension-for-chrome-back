import { Module } from '@nestjs/common';
import { ReferralBonusResolver } from './referral-bonus.resolver';
import { ReferralBonusService } from './referral-bonus.service';
import { SiteSettingRepoService } from '../../../repositories/site-setting/site-setting-repo.service';

@Module({
  providers: [
    ReferralBonusResolver,
    ReferralBonusService,
    SiteSettingRepoService,
  ],
})
export class ReferralBonusModule {}
