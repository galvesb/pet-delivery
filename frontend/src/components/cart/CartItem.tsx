import type { CartItem as CartItemType } from "@/types";
import { useCart } from "@/hooks/useCart";

interface Props {
  item: CartItemType;
}

export function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();
  const atMax = item.stock > 0 && item.quantity >= item.stock;

  return (
    <div className="cart-item">
      <img src={item.image_url} alt={item.name} />
      <div className="cart-item-info">
        <div className="cart-item-header">
          <div className="cart-item-title">{item.name}</div>
          <button
            className="cart-item-remove"
            onClick={() => removeItem(item.product_id)}
            aria-label={`Remover ${item.name}`}
            title="Remover item"
          >
            ✕
          </button>
        </div>
        <div className="cart-item-unit-price">
          {item.original_price && (
            <span className="cart-item-price-original">
              R$ {item.original_price.toFixed(2).replace(".", ",")}
            </span>
          )}
          R$ {item.price.toFixed(2).replace(".", ",")} / un.
        </div>
        <div className="cart-item-bottom">
          <div className="cart-qty-controls">
            <button
              className="cart-qty-btn"
              onClick={() => updateQuantity(item.product_id, -1)}
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <span className="cart-qty-value">{item.quantity}</span>
            <button
              className="cart-qty-btn"
              onClick={() => updateQuantity(item.product_id, +1)}
              disabled={atMax}
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
          <div className="cart-item-price">
            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
          </div>
        </div>
      </div>
    </div>
  );
}
