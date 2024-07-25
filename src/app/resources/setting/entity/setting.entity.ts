import { ObjectType, OmitType } from '@nestjs/graphql';
import { SettingRepoInterface } from '../../../repositories/setting/setting-repo.interface';

@ObjectType()
export class SettingEntity extends OmitType(
  SettingRepoInterface,
  ['updated_at'],
  ObjectType,
) {}
