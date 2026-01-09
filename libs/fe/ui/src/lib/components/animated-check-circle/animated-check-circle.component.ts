import { NgStyle } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'sp-animated-check-circle',
  templateUrl: './animated-check-circle.component.html',
  styleUrl: './animated-check-circle.component.scss',
  imports: [NgStyle],
})
export class AnimatedCheckCircleComponent {
  public readonly width: InputSignal<string> = input('0px');
  public readonly height: InputSignal<string> = input('0px');
}
