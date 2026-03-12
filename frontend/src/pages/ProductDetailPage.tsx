import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/api/client";
import type { Category, Product } from "@/types";
import { ProductGallery } from "@/components/products/ProductGallery";
import { useCart } from "@/hooks/useCart";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, openCart, items } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get<Product>(`/products/${id}`),
      api.get<Category[]>("/categories"),
    ])
      .then(([prodRes, catRes]) => {
        setProduct(prodRes.data);
        setCategories(catRes.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const inCart = product ? items.find((i) => i.product_id === product.id) : undefined;
  const outOfStock = product ? product.stock === 0 : false;
  const atMax = product && !outOfStock && inCart ? inCart.quantity >= product.stock : false;
  const addDisabled = outOfStock || atMax;

  const handleAdd = () => {
    if (!product || addDisabled) return;
    addItem(product);
    openCart();
  };

  const getCategoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <p style={{ color: "var(--gray-text)" }}>Carregando produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2>Produto não encontrado</h2>
        <p style={{ color: "var(--gray-text)", margin: "16px 0" }}>
          O produto que você procura não existe ou foi removido.
        </p>
        <button className="btn btn-outline" onClick={() => navigate("/")}>
          ← Voltar para a loja
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <button
        className="btn btn-outline"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 32, display: "inline-flex", alignItems: "center", gap: 6 }}
      >
        ← Voltar
      </button>

      <div className="product-detail-layout">
        {/* Galeria */}
        <ProductGallery
          imageUrls={product.image_urls}
          coverIndex={product.cover_index}
          productName={product.name}
        />

        {/* Informações */}
        <div className="product-detail-info">
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            {product.name}
          </h1>

          {product.discount_price ? (
            <div className="product-detail-price-group">
              <span className="product-detail-price-original">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              <span className="product-detail-price">
                R$ {product.effective_price.toFixed(2).replace(".", ",")}
              </span>
              <div className="product-detail-savings">
                Você economiza R${" "}
                {(product.price - product.effective_price).toFixed(2).replace(".", ",")}{" "}
                ({Math.round((1 - product.effective_price / product.price) * 100)}%)
              </div>
            </div>
          ) : (
            <p className="product-detail-price">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </p>
          )}

          {product.description && (
            <p className="product-detail-description">{product.description}</p>
          )}

          {product.categories.length > 0 && (
            <div className="product-detail-categories">
              {product.categories.map((slug) => (
                <span key={slug} className="category-badge">
                  {getCategoryName(slug)}
                </span>
              ))}
            </div>
          )}

          <button
            className="btn"
            onClick={handleAdd}
            disabled={addDisabled}
            style={{ width: "100%", marginTop: 24, fontSize: 16, padding: "14px 24px" }}
          >
            {outOfStock ? "Produto esgotado" : atMax ? "Limite no carrinho" : "+ Adicionar ao carrinho"}
          </button>
        </div>
      </div>
    </div>
  );
}
