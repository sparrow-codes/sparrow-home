import { Logger } from '@nestjs/common';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { HomeDevice } from './home-device';

@Entity()
export class AquaPreferences {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: true })
  public lightStartTime!: Date | null;

  @Column({ nullable: true })
  public lightEndTime!: Date | null;

  @OneToOne(() => HomeDevice, { eager: true, nullable: true })
  @JoinColumn()
  public homeDevice!: HomeDevice | null;

  @Column({ nullable: true, name: 'isActive' })
  private _isActive!: boolean;

  public set isActive(value: boolean) {
    if (this.lightStartTime && this.lightEndTime && this.homeDevice) {
      this._isActive = value;
    } else {
      Logger.warn('Invalid configuration. Activation is not possible');
    }
  }

  public get isActive(): boolean {
    return this._isActive;
  }
}
