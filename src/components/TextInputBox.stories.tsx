import type { Meta, StoryObj } from '@storybook/react';
import { TextInputBox } from './TextInputBox';

const meta = {
  title: 'Components/TextInputBox',
  component: TextInputBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextInputBox>;

export default meta;
type Story = StoryObj<typeof TextInputBox>;

export const Empty: Story = {
  args: {
    value: '',
    onChange: (text) => console.log('Text changed:', text),
    placeholder: 'Enter up to 3 lines of text...',
  },
};

export const WithOneLine: Story = {
  args: {
    value: 'This is a single line of text',
    onChange: (text) => console.log('Text changed:', text),
  },
};

export const WithThreeLines: Story = {
  args: {
    value: 'First line\nSecond line\nThird line',
    onChange: (text) => console.log('Text changed:', text),
  },
};

export const NearCharacterLimit: Story = {
  args: {
    value: 'This is a very long text that is approaching the character limit. It should show the character count and prevent adding more characters when the limit is reached.',
    onChange: (text) => console.log('Text changed:', text),
  },
};

export const WithoutCharacterCount: Story = {
  args: {
    value: 'Text without character count display',
    onChange: (text) => console.log('Text changed:', text),
    showCharacterCount: false,
  },
}; 