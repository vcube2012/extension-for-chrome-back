interface IStripeProductMetadata {
  deposit_id: number;
}

export class StripeProductDto {
  name: string;
  active: boolean = true;
  metadata: IStripeProductMetadata = { deposit_id: null };
}
