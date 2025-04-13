import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AlarmPreferences {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ default: false })
  public isActive: boolean = false;
}
