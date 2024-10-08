import { Module } from '@nestjs/common';
import { ZipCodeModule } from './zip-code/zip-code.module';
import { AddressModule } from './address/address.module';
import { UserModule } from './user/user.module';
import { SettingModule } from './setting/setting.module';
import { TagModule } from './tag/tag.module';
import { PackageModule } from './package/package.module';
import { StaticPageModule } from './static-page/static-page.module';
import { BlogModule } from './blog/blog.module';
import { FaqModule } from './faq/faq.module';
import { ReviewModule } from './review/review.module';
import { SiteSettingModule } from './site-setting/site-setting.module';
import { ReferralBonusModule } from './referral-bonus/referral-bonus.module';
import { DepositModule } from './deposit/deposit.module';
import { PaymentSystemModule } from './payment-system/payment-system.module';
import { BlockModule } from './block/block.module';
import { MetaTagModule } from './meta-tag/meta-tag.module';

@Module({
  imports: [
    ZipCodeModule,
    AddressModule,
    UserModule,
    SettingModule,
    TagModule,
    PackageModule,
    StaticPageModule,
    BlogModule,
    FaqModule,
    ReviewModule,
    SiteSettingModule,
    ReferralBonusModule,
    DepositModule,
    PaymentSystemModule,
    BlockModule,
    MetaTagModule,
  ],
})
export class ResourceModule {}
