import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Task } from './task';

@Entity({ name: 'action_job' })
export class ActionJob {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'assignedDeviceId' })
  public assignedDeviceId!: string;

  @Column({ name: 'payload', type: 'json' })
  public payload!: string;

  @Column({ name: 'execution_time' })
  public executionTime!: Date;

  @ManyToOne(() => Task, (task) => task.actionJobs, { orphanedRowAction: 'delete' })
  public task!: Task;
}
