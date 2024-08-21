export class CreateDepositDto {
  payment_system_id: number;
  package_id: number;
  user_id: number;
  type: string;
  amount: number;
  status: string;
}
