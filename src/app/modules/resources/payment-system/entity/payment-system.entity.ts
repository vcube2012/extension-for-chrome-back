import { ObjectType, OmitType } from '@nestjs/graphql';
import { PaymentSystemRepoInterface } from '../../../../repositories/payment-system/payment-system-repo.interface';

@ObjectType()
export class PaymentSystemEntity extends OmitType(
  PaymentSystemRepoInterface,
  ['updated_at'],
  ObjectType,
) {}
