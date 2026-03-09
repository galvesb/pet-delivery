import { useRef, useState } from "react";
import { api } from "@/api/client";

export interface ImageItem {
  url: string;
  isCover: boolean;
}

interface Props {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
}

export function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = 5 - images.length;
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    try {
      const formData = new FormData();
      toUpload.forEach((f) => formData.append("files", f));
      const res = await api.post<{ urls: string[] }>("/uploads/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newItems: ImageItem[] = res.data.urls.map((url) => ({
        url,
        isCover: false,
      }));
      const updated = [...images, ...newItems];
      // se não tem capa, a primeira vira capa
      if (!updated.some((i) => i.isCover) && updated.length > 0) {
        updated[0] = { ...updated[0], isCover: true };
      }
      onChange(updated);
    } catch {
      // erro de upload — silencioso por ora
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    if (updated.length > 0 && !updated.some((i) => i.isCover)) {
      updated[0] = { ...updated[0], isCover: true };
    }
    onChange(updated);
  };

  const handleSetCover = (idx: number) => {
    onChange(images.map((img, i) => ({ ...img, isCover: i === idx })));
  };

  // Drag and drop para reordenar
  const handleDragStart = (idx: number) => {
    dragIndex.current = idx;
  };

  const handleDrop = (dropIdx: number) => {
    const fromIdx = dragIndex.current;
    if (fromIdx === null || fromIdx === dropIdx) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(dropIdx, 0, moved);
    dragIndex.current = null;
    onChange(updated);
  };

  const thumbStyle: React.CSSProperties = {
    width: 90,
    height: 90,
    border: "var(--border-thick)",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    cursor: "grab",
    flexShrink: 0,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          padding: 12,
          border: "var(--border-thick)",
          borderRadius: 8,
          minHeight: 110,
          background: "#fafafa",
        }}
      >
        {images.map((img, idx) => (
          <div
            key={img.url}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            style={{
              ...thumbStyle,
              boxShadow: img.isCover ? "0 0 0 3px var(--primary-red)" : "none",
            }}
          >
            <img
              src={img.url}
              alt={`foto ${idx + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Overlay com botões */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 4,
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                title="Remover"
                style={{
                  alignSelf: "flex-end",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                  fontSize: 12,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
              <button
                type="button"
                onClick={() => handleSetCover(idx)}
                title={img.isCover ? "Capa atual" : "Definir como capa"}
                style={{
                  alignSelf: "flex-start",
                  background: img.isCover ? "var(--primary-red)" : "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "2px 5px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                {img.isCover ? "⭐ Capa" : "☆"}
              </button>
            </div>
          </div>
        ))}

        {/* Botão adicionar */}
        {images.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              ...thumbStyle,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              background: "#f0f0f0",
              cursor: uploading ? "wait" : "pointer",
              fontSize: 24,
              color: "var(--gray-text)",
              border: "2px dashed var(--dark)",
            }}
          >
            <span>{uploading ? "⏳" : "+"}</span>
            <span style={{ fontSize: 11 }}>{uploading ? "Enviando..." : "Foto"}</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <span style={{ fontSize: 12, color: "var(--gray-text)" }}>
        {images.length}/5 fotos · Arraste para reordenar · ⭐ = capa
      </span>
    </div>
  );
}
