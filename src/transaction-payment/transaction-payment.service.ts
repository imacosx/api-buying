import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Pago } from 'src/entities/pagos.entity';
import { Repository } from 'typeorm';
/* import { WebpayTransactionResponse } from './interfaces/response-webpay-transaction.interface'; */

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

  async createTrasaction() {
    const body = {
      buy_order: 'ordenCompra12345678',
      session_id: 'sesion1234557545',
      amount: 10000,
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
      console.log('entraste');
      const paymentStatus = await axios.put(
        `${this.configService.get<string>('URL_TBK')}/rswebpaytransaction/api/webpay/v1.2/transactions/${tokenWs}`,
        config,
      );

      console.log(paymentStatus);
    } catch (error) {
      console.error('Error al realizar el PUT:', error);
    }
  }

  async updateRegisterPayment() {}
}
