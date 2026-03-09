import { useState } from "react";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { ProductGrid } from "@/components/products/ProductGrid";

export function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState("todos");

  return (
    <section id="menu-produtos" className="products container">
      <h2>Menu de Produtos</h2>
      <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />
      <ProductGrid category={activeCategory} />
    </section>
  );
}
