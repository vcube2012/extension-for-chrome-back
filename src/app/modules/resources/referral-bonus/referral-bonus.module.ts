import { Module } from '@nestjs/common';
import { ReferralBonusResolver } from './referral-bonus.resolver';
import { ReferralBonusService } from './referral-bonus.service';

@Module({
  providers: [ReferralBonusResolver, ReferralBonusService],
})
export class ReferralBonusModule {}
