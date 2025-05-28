import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CanvasTransition from '../components/CanvasTransition';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sample images - using .webp images found in public/images
  const images = [
    '/images/img1.webp',
    '/images/img2.webp',
    '/images/img3.webp',
    '/images/img4.webp',
  ];

  // Automatic image cycling
  useEffect(() => {
    const interval = setInterval(() => {
      // Only cycle automatically if not currently transitioning and not controlled by user input
      if (!isTransitioning) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(true);
      }
    }, 5000); // Change image every 5 seconds (adjusted for better viewing)

    return () => clearInterval(interval);
  }, [isTransitioning, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTransitioning) return; // Prevent changing image during transition

      if (event.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(true);
      } else if (event.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsTransitioning(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTransitioning, images.length]); // Added isTransitioning to dependencies

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  };

  // Function to handle dot navigation click
  const handleDotClick = (index: number) => {
    console.log('Dot clicked with index:', index);
    if (isTransitioning || index === currentImageIndex) {
      console.log('Ignoring dot click: isTransitioning =', isTransitioning, ' currentImageIndex =', currentImageIndex);
      return; // Prevent changing image during transition or if already on that image
    }
    console.log('Setting currentImageIndex to:', index);
    setCurrentImageIndex(index);
    setIsTransitioning(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <CanvasTransition
        images={images}
        currentIndex={currentImageIndex}
        onTransitionComplete={handleTransitionComplete}
      />
      
      {/* Content overlay - Centered */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white text-center">
        {/* Background overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        <div className="relative mb-4 z-20">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm tracking-widest text-white font-light drop-shadow-lg">
            CUSTOMIZE YOUR STYLE
          </div>
          <h1 className="text-7xl font-bold font-owners-xnarrow tracking-wider drop-shadow-xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
              POD
            </span>
            <span className="ml-2 drop-shadow-lg">T-shirt</span>
            <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
              STORE
            </span>
          </h1>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg"></div>
        </div>
        <div className="space-y-4 z-20">
          <p className="text-xl mb-2 opacity-90 font-halyard-display tracking-wide drop-shadow-lg">
            discover our unique collection
          </p>
          <p className="text-sm text-white italic max-w-md drop-shadow-lg bg-black bg-opacity-40 px-6 py-3 rounded-full">
            "Where creativity meets comfort, and style becomes your signature"
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-white drop-shadow-lg">
            <span className="bg-black bg-opacity-40 px-4 py-1 rounded-full">• Premium Quality</span>
            <span className="bg-black bg-opacity-40 px-4 py-1 rounded-full">• Custom Designs</span>
            <span className="bg-black bg-opacity-40 px-4 py-1 rounded-full">• Express Delivery</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/product')}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg z-20"
        >
          Shop Now
        </button>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentImageIndex
                ? 'bg-white scale-125'
                : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Home; 