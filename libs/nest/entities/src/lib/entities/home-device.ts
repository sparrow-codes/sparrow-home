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
  public battery: number | null = null;

  @Column({ nullable: true })
  public signalStrength: number | null = null;

  /**
   * Custom filed only for temperature sensor
   */
  @Column({ nullable: true, type: 'decimal' })
  public temperature: number | null = null;

  /**
   * Custom filed only for open door sensor
   */
  @Column({ nullable: true })
  public isOpen: boolean | null = null;
}
