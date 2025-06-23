import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sp-device-list-panel',
  imports: [CommonModule, RouterLink],
  templateUrl: './device-list-panel.component.html',
})
export class DeviceListPanelComponent {}
