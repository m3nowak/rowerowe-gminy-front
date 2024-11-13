import type { Meta, StoryObj } from '@storybook/angular';

import { StravaBtnComponent } from './strava-btn.component';

const meta: Meta<StravaBtnComponent> = {
  component: StravaBtnComponent,
};

export default meta;

type Story = StoryObj<StravaBtnComponent>;
export const Primary: Story = {
  args: {
    grow: false,
  },
  parameters: {
    styles: `
      <style>
        app-strava-btn { width: 300px; }
      </style>
    `,
  },
};
