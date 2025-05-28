import React from 'react';

interface TextInputBoxProps {
  value: string;
  onChange: (text: string) => void;
  maxLines?: number;
  maxLength?: number;
  placeholder?: string;
  showCharacterCount?: boolean;
}

export const TextInputBox: React.FC<TextInputBoxProps> = ({
  value,
  onChange,
  maxLines = 3,
  maxLength = 150,
  placeholder = 'Enter text...',
  showCharacterCount = true,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const lines = newText.split('\n');
    
    if (lines.length <= maxLines && newText.length <= maxLength) {
      onChange(newText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const lines = value.split('\n');
      if (lines.length >= maxLines) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={maxLines}
        maxLength={maxLength}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
      {showCharacterCount && (
        <div className="text-sm text-gray-500">
          <span>Maximum {maxLines} lines</span>
          <span className="ml-4">{value.length}/{maxLength} characters</span>
        </div>
      )}
    </div>
  );
}; 