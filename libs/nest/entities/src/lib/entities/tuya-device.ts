import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { TuyaDeviceType } from '../enum/tuya-device-type';


@Entity()
export class TuyaDevice {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ unique: true })
  public tuyaDeviceId!: string;

  @Column({ enum: TuyaDeviceType })
  public deviceType!: number;

  @Column({ length: 100 })
  public deviceName!: string;
}
