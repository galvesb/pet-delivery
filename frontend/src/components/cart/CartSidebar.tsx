import { useCart } from "@/hooks/useCart";
import { CartItem } from "./CartItem";

export function CartSidebar() {
  const { items, isOpen, closeCart, getTotal } = useCart();

  return (
    <aside className={`cart-sidebar${isOpen ? " active" : ""}`} id="cart-sidebar" aria-label="Carrinho">
      <div className="cart-header">
        <h2>Seu Carrinho</h2>
        <button className="close-cart" onClick={closeCart} aria-label="Fechar carrinho">✖</button>
      </div>

      <div className="cart-items" id="cart-items-container">
        {items.length === 0 ? (
          <p style={{ color: "var(--gray-text)", textAlign: "center", marginTop: 20 }}>
            Seu carrinho está vazio.
          </p>
        ) : (
          items.map((item) => <CartItem key={item.product_id} item={item} />)
        )}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span>R$ {getTotal().toFixed(2).replace(".", ",")}</span>
        </div>
        <button
          className="btn checkout-btn"
          style={{ width: "100%", textAlign: "center" }}
          onClick={() => alert("Redirecionando para o Checkout!")}
          disabled={items.length === 0}
        >
          Finalizar Pedido
        </button>
      </div>
    </aside>
  );
}
