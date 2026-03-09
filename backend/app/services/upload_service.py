import uuid
from io import BytesIO
from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image

UPLOAD_DIR = Path("uploads/products")
MAX_DIMENSION = 1200
WEBP_QUALITY = 85
ALLOWED_CONTENT_TYPES = {
    "image/jpeg", "image/png", "image/gif",
    "image/webp", "image/bmp", "image/tiff",
}


def _ensure_upload_dir() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


async def process_and_save(file: UploadFile) -> str:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de arquivo inválido: {file.content_type}. Envie uma imagem.",
        )

    contents = await file.read()
    try:
        img = Image.open(BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Arquivo de imagem corrompido ou inválido.")

    # Converte para RGB para garantir compatibilidade com webp
    if img.mode in ("RGBA", "LA"):
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1])
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")

    img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

    _ensure_upload_dir()
    filename = f"{uuid.uuid4().hex}.webp"
    save_path = UPLOAD_DIR / filename

    img.save(save_path, format="WEBP", quality=WEBP_QUALITY)

    return f"/uploads/products/{filename}"


async def process_and_save_many(files: list[UploadFile]) -> list[str]:
    if not files:
        raise HTTPException(status_code=400, detail="Nenhum arquivo enviado.")
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Máximo de 5 imagens por upload.")

    urls = []
    for f in files:
        url = await process_and_save(f)
        urls.append(url)
    return urls
