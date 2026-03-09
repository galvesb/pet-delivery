import { useCart } from "@/hooks/useCart";

export function CartOverlay() {
  const { isOpen, closeCart } = useCart();
  return (
    <div
      className={`cart-overlay${isOpen ? " active" : ""}`}
      onClick={closeCart}
      aria-hidden="true"
    />
  );
}
