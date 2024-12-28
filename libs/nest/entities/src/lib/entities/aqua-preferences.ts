import { Logger } from '@nestjs/common';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TuyaDevice } from './tuya-device';

@Entity()
export class AquaPreferences {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: true })
  public lightStartTime?: Date;

  @Column({ nullable: true })
  public lightEndTime?: Date;

  @OneToOne(() => TuyaDevice, { eager: true, nullable: true })
  @JoinColumn()
  public tuyaDevice?: TuyaDevice;

  @Column({ nullable: true })
  private _isActive!: boolean;

  public set isActive(value: boolean) {
    if (this.lightStartTime && this.lightEndTime && this.tuyaDevice) {
      this._isActive = value;
    } else {
      Logger.warn('Invalid configuration. Activation is not possible');
    }
  }

  public get isActive(): boolean {
    return this._isActive;
  }
}
