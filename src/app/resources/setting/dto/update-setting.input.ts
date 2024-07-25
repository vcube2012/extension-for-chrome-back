import { InputType, PickType } from '@nestjs/graphql';
import { SettingRepoInterface } from '../../../repositories/setting/setting-repo.interface';

@InputType()
export class UpdateSettingInput extends PickType(
  SettingRepoInterface,
  ['data', 'user_id'],
  InputType,
) {}
