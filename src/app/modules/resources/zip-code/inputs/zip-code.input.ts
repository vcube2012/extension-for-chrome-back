import { InputType, PickType } from '@nestjs/graphql';
import { ZipCodeRepoInterface } from '../../../../repositories/zip-code/zip-code-repo.interface';

@InputType()
export class ZipCodeInput extends PickType(
  ZipCodeRepoInterface,
  ['code'],
  InputType,
) {}
