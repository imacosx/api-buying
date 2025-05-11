import { IsInt } from 'class-validator';

export class createTransactionDto {
  @IsInt()
  buyOrder: number;

  @IsInt()
  amount: number;
}
