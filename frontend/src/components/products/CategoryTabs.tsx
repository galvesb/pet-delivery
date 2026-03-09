import { useEffect, useState } from "react";
import { api } from "@/api/client";
import type { Category } from "@/types";

interface Props {
  activeCategory: string;
  onSelect: (slug: string) => void;
}

export function CategoryTabs({ activeCategory, onSelect }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get<Category[]>("/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  return (
    <div className="category-tabs">
      <button
        className={`tab-btn${activeCategory === "todos" ? " active" : ""}`}
        onClick={() => onSelect("todos")}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`tab-btn${activeCategory === cat.slug ? " active" : ""}`}
          onClick={() => onSelect(cat.slug)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
