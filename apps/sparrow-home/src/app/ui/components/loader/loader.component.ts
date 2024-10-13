import { ChangeDetectionStrategy, Component } from '@angular/core';
import { sparrowFadeIn } from '@sparrow-codes/sparrow-ui';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
  animations: [sparrowFadeIn],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {}
