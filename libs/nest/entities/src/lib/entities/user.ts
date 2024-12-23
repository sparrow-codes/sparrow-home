import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserRole } from '../enum/user-role';
import { CloudPreferences } from './cloud-preferences';
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

  @OneToOne(() => Setup, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public setup!: Setup;

  @OneToOne(() => CloudPreferences, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public cloudPreferences!: CloudPreferences;
}
