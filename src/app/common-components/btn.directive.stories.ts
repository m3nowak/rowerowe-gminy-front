import type { Meta, StoryObj } from '@storybook/angular';

import { BtnDirective } from './btn.directive';

const meta: Meta<BtnDirective> = {
  title: 'Common/Btn',
  tags: ['autodocs'],
  component: BtnDirective,
};

export default meta;

type Story = StoryObj<BtnDirective>;
export const Default: Story = {
  render: () => ({
    props: {
      main: false,
    },
    template: '<button appBtn>Default Button</button>',
  }),
};

export const Main: Story = {
  render: () => ({
    props: {
      main: true,
    },
    template: '<button appBtn main>Main button</button>',
  }),
};

export const Link: Story = {
  render: () => ({
    props: {
      main: true,
    },
    template: '<a appBtn href="#">Link button</a>',
  }),
};
