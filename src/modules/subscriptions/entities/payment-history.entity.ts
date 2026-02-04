import { Pricing } from "src/modules/pricings/entities/pricing.entity";
import { Service } from "src/modules/services/entities/service.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

@Entity('payment_histories')
export class PaymentHistory {
  /**
   * Primary Key
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Added by user
   */
  @Column({
    type: 'bigint',
    nullable: false,
  })
  added_by: string;

  /**
   * User Relation
   */
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by' })
  added_by_user: User;

  /**
   * service ID
   */
  @Column({
    type: 'uuid',
    nullable: false,
  })
  service_id: string;

  /**
   * Service Relation
   */
  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  /**
   * Pricing ID
   */
  @Column({
    type: 'uuid',
    nullable: false,
  })
  pricing_id: string;

  /**
   * Pricing Relation
   */
  @ManyToOne(() => Pricing, { nullable: false })
  @JoinColumn({ name: 'pricing_id' })
  pricing: Pricing;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  subscription_id: string;

  /**
   * Gateway
   */
  @Column({
    type: 'varchar',
    nullable: false,
  })
  gateway: string;

  /**
   * Gateway
   */
  @Column({
    type: 'varchar',
    nullable: true,
  })
  bank_tran_id: string;

  /**
   * Transaction ID
   */
  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  transaction_id: string;

  /**
   * Amount
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  store_amount: number;

  /**
   * Ip Address
   */
  @Column({
    type: 'varchar',
    nullable: false,
  })
  ip_address: string;

  /**
   * Payment status
   */
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  /**
   * Created At
   */
  @CreateDateColumn()
  created_at: Date;
}