import type { Meta, StoryObj } from '@storybook/angular';

import { StravaBtnComponent } from './strava-btn.component';

const meta: Meta<StravaBtnComponent> = {
  title: 'Common/StravaBtn',
  tags: ['autodocs'],
  component: StravaBtnComponent,
};

export default meta;

type Story = StoryObj<StravaBtnComponent>;
export const Primary: Story = {
  args: {
    grow: false,
  },
};
