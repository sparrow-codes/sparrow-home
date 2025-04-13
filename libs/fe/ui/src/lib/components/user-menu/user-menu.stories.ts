import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matSettings } from '@ng-icons/material-icons/baseline';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { MaterialConfiguration } from '../../config/material-config';

const meta: Meta = {
  title: 'User Menu',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [MaterialConfiguration, provideIcons({ matSettings })],
      imports: [MatMenuModule, MatButtonModule, BrowserAnimationsModule, NgIconComponent],
    }),
  ],
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    return {
      template: `<div class="w-full flex justify-end bg-dark-blue">
                    <button mat-button [matMenuTriggerFor]="menu">
                      <span class="text-white"><ng-icon name="matSettings" size="1.5rem"></ng-icon></span>
                    </button>
                    <mat-menu #menu="matMenu">
                        <button mat-menu-item>PROFIL</button>
                        <button mat-menu-item>WYLOGUJ</button>
                    </mat-menu>
                </div>`,
    };
  },
};
