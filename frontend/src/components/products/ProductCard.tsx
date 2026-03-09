import type { Product } from "@/types";
import { useCart } from "@/hooks/useCart";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product);
  };

  return (
    <div className="product-card">
      <div className="product-img">
        <img src={product.image_url} alt={product.name} loading="lazy" />
      </div>
      <div className="product-info">
        <h4>{product.name}</h4>
        <p>{product.description}</p>
        <div className="product-bottom">
          <span className="product-price">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          <button className="add-to-cart-btn" onClick={handleAdd} aria-label={`Adicionar ${product.name} ao carrinho`}>
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
