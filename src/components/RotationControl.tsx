import React from 'react';

interface RotationControlProps {
  rotation: number;
  onRotationChange: (rotation: number) => void;
  step?: number;
  min?: number;
  max?: number;
}

export const RotationControl: React.FC<RotationControlProps> = ({
  rotation,
  onRotationChange,
  step = 15,
  min = -180,
  max = 180,
}) => {
  const handleRotationChange = (newRotation: number) => {
    // Normalize rotation to be within min and max
    let normalizedRotation = newRotation;
    while (normalizedRotation < min) normalizedRotation += 360;
    while (normalizedRotation > max) normalizedRotation -= 360;
    onRotationChange(normalizedRotation);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Rotation
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleRotationChange(rotation - step)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ↺
        </button>
        <span className="w-12 text-center">{rotation}°</span>
        <button
          onClick={() => handleRotationChange(rotation + step)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ↻
        </button>
      </div>
    </div>
  );
}; 