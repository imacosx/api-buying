import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pagos') // El nombre de la tabla
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column('decimal')
  amount: number;

  @Column()
  payment_status: string;

  @Column()
  payment_date: Date;

  @Column()
  payment_method: string;

  @Column()
  token_ws: string;

  @Column()
  number_card: string;

  @Column()
  reponse_code: number;

  @Column()
  installments_amount: number;

  @Column()
  installments_number: number;

  @Column()
  autorization_code: string;
}
