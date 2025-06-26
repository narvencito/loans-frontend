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

// Mapa de traducción de estados
const statusTranslations: { [key: string]: { label: string; className: string } } = {
  'AVAILABLE': { label: 'Disponible', className: 'bg-green-100 text-green-800' },
  'IN_USE': { label: 'En Uso', className: 'bg-blue-100 text-blue-800' },
  'UNDER_MAINTENANCE': { label: 'En Mantenimiento', className: 'bg-yellow-100 text-yellow-800' },
  'OUT_OF_SERVICE': { label: 'Fuera de Servicio', className: 'bg-red-100 text-red-800' },
  'RESERVED': { label: 'Reservado', className: 'bg-purple-100 text-purple-800' },
  'PENDING_RETURN': { label: 'Pendiente de Devolución', className: 'bg-orange-100 text-orange-800' },
  'LOST': { label: 'Perdido', className: 'bg-gray-100 text-gray-800' },
  'DAMAGED': { label: 'Dañado', className: 'bg-red-100 text-red-800' },
  'NEW': { label: 'Nuevo', className: 'bg-green-100 text-green-800' },
  'USED': { label: 'Usado', className: 'bg-blue-100 text-blue-800' },
  'REFURBISHED': { label: 'Reacondicionado', className: 'bg-yellow-100 text-yellow-800' }
};

const ProductDetailDialog = ({ product, open, onClose }: Props) => {
  const navigate = useNavigate();

  if (!product) return null;

  const getStatusInfo = (status: string) => {
    const normalizedStatus = status?.toUpperCase() || 'UNKNOWN';
    return statusTranslations[normalizedStatus] || { label: status || 'Desconocido', className: 'bg-gray-100 text-gray-800' };
  };

  // Agrupar características por tipo
  const groupedFeatures = product.features.reduce((acc: { [key: string]: typeof product.features }, feature) => {
    // Asumimos que todas las características son del mismo tipo para este caso
    const type = 'Especificaciones';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(feature);
    return acc;
  }, {});

  const statusInfo = getStatusInfo(product.statusName);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-5xl max-h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span>{product.name}</span>
            <div className={`px-2 py-1 rounded text-sm ${statusInfo.className}`}>
              {statusInfo.label}
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <div className="max-w-lg mx-auto aspect-[4/2] rounded-lg overflow-hidden border">
                <ImageCarousel images={product.images} />
              </div>

              <div className="bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Información general</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Marca</p>
                    <p className="font-medium">{product.brandRelation?.name || 'No especificada'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Categoría</p>
                    <p className="font-medium">{product.category?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Perfil de uso</p>
                    <p className="font-medium">{product.generalCategory?.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Precios</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className=" bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">Precio de venta</p>
                    <p className="text-2xl font-bold text-blue-700">
                      S/ {product.salePrice.toFixed(2)}
                    </p>
                  </div>
                  <div className=" bg-green-50 rounded-lg">
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Descripción</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Características</h3>
                <div className="space-y-4">
                  {Object.entries(groupedFeatures).map(([type, features]) => (
                    <div key={type}>
                      <h4 className="font-medium text-gray-700 mb-2">{type}</h4>
                      <div className="flex flex-wrap gap-2">
                        {features.map((feature) => (
                          <div 
                            key={feature.id} 
                            className="p-1 bg-white rounded-lg border inline-flex flex-col"
                          >
                            <p className="text-sm font-medium">{feature.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{feature.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
