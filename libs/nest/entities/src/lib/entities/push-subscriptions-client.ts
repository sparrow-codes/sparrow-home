import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PushSubscriptionsClient {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 300 })
  public endpoint!: string;

  @Column()
  public p256dh!: string;

  @Column()
  public auth!: string;
}
