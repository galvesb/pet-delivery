import { useState } from "react";

interface Props {
  imageUrls: string[];
  coverIndex: number;
  productName: string;
}

export function ProductGallery({ imageUrls, coverIndex, productName }: Props) {
  const [activeIdx, setActiveIdx] = useState(coverIndex);

  if (!imageUrls.length) return null;

  const mainUrl = imageUrls[activeIdx] ?? imageUrls[0];

  return (
    <div className="product-gallery">
      <div className="gallery-main">
        <img src={mainUrl} alt={productName} />
      </div>
      {imageUrls.length > 1 && (
        <div className="gallery-thumbs">
          {imageUrls.map((url, idx) => (
            <button
              key={url}
              type="button"
              className={"gallery-thumb" + (idx === activeIdx ? " active" : "")}
              onClick={() => setActiveIdx(idx)}
              aria-label={`Ver foto ${idx + 1}`}
            >
              <img src={url} alt={`${productName} ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
