import type { Meta, StoryObj } from '@storybook/angular';

import { WaterTankComponent } from './water-tank.component';

const meta: Meta<WaterTankComponent> = {
  component: WaterTankComponent,
  title: 'WaterTankComponent',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<WaterTankComponent>;

export const HeatWaterOff: Story = {
  args: {
    waterTank: {
      currentTemperature: 51,
      operationStatus: 0,
      heatSet: 0,
      heatMin: 45,
      heatMax: 65,
    },
    waterTankOptions: {
      isScheduledHeating: true,
    },
  },
};

export const HeatWaterOn: Story = {
  args: {
    waterTank: {
      currentTemperature: 51,
      operationStatus: 1,
      heatSet: 0,
      heatMin: 45,
      heatMax: 65,
    },
    waterTankOptions: {
      isScheduledHeating: true,
    },
  },
};
