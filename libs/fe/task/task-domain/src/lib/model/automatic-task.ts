import { TaskAction } from './task-action';

export interface AutomaticTask {
  id: number;
  name: string;
  isActive: boolean;
  actions: TaskAction[];
}
