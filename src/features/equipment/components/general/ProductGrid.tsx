import { useState } from 'react';
import { PublicEquipmentItem } from '../../api/equipmentPublicApi';
import ProductCard from './ProductCard';
import ProductDetailDialog from './ProductDetailDialog';

interface Props {
  products: PublicEquipmentItem[];
}

const ProductGrid = ({ products }: Props) => {
  const [selectedProduct, setSelectedProduct] = useState<PublicEquipmentItem | null>(null);

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No se encontraron equipos que coincidan con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      <ProductDetailDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default ProductGrid;
