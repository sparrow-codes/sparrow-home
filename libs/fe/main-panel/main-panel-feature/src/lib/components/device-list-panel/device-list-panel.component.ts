import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'sp-device-list-panel',
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './device-list-panel.component.html',
})
export class DeviceListPanelComponent {}
