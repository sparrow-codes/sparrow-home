import type { Meta, StoryObj } from '@storybook/angular';

import { HeatTankComponent } from './heat-tank.component';

const meta: Meta<HeatTankComponent> = {
  component: HeatTankComponent,
  title: 'HeatTankComponent',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<HeatTankComponent>;

export const IsWorking: Story = {
  args: {
    heatTank: {
      heatSet: 0,
      currentTemperature: 37,
      operationStatus: 1,
    },
  },
};

export const IsOffline: Story = {
  args: {
    heatTank: {
      heatSet: 0,
      currentTemperature: 37,
      operationStatus: 0,
    },
  },
};
