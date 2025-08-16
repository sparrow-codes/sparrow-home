import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserRole } from '../enum/user-role';
import { AlarmPreferences } from './alarm-preferences';
import { CloudPreferences } from './cloud-preferences';
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

  @OneToOne(() => CloudPreferences, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public cloudPreferences!: CloudPreferences;

  @OneToOne(() => AlarmPreferences, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public alarmPreferences!: AlarmPreferences;

  @OneToOne(() => PushSubscriptionClient, { onDelete: 'CASCADE', eager: true, nullable: true })
  @JoinColumn()
  public pushSubscriptionClient: PushSubscriptionClient | null = null;
}
