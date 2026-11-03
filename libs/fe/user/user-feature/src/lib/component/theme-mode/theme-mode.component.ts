import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonToggle } from '@ionic/angular';
import { bootstrapMoon, bootstrapSun } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'sp-theme-mode',
  imports: [NgIcon, FormsModule, TranslatePipe, IonCard, IonCardContent, IonToggle, IonCardHeader, IonCardSubtitle],
  templateUrl: './theme-mode.component.html',
  providers: [provideIcons({ bootstrapMoon, bootstrapSun })],
})
export class ThemeModeComponent {
  public readonly isDarkMode: InputSignal<boolean> = input.required();
  public readonly toggleDarkMode: OutputEmitterRef<void> = output();
}
