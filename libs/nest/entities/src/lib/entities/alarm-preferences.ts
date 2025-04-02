import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AlarmPreferences {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public isActive: boolean = false;
}
