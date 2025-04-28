import { Controller, Get, Post, Query } from '@nestjs/common';
import { TransactionPaymentService } from './transaction-payment.service';

@Controller('transaction-payment')
export class TransactionPaymentController {
  constructor(private transactionPaymentService: TransactionPaymentService) {}

  @Post('create-transaction')
  async createTransaction() {
    return await this.transactionPaymentService.createTrasaction();
  }

  @Get('create-orderBuy')
  async createOrderBuy() {
    return await this.transactionPaymentService.createOrderBuy();
  }

  @Get('proccess-payment')
  async processPayment(@Query('token_ws') tokenWs: string) {
    return this.transactionPaymentService.processPayment(tokenWs);
  }
}
