import { DepositEntity } from '@/src/app/modules/resources/deposit/entity/deposit.entity';
import { UserEntity } from '@/src/app/modules/resources/user/entity/user.entity';

export interface PaymentOptions {
  deposit: DepositEntity;
  user: UserEntity;
}
