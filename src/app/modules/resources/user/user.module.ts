import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepoService } from '@/src/app/repositories/user/user-repo.service';

@Module({
  providers: [UserResolver, UserService, UserRepoService],
})
export class UserModule {}
