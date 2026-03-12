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
            <Link to={`/produto/${product.id}`} className="featured-product-img-link" style={{ position: "relative" }}>
              <img
                src={product.cover_url}
                alt={product.name}
                className="featured-product-img"
              />
              {product.discount_price && (
                <span className="discount-badge">
                  -{Math.round((1 - product.effective_price / product.price) * 100)}%
                </span>
              )}
            </Link>
            <div className="featured-product-info">
              <h3 className="featured-product-name">{product.name}</h3>
              <div className="product-price-group">
                {product.discount_price ? (
                  <>
                    <span className="product-price-original">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="featured-product-price">
                      R$ {product.effective_price.toFixed(2).replace(".", ",")}
                    </span>
                  </>
                ) : (
                  <span className="featured-product-price">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>
              <Link to={`/produto/${product.id}`} className="btn featured-product-btn">
                Ver produto
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
