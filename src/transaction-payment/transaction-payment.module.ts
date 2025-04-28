import { Module } from '@nestjs/common';
import { TransactionPaymentController } from './transaction-payment.controller';
import { TransactionPaymentService } from './transaction-payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from 'src/entities/pagos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago])], // Importa la entidad Pago aquí
  controllers: [TransactionPaymentController],
  providers: [TransactionPaymentService],
})
export class TransactionPaymentModule {}
