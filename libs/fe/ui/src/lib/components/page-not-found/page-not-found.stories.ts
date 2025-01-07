import { Meta, StoryObj } from '@storybook/angular';

import { PageNotFoundComponent } from './page-not-found.component';

const meta: Meta<PageNotFoundComponent> = {
  title: 'Page not found',
  component: PageNotFoundComponent,
};

export default meta;
type Story = StoryObj<PageNotFoundComponent>;

export const Default: Story = {};
