import { Module } from '@nestjs/common';
import { AddressResolver } from './address.resolver';
import { AddressService } from './address.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [AddressResolver, AddressService, UserService],
})
export class AddressModule {}
