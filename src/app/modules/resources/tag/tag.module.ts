import { Module } from '@nestjs/common';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';
import { AddressService } from '../address/address.service';

@Module({
  providers: [TagResolver, TagService, AddressService],
})
export class TagModule {}
