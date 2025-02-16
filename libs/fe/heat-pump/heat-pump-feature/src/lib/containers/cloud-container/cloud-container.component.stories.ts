import { signal } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeatingPreferences, HeatPump, HeatPumpFacadeService } from '@sparrow-home/heat-pump-domain';
import { LayoutService, MaterialConfiguration } from '@sparrow-home/ui';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { provideNgxMask } from 'ngx-mask';

import { CloudContainerComponent } from './cloud-container.component';

function prepareHeatPum(): HeatPump {
  return {
    deviceGuid: '',
    outdoorNow: 11,
    waterPressure: '1.4',
    heatTank: {
      heatSet: 0,
      currentTemperature: 37,
      operationStatus: 1,
    },
    waterTank: {
      currentTemperature: 51,
      operationStatus: 0,
      heatSet: 0,
      heatMin: 45,
      heatMax: 65,
    },
  };
}

const meta: Meta<CloudContainerComponent> = {
  component: CloudContainerComponent,
  title: 'CloudContainerComponent',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
      providers: [
        MaterialConfiguration,
        provideNgxMask({ validation: false }),
        {
          provide: HeatPumpFacadeService,
          useValue: {
            fetchInitData: () => void 0,
            heatPump: signal(prepareHeatPum()),
            waterTankOptions: signal({
              isScheduledHeating: true,
            }),
            homeDeviceOptions: signal([
              {
                label: 'Label 1',
                value: 'label 1',
              },
              {
                label: 'Label 2',
                value: 'label 2',
              },
            ]),
            circularPumpPreferences: signal({
              scheduledEndTime: new Date(),
              scheduledStartTime: new Date(),
              isActive: true,
              homeDeviceId: 'abc',
              canBeActivated: () => true,
            }),
            heatingPreferences: signal({
              isAutomaticHeat: false,
              maxTargetTemperature: 25.2,
              minTargetTemperature: 22.1,
              groundFlorTemperatureSensorId: 1,
              firstFlorTemperatureSensorId: 2,
            } as HeatingPreferences),
            temperatureSensorsOptions: signal([
              {
                label: 'temp 1',
                value: 1,
              },
              {
                label: 'temp 2',
                value: 2,
              },
            ]),
          },
        },
        {
          provide: LayoutService,
          useValue: {
            isMobile: signal(true),
          },
        },
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<CloudContainerComponent>;

export const Primary: Story = {
  args: {},
};

export const Web: Story = {
  decorators: [
    moduleMetadata({
      providers: [{ provide: LayoutService, useValue: { isMobile: signal(false) } }],
    }),
  ],
};
