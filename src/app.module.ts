import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionPaymentModule } from './transaction-payment/transaction-payment.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pagos.entity';

@Module({
  imports: [
    TransactionPaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', // Tipo de base de datos
      host: process.env.DB_HOST, // Dirección del servidor de base de datos
      port: parseInt(process.env.DB_PORT), // Puerto por defecto de MySQL
      username: process.env.DB_USER, // Nombre de usuario para MySQL
      password: process.env.DB_PASS, // Contraseña para MySQL
      database: process.env.DB_NAME, // Nombre de la base de datos
      entities: [Pago], // Aquí se agregarán las entidades de TypeORM
      synchronize: false, // Esto hace que TypeORM sincronice las entidades con la base de datos automáticamente (usualmente no se recomienda en producción)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
