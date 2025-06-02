// src/components/ProductCard.tsx
import { EquipmentDto } from "../../model/EquipmentDto";
import { useState } from "react";

function NoImagePlaceholder() {
  return (
    <div className="w-[200px] h-[200px] flex items-center justify-center bg-white border border-gray-400 rounded-[12px] shadow-md">
      <span className="text-gray-600 font-bold text-lg">SIN IMAGEN</span>
    </div>
  );
}

export default function ProductCard({ producto }: { producto: EquipmentDto }) {
  const {
    name,
    images,
    pricePerMonth,
    regularPricePerMonth,
    promotion,
    initialFee,
    termMonths,
  } = producto;

  const imagesUrls = images.map((img) => img.url).filter(Boolean);
  const [currentImage, setCurrentImage] = useState(0);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % imagesUrls.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + imagesUrls.length) % imagesUrls.length);
  };

  const hasImages = imagesUrls.length > 0;

  return (
    <div className="w-[300px] h-[400px] border rounded-xl p-4 shadow hover:shadow-lg transition bg-white flex flex-col items-center justify-between relative">
      {promotion && (
        <span className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-tr-lg rounded-bl-lg">
          {promotion}
        </span>
      )}

      <div className="relative w-[200px] h-[200px] flex items-center justify-center">
        {hasImages ? (
          <img
            src={imagesUrls[currentImage]}
            alt={name}
            className="w-full h-full object-contain border border-gray-300 rounded-[12px] shadow-md transition-all duration-500 ease-in-out"
          />
        ) : (
          <NoImagePlaceholder />
        )}
      </div>

      {hasImages && imagesUrls.length > 1 && (
        <div className="absolute -left-4 top-[85px] flex items-center justify-between w-[calc(100%+32px)] pointer-events-none px-5">
          <button
            onClick={handlePrev}
            className="pointer-events-auto bg-black/40 text-white rounded-full px-2 py-1 "
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto bg-black/40 text-white rounded-full px-2 py-1 "
          >
            ›
          </button>
        </div>
      )}

      <div className="mt-2 text-center">
        <h2 className="font-semibold text-2xl">{name}</h2>

        <button className="w-full bg-yellow-400 mt-3 py-2 rounded font-bold text-white hover:bg-yellow-500">
          ¡La quiero!
        </button>

        <div className="flex flex-col items-center mt-2 text-sm underline text-blue-600">
          <a href="#">Ver características</a>
        </div>
      </div>
    </div>
  );
}