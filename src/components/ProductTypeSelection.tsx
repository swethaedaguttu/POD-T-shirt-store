import React from 'react';

interface ProductTypeSelectionProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
}

const productTypes = {
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt',
    defaultImage: '/images/white t-shirt.png'
  },
  hoodie: {
    id: 'hoodie',
    name: 'Hoodie',
    defaultImage: '/images/black hoodie.png'
  },
  sleevie: {
    id: 'sleevie',
    name: 'Sleeveless',
    defaultImage: '/images/sleveless.png'
  },
  cap: {
    id: 'cap',
    name: 'Cap',
    defaultImage: '/images/cap.png'
  },
};

export const ProductTypeSelection: React.FC<ProductTypeSelectionProps> = ({ productType, onProductTypeChange }) => (
  <div className="mt-6">
    <h3 className="text-xl font-semibold mb-3">Select Product Type:</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.values(productTypes).map((type) => (
        <button
          key={type.id}
          className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
            productType === type.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => onProductTypeChange(type.id)}
        >
          <img 
            src={type.defaultImage} 
            alt={type.name}
            className="w-16 h-16 object-contain mb-2"
          />
          <span className="text-sm font-medium">{type.name}</span>
        </button>
      ))}
    </div>
  </div>
); 