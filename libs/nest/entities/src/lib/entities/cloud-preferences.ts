import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CloudPreferences {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ default: false })
  public isEverydayWaterHeatOn!: boolean;
}
