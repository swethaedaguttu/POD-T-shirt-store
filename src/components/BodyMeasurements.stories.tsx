import type { Meta, StoryObj } from '@storybook/react';
import { BodyMeasurements } from './BodyMeasurements';

const meta = {
  title: 'Components/BodyMeasurements',
  component: BodyMeasurements,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BodyMeasurements>;

export default meta;
type Story = StoryObj<typeof BodyMeasurements>;

export const Default: Story = {
  args: {
    height: '180',
    weight: '80',
    build: 'athletic',
    onHeightChange: (height) => console.log('Height changed:', height),
    onWeightChange: (weight) => console.log('Weight changed:', weight),
    onBuildChange: (build) => console.log('Build changed:', build),
  },
};

export const WithValidationErrors: Story = {
  args: {
    height: '140',
    weight: '30',
    build: 'athletic',
    onHeightChange: (height) => console.log('Height changed:', height),
    onWeightChange: (weight) => console.log('Weight changed:', weight),
    onBuildChange: (build) => console.log('Build changed:', build),
    errors: {
      height: 'Height must be between 150cm and 220cm',
      weight: 'Weight must be between 40kg and 150kg',
    },
  },
};

export const WithDifferentBuild: Story = {
  args: {
    height: '175',
    weight: '90',
    build: 'big',
    onHeightChange: (height) => console.log('Height changed:', height),
    onWeightChange: (weight) => console.log('Weight changed:', weight),
    onBuildChange: (build) => console.log('Build changed:', build),
  },
}; 