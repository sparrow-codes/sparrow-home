import { signal } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { DeviceType } from '@sparrow-home/core';
import { DeviceFacadeService, HomeDevice } from '@sparrow-home/home-device-domain';
import { MaterialConfiguration } from '@sparrow-home/ui';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { DevicePageComponent } from './device-page.component';

const meta: Meta = {
  title: 'Home Device List',
  component: DevicePageComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
      providers: [MaterialConfiguration],
    }),
  ],
};

export default meta;
type Story = StoryObj<DevicePageComponent>;

export const Default: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: DeviceFacadeService,
          useValue: {
            homeDevices: signal(prepareHomeDevice()),
            fetchDevices: () => void 0,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }),
  ],
};

function prepareHomeDevice(): HomeDevice[] {
  return [
    {
      type: DeviceType.OPEN_DOOR_SENSOR,
      name: 'Door sensor',
      id: 1,
      homeDeviceId: '1',
    },
    {
      type: DeviceType.TEMPERATURE_SENSOR,
      name: 'Temperature Sensor',
      id: 2,
      homeDeviceId: '2',
    },
    {
      type: DeviceType.SIREN,
      name: 'Siren',
      id: 3,
      homeDeviceId: '3',
    },
  ];
}
