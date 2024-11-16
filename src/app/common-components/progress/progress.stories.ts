import type { Meta, StoryObj } from '@storybook/angular';
import { ProgressComponent } from './progress.component';

const meta: Meta<ProgressComponent> = {
  title: 'Common/Progress',
  tags: ['autodocs'],
  component: ProgressComponent,
};

export default meta;

type Story = StoryObj<ProgressComponent>;
export const Percent: Story = {
  args: {
    progress: 100,
  },
};
export const Indeterminate: Story = {
  args: {
    progress: undefined,
  },
};
