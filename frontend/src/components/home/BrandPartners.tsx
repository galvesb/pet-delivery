import { useEffect, useState } from "react";
import { api } from "@/api/client";
import type { Brand } from "@/types";

export function BrandPartners() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    api.get<Brand[]>("/brands").then((res) => {
      setBrands(res.data);
    }).catch(() => {});
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="brand-partners container">
      <h2>Marcas parceiras</h2>
      <div className="brand-partners-logos">
        {brands.map((brand) => (
          <div key={brand.id} className="brand-logo-wrapper">
            <img
              src={brand.logo_url}
              alt={brand.name}
              title={brand.name}
              className="brand-logo"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
