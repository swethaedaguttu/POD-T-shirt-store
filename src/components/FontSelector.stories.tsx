import type { Meta, StoryObj } from '@storybook/react';
import { FontSelector } from './FontSelector';

const meta: Meta<typeof FontSelector> = {
  title: 'Components/FontSelector',
  component: FontSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FontSelector>;

const defaultFonts = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Helvetica', value: 'Helvetica' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Courier New', value: 'Courier New' },
];

export const Default: Story = {
  args: {
    fonts: defaultFonts,
    selectedFont: 'Arial',
    fontSize: 24,
    onFontChange: (font) => console.log('Font changed:', font),
    onFontSizeChange: (size) => console.log('Font size changed:', size),
  },
};

export const WithDifferentFont: Story = {
  args: {
    fonts: defaultFonts,
    selectedFont: 'Times New Roman',
    fontSize: 24,
    onFontChange: (font) => console.log('Font changed:', font),
    onFontSizeChange: (size) => console.log('Font size changed:', size),
  },
};

export const WithLargeFontSize: Story = {
  args: {
    fonts: defaultFonts,
    selectedFont: 'Arial',
    fontSize: 48,
    onFontChange: (font) => console.log('Font changed:', font),
    onFontSizeChange: (size) => console.log('Font size changed:', size),
  },
};

export const WithSmallFontSize: Story = {
  args: {
    fonts: defaultFonts,
    selectedFont: 'Arial',
    fontSize: 12,
    onFontChange: (font) => console.log('Font changed:', font),
    onFontSizeChange: (size) => console.log('Font size changed:', size),
  },
}; 