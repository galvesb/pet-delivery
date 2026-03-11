import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import type { Banner } from "@/types";

export function PromoBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    api.get<Banner[]>("/banners").then((res) => {
      if (res.data.length > 0) setBanner(res.data[0]);
    }).catch(() => {});
  }, []);

  if (!banner) return null;

  return (
    <div
      className="promo-banner"
      style={{ backgroundColor: banner.bg_color, color: banner.text_color }}
    >
      <div className="promo-banner-content">
        <span className="promo-banner-title">{banner.title}</span>
        {banner.subtitle && (
          <span className="promo-banner-subtitle">{banner.subtitle}</span>
        )}
        {banner.link_url && banner.link_text && (
          <Link
            to={banner.link_url}
            className="promo-banner-btn"
            style={{ color: banner.bg_color, backgroundColor: banner.text_color }}
          >
            {banner.link_text}
          </Link>
        )}
      </div>
    </div>
  );
}
