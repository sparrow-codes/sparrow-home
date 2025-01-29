import { Meta, StoryObj } from '@storybook/angular';

import { BatteryStatusComponent } from './battery-status.component';

const meta: Meta<BatteryStatusComponent> = {
  title: 'Battery Status',
  component: BatteryStatusComponent,
};

export default meta;
type Story = StoryObj<BatteryStatusComponent>;

export const FullBattery: Story = {
  args: {
    batteryStatus: 98,
  },
};

export const MediumBattery: Story = {
  args: {
    batteryStatus: 42,
  },
};

export const LowBattery: Story = {
  args: {
    batteryStatus: 15,
  },
};
