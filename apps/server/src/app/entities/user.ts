import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserRole } from '../modules/user/enum/user-role';
import { CloudPreferences } from './cloud-preferences';
import { Setup } from './setup';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public password: string;

  @Column()
  public email: string;

  @Column()
  public isPasswordExpired: boolean;

  @Column({ enum: UserRole })
  public role: number;

  @OneToOne(() => Setup, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public setup: Setup;

  @OneToOne(() => CloudPreferences, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public cloudPreferences: CloudPreferences;
}
