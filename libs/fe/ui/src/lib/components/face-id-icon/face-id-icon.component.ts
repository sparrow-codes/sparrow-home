import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'sp-face-id-icon',
  imports: [CommonModule],
  templateUrl: './face-id-icon.component.html',
})
export class FaceIdIconComponent {
  public readonly disabled: InputSignal<boolean> = input(false);
  public readonly clickEvent: OutputEmitterRef<void> = output();

  protected onIconClick(): void {
    if (!this.disabled()) {
      this.clickEvent.emit();
    }
  }
}
