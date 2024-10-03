import {
  Field,
  Int,
  ObjectType,
  OmitType,
  registerEnumType,
} from '@nestjs/graphql';
import { SiteSettingRepoInterface } from '../../../../repositories/site-setting/site-setting-repo.interface';

export enum SiteSettingKey {
  VIDEO_MAIN_PAGE = 'video_main_page',
  PARTNER_BONUS = 'partner_bonus',
  SOCIAL_MEDIA = 'social_media',
}

enum SocialMedia {
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
}

registerEnumType(SocialMedia, { name: 'SocialMedia' });

@ObjectType()
export class SocialMediaEntity extends OmitType(
  SiteSettingRepoInterface,
  ['updated_at'],
  ObjectType,
) {
  @Field(() => [SocialMediaItem])
  value: any;
}

@ObjectType()
class SocialMediaItem {
  @Field(() => SocialMedia)
  name: string;

  @Field()
  link: string;
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
