import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlarmFacadeDataService } from '@sparrow-home/alarm-domain';
import { MaterialConfiguration } from '@sparrow-home/ui';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { AlarmPageComponent } from './alarm-page.component';

const meta: Meta<AlarmPageComponent> = {
  title: 'Alarm Page',
  component: AlarmPageComponent,
  decorators: [
    moduleMetadata({
      providers: [...MaterialConfiguration, { provide: AlarmFacadeDataService, useValue: { setAlarm: () => void 0 } }],
      imports: [BrowserAnimationsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<AlarmPageComponent>;

export const Default: Story = {};
