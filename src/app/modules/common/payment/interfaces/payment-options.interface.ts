import { DepositEntity } from '../../../resources/deposit/entity/deposit.entity';
import { UserEntity } from '../../../resources/user/entity/user.entity';

export interface PaymentOptions {
  deposit: DepositEntity;
  user: UserEntity;
  trial: boolean;
}
