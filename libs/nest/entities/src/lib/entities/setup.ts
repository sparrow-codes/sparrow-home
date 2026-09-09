import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Setup {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({default: false})
  public isVacationMode: boolean = false;
}
