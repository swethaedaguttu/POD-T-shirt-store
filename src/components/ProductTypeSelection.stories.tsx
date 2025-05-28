import type { Meta, StoryObj } from '@storybook/react';
import { ProductTypeSelection } from './ProductTypeSelection';

const meta: Meta<typeof ProductTypeSelection> = {
  title: 'Components/ProductTypeSelection',
  component: ProductTypeSelection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductTypeSelection>;

export const Default: Story = {
  args: {
    productType: 'tshirt',
    onProductTypeChange: (type: string) => console.log('Product type changed:', type),
  },
};

export const WithHoodieSelected: Story = {
  args: {
    productType: 'hoodie',
    onProductTypeChange: (type: string) => console.log('Product type changed:', type),
  },
};

export const WithSleevelessSelected: Story = {
  args: {
    productType: 'sleevie',
    onProductTypeChange: (type: string) => console.log('Product type changed:', type),
  },
};

export const WithCapSelected: Story = {
  args: {
    productType: 'cap',
    onProductTypeChange: (type: string) => console.log('Product type changed:', type),
  },
}; 