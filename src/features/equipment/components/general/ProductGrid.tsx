import { useState } from 'react';
import { PublicEquipmentItem } from '../../api/equipmentPublicApi';
import ProductCard from './ProductCard';
import ProductDetailDialog from './ProductDetailDialog';

interface Props {
  products: PublicEquipmentItem[];
}

const ProductGrid = ({ products }: Props) => {
  const [selectedProduct, setSelectedProduct] = useState<PublicEquipmentItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
