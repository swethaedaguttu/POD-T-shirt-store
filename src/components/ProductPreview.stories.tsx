import type { Meta, StoryObj } from '@storybook/react';
import { ProductPreview } from './ProductPreview';

const meta: Meta<typeof ProductPreview> = {
  title: 'Components/ProductPreview',
  component: ProductPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductPreview>;

const defaultArgs = {
  productType: 'tshirt',
  specs: {
    height: '180',
    weight: '80',
    build: 'athletic',
    color: 'white'
  },
  mainImage: null,
  logoPosition: { x: 0, y: 0, scale: 1 },
  textToPrint: '',
  showText: false,
  textPosition: { x: 0, y: 0 },
  textStyle: {
    fontSize: 24,
    fontFamily: 'Arial',
    color: '#000000',
    rotation: 0
  },
  onLogoDragStart: () => {},
  onTextDragStart: () => {},
  onFileChange: () => {},
  onDragOver: () => {},
  onDragLeave: () => {},
  onDrop: () => {},
  isDragging: false,
  fileInputRef: { current: null }
};

export const Default: Story = {
  args: defaultArgs
};

export const WithUploadedLogo: Story = {
  args: {
    ...defaultArgs,
    mainImage: 'https://example.com/logo.png',
    logoPosition: { x: 100, y: 100, scale: 1.2 }
  },
};

export const WithCustomText: Story = {
  args: {
    ...defaultArgs,
    textToPrint: 'Custom Text',
    showText: true,
    textPosition: { x: 50, y: 50 },
    textStyle: {
      fontSize: 32,
      fontFamily: 'Arial',
      color: '#FF0000',
      rotation: 15
    }
  },
};

export const WithBothLogoAndText: Story = {
  args: {
    ...defaultArgs,
    mainImage: 'https://example.com/logo.png',
    logoPosition: { x: 100, y: 100, scale: 1.2 },
    textToPrint: 'Custom Text',
    showText: true,
    textPosition: { x: 50, y: 50 },
    textStyle: {
      fontSize: 32,
      fontFamily: 'Arial',
      color: '#FF0000',
      rotation: 15
    }
  },
}; 