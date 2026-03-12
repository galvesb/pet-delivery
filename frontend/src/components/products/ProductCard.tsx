import { useNavigate } from "react-router-dom";
import type { Product } from "@/types";
import { useCart } from "@/hooks/useCart";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addItem, items } = useCart();
  const navigate = useNavigate();
  const inCart = items.find((i) => i.product_id === product.id);
  const outOfStock = product.stock === 0;
  const atMax = !outOfStock && !!inCart && inCart.quantity >= product.stock;
  const disabled = outOfStock || atMax;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) addItem(product);
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/produto/${product.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="product-img">
        <img src={product.cover_url} alt={product.name} loading="lazy" />
        {product.discount_price && (
          <span className="discount-badge">
            -{Math.round((1 - product.effective_price / product.price) * 100)}%
          </span>
        )}
      </div>
      <div className="product-info">
        <h4>{product.name}</h4>
        <div className="product-bottom">
          <div className="product-price-group">
            {product.discount_price ? (
              <>
                <span className="product-price-original">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                <span className="product-price">
                  R$ {product.effective_price.toFixed(2).replace(".", ",")}
                </span>
              </>
            ) : (
              <span className="product-price">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>
          <button
            className="add-to-cart-btn"
            onClick={handleAdd}
            disabled={disabled}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            {outOfStock ? "Esgotado" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
