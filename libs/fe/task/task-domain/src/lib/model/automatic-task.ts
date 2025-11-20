import { TaskAction } from './task-action';

export interface AutomaticTask {
  id: number;
  name: string;
  isActive: boolean;
  daysOfWeek: number[] | null;
  actions: TaskAction[];
}
