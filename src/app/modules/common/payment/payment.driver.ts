import { DatabaseService } from '../../globals/database/database.service';
import { DepositEntity } from '../../resources/deposit/entity/deposit.entity';
import { DepositStatus } from '../../../repositories/deposit/deposit-repo.interface';

export abstract class PaymentDriver {
  protected constructor(protected readonly db: DatabaseService) {}

  async depositSuccess(deposit: DepositEntity): Promise<DepositEntity> {
    return this.db.deposit.update({
      where: {
        id: deposit.id,
      },
      data: {
        status: DepositStatus.SUCCESS,
      },
    });
  }

  async depositWaiting(
    deposit: DepositEntity,
    paymentId: string | null = null,
  ): Promise<DepositEntity> {
    return this.db.deposit.update({
      where: {
        id: deposit.id,
      },
      data: {
        status: DepositStatus.WAITING,
        payment_id: paymentId,
      },
    });
  }

  async depositFailed(
    deposit: DepositEntity,
    error: string | null = null,
  ): Promise<DepositEntity> {
    return this.db.deposit.update({
      where: {
        id: deposit.id,
      },
      data: {
        status: DepositStatus.WAITING,
        error: error,
      },
    });
  }
}
