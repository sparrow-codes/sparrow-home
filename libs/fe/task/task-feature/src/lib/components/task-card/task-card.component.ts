import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AutomaticTask } from '@sparrow-home/task-domain';
import { Card } from 'primeng/card';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'sp-task-card',
  imports: [CommonModule, Card, RouterLink, ToggleSwitch, FormsModule],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  public readonly task: InputSignal<AutomaticTask> = input.required();

  public readonly isActive: OutputEmitterRef<boolean> = output();
}
