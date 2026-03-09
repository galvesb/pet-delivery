import { useEffect, useState } from "react";
import { api } from "@/api/client";
import type { Category } from "@/types";

interface Props {
  selectedCategories: string[];
  onCategoriesChange: (slugs: string[]) => void;
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
}

export function FilterSidebar({
  selectedCategories,
  onCategoriesChange,
  minPrice,
  maxPrice,
  onPriceChange,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    api.get<Category[]>("/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      onCategoriesChange(selectedCategories.filter((s) => s !== slug));
    } else {
      onCategoriesChange([...selectedCategories, slug]);
    }
  };

  const handleApplyPrice = () => {
    onPriceChange(localMin, localMax);
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-section">
        <h3>Categorias</h3>
        {categories.map((cat) => (
          <label key={cat.id} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat.slug)}
              onChange={() => toggleCategory(cat.slug)}
            />
            {cat.name}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Preço</h3>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-outline" onClick={handleApplyPrice} style={{ width: "100%", marginTop: 8 }}>
          Aplicar
        </button>
      </div>
    </aside>
  );
}
