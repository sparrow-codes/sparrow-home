import { signal } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlarmFacadeDataService } from '@sparrow-home/alarm-domain';
import { MaterialConfiguration } from '@sparrow-home/ui';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { AlarmPageComponent } from './alarm-page.component';

const meta: Meta<AlarmPageComponent> = {
  title: 'Alarm Page',
  component: AlarmPageComponent,
  decorators: [
    moduleMetadata({
      providers: [MaterialConfiguration],
      imports: [BrowserAnimationsModule],
    }),
  ],
};

const onToggle: object = action('onToggle');
const fetchInitial: object = action('fetchInitial');

export default meta;
type Story = StoryObj<AlarmPageComponent>;

export const Default: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: AlarmFacadeDataService,
          useValue: {
            setAlarm: () => void 0,
            alarmMode: signal(false),
            fetchAlarmMode: fetchInitial,
            setAlarmMode: onToggle,
          },
        },
      ],
    }),
  ],
};

export const ActiveAlarm: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: AlarmFacadeDataService,
          useValue: {
            setAlarm: () => void 0,
            alarmMode: signal(true),
            fetchAlarmMode: fetchInitial,
            setAlarmMode: onToggle,
          },
        },
      ],
    }),
  ],
};
