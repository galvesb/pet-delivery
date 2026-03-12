import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { CartOverlay } from "@/components/cart/CartOverlay";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PromoBanner } from "@/components/home/PromoBanner";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { DashboardPage } from "@/pages/admin/DashboardPage";
import { ProductsPage as AdminProductsPage } from "@/pages/admin/ProductsPage";
import { ProductFormPage } from "@/pages/admin/ProductFormPage";
import { CategoriesPage } from "@/pages/admin/CategoriesPage";
import { BannersPage } from "@/pages/admin/BannersPage";
import { BannerFormPage } from "@/pages/admin/BannerFormPage";
import { BrandsPage } from "@/pages/admin/BrandsPage";
import { BrandFormPage } from "@/pages/admin/BrandFormPage";

export function App() {
  return (
    <>
      <PromoBanner />
      <Header />
      <main>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/produto/:id" element={<ProductDetailPage />} />

          {/* Admin (requer role ADMIN) */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/new" element={<ProductFormPage />} />
            <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
            <Route path="/admin/categories" element={<CategoriesPage />} />
            <Route path="/admin/banners" element={<BannersPage />} />
            <Route path="/admin/banners/new" element={<BannerFormPage />} />
            <Route path="/admin/banners/:id/edit" element={<BannerFormPage />} />
            <Route path="/admin/brands" element={<BrandsPage />} />
            <Route path="/admin/brands/new" element={<BrandFormPage />} />
            <Route path="/admin/brands/:id/edit" element={<BrandFormPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />

      {/* Carrinho */}
      <CartOverlay />
      <CartSidebar />
    </>
  );
}
