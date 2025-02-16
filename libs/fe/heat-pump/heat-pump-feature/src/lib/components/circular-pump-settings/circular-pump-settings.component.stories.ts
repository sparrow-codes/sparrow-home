import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialConfiguration } from '@sparrow-home/ui';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { CircularPumpSettingsComponent } from './circular-pump-settings.component';

const meta: Meta<CircularPumpSettingsComponent> = {
  component: CircularPumpSettingsComponent,
  title: 'CircularPumpSettingsComponent',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
      providers: [MaterialConfiguration],
    }),
  ],
};
export default meta;
type Story = StoryObj<CircularPumpSettingsComponent>;

export const Primary: Story = {
  args: {
    homeDeviceOptions: [
      {
        label: 'Label 1',
        value: 'label 1',
      },
      {
        label: 'Label 2',
        value: 'label 2',
      },
    ],
    circularPumpPreferences: {
      scheduledEndTime: new Date(),
      scheduledStartTime: new Date(),
      isActive: true,
      homeDeviceId: 'abc',
      canBeActivated: () => true,
    },
  },
};
