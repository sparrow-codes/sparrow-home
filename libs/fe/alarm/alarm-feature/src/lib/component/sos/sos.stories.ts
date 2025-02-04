import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { SosComponent } from './sos.component';

const meta: Meta<SosComponent> = {
  title: 'Sos Component',
  component: SosComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<SosComponent>;

export const Default: Story = {
  render: () => ({
    template: `<div style="width: 100%; height: 80vh"><sp-sos></sp-sos></div>`,
  }),
};
