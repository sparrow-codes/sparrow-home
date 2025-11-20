import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Task } from './task';

@Entity({ name: 'action_job' })
export class ActionJob {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'assignedDeviceId' })
  public assignedDeviceId!: string;

  @Column({ name: 'payload', type: 'json' })
  public payload!: Record<string, unknown>;

  @Column({ name: 'daysOfWeek', type: 'json', nullable: true })
  public daysOfWeek: number[] | null = null;

  @Column({ name: 'execution_time' })
  public executionTime!: Date;

  @ManyToOne(() => Task, (task) => task.actionJobs, { orphanedRowAction: 'delete' })
  public task!: Task;
}
