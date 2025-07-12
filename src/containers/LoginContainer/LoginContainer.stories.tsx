import type { Meta, StoryObj } from '@storybook/react-vite';

import LoginContainer from './LoginContainer';

const meta = {
  component: LoginContainer,
} satisfies Meta<typeof LoginContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};