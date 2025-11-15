import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserRole } from '../enum/user-role';
import { PushSubscriptionClient } from './push-subscription-client';
import { Setup } from './setup';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public firstName!: string;

  @Column({ nullable: true })
  public lastName?: string;

  @Column()
  public password!: string;

  @Column()
  public email!: string;

  @Column({ enum: UserRole })
  public userRole!: number;

  @Column()
  public isActive: boolean = false;

  @OneToOne(() => Setup, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public setup!: Setup;

  @OneToOne(() => PushSubscriptionClient, { onDelete: 'CASCADE', eager: true, nullable: true })
  @JoinColumn()
  public pushSubscriptionClient: PushSubscriptionClient | null = null;
}
