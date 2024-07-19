import { ObjectType, OmitType } from '@nestjs/graphql';
import { UserRepoInterface } from '../../../repositories/user/user-repo.interface';

@ObjectType()
export class UserEntity extends OmitType(
  UserRepoInterface,
  ['updated_at'],
  ObjectType,
) {}
