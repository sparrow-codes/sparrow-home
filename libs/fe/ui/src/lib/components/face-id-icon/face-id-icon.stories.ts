import { Meta, StoryObj } from '@storybook/angular';

import { FaceIdIconComponent } from './face-id-icon.component';

const meta: Meta<FaceIdIconComponent> = {
  title: 'Face id icon',
  component: FaceIdIconComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FaceIdIconComponent>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
