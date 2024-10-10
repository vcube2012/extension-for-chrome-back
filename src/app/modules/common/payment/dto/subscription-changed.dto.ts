import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum SubscriptionChangedType {
  UNSUBSCRIBE = 'unsubscribe',
  UPDATE = 'update',
  ACTIVATED = 'activated',
}

export class SubscriptionChangedDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(SubscriptionChangedType)
  type: string;
}
