import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ActionJob } from './action-job';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'name' })
  public name!: string;

  @Column({ name: 'isActive' })
  public isActive!: boolean;

  @OneToMany(() => ActionJob, (actionJob) => actionJob.task, {
    cascade: true,
    eager: true,
  })
  public actionJobs!: ActionJob[];
}
