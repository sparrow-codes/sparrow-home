import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UserRole } from '../enum/user-role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public password: string;

  @Column()
  public email: string;

  @Column()
  public isPasswordExpired: boolean;

  @Column({ enum: UserRole })
  public role: number;
}
