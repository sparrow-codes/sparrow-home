import { Routes } from '@angular/router';
import { tasksSignalStore } from '@sparrow-home/task-domain';

import { EditTaskComponent } from './lib/pages/edit-task/edit-task.component';
import { NewTaskComponent } from './lib/pages/new-task/new-task.component';
import { TaskListComponent } from './lib/pages/task-list/task-list.component';

export const TASK_ROUTES: Routes = [
  {
    path: '',
    providers: [tasksSignalStore],
    children: [
      {
        path: '',
        component: TaskListComponent,
      },
      {
        path: 'new',
        component: NewTaskComponent,
      },
      {
        path: 'edit/:taskId',
        component: EditTaskComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
