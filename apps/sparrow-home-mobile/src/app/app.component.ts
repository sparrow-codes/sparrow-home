import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline,
  banOutline,
  calendarOutline,
  checkmarkCircleOutline,
  checkmarkOutline,
  chevronBackOutline,
  closeCircle,
  closeOutline,
  flashOutline,
  listOutline,
  logInOutline,
  logOutOutline,
  pauseCircleOutline,
  pencilOutline,
  playCircleOutline,
  playOutline,
  saveOutline,
  searchOutline,
  timeOutline,
  trashOutline,
  wifiOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  public constructor() {
    addIcons({
      addOutline,
      banOutline,
      calendarOutline,
      checkmarkCircleOutline,
      checkmarkOutline,
      chevronBackOutline,
      closeCircle,
      closeOutline,
      flashOutline,
      listOutline,
      logInOutline,
      logOutOutline,
      pauseCircleOutline,
      pencilOutline,
      playCircleOutline,
      playOutline,
      saveOutline,
      searchOutline,
      timeOutline,
      trashOutline,
      wifiOutline,
    });
  }
}
