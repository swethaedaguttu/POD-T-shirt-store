import React from 'react';
import { motion } from 'framer-motion';

interface ProductPanelProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ProductPanel: React.FC<ProductPanelProps> = ({ product, isOpen, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full p-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[var(--color-close)] font-owners-xnarrow text-lg"
        >
          close
        </button>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="mt-6">
            <h2 className="font-owners-xnarrow text-2xl">{product.name}</h2>
            <p className="font-halyard-display text-lg mt-2">${product.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductPanel; 