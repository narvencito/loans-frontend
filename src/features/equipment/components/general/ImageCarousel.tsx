// src/components/ImageCarousel.tsx
import { useState } from 'react';

interface Props {
  images: { url: string }[];
  height?: string; // e.g. 'h-64' or 'h-[300px]'
  rounded?: string; // e.g. 'rounded-md'
}

export default function ImageCarousel({ images, height = 'h-64', rounded = 'rounded-md' }: Props) {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const currentImage = images[current]?.url || '/placeholder.png';

  return (
    <div className={`relative w-full max-w-md mx-auto ${height}`}>
      <img
        src={currentImage}
        alt={`Imagen ${current + 1}`}
        className={`w-full ${height} object-contain border shadow-md ${rounded} transition-all duration-500 ease-in-out`}
      />

      {images.length > 1 && (
        <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center px-4 transform -translate-y-1/2">
          <button
            onClick={handlePrev}
            className="bg-black/40 text-white rounded-full px-2 py-1 hover:bg-black/60"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="bg-black/40 text-white rounded-full px-2 py-1 hover:bg-black/60"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
