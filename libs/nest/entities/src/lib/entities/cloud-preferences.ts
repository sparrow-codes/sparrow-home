import { Logger } from '@nestjs/common';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { HomeDevice } from './home-device';

@Entity()
export class CloudPreferences {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ default: false })
  public isEverydayWaterHeatOn!: boolean;

  @Column({ nullable: true })
  public circularPumpStartTime!: Date | null;

  @Column({ nullable: true })
  public circularPumpEndTime!: Date | null;

  @OneToOne(() => HomeDevice, { eager: true, nullable: true })
  @JoinColumn()
  public homeDevice!: HomeDevice | null;

  @Column({ default: false, name: 'isCircularPumpActive' })
  private _isCircularPumpActive!: boolean;

  public set isCircularPumpActive(value: boolean) {
    if (this.circularPumpStartTime && this.circularPumpEndTime && this.homeDevice) {
      this._isCircularPumpActive = value;
    } else {
      Logger.warn('Invalid configuration. Activation is not possible');
    }
  }

  public get isCircularPumpActive(): boolean {
    return this._isCircularPumpActive;
  }
}
