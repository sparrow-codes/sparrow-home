import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUserCircleSolid } from '@ng-icons/heroicons/solid';
import { User } from '@sparrow-home/user-domain';

@Component({
  selector: 'sp-user-basic-data',
  imports: [CommonModule, NgIcon],
  templateUrl: './user-basic-data.component.html',
  providers: [provideIcons({ heroUserCircleSolid })],
})
export class UserBasicDataComponent {
  public readonly user: InputSignal<User | null> = input.required();
}
