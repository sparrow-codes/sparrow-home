import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Setup {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true, type: 'decimal' })
  public lat?: number;

  @Column({ nullable: true, type: 'decimal' })
  public lng?: number;
}
