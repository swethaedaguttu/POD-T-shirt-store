import React from 'react';

interface ProductSpecs {
  height: string;
  weight: string;
  build: string;
  color: string;
}

interface ProductPreviewProps {
  productType: string;
  specs: ProductSpecs;
  mainImage: string | null;
  logoPosition: { x: number; y: number; scale: number };
  textToPrint: string;
  showText: boolean;
  textPosition: { x: number; y: number };
  textStyle: {
    fontSize: number;
    fontFamily: string;
    color: string;
    rotation: number;
  };
  onLogoDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTextDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const productTypes: Record<string, { id: string; name: string; defaultImage: string }> = {
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

export const ProductPreview: React.FC<ProductPreviewProps> = ({
  productType,
  specs,
  mainImage,
  logoPosition,
  textToPrint,
  showText,
  textPosition,
  textStyle,
  onLogoDragStart,
  onTextDragStart,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragging,
  fileInputRef
}) => {
  const currentProduct = productTypes[productType];

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md product-preview">
      <h3 className="text-xl font-semibold mb-4">Product Preview</h3>
      <div 
        className="relative aspect-square max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: specs.color }}
        >
          <div className="relative w-full h-full">
            <img
              src={currentProduct.defaultImage}
              alt={currentProduct.name}
              className="w-full h-full object-contain"
            />
            
            {mainImage && (
              <div 
                className="absolute cursor-move select-none"
                style={{ 
                  zIndex: 2,
                  transform: `translate(${logoPosition.x}px, ${logoPosition.y}px) scale(${logoPosition.scale})`,
                  userSelect: 'none',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  touchAction: 'none'
                }}
                onMouseDown={onLogoDragStart}
              >
                <img
                  src={mainImage}
                  alt="Custom logo"
                  className="max-w-[200px] max-h-[200px] object-contain"
                />
              </div>
            )}

            {showText && textToPrint && (
              <div 
                className="absolute text-center font-medium cursor-move select-none"
                style={{ 
                  zIndex: 3,
                  transform: `translate(${textPosition.x}px, ${textPosition.y}px) rotate(${textStyle.rotation}deg)`,
                  userSelect: 'none',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  fontSize: `${textStyle.fontSize}px`,
                  fontFamily: textStyle.fontFamily,
                  color: textStyle.color,
                  minWidth: '100px',
                  touchAction: 'none',
                  whiteSpace: 'pre-line',
                  textTransform: 'none'
                }}
                onMouseDown={onTextDragStart}
              >
                {textToPrint}
              </div>
            )}

            {!mainImage && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-200 bg-opacity-75 rounded-full m-32 cursor-pointer transition-all duration-200 border-dashed ${
                  isDragging ? 'border-blue-500 border-4' : 'border-gray-400 border-2'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={onFileChange}
                  accept="image/*"
                />
                <div className="text-center p-4">
                  <svg className="mx-auto h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-700 text-sm mt-2">Drag or Click to Upload Logo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 