import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransactionPaymentService } from './transaction-payment.service';
import { createTransactionDto } from './dto/create-order.dto';

@Controller('transaction-payment')
export class TransactionPaymentController {
  constructor(private transactionPaymentService: TransactionPaymentService) {}

  @Post('create-transaction')
  async createTransaction(@Body() creatOrderDto: createTransactionDto) {
    return await this.transactionPaymentService.createTrasaction(creatOrderDto);
  }

  @Get('create-orderBuy')
  async createOrderBuy() {
    return await this.transactionPaymentService.createOrderBuy();
  }

  @Get('proccess-payment')
  async processPayment(@Query('token_ws') tokenWs: string) {
    return this.transactionPaymentService.processPayment(tokenWs);
  }

  @Get('find-information-payment')
  async findInformationPayment(@Query('orderBuy') orderBuy: number){
    return this.transactionPaymentService.findInformationPayment(orderBuy);
  }
}
