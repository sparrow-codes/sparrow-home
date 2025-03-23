import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { MobilePushNotificationService } from '@sparrow-home/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly _pushNotificationsService: MobilePushNotificationService = inject(MobilePushNotificationService);

  public ngOnInit(): void {
    this._pushNotificationsService.subscribeMessage();
  }
}
