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

  @Column({ default: false })
  public isHeatOn: boolean = false;

  @Column({ nullable: true })
  public groundFlorTemperatureSensorZigbeeId: string | null = null;

  @Column({ nullable: true })
  public firstFlorTemperatureSensorZigbeeId: string | null = null;

  @Column({ nullable: true, type: 'decimal' })
  public minTargetTemperature: number | null = null;

  @Column({ nullable: true, type: 'decimal' })
  public maxTargetTemperature: number | null = null;

  @OneToOne(() => HomeDevice, { eager: true, nullable: true })
  @JoinColumn()
  public homeDevice!: HomeDevice | null;

  @Column({ default: false, name: 'isCircularPumpActive' })
  private _isCircularPumpActive!: boolean;

  @Column({ default: false, name: 'isAutomaticHeat' })
  public _isAutomaticHeat: boolean = false;

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

  public set isAutomaticHeat(value: boolean) {
    if (
      (!this.firstFlorTemperatureSensorZigbeeId && !this.groundFlorTemperatureSensorZigbeeId!) ||
      this.maxTargetTemperature === null ||
      this.minTargetTemperature === null
    ) {
      Logger.warn('Invalid configuration. Activation of automatic heating is not possible');
      return;
    }

    this._isAutomaticHeat = value;
  }

  public get isAutomaticHeat(): boolean {
    return this._isAutomaticHeat;
  }
}
