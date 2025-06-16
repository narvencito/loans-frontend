import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { equipmentPublicApi } from '../../api/equipmentPublicApi';
import ProductDetailDialog from './ProductDetailDialog';
import { EquipmentItem } from '../../api/equipment_api';
import SalesAssistantWidget from '@/features/assistant/components/SalesAssistantWidget';
import EquipmentChatBot from '@/features/chatbot/components/EquipmentChatBot';

export default function ProductGrid() {
  const [productos, setProductos] = useState<EquipmentItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<EquipmentItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    equipmentPublicApi.getAll().then(setProductos).catch(console.error);
  }, []);

  const handleViewDetail = (producto: EquipmentItem) => {
    setSelectedProduct(producto);
    setShowDetail(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-wrap justify-center gap-6">
        {productos.map(producto => (
          <ProductCard
            key={producto.id}
            producto={producto}
            onViewDetail={() => handleViewDetail(producto)}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailDialog
          open={showDetail}
          onClose={() => setShowDetail(false)}
          equipment={selectedProduct}
        />
      )}

      <div className="animate__animated animate__bounceIn p-10">
        <EquipmentChatBot />
      </div>
    </div>
  );
}
