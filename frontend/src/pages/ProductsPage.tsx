import { useCallback, useEffect, useState } from "react";
import { api } from "@/api/client";
import type { Product } from "@/types";
import { SearchBar } from "@/components/products/SearchBar";
import { SortSelect } from "@/components/products/SortSelect";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { ProductCard } from "@/components/products/ProductCard";
import { LoadMoreButton } from "@/components/products/LoadMoreButton";

const PAGE_SIZE = 20;

interface ProductListResponse {
  items: Product[];
  total: number;
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [page, setPage] = useState(0);

  const fetchProducts = useCallback(
    async (skip: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const params: Record<string, string> = {
        skip: String(skip),
        limit: String(PAGE_SIZE),
        sort_by: sortBy,
      };
      if (search) params.search = search;
      if (selectedCategories.length > 0) params.categories = selectedCategories.join(",");
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;

      try {
        const res = await api.get<ProductListResponse>("/products", { params });
        if (append) {
          setProducts((prev) => [...prev, ...res.data.items]);
        } else {
          setProducts(res.data.items);
        }
        setTotal(res.data.total);
      } catch {
        if (!append) setProducts([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [search, sortBy, selectedCategories, minPrice, maxPrice],
  );

  useEffect(() => {
    setPage(0);
    fetchProducts(0, false);
  }, [fetchProducts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage * PAGE_SIZE, true);
  };

  const handleSearch = useCallback((term: string) => {
    setSearch(term);
  }, []);

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleCategoriesChange = (slugs: string[]) => {
    setSelectedCategories(slugs);
  };

  const handlePriceChange = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <div className="products-page container">
      <h2>Nossos Produtos</h2>

      <div className="search-sort-bar">
        <SearchBar onSearch={handleSearch} />
        <SortSelect value={sortBy} onChange={handleSortChange} />
        <button
          type="button"
          className="btn btn-outline filters-toggle"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          {filtersOpen ? "Fechar filtros" : "Filtros"}
        </button>
      </div>

      <div className="products-page-body">
        <div className={`filter-sidebar-wrapper${filtersOpen ? " open" : ""}`}>
          <FilterSidebar
            selectedCategories={selectedCategories}
            onCategoriesChange={handleCategoriesChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
          />
        </div>

        <div className="products-page-content">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--gray-text)" }}>
              Carregando produtos...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--gray-text)" }}>
              Nenhum produto encontrado.
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <LoadMoreButton
                shown={products.length}
                total={total}
                loading={loadingMore}
                onLoadMore={handleLoadMore}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
