import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Injector, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { bootstrapBellFill, bootstrapCheckCircleFill } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { sparrowFadeIn } from '@sparrow-home/ui';
import { Subject } from 'rxjs';

@Component({
  selector: 'sp-sos',
  imports: [CommonModule, NgIcon, MatButton, MatDialogClose],
  templateUrl: './sos.component.html',
  providers: [provideIcons({ bootstrapBellFill, bootstrapCheckCircleFill })],
  animations: [sparrowFadeIn],
})
export class SosComponent implements OnInit {
  public readonly isOnEvent: Subject<boolean> = new Subject();

  protected readonly isOn: WritableSignal<boolean> = signal(false);
  protected readonly icon: Signal<string> = computed(() =>
    this.isOn() ? 'bootstrapCheckCircleFill' : 'bootstrapBellFill'
  );

  private readonly injector: Injector = inject(Injector);

  public ngOnInit(): void {
    effect(
      () => {
        this.isOnEvent.next(this.isOn());
      },
      { injector: this.injector }
    );
  }
}
