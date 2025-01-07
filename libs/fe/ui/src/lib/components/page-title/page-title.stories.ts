import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { PageTitleComponent } from './page-title.component';

const meta: Meta<PageTitleComponent> = {
  title: 'Page Title',
  component: PageTitleComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<PageTitleComponent>;

export const WithoutLink: Story = {
  render: () => ({
    template: `<sp-page-title>Page Title</sp-page-title>`,
  }),
};

export const WithReturnLink: Story = {
  render: () => ({
    template: `<sp-page-title [routerLink]="['back']">Page Title</sp-page-title>`,
  }),
};
