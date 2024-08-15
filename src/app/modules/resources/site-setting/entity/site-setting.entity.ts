import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { SiteSettingRepoInterface } from '../../../../repositories/site-setting/site-setting-repo.interface';

export enum SiteSettingKey {
  VIDEO_MAIN_PAGE = 'video_main_page',
  PARTNER_BONUS = 'partner_bonus',
}

@ObjectType()
export class VideoMainPageEntity extends OmitType(
  SiteSettingRepoInterface,
  ['updated_at'],
  ObjectType,
) {
  @Field(() => String)
  value: any;
}

@ObjectType()
export class PartnerBonusEntity extends OmitType(
  SiteSettingRepoInterface,
  ['updated_at'],
  ObjectType,
) {
  @Field(() => Int)
  value: any;
}
