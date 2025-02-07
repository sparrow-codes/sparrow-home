import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeatingPreferences } from '@sparrow-home/heat-pump-domain';
import { MaterialConfiguration } from '@sparrow-home/ui';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { provideNgxMask } from 'ngx-mask';

import { HeatingSettingsComponent } from './heating-settings.component';

const meta: Meta<HeatingSettingsComponent> = {
  title: 'Heating Settings',
  component: HeatingSettingsComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
      providers: [MaterialConfiguration, provideNgxMask({ validation: false, decimalMarker: '.' })],
    }),
  ],
};

export default meta;
type Story = StoryObj<HeatingSettingsComponent>;

export const Default: Story = {
  render: () => ({
    props: {
      update: action('update'),
      heatingPreferences: {
        isAutomaticHeat: false,
        canBeActivated: () => true,
      },
      sensorOptions: [
        {
          label: '1 option',
          value: 1,
        },
        {
          label: '2 option',
          value: 2,
        },
      ],
    },
    template: `<sp-heating-settings [heatingPreferences]="heatingPreferences" [sensorOptions]="sensorOptions" (update)="update($event)"></sp-heating-settings>`,
  }),
};

export const OnFilledData: Story = {
  render: () => ({
    props: {
      update: action('update'),
      activated: action('isActive'),
      heatingPreferences: {
        isAutomaticHeat: true,
        minTargetTemperature: 22.1,
        groundFlorTemperatureSensorId: 1,
        firstFlorTemperatureSensorId: 2,
        maxTargetTemperature: 23.2,
      } as HeatingPreferences,
      sensorOptions: [
        {
          label: '1 option',
          value: 1,
        },
        {
          label: '2 option',
          value: 2,
        },
      ],
    },
    template: `<sp-heating-settings [heatingPreferences]="heatingPreferences" [sensorOptions]="sensorOptions" (update)="update($event)" (activated)="activated($event)"></sp-heating-settings>`,
  }),
};
