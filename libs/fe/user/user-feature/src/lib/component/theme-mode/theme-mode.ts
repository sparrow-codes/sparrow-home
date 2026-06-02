import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapMoon, bootstrapSun } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Card } from 'primeng/card';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'sp-theme-mode',
  imports: [Card, ToggleSwitch, NgIcon, FormsModule, TranslatePipe],
  templateUrl: './theme-mode.html',
  providers: [provideIcons({ bootstrapMoon, bootstrapSun })],
})
export class ThemeMode {
  public readonly isDarkMode: InputSignal<boolean> = input.required();
  public readonly toggleDarkMode: OutputEmitterRef<void> = output();
}
