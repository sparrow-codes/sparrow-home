import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { DeviceType } from '../enums/device-type';

@Entity()
export class TuyaDevice {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ unique: true })
  public tuyaDeviceId!: string;

  @Column({ enum: DeviceType })
  public deviceType!: number;

  @Column({ length: 100 })
  public deviceName!: string;
}
