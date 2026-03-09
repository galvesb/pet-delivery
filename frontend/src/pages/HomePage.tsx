import { Hero } from "@/components/home/Hero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { ProductCatalog } from "@/components/home/ProductCatalog";

export function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <ProductCatalog />
    </>
  );
}
