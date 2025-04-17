import { signal } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { DeviceType } from '@sparrow-home/core';
import { DeviceFacadeService, OpenDoorSensor, Pilot } from '@sparrow-home/home-device-domain';
import { MaterialConfiguration } from '@sparrow-home/ui';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { of } from 'rxjs';

import { DeviceDetailsComponent } from './device-details.component';

const meta: Meta = {
  title: 'Device Details',
  component: DeviceDetailsComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<DeviceDetailsComponent>;

export const OpenDoorSensorDetails: Story = {
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
      providers: [
        MaterialConfiguration,
        {
          provide: DeviceFacadeService,
          useValue: { homeDeviceDetails: signal(prepareSensorDetails()), fetchDeviceDetailsById: () => void 0 },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (id: string) => id }),
          },
        },
      ],
    }),
  ],
};

export const PilotDetails: Story = {
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
      providers: [
        MaterialConfiguration,
        {
          provide: DeviceFacadeService,
          useValue: { homeDeviceDetails: signal(preparePilotDetails()), fetchDeviceDetailsById: () => void 0 },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (id: string) => id }),
          },
        },
      ],
    }),
  ],
};

function prepareSensorDetails(): OpenDoorSensor {
  return {
    battery: 98,
    homeDeviceId: 'asdasd',
    id: 0,
    isOnline: true,
    isOpen: true,
    lastOpened: new Date(),
    name: 'Open Door Sensor',
    signalStrength: 80,
    type: DeviceType.OPEN_DOOR_SENSOR,
  };
}

function preparePilotDetails(): Pilot {
  return {
    battery: 98,
    homeDeviceId: 'asdasd',
    id: 0,
    isOnline: null,
    name: 'Pilot device',
    type: DeviceType.PILOT,
  };
}
