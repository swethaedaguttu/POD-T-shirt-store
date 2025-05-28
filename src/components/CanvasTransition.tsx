import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface CanvasTransitionProps {
  images: string[];
  currentIndex: number;
  onTransitionComplete?: () => void;
}

interface Mover {
  id: number;
  isCurrent: boolean; // true if animating from current image, false for next image
  startRect: { x: number; y: number; width: number; height: number };
  endRect: { x: number; y: number; width: number; height: number };
  progress: number; // 0 to 1
  delay: number; // Animation start delay
  duration: number; // Animation duration
  ease: string; // GSAP ease string
  clipPathDirection: string; // Direction of clip-path animation
  rotation: number; // Z-axis rotation
  wobbleX: number; // Random horizontal wobble
  wobbleY: number; // Random vertical wobble
  x: number; // Current x position
  y: number; // Current y position
  width: number; // Current width
  height: number; // Current height
  // We no longer need sourceRect directly on the mover, as we'll calculate it during drawing
}

interface AnimationConfig {
  steps: number;
  stepDuration: number;
  stepInterval: number;
  moverPauseBeforeExit: number;
  rotationRange: number;
  wobbleStrength: number;
  pathMotion: 'linear' | 'sine';
  sineAmplitude: number;
  sineFrequency: number;
  moverEnterEase: string;
  moverExitEase: string;
  panelRevealEase: string;
  gridItemEase: string;
  // Added for potential alpha animation control
  moverStartAlpha: number;
  moverEndAlpha: number;
  // Configuration for the repeating grid
  gridCols: number;
  gridRows: number;
}

// Configuration object for animation settings (simplified based on original)
const config: AnimationConfig = {
  steps: 6, // Number of mover elements
  stepDuration: 0.35, // Duration (in seconds) for each animation step
  stepInterval: 0.05, // Delay between each mover's animation start
  moverPauseBeforeExit: 0.14, // Pause before mover elements exit
  rotationRange: 0, // Maximum random rotation
  wobbleStrength: 0, // Maximum random positional wobble
  pathMotion: 'linear', // Type of path movement ('linear' or 'sine')
  sineAmplitude: 50, // Amplitude of sine wave for pathMotion 'sine'
  sineFrequency: Math.PI, // Frequency of sine wave for pathMotion 'sine'
  moverEnterEase: 'sine.in', // Easing function for mover entering animation
  moverExitEase: 'sine', // Easing function for mover exit animation
  panelRevealEase: 'sine.inOut', // Easing function for panel reveal animation
  gridItemEase: 'sine', // Easing function for grid item exit animation
  moverStartAlpha: 0.4, // Based on initial opacity in original GSAP timeline
  moverEndAlpha: 1.0, // Based on end opacity in original GSAP timeline
  gridCols: 5, // Example: 5 columns in the repeating grid
  gridRows: 3, // Example: 3 rows in the repeating grid
};

// Linear interpolation helper
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Get appropriate clipping rectangle for canvas based on direction and progress
const getClippingRect = (direction: string, progress: number, rect: {x: number, y: number, width: number, height: number}) => {
  let { x, y, width, height } = rect;

  switch (direction) {
    case 'bottom-top':
      height = rect.height * progress; // Clip from bottom, height increases
      y = rect.y + rect.height * (1 - progress); // Y starts lower and moves up
      break;
    case 'left-right':
      width = rect.width * progress; // Clip from left, width increases
      x = rect.x + rect.width * (1 - progress); // X starts right and moves left
      break;
    case 'right-left':
      width = rect.width * progress; // Clip from right, width increases
      // X starts at rect.x and stays there
      break;
    case 'top-bottom':
    default:
      height = rect.height * progress; // Clip from top, height increases
      // Y starts at rect.y and stays there
      break;
  }
  return { x, y, width, height };
};

const CanvasTransition: React.FC<CanvasTransitionProps> = ({
  images,
  currentIndex,
  onTransitionComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [movers, setMovers] = useState<Mover[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const previousIndex = useRef<number>(currentIndex);

  useEffect(() => {
    console.log('Loading images:', images);
    // Load all images
    const loadImages = async () => {
      try {
        const imageElements = await Promise.all(
          images.map(
            (src) =>
              new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                  console.log('Image loaded successfully:', src);
                  resolve(img);
                };
                img.onerror = (e) => {
                  console.error('Error loading image:', src, e);
                  reject(e);
                };
                img.src = src;
              })
          )
        );
        console.log('All images loaded:', imageElements);
        setLoadedImages(imageElements);
      } catch (error) {
        console.error('Error loading one or more images:', error);
      }
    };

    loadImages();
  }, [images]);

  // Effect to draw the current image as a repeating grid when not transitioning or after a transition completes
   useEffect(() => {
     // Only draw if images are loaded and no transition is active (movers array is empty)
     if (loadedImages.length === 0 || movers.length > 0) return;

     const canvas = canvasRef.current;
     const ctx = canvas?.getContext('2d');
     if (!canvas || !ctx) return;

      console.log('Drawing static tiled image:', images[currentIndex]);

     // Set canvas size to match window size
     const resizeCanvas = () => {
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;

        // Redraw the grid after resize
        if (loadedImages[currentIndex]) {
            drawTiledImage(ctx, loadedImages[currentIndex], canvas.width, canvas.height, config.gridCols, config.gridRows);
        }
     };

     resizeCanvas(); // Initial draw
     window.addEventListener('resize', resizeCanvas);

     const currentImage = loadedImages[currentIndex];
     if (currentImage) {
       drawTiledImage(ctx, currentImage, canvas.width, canvas.height, config.gridCols, config.gridRows);
     }

     return () => {
       window.removeEventListener('resize', resizeCanvas);
     };
   }, [currentIndex, loadedImages, images, movers.length]);

    // Helper function to draw a tiled image
    const drawTiledImage = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, canvasWidth: number, canvasHeight: number, cols: number, rows: number) => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const tileWidth = canvasWidth / cols;
        const tileHeight = canvasHeight / rows;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            ctx.drawImage(
              image,
              0, 0, image.width, image.height, // Source rectangle (entire image)
              col * tileWidth, row * tileHeight, tileWidth + 1, tileHeight + 1 // Destination rectangle (each tile) - added +1 to prevent gaps
            );
          }
        }
    };

  useEffect(() => {
    if (loadedImages.length === 0 || currentIndex === previousIndex.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    console.log('Starting transition for image index:', currentIndex);
    
    // Capture the state *before* the index changes for the transition start
    const startImageIndex = previousIndex.current;

    previousIndex.current = currentIndex; // Update previous index for the *next* transition

    // Set canvas size to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Note: Redrawing movers on resize during animation is complex and might cause visual glitches.
      // For now, focusing on stable animation. Full resize handling during transition might require
      // recalculating mover paths and states, which is beyond the current scope.
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Animation Setup ---
    // Placeholder for start and end element bounds - in a real scenario, these would come from the DOM elements
    // For a full-screen grid transition, the start and end rects for the overall animation are likely the full canvas size
    //const startRect = { x: 0, y: 0, width: canvas.width, height: canvas.height };
    //const endRect = { x: 0, y: 0, width: canvas.width, height: canvas.height };

    //const startCenter = {
    // x: startRect.x + startRect.width / 2,
    // y: startRect.y + startRect.height / 2,
    //};
    //const endCenter = {
    //  x: endRect.x + endRect.width / 2,
    //  y: endRect.y + endRect.height / 2,
    //};

    //const fullSteps = config.steps + 2;

    const generatedMovers: Mover[] = [];

    // The movers should correspond to the tiles in the grid
    const tileWidth = canvas.width / config.gridCols;
    const tileHeight = canvas.height / config.gridRows;

    let moverId = 0;
    for (let row = 0; row < config.gridRows; row++) {
        for (let col = 0; col < config.gridCols; col++) {

            // Define start and end positions for each mover (tile)
            // In the original demo, movers animate from a position/size within the grid item
            // to a position/size on the panel. Here, they animate from a tile position
            // to potentially another tile position or off-screen.
            const moverStartRect = { x: col * tileWidth, y: row * tileHeight, width: tileWidth, height: tileHeight };
            const moverEndRect = { x: col * tileWidth, y: row * tileHeight, width: tileWidth, height: tileHeight }; // Simplified end: stays at tile position
            // TODO: Implement more accurate endRect calculation based on original demo's panel/target positioning

            // Recalculate t based on mover index within the grid for staggered animation
             //const totalMovers = config.gridCols * config.gridRows;
             //const moverT = moverId / (totalMovers > 1 ? totalMovers - 1 : 1); // t value based on mover index, handle case with 1 mover

            // Apply top offset (for sine motion) - needs to be based on overall animation progress (t)
            // Sine motion with tiling might require adjusting the source image position
            //const sineOffset = 0; // Placeholder

            // Add random wobble
            const wobbleX = (Math.random() - 0.5) * config.wobbleStrength;
            const wobbleY = (Math.random() - 0.5) * config.wobbleStrength;

            generatedMovers.push({
              id: moverId,
              isCurrent: true, // Animating from the current image grid
              startRect: moverStartRect,
              endRect: moverEndRect, // This needs to be the position/size on the target image
              progress: 0,
              delay: moverId * config.stepInterval * 1000, // Stagger delay based on mover index
              duration: config.stepDuration * 1000,
              ease: config.moverEnterEase,
              clipPathDirection: 'top-bottom', // This should likely be varied per mover based on original demo
              rotation: gsap.utils.random(-config.rotationRange, config.rotationRange),
              wobbleX,
              wobbleY,
              x: moverStartRect.x, // Initial x position
              y: moverStartRect.y, // Initial y position
              width: moverStartRect.width, // Initial width
              height: moverStartRect.height, // Initial height
            });
            moverId++;
        }
    }

    setMovers(generatedMovers);

    // --- Animation Loop ---
    const animate = (currentTime: number) => {
      if (!startTime.current) startTime.current = currentTime;
      const elapsed = currentTime - startTime.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allComplete = true;

      // During the transition, draw the *next* image as a background behind the animating movers
       const nextImage = loadedImages[currentIndex]; // The image we are transitioning *to*
       if (nextImage) {
           ctx.save();
           ctx.globalAlpha = 1; // Full opacity for the background image
            // Draw the next image tiled as the background
            drawTiledImage(ctx, nextImage, canvas.width, canvas.height, config.gridCols, config.gridRows);
           ctx.restore();
       }

      setMovers((prevMovers) =>
        prevMovers.map((mover) => {
          const moverElapsed = elapsed - mover.delay;
          let progress = 0;
          // Calculate progress only if elapsed time is beyond the delay
          if (moverElapsed > 0) {
             progress = Math.min(moverElapsed / mover.duration, 1);
          }

          // Apply easing
          const easedProgress = gsap.utils.pipe(gsap.parseEase(mover.ease))(progress); // Use gsap.utils.pipe for easing

          // Calculate current position and size based on eased progress and wobble
          const currentX = lerp(mover.startRect.x, mover.endRect.x, easedProgress) + mover.wobbleX; // Lerp between start and end tile positions
          const currentY = lerp(mover.startRect.y, mover.endRect.y, easedProgress) + mover.wobbleY;
          const currentWidth = lerp(mover.startRect.width, mover.endRect.width, easedProgress);
          const currentHeight = lerp(mover.startRect.height, mover.endRect.height, easedProgress);

           // Apply top offset (for sine motion) - needs to be based on overall animation progress (t)
           // Sine motion with tiling might require adjusting the source image position
           const sineOffset = 0; // Placeholder

          // Update mover properties for drawing
          const updatedMover = { ...mover, x: currentX, y: currentY + sineOffset, width: currentWidth, height: currentHeight };

          // Draw the mover
          if (loadedImages.length > 0) {
            ctx.save();
            // Translate and rotate to the center of the mover's current animated position
            ctx.translate(updatedMover.x + updatedMover.width / 2, updatedMover.y + updatedMover.height / 2);
            ctx.rotate(updatedMover.rotation * Math.PI / 180);

             // Calculate the source rectangle (portion of the original image)
            const sourceImage = loadedImages[startImageIndex]; // Image the transition is starting from
            const imageWidth = sourceImage.width;
            const imageHeight = sourceImage.height;

            // Calculate the source x, y to get the correct tiled portion
            // This requires mapping the mover's grid position back to the original image
             const tileCol = mover.id % config.gridCols;
             const tileRow = Math.floor(mover.id / config.gridCols);
             const sourceX = (tileCol / config.gridCols) * imageWidth; // X based on column index
             const sourceY = (tileRow / config.gridRows) * imageHeight; // Y based on row index

             const sourceWidth = imageWidth / config.gridCols; // Source width is the width of one tile in the original image
             const sourceHeight = imageHeight / config.gridRows; // Source height is the height of one tile in the original image

             // Apply clipping based on clipPathDirection and mover progress
            // The clipping rectangle should be relative to the translated and rotated canvas context (the mover's space)
            const clippingRect = getClippingRect(updatedMover.clipPathDirection, easedProgress, {x: -updatedMover.width / 2, y: -updatedMover.height / 2, width: updatedMover.width, height: updatedMover.height});

            ctx.beginPath();
            ctx.rect(clippingRect.x, clippingRect.y, clippingRect.width, clippingRect.height);
            ctx.clip();

            // Apply alpha based on mover animation progress (entering/exiting)
            // Simple approach: fade in during moverEnterEase duration, then stay opaque
             let moverAlpha = 0;
             // Only apply alpha animation during the mover's active duration
             if (moverElapsed > 0) { // Start fading/animating when elapsed time is beyond delay
                 // Calculate progress for alpha animation (can be different from position/size progress)
                 let alphaProgress = Math.min(moverElapsed / mover.duration, 1);
                 moverAlpha = lerp(config.moverStartAlpha, config.moverEndAlpha, alphaProgress); // Fade in
                 
                 // TODO: Implement fade out during moverExitEase
             }

             ctx.globalAlpha = moverAlpha;

            // Draw the segment of the source image onto the clipped area
            // The destination rectangle is the full area of the mover in its local coordinate space
            ctx.drawImage(
              sourceImage,
              sourceX, sourceY, sourceWidth, sourceHeight, // Source rectangle (from the original image - the tile portion)
              -updatedMover.width / 2, -updatedMover.height / 2, updatedMover.width, updatedMover.height // Destination rectangle (scaled to mover size) - draw at translated origin
            );

            ctx.restore();
          }

          // Check if this mover's animation is complete
          // Consider the mover complete after its duration + a small buffer
          if (moverElapsed < mover.duration + config.moverPauseBeforeExit * 1000) {
             allComplete = false;
          }

          return updatedMover;
        })
      );

      if (!allComplete) { // Continue animation if any mover is not complete
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        console.log('Transition complete');
        onTransitionComplete?.();
        setMovers([]); // Clear movers after animation
        startTime.current = null;
        // Immediately redraw the static grid of the new current image after transition completes
        const finalCanvas = canvasRef.current;
        const finalCtx = finalCanvas?.getContext('2d');
        if (finalCanvas && finalCtx && loadedImages[currentIndex]) {
            drawTiledImage(finalCtx, loadedImages[currentIndex], finalCanvas.width, finalCanvas.height, config.gridCols, config.gridRows);
        }
      }
    };

    // Start animation
    startTime.current = null; // Reset start time for each new transition
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [currentIndex, images.length, loadedImages, onTransitionComplete]); // Added loadedImages to dependencies


  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default CanvasTransition;