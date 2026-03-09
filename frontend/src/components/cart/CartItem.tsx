import type { CartItem as CartItemType } from "@/types";
import { useCart } from "@/hooks/useCart";

interface Props {
  item: CartItemType;
}

export function CartItem({ item }: Props) {
  const { removeItem } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image_url} alt={item.name} />
      <div className="cart-item-info">
        <div>
          <div className="cart-item-title">
            {item.name} (x{item.quantity})
          </div>
          <div className="cart-item-price">
            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
          </div>
        </div>
        <button
          className="remove-item"
          onClick={() => removeItem(item.product_id)}
          aria-label={`Remover ${item.name}`}
        >
          Remover
        </button>
      </div>
    </div>
  );
}
