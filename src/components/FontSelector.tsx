import React from 'react';

interface Font {
  name: string;
  value: string;
}

interface FontSelectorProps {
  fonts: Font[];
  selectedFont: string;
  fontSize: number;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  minSize?: number;
  maxSize?: number;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  fonts,
  selectedFont,
  fontSize,
  onFontChange,
  onFontSizeChange,
  minSize = 12,
  maxSize = 72,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Family
        </label>
        <select
          value={selectedFont}
          onChange={(e) => onFontChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {fonts.map(font => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Size
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFontSizeChange(Math.max(minSize, fontSize - 2))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span className="w-12 text-center">{fontSize}px</span>
          <button
            onClick={() => onFontSizeChange(Math.min(maxSize, fontSize + 2))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}; 