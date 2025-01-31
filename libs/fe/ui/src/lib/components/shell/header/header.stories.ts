import { RouterTestingModule } from '@angular/router/testing';
import { provideIcons } from '@ng-icons/core';
import { heroHome } from '@ng-icons/heroicons/outline';
import { matHeatPumpOutline } from '@ng-icons/material-icons/outline';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { AppHeaderComponent } from './app-header.component';

const meta: Meta<AppHeaderComponent> = {
  title: 'App Header',
  component: AppHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule],
      providers: [provideIcons({ heroHome, matHeatPumpOutline })],
    }),
  ],
  args: {
    currentUrl: '/first',
    navigationItems: [
      {
        label: 'First Page',
        routerLink: 'first',
        icon: 'heroHome',
      },
      {
        label: 'Second Page',
        routerLink: 'second',
        icon: 'matHeatPumpOutline',
      },
      {
        label: 'Third Page',
        routerLink: 'third',
        icon: 'heroHome',
      },
    ],
  },
};

export default meta;
type Story = StoryObj<AppHeaderComponent>;

export const Default: Story = {};
