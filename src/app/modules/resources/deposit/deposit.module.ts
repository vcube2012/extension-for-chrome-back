import { Module } from '@nestjs/common';
import { DepositResolver } from './deposit.resolver';
import { DepositService } from './deposit.service';

@Module({
  providers: [DepositResolver, DepositService],
  exports: [DepositService],
})
export class DepositModule {}
