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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  payment_date: Date;

  @Column()
  payment_method: string;

  @Column()
  token_ws: string;
}
