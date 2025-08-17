import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { HomeDevice } from './home-device';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'name' })
  public name!: string;

  @Column({ name: 'isActive' })
  public isActive!: boolean;

  @Column({ nullable: true })
  public startTime?: Date;

  @Column({ nullable: true })
  public endTime?: Date;

  @Column({ nullable: true })
  public atSunset?: boolean;

  @OneToMany(() => HomeDevice, (device) => device.task, { cascade: true, eager: true })
  public homeDevices?: HomeDevice[];
}
