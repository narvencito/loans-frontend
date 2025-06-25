import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublicEquipmentItem } from "../../api/equipmentPublicApi";
import ImageCarousel from "./ImageCarousel";

interface Props {
  product: PublicEquipmentItem;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: Props) => {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="aspect-square overflow-hidden">
        <ImageCarousel images={product.images} />
      </div>
      <CardContent className="p-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1">{product.name}</h3>
          <div className={`px-2 py-1 rounded text-sm ${product.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {product.status === 'AVAILABLE' ? 'Disponible' : 'No disponible'}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Marca:</p>
            <p className="text-sm font-medium">{product.brandName}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Categoría:</p>
            <p className="text-sm font-medium">{product.categoryName}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Perfil de uso:</p>
            <p className="text-sm font-medium">{product.generalCategoryName}</p>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          {product.features.slice(0, 2).map((feature) => (
            <div key={feature.id} className="text-sm">
              <span className="text-gray-500">{feature.name}:</span>
              <span className="ml-1 font-medium">{feature.value}</span>
            </div>
          ))}
          {product.features.length > 2 && (
            <p className="text-sm text-blue-600">+ {product.features.length - 2} características más</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="text-sm text-gray-500">Precio de venta</p>
            <p className="text-lg font-bold">S/ {product.salePrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Alquiler diario</p>
            <p className="text-lg font-bold">S/ {product.rentalDailyRate.toFixed(2)}</p>
          </div>
        </div>
        <Button 
          onClick={onClick}
          className="w-full"
        >
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
