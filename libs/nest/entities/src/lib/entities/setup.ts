import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Setup {
  @PrimaryGeneratedColumn()
  public id!: number;
}
