import { RouterTestingModule } from '@angular/router/testing';
import { bootstrapBellFill } from '@ng-icons/bootstrap-icons';
import { provideIcons } from '@ng-icons/core';
import { heroComputerDesktop, heroLightBulb } from '@ng-icons/heroicons/outline';
import { matHeatPump } from '@ng-icons/material-icons/baseline';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { AppHeaderComponent } from './app-header.component';

const meta: Meta<AppHeaderComponent> = {
  title: 'App Header',
  component: AppHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule],
      providers: [provideIcons({ heroComputerDesktop, heroLightBulb, matHeatPump, bootstrapBellFill })],
    }),
  ],
  args: {
    currentUrl: '/first',
    navigationItems: [
      { label: 'Panel Główny', icon: 'heroComputerDesktop', routerLink: '' },
      { label: 'Pompa Ciepła', icon: 'matHeatPump', routerLink: '' },
      { label: 'Akwarium', icon: 'heroLightBulb', routerLink: '' },
      { label: 'Alarm', icon: 'bootstrapBellFill', routerLink: '' },
    ],
  },
};

export default meta;
type Story = StoryObj<AppHeaderComponent>;

export const Default: Story = {};
