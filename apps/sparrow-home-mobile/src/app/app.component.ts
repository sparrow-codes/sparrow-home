import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { VisibilityService } from '@sparrow-home/core';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, Toast],
})
export class AppComponent implements OnInit {
  private readonly _visibilityService: VisibilityService = inject(VisibilityService);

  public ngOnInit(): void {
    this._visibilityService.listenToVisibilityChange();
  }
}
