import { useState } from "react";
import { EquipmentItem } from "../../api/equipment_api";
import { useNavigate } from "react-router-dom";

function NoImagePlaceholder() {
  return (
    <div className="w-[200px] h-[200px] flex items-center justify-center bg-white border border-gray-400 rounded-[12px] shadow-md">
      <span className="text-gray-600 font-bold text-lg">SIN IMAGEN</span>
    </div>
  );
}

interface Props {
  producto: EquipmentItem;
  onViewDetail?: () => void;
}

export default function ProductCard({ producto, onViewDetail }: Props) {
  const {
    name,
    images,
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

  const navigate = useNavigate();
  // const handleContinue = () => { // This function will be removed
  //   navigate('/financing/personal-data');
  // };

  return (
    <div className="w-[300px] h-[400px] border rounded-xl shadow hover:shadow-lg transition bg-white flex flex-col items-center justify-between relative p-4">

      <div className="relative w-[200px] h-[200px] flex items-center justify-center mx-auto">
        {hasImages ? (
          <>
            <img
              key={currentImage}
              src={imagesUrls[currentImage]}
              alt={name}
              className="w-full h-full object-contain border border-gray-300 rounded-[12px] shadow-md transition-opacity duration-300 ease-in-out"
            />

            {imagesUrls.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute -left-6 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60"
                >
                  ‹
                </button>
                <button
                  onClick={handleNext}
                  className="absolute -right-6 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60"
                >
                  ›
                </button>
              </>
            )}
          </>
        ) : (
          <NoImagePlaceholder />
        )}
      </div>

      <div className="mt-2 text-center w-full flex-1 flex flex-col justify-between">
        <h2 className="font-semibold text-2xl">{name}</h2>

        <button
          onClick={() => navigate(`/request-wizard?type=financing&equipmentId=${producto.id}`)}
          className="w-full bg-yellow-400 mt-3 py-2 rounded font-bold text-white hover:bg-yellow-500">
          ¡La quiero!
        </button>

        <button
          onClick={() => navigate(`/request-wizard?type=equipment&equipmentId=${producto.id}`)}
          className="w-full bg-blue-500 mt-3 py-2 rounded font-bold text-white hover:bg-blue-600" // Added some basic styling for visibility
        >
          Solicitar préstamo
        </button>
        <button
          onClick={() => navigate(`/request-wizard?type=financing&equipmentId=${producto.id}`)}
          className="w-full bg-green-500 mt-3 py-2 rounded font-bold text-white hover:bg-green-600" // Added some basic styling for visibility
        >
          Solicitar financiamiento
        </button>

        <div className="flex flex-col items-center mt-2 text-sm underline text-blue-600">
          <button onClick={onViewDetail} className="hover:text-blue-800">
            Ver características
          </button>
        </div>
      </div>
    </div>
  );
}
