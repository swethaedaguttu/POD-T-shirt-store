import React, { useEffect, useState } from 'react';

interface ImageTransitionProps {
  images: string[];
  interval?: number;
}

const ImageTransition: React.FC<ImageTransitionProps> = ({ 
  images, 
  interval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Log the current images array
    console.log('Available images:', images);

    // Preload images
    images.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Successfully loaded: ${src}`);
        setLoadedImages(prev => new Set([...prev, src]));
      };
      img.onerror = () => {
        console.error(`Failed to load: ${src}`);
      };
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    const timer = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const currentImage = images[currentIndex];
  const isLoaded = loadedImages.has(currentImage);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {isLoaded ? (
        <img
          src={currentImage}
          alt={`Slide ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 1, transition: 'opacity 0.5s ease-in-out' }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white">Loading image...</div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageTransition; 