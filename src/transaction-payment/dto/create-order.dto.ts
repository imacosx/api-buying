import { IsEmail, IsInt, IsString } from 'class-validator';

export class createTransactionDto {
  @IsInt()
  buyOrder: number;

  @IsInt()
  amount: number;
  
  @IsString()
  details: string;

  @IsInt()
  invoiceNumber: number;

  @IsEmail()
  email: string;
}
