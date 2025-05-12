import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pagos') // El nombre de la tabla
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column('decimal')
  amount: number;

  @Column({ default: 'PENDING' })
  payment_status: string;

  @Column({ type: 'datetime', nullable: true })
  payment_date: Date;

  @Column({nullable: true })
  payment_method: string;

  @Column({nullable: true })
  token_ws: string;

  @Column({nullable: true })
  number_card: string;

  @Column({nullable: true })
  reponse_code: number;

  @Column({nullable: true })
  installments_amount: number;

  @Column({nullable: true })
  installments_number: number;

  @Column({nullable: true })
  autorization_code: string;

  @Column({nullable: true })
  transaction_details: string;

  @Column({nullable: true})
  details_purchase: string;

  @Column({nullable: true})
  invoice_number: number;

  @Column({nullable: true})
  email: string;

}
