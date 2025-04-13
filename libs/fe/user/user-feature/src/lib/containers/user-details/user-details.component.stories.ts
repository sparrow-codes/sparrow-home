import { signal } from '@angular/core';
import { MaterialConfiguration } from '@sparrow-home/ui';
import { User, UserDataFacadeService } from '@sparrow-home/user-domain';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { UserDetailsComponent } from './user-details.component';

const meta: Meta = {
  title: 'User Details',
  component: UserDetailsComponent,
  decorators: [
    moduleMetadata({
      providers: [
        MaterialConfiguration,
        {
          provide: UserDataFacadeService,
          useValue: {
            user: signal(prepareUser()),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<UserDetailsComponent>;

export const Default: Story = {};

function prepareUser(): User {
  return {
    id: 1,
    firstName: 'Piotr',
    lastName: 'Wróbel',
    email: 'wrobel.j.piotr@gmail.com',
  };
}
