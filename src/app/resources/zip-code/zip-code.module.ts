import { Module } from '@nestjs/common';
import { ZipCodeService } from './zip-code.service';
import { ZipCodeResolver } from './zip-code.resolver';

@Module({
  providers: [ZipCodeResolver, ZipCodeService],
})
export class ZipCodeModule {}
