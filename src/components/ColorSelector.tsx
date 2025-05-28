import React from 'react';

interface Color {
  name: string;
  value: string;
  hex: string;
}

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: string;
  onColorChange: (color: string) => void;
  disabled?: boolean;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorChange,
  disabled = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Color
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {colors.map(({ name, value, hex }) => (
          <button
            key={value}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-transform ${
              selectedColor === value ? 'scale-110 border-blue-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300'}`}
            style={{ backgroundColor: hex }}
            onClick={() => !disabled && onColorChange(value)}
            title={name}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}; 