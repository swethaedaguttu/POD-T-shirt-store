import type { Meta, StoryObj } from '@storybook/react';
import { RotationControl } from './RotationControl';

const meta: Meta<typeof RotationControl> = {
  title: 'Components/RotationControl',
  component: RotationControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RotationControl>;

export const Default: Story = {
  args: {
    rotation: 0,
    onRotationChange: (rotation) => console.log('Rotation changed:', rotation),
  },
};

export const Rotated15Degrees: Story = {
  args: {
    rotation: 15,
    onRotationChange: (rotation) => console.log('Rotation changed:', rotation),
  },
};

export const Rotated45Degrees: Story = {
  args: {
    rotation: 45,
    onRotationChange: (rotation) => console.log('Rotation changed:', rotation),
  },
};

export const RotatedMinus15Degrees: Story = {
  args: {
    rotation: -15,
    onRotationChange: (rotation) => console.log('Rotation changed:', rotation),
  },
};

export const CustomStep: Story = {
  args: {
    rotation: 0,
    step: 30,
    onRotationChange: (rotation) => console.log('Rotation changed:', rotation),
  },
}; 