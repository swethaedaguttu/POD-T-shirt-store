import React from 'react';

interface BodyMeasurementsProps {
  height: string;
  weight: string;
  build: string;
  onHeightChange: (height: string) => void;
  onWeightChange: (weight: string) => void;
  onBuildChange: (build: string) => void;
  errors?: {
    height?: string;
    weight?: string;
  };
}

export const BodyMeasurements: React.FC<BodyMeasurementsProps> = ({
  height,
  weight,
  build,
  onHeightChange,
  onWeightChange,
  onBuildChange,
  errors = {}
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Body Measurements</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.height ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter height (150-220cm)"
          />
          {errors.height && (
            <p className="mt-1 text-sm text-red-500">{errors.height}</p>
          )}
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.weight ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter weight (40-150kg)"
          />
          {errors.weight && (
            <p className="mt-1 text-sm text-red-500">{errors.weight}</p>
          )}
        </div>

        <div>
          <label htmlFor="build" className="block text-sm font-medium text-gray-700 mb-1">
            Build Type
          </label>
          <select
            id="build"
            value={build}
            onChange={(e) => onBuildChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="lean">Lean</option>
            <option value="regular">Regular</option>
            <option value="athletic">Athletic</option>
            <option value="big">Big</option>
          </select>
        </div>
      </div>
    </div>
  );
}; 