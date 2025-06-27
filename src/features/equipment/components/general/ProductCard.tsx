import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublicEquipmentItem } from "../../api/equipmentPublicApi";
import ImageCarousel from "./ImageCarousel";
import { useNavigate } from "react-router-dom";
import { RequestTypeEnum } from "@/shared/enums/request-type.enum";

interface Props {
  product: PublicEquipmentItem;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: Props) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="aspect-[4/3] overflow-hidden cursor-pointer" onClick={onClick}>
        <ImageCarousel images={product.images} />
      </div>
      <CardContent className="p-6 flex-1">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="font-semibold text-xl line-clamp-2 flex-1 cursor-pointer" onClick={onClick}>{product.name}</h3>
          <div className={`px-3 py-1.5 rounded-md text-sm font-medium ${product.statusName === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {product.statusName === 'AVAILABLE' ? 'Disponible' : 'No disponible'}
          </div>
        </div>
        
        <p className="text-base text-gray-600 mb-6 line-clamp-3">{product.description}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Marca:</p>
            <p className="text-sm font-medium">{product.brandRelation.name}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Categoría:</p>
            <p className="text-sm font-medium">{product.category.name}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Perfil de uso:</p>
            <p className="text-sm font-medium">{product.generalCategory.name}</p>
          </div>
        </div>

      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="text-sm text-gray-500">Precio de venta</p>
            <p className="text-xl font-bold">S/ {product.salePrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Alquiler diario</p>
            <p className="text-xl font-bold">S/ {product.rentalDailyRate.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate(`/general/request-wizard?type=${RequestTypeEnum.EQUIPMENT_FINANCING}&equipmentId=${product.id}`)}
            className="w-full bg-yellow-400 py-1 px-4 rounded font-bold text-sm text-gray-700 "
          >
             Solicitar financiamiento
          </button>
          <button
            onClick={() => navigate(`/general/request-wizard?type=${RequestTypeEnum.EQUIPMENT_LOAN}&equipmentId=${product.id}`)}
            className="w-full bg-blue-500 py-1 px-4 rounded font-bold text-sm text-gray-700 "
          >
            Solicitar préstamo
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
