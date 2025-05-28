import React, { useState, useEffect, useRef } from 'react';

interface ProductSpecs {
  height: string;
  weight: string;
  build: string;
  color: string;
}

interface ProductType {
  id: string;
  name: string;
  defaultImage: string;
}

interface TextPosition {
  x: number;
  y: number;
}

interface LogoPosition {
  x: number;
  y: number;
  scale: number;
}

interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  rotation: number;
}

const Product: React.FC = () => {
  const [specs, setSpecs] = useState<ProductSpecs>({
    height: '180',
    weight: '80',
    build: 'athletic',
    color: 'white'
  });
  const [textToPrint, setTextToPrint] = useState('');
  const [showText, setShowText] = useState(false);
  const [textStyle, setTextStyle] = useState<TextStyle>({
    fontSize: 24,
    fontFamily: 'Arial',
    color: '#000000',
    rotation: 0
  });
  const [textPosition, setTextPosition] = useState<TextPosition>({ x: 0, y: 0 });
  const [logoPosition, setLogoPosition] = useState<LogoPosition>({ x: 0, y: 0, scale: 1 });
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [dragStart, setDragStart] = useState<TextPosition>({ x: 0, y: 0 });
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [productType, setProductType] = useState('tshirt');
  const [version, setVersion] = useState(1);
  const [errors, setErrors] = useState<Partial<ProductSpecs>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const productColors = [
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Navy', value: 'navy', hex: '#000080' },
    { name: 'Gray', value: 'gray', hex: '#808080' },
    { name: 'Red', value: 'red', hex: '#FF0000' },
    { name: 'Green', value: 'green', hex: '#008000' },
    { name: 'Blue', value: 'blue', hex: '#0000FF' },
    { name: 'Yellow', value: 'yellow', hex: '#FFFF00' },
    { name: 'Purple', value: 'purple', hex: '#800080' },
    { name: 'Pink', value: 'pink', hex: '#FFC0CB' },
    { name: 'Orange', value: 'orange', hex: '#FFA500' },
    { name: 'Brown', value: 'brown', hex: '#A52A2A' },
    { name: 'Light Blue', value: 'lightblue', hex: '#ADD8E6' },
    { name: 'Light Gray', value: 'lightgray', hex: '#D3D3D3' },
    { name: 'Maroon', value: 'maroon', hex: '#800000' },
    { name: 'Teal', value: 'teal', hex: '#008080' }
  ];

  const productTypes: Record<string, ProductType> = {
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

  const fontFamilies = [
    { name: 'Arial', value: 'Arial' },
    { name: 'Times New Roman', value: 'Times New Roman' },
    { name: 'Helvetica', value: 'Helvetica' },
    { name: 'Georgia', value: 'Georgia' },
    { name: 'Verdana', value: 'Verdana' },
    { name: 'Courier New', value: 'Courier New' }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'q') {
        setVersion(prevVersion => (prevVersion % 3) + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      setShowScrollTop(scrollPosition > 300);
      setShowScrollBottom(scrollPosition < documentHeight - windowHeight - 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const validateSpecs = (): boolean => {
    const newErrors: Partial<ProductSpecs> = {};
    
    const heightNum = parseInt(specs.height);
    if (isNaN(heightNum) || heightNum < 150 || heightNum > 220) {
      newErrors.height = 'Height must be between 150cm and 220cm';
    }

    const weightNum = parseInt(specs.weight);
    if (isNaN(weightNum) || weightNum < 40 || weightNum > 150) {
      newErrors.weight = 'Weight must be between 40kg and 150kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSpecsChange = (field: keyof ProductSpecs, value: string) => {
    setSpecs(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const isValid = validateField(field, value);
      if (isValid) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  const validateField = (field: keyof ProductSpecs, value: string): boolean => {
    switch (field) {
      case 'height':
        const heightNum = parseInt(value);
        return !isNaN(heightNum) && heightNum >= 150 && heightNum <= 220;
      case 'weight':
        const weightNum = parseInt(value);
        return !isNaN(weightNum) && weightNum >= 40 && weightNum <= 150;
      default:
        return true;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setShowTooltip('File size must be less than 5MB');
        return;
      }
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImage(reader.result as string);
        centerElements();
        setIsLoading(false);
        setSuccessMessage('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  const handleTextDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!textToPrint) return;
    
    e.preventDefault();
    setIsDraggingText(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleTextDrag = (e: MouseEvent) => {
    if (!isDraggingText || !previewRef.current) return;

    e.preventDefault();
    const previewRect = previewRef.current.getBoundingClientRect();
    
    // Calculate new position relative to the preview container
    const newX = e.clientX - previewRect.left - dragStart.x;
    const newY = e.clientY - previewRect.top - dragStart.y;

    // Calculate boundaries
    const maxX = previewRect.width - 200;
    const maxY = previewRect.height - 100;

    // Constrain position within preview boundaries
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));

    setTextPosition({
      x: constrainedX,
      y: constrainedY
    });
  };

  const handleTextDragEnd = () => {
    setIsDraggingText(false);
  };

  useEffect(() => {
    if (isDraggingText) {
      document.addEventListener('mousemove', handleTextDrag);
      document.addEventListener('mouseup', handleTextDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleTextDrag);
      document.removeEventListener('mouseup', handleTextDragEnd);
    };
  }, [isDraggingText, dragStart]);

  const handleLogoDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleLogoDrag = (e: MouseEvent) => {
    if (!isDraggingLogo || !previewRef.current) return;

    e.preventDefault();
    const previewRect = previewRef.current.getBoundingClientRect();
    
    const newX = e.clientX - previewRect.left - dragStart.x;
    const newY = e.clientY - previewRect.top - dragStart.y;

    const maxX = previewRect.width - 200;
    const maxY = previewRect.height - 100;

    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));

    setLogoPosition(prev => ({
      ...prev,
      x: constrainedX,
      y: constrainedY
    }));
  };

  const handleLogoDragEnd = () => {
    setIsDraggingLogo(false);
  };

  useEffect(() => {
    if (isDraggingLogo) {
      document.addEventListener('mousemove', handleLogoDrag);
      document.addEventListener('mouseup', handleLogoDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleLogoDrag);
      document.removeEventListener('mouseup', handleLogoDragEnd);
    };
  }, [isDraggingLogo, dragStart]);

  const centerElements = () => {
    if (previewRef.current) {
      const previewRect = previewRef.current.getBoundingClientRect();
      const topX = (previewRect.width - 200) / 2;
      const topY = 20; // Position near the top with 20px padding
      
      setTextPosition({ x: topX, y: topY });
      setLogoPosition({ x: topX, y: topY, scale: 1 });
    }
  };

  //const handlePrintText = () => {
    //if (textToPrint.trim()) {
      //setShowText(true);
      //if (previewRef.current) {
        //const previewRect = previewRef.current.getBoundingClientRect();
        //const topX = (previewRect.width - 200) / 2;
        //const topY = 20;
        //setTextPosition({ x: topX, y: topY });
      //}
      //setSuccessMessage('Text added to preview!');
    //}
  //};

  const TextToPrintInput = () => {
    const [localText, setLocalText] = useState(textToPrint);
    const [charCount, setCharCount] = useState(0);
    const [lineCount, setLineCount] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      setLocalText(textToPrint);
      setCharCount(textToPrint.length);
      setLineCount(textToPrint.split('\n').length);
    }, [textToPrint]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      const lines = newText.split('\n');
      
      if (lines.length > 3) {
        return;
      }

      if (newText.length > 150) {
        return;
      }

      setLocalText(newText);
      setCharCount(newText.length);
      setLineCount(lines.length);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        const lines = localText.split('\n');
        if (lines.length >= 3) {
          e.preventDefault();
          setShowTooltip('Maximum 3 lines allowed');
        }
      }
    };

    const handlePrintText = () => {
      if (localText.trim()) {
        setTextToPrint(localText);
        setShowText(true);
        if (previewRef.current) {
          const previewRect = previewRef.current.getBoundingClientRect();
          const topX = (previewRect.width - 200) / 2;
          const topY = 20;
          setTextPosition({ x: topX, y: topY });
        }
        setSuccessMessage('Text added to preview!');
      }
    };

    const renderTextControls = () => {
      if (version === 2) {
        return (
          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setTextStyle(prev => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 2) }))
                  }}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-200"
                >
                  -
                </button>
                <span className="w-12 text-center">{textStyle.fontSize}px</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setTextStyle(prev => ({ ...prev, fontSize: Math.min(72, prev.fontSize + 2) }))
                  }}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                value={textStyle.fontFamily}
                onChange={(e) => setTextStyle(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {fontFamilies.map(font => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textStyle.color}
                  onChange={(e) => setTextStyle(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
                />
                <span className="text-sm text-gray-500">
                  {textStyle.color}
                </span>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rotation
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setTextStyle(prev => ({ ...prev, rotation: (prev.rotation - 15) % 360 }))
                  }}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-200"
                >
                  ↺
                </button>
                <span className="w-12 text-center">{textStyle.rotation}°</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setTextStyle(prev => ({ ...prev, rotation: (prev.rotation + 15) % 360 }))
                  }}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-200"
                >
                  ↻
                </button>
              </div>
            </div>

            {/* Character and Line Count */}
            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {lineCount}/3 lines
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {charCount}/150 characters
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setTextStyle(prev => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 2) }))
                }}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-200"
              >
                -
              </button>
              <span className="w-12 text-center">{textStyle.fontSize}px</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setTextStyle(prev => ({ ...prev, fontSize: Math.min(72, prev.fontSize + 2) }))
                }}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-200"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              value={textStyle.fontFamily}
              onChange={(e) => setTextStyle(prev => ({ ...prev, fontFamily: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {fontFamilies.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textStyle.color}
                onChange={(e) => setTextStyle(prev => ({ ...prev, color: e.target.value }))}
                className="w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
              />
              <span className="text-sm text-gray-500">
                {textStyle.color}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rotation
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setTextStyle(prev => ({ ...prev, rotation: (prev.rotation - 15) % 360 }))
                }}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-200"
              >
                ↺
              </button>
              <span className="w-12 text-center">{textStyle.rotation}°</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setTextStyle(prev => ({ ...prev, rotation: (prev.rotation + 15) % 360 }))
                }}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-200"
              >
                ↻
              </button>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Custom Text</h2>
        <div className="space-y-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={localText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              rows={3}
              maxLength={150}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter up to 3 lines of text to print on your product"
            />
            {version !== 2 && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {charCount}/150 characters
              </div>
            )}
          </div>
          
          {/* Text Style Controls */}
          {renderTextControls()}

          <div className="flex justify-between items-center pt-2">
            {version !== 2 && (
              <div className="text-sm text-gray-500 flex items-center gap-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {lineCount}/3 lines
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {charCount}/150 characters
                </span>
              </div>
            )}
            <button
              onClick={handlePrintText}
              className={`px-4 py-2 rounded-md text-white font-medium transition-all duration-200 ${
                localText.trim() 
                  ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!localText.trim()}
            >
              Print Text
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProductPreview = () => {
    const currentProduct = productTypes[productType];

    const handleLogoSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newScale = parseFloat(e.target.value);
      setLogoPosition(prev => ({
        ...prev,
        scale: newScale
      }));
    };

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md product-preview">
        <h3 className="text-xl font-semibold mb-4">Product Preview</h3>
        <div 
          ref={previewRef}
          className="relative aspect-square max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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
              
              {/* Uploaded Logo */}
              {mainImage && (
                <div 
                  className="absolute cursor-move select-none group"
                  style={{ 
                    zIndex: 2,
                    transform: `translate(${logoPosition.x}px, ${logoPosition.y}px) scale(${logoPosition.scale})`,
                    userSelect: 'none',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '200px',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'none'
                  }}
                  onMouseDown={handleLogoDragStart}
                >
                  <img
                    src={mainImage}
                    alt="Custom logo"
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
                </div>
              )}

              {/* Custom Text */}
              {showText && textToPrint && (
                <div 
                  className="absolute text-center font-medium cursor-move select-none group"
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
                    minWidth: '200px',
                    touchAction: 'none',
                    whiteSpace: 'pre-line',
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseDown={handleTextDragStart}
                >
                  {textToPrint}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
                </div>
              )}

              {/* Upload Area within Preview */}
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
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <div className="text-center p-4">
                    <svg className="mx-auto h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-700 text-sm mt-2">Drag or Click to Upload Logo</p>
                    <p className="text-gray-500 text-xs mt-1">Max size: 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
            {successMessage}
          </div>
        )}

        {/* Tooltip */}
        {showTooltip && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
            {showTooltip}
          </div>
        )}

        {/* Logo Size Controls */}
        {mainImage && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Logo Size</h4>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={logoPosition.scale}
                onChange={handleLogoSizeChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-16 text-center font-medium">
                {Math.round(logoPosition.scale * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Current Specifications Display */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Current Specifications:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Height: {specs.height} cm</div>
            <div>Weight: {specs.weight} kg</div>
            <div>Build: {specs.build}</div>
            <div>Color: {specs.color}</div>
          </div>
        </div>
      </div>
    );
  };

  const ProductPreviewGallery = () => {
    const renderGalleryGrid = () => {
      const currentProduct = productTypes[productType];

      if (version === 3) {
        return (
          <div className="grid grid-cols-3 gap-4">
            {productColors.map((colorInfo) => (
              <div 
                key={`${productType}-${colorInfo.value}`}
                className="relative aspect-square bg-gray-100 overflow-hidden border border-gray-200 rounded-lg group hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: colorInfo.hex }}
              >
                <div className="relative w-full h-full">
                  <img
                    src={currentProduct.defaultImage}
                    alt={`${currentProduct.name} in ${colorInfo.name}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Color Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm py-2 text-center">
                  {colorInfo.name}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <h4 className="text-lg font-medium text-gray-700">{currentProduct.name}</h4>
            <div className="grid grid-cols-8 gap-0">
              {productColors.map((colorInfo) => (
                <div 
                  key={`${productType}-${colorInfo.value}`}
                  className="relative aspect-square bg-gray-100 overflow-hidden border border-gray-200 group hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: colorInfo.hex }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={currentProduct.defaultImage}
                      alt={`${currentProduct.name} in ${colorInfo.name}`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Color Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">
                    {colorInfo.name}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Available Colors</h3>
        {renderGalleryGrid()}
      </div>
    );
  };

  const ActionButton = () => (
    <div className="mt-8 text-center">
      <button
        onClick={() => {
          if (validateSpecs()) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
              setIsLoading(false);
              setSuccessMessage('Product added to cart successfully!');
            }, 1000);
          }
        }}
        disabled={isLoading}
        className={`px-10 py-4 text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-lg relative overflow-hidden ${
          isLoading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Add to Cart'
        )}
      </button>
    </div>
  );

  const ScrollToTopButton = () => (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-blue-700 ${
        showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <span className="text-lg font-bold">↑</span>
    </button>
  );

  const ScrollToBottomButton = () => (
    <button
      onClick={scrollToBottom}
      className={`fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-blue-700 ${
        showScrollBottom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to bottom"
    >
      <span className="text-lg font-bold">↓</span>
    </button>
  );

  const ProductTypeSelection = () => (
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
            onClick={(e) => {
              e.preventDefault();
              setProductType(type.id);
            }}
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

  const SpecificationsForm = () => {
    const [localSpecs, setLocalSpecs] = useState(specs);
    const [isEditing, setIsEditing] = useState<keyof ProductSpecs | null>(null);

    const buildTypes = [
      { value: 'lean', label: 'Lean', description: 'Slim build' },
      { value: 'regular', label: 'Regular', description: 'Average build' },
      { value: 'athletic', label: 'Athletic', description: 'Muscular build' },
      { value: 'big', label: 'Big', description: 'Large build' }
    ];

    const handleInputChange = (field: keyof ProductSpecs, value: string) => {
      // Remove any non-numeric characters except decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      
      // Ensure only one decimal point
      const parts = numericValue.split('.');
      const formattedValue = parts.length > 2 ? `${parts[0]}.${parts[1]}` : numericValue;

      setLocalSpecs(prev => ({ ...prev, [field]: formattedValue }));
    };

    const handleBlur = (field: keyof ProductSpecs) => {
      setIsEditing(null);
      const value = localSpecs[field];
      
      // Validate and format the value
      let validatedValue = value;
      switch (field) {
        case 'height':
          const heightNum = parseFloat(value);
          if (isNaN(heightNum) || heightNum < 150 || heightNum > 220) {
            validatedValue = '180';
            setErrors(prev => ({ ...prev, height: 'Height must be between 150cm and 220cm' }));
          } else {
            validatedValue = heightNum.toString();
            setErrors(prev => ({ ...prev, height: undefined }));
          }
          break;
        case 'weight':
          const weightNum = parseFloat(value);
          if (isNaN(weightNum) || weightNum < 40 || weightNum > 150) {
            validatedValue = '80';
            setErrors(prev => ({ ...prev, weight: 'Weight must be between 40kg and 150kg' }));
          } else {
            validatedValue = weightNum.toString();
            setErrors(prev => ({ ...prev, weight: undefined }));
          }
          break;
      }
      
      setLocalSpecs(prev => ({ ...prev, [field]: validatedValue }));
      handleSpecsChange(field, validatedValue);
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Body Measurements</h3>
        <div className="space-y-6">
          {/* Height Input */}
          <div className="relative">
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Height
            </label>
            <div className="relative">
              <input
                type="text"
                id="height"
                value={localSpecs.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                onFocus={() => setIsEditing('height')}
                onBlur={() => handleBlur('height')}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.height ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter height (150-220cm)"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                cm
              </span>
            </div>
            {errors.height && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.height}
              </p>
            )}
            {isEditing === 'height' && (
              <div className="mt-1 text-xs text-gray-500">
                Enter a value between 150 and 220 centimeters
              </div>
            )}
          </div>

          {/* Weight Input */}
          <div className="relative">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight
            </label>
            <div className="relative">
              <input
                type="text"
                id="weight"
                value={localSpecs.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                onFocus={() => setIsEditing('weight')}
                onBlur={() => handleBlur('weight')}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter weight (40-150kg)"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                kg
              </span>
            </div>
            {errors.weight && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.weight}
              </p>
            )}
            {isEditing === 'weight' && (
              <div className="mt-1 text-xs text-gray-500">
                Enter a value between 40 and 150 kilograms
              </div>
            )}
          </div>

          {/* Build Type Selection */}
          <div>
            <label htmlFor="build" className="block text-sm font-medium text-gray-700 mb-1">
              Build Type
            </label>
            <div className="relative">
              <select
                id="build"
                value={specs.build}
                onChange={(e) => handleSpecsChange('build', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                {buildTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {productColors.map(({ name, value, hex }) => (
                <button
                  key={value}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 ${
                    specs.color === value 
                      ? 'scale-110 border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                  style={{ backgroundColor: hex }}
                  onClick={() => handleSpecsChange('color', value)}
                  title={name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVersion = () => {
    const content = (() => {
      switch (version) {
        case 1:
          return (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold mb-4">Customize Your Product</h2>
                  <ProductTypeSelection />
                  <ProductPreview />
                </div>

                <div className="flex-1 flex flex-col">
                  <SpecificationsForm />
                  <TextToPrintInput />
                  <ActionButton />
                </div>
              </div>

              {/* Full Width Gallery */}
              <div className="w-full">
                <ProductPreviewGallery />
              </div>
            </div>
          );
        case 2:
          return (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar */}
                <div className="lg:col-span-3 flex flex-col gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Product Type</h2>
                    <ProductTypeSelection />
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Specifications</h2>
                    <SpecificationsForm />
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-6 flex flex-col gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Preview</h2>
                    <ProductPreview />
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-3 flex flex-col gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Custom Text</h2>
                    <TextToPrintInput />
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <ActionButton />
                  </div>
                </div>
              </div>

              {/* Full Width Gallery */}
              <div className="w-full">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">Product Gallery</h2>
                  <ProductPreviewGallery />
                </div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Column - Product Selection & Preview */}
                <div className="lg:col-span-5 bg-white/90 backdrop-blur-sm p-6 border-r border-gray-100">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-600">Choose Your Style</h3>
                    <ProductTypeSelection />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-blue-600">Live Preview</h3>
                    <ProductPreview />
                  </div>
                </div>

                {/* Middle Column - Customization */}
                <div className="lg:col-span-4 bg-white/90 backdrop-blur-sm p-6 border-r border-gray-100">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-600">Your Measurements</h3>
                    <SpecificationsForm />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-blue-600">Add Custom Text</h3>
                    <TextToPrintInput />
                  </div>
                </div>

                {/* Right Column - Gallery & Action */}
                <div className="lg:col-span-3 bg-gradient-to-br from-blue-600 to-purple-600 p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 text-white">Product Gallery</h3>
                    <ProductPreviewGallery />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-xl font-bold mb-4 text-white">Ready to Order?</h3>
                    <ActionButton />
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    })();

    return (
      <div className="w-full">
        {content}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8 font-sans bg-gray-50 min-h-screen overflow-y-auto">
      <style>
        {`
          /* Disable automatic scrolling */
          html,
          body,
          #root {
            scroll-behavior: auto !important;
            overflow-y: auto;
          }

          /* Ensure full height and manual scrolling */
          html, body {
            height: 100%;
          }

          #root {
            min-height: 100vh;
          }

          /* Animation for messages */
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-down {
            animation: fadeInDown 0.3s ease-out;
          }
        `}
      </style>
      <div className="mb-8 text-center">
        <span className="text-lg font-semibold text-gray-700">Layout Version:</span>{' '}
        <span className="text-lg font-bold text-blue-600">{version}</span> (Press{' '}
        <kbd className="px-2 py-1 bg-gray-200 border rounded text-gray-700">Alt</kbd> +{' '}
        <kbd className="px-2 py-1 bg-gray-200 border rounded text-gray-700">Q</kbd> to switch)
      </div>

      {renderVersion()}
      <ScrollToTopButton />
      <ScrollToBottomButton />
    </div>
  );
};

export default Product; 