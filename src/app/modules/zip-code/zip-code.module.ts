import { Module } from '@nestjs/common';
import { ZipCodeService } from './zip-code.service';
import { ZipCodeController } from './zip-code.controller';

@Module({
  controllers: [ZipCodeController],
  providers: [ZipCodeService],
})
export class ZipCodeModule {}
