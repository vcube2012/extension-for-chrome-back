import { StripeType } from '../enums/stripe-type.enum';

export interface FindStripeOptions {
  model_id: number;
  model_type: string;
  stripe_type: StripeType;
}
