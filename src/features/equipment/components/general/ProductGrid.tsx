import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { EquipmentDto } from '../../model/EquipmentDto';
import { equipmentPublicApi } from '../../api/equipmentPublicApi';

export default function ProductGrid() {
  const [productos, setProductos] = useState<EquipmentDto[]>([]);

   useEffect(() => {
    equipmentPublicApi.getAll().then(setProductos).catch(console.error);
  }, []);

  return (
     <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-wrap gap-4 justify-center">
        {productos.map(producto => (
          <div key={producto.id} className="w-[300px]">
            <ProductCard producto={producto} />
          </div>
        ))}
      </div>
    </div>
  );
}