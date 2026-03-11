import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import type { Product } from "@/types";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get<{ items: Product[]; total: number }>("/products", {
      params: { featured: true, limit: 4 },
    }).then((res) => {
      setProducts(res.data.items);
    }).catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="featured-products container">
      <h2>Produtos em Destaque</h2>
      <div className="featured-products-grid">
        {products.map((product) => (
          <div key={product.id} className="featured-product-card">
            <Link to={`/produto/${product.id}`} className="featured-product-img-link">
              <img
                src={product.cover_url}
                alt={product.name}
                className="featured-product-img"
              />
            </Link>
            <div className="featured-product-info">
              <h3 className="featured-product-name">{product.name}</h3>
              <p className="featured-product-price">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
              <Link to={`/produto/${product.id}`} className="btn btn-outline featured-product-btn">
                Ver produto
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="featured-products-footer">
        <Link to="/products" className="btn">Ver todos os produtos</Link>
      </div>
    </section>
  );
}
