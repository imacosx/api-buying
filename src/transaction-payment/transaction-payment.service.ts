import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Pago } from 'src/entities/pagos.entity';
import { Repository } from 'typeorm';
import { WebpayTransactionResponse } from './interfaces/response-webpay-transaction.interface';
import { createTransactionDto } from './dto/create-order.dto';

@Injectable()
export class TransactionPaymentService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Pago)
    private readonly paymentRepository: Repository<Pago>,
  ) {}

  async createOrderBuy() {
    const lastPayment = await this.paymentRepository.find({
      order: { order_id: 'DESC' },
      take: 1, // Limitar a 1 solo resultado
    });

    let lastOrderid = 1; // Valor por defecto si no hay registros

    if (lastPayment.length > 0) {
      lastOrderid = lastPayment[0].order_id + 1; // Aseguramos que sea un string
    }

    const newPaymentGenerated = this.paymentRepository.create({
      order_id: lastOrderid,
      amount: 10000,
    });

    await this.paymentRepository.save(newPaymentGenerated);

    return lastOrderid;
  }

  async createTrasaction(creatOrderDto: createTransactionDto) {
    const body = {
      buy_order: creatOrderDto.buyOrder,
      session_id: 'sesion1234557545',
      amount: creatOrderDto.amount,
      return_url:
        'http://localhost:3000/api/transaction-payment/proccess-payment',
    };

    const config = {
      headers: {
        'Tbk-Api-Key-Id': this.configService.get<number>('TBK_API_KEY'),
        'Tbk-Api-Key-Secret':
          this.configService.get<number>('TBK_API_KEY_SECRET'),
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        `${this.configService.get<number>('URL_TBK')}/rswebpaytransaction/api/webpay/v1.2/transactions`,
        body,
        config,
      );

      if (response.status === 200) {
        const paymentToUpdated = await this.paymentRepository.findOneBy({
          order_id: creatOrderDto.buyOrder,
        });

        paymentToUpdated.token_ws = response.data.token;

        await this.paymentRepository.save(paymentToUpdated);
        return response.data;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  async processPayment(tokenWs: string) {
    const config = {
      headers: {
        'Tbk-Api-Key-Id': process.env.TBK_API_KEY,
        'Tbk-Api-Key-Secret': process.env.TBK_API_KEY_SECRET,
        'Content-Type': 'application/json',
      },
    };

    try {
      const paymentStatus = await axios.put(
        `${this.configService.get<string>('URL_TBK')}/rswebpaytransaction/api/webpay/v1.2/transactions/${tokenWs}`,
        {},
        config,
      );

      const dataPayment: WebpayTransactionResponse = paymentStatus.data;

      if (dataPayment.status === 'AUTHORIZED') {
        const updatedPayment = await this.updateRegisterPayment(
          tokenWs,
          parseInt(dataPayment.buy_order),
          dataPayment,
        );

        if (!updatedPayment) {
          throw new HttpException(
            {
              success: false,
              message:
                'No se pudo actualizar el pago, porfavor intente mas tarde',
              code: 500,
            },
            500,
          );
        }

        return {
          success: true,
          message: 'Pago actualizado correctamente',
          code: 200,
        };
      } else {
        console.log(
          'deberia ir algo para que lo redireccione y envie un mensaje',
        );
      }
    } catch (error) {
      console.error('Error al realizar el PUT:', error);
    }
  }

  async updateRegisterPayment(
    token: string,
    orderBuy: number,
    transactionWebPay: WebpayTransactionResponse,
  ): Promise<boolean> {
    try {
      const paymentToUpdated = await this.paymentRepository.findOneBy({
        token_ws: token,
        order_id: orderBuy,
      });

      if (!paymentToUpdated) {
        throw new NotFoundException(`Payment with token ${token} not found`);
      }

      paymentToUpdated.payment_date = new Date();
      paymentToUpdated.payment_method = transactionWebPay.payment_type_code;
      paymentToUpdated.payment_status = transactionWebPay.status;
      paymentToUpdated.number_card = transactionWebPay.card_detail.card_number;
      paymentToUpdated.reponse_code = transactionWebPay.response_code;
      (paymentToUpdated.autorization_code =
        transactionWebPay.authorization_code),
        (paymentToUpdated.installments_amount =
          transactionWebPay.installments_number);
      paymentToUpdated.installments_number =
        transactionWebPay.installments_number;

      await this.paymentRepository.save(paymentToUpdated);

      return true;
    } catch (error) {
      console.log('having error ', error);
      return false;
    }
  }
}
