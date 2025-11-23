import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { DeviceType } from '../enum/device-type';

@Entity()
export class HomeDevice {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ unique: true })
  public zigbeeDeviceId!: string;

  @Column({ enum: DeviceType })
  public deviceType!: number;

  @Column({ length: 100 })
  public deviceName!: string;

  @Column({ nullable: true })
  public mainActionKey: string | null = null;

  @Column({ nullable: true })
  public mainParamKey: string | null = null;

  @Column({ nullable: true })
  public isOnMainPage?: boolean;

  @Column({ nullable: true })
  public lastChanged: Date | null = null;
}
