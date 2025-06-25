import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PublicEquipmentItem } from "../../api/equipmentPublicApi";
import ImageCarousel from "./ImageCarousel";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  product: PublicEquipmentItem | null;
  open: boolean;
  onClose: () => void;
}

const ProductDetailDialog = ({ product, open, onClose }: Props) => {
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-5xl max-h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <div className="aspect-square">
                <ImageCarousel images={product.images} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Información general</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Marca</p>
                    <p className="font-medium">{product.brandName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Categoría</p>
                    <p className="font-medium">{product.categoryName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Perfil de uso</p>
                    <p className="font-medium">{product.generalCategoryName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <div className={`inline-block px-2 py-1 rounded text-sm mt-1 ${product.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.status === 'AVAILABLE' ? 'Disponible' : 'No disponible'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Precios</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">Precio de venta</p>
                    <p className="text-2xl font-bold text-blue-700">
                      S/ {product.salePrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Tarifa diaria</p>
                    <p className="text-2xl font-bold text-green-700">
                      S/ {product.rentalDailyRate.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Descripción</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Características</h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.features.map((feature) => (
                    <div key={feature.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">{feature.name}</p>
                      <p className="text-sm text-gray-600">{feature.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    onClose();
                    navigate('/request/new', { state: { equipmentId: product.id } });
                  }}
                >
                  Solicitar equipo
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
