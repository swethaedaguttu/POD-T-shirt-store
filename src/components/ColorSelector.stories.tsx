import type { Meta, StoryObj } from '@storybook/react';
import { ColorSelector } from './ColorSelector';

const meta = {
  title: 'Components/ColorSelector',
  component: ColorSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorSelector>;

export default meta;
type Story = StoryObj<typeof ColorSelector>;

const defaultColors = [
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Navy', value: 'navy', hex: '#000080' },
  { name: 'Gray', value: 'gray', hex: '#808080' },
  { name: 'Red', value: 'red', hex: '#FF0000' },
  { name: 'Green', value: 'green', hex: '#008000' },
  { name: 'Blue', value: 'blue', hex: '#0000FF' },
  { name: 'Yellow', value: 'yellow', hex: '#FFFF00' },
];

export const Default: Story = {
  args: {
    colors: defaultColors,
    selectedColor: 'white',
    onColorChange: (color) => console.log('Color changed:', color),
  },
};

export const WithBlackSelected: Story = {
  args: {
    colors: defaultColors,
    selectedColor: 'black',
    onColorChange: (color) => console.log('Color changed:', color),
  },
};

export const WithRedSelected: Story = {
  args: {
    colors: defaultColors,
    selectedColor: 'red',
    onColorChange: (color) => console.log('Color changed:', color),
  },
};

export const Disabled: Story = {
  args: {
    colors: defaultColors,
    selectedColor: 'white',
    onColorChange: (color) => console.log('Color changed:', color),
    disabled: true,
  },
}; 