import { useEffect, useState } from "react";
import { api } from "@/api/client";
import type { Brand } from "@/types";

const MIN_ITEMS = 12;

function fillBrands(brands: Brand[]): Brand[] {
  if (brands.length === 0) return [];
  const filled: Brand[] = [];
  while (filled.length < MIN_ITEMS) {
    filled.push(...brands);
  }
  return filled.slice(0, Math.max(filled.length, MIN_ITEMS));
}

export function BrandPartners() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    api.get<Brand[]>("/brands").then((res) => {
      setBrands(res.data);
    }).catch(() => {});
  }, []);

  if (brands.length === 0) return null;

  const track = fillBrands(brands);

  return (
    <section className="brand-partners">
      <div className="container">
        <h2>Marcas parceiras</h2>
      </div>
      <div className="brand-marquee-outer">
        <div className="brand-marquee-track">
          {[...track, ...track].map((brand, i) => (
            <div key={`${brand.id}-${i}`} className="brand-logo-wrapper">
              <img
                src={brand.logo_url}
                alt={brand.name}
                title={brand.name}
                className="brand-logo"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
