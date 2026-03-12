import { Outlet } from "react-router-dom";
import { PromoBanner } from "@/components/home/PromoBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { CartOverlay } from "@/components/cart/CartOverlay";

export function PublicLayout() {
  return (
    <>
      <PromoBanner />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartOverlay />
      <CartSidebar />
    </>
  );
}
