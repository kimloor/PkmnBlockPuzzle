#!/usr/bin/env python3
"""Correct the pale rectangular tint embedded in the original Pokemon wallpapers.
This script never generates artwork: it adjusts only the affected JPEG pixel region.
"""
from pathlib import Path
import os
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "TetrisApp/www/images/pokemon/backgrounds"
SOURCES = {
    "pokemon_bg_mobile.jpg": (768, 218, 550),
    "pokemon_bg_desktop.jpg": (1376, 505, 871),
}

def correct(path, expected_width, left, right):
    img = Image.open(path).convert("RGB")
    width, height = img.size
    if width != expected_width or right >= width - 4:
        raise ValueError(f"Unexpected wallpaper dimensions: {path}: {img.size}")
    arr = np.asarray(img, dtype=np.float32)
    sy = slice(3, height - 3, 3)
    outside = np.concatenate((
        arr[sy, left-3:left-1].mean(axis=1),
        arr[sy, right+1:right+3].mean(axis=1)
    ), axis=0)
    inside = np.concatenate((
        arr[sy, left+1:left+3].mean(axis=1),
        arr[sy, right-3:right-1].mean(axis=1)
    ), axis=0)
    candidates = np.linspace(0.03, 0.40, 371, dtype=np.float32)
    best_alpha, best_loss = 0.0, float("inf")
    for a in candidates:
        estimated = np.clip((inside - 255*a)/(1-a), 0, 255)
        loss = float(np.median(np.abs(estimated - outside)))
        if loss < best_loss:
            best_alpha, best_loss = float(a), loss
    if not (0.045 <= best_alpha <= 0.40):
        raise ValueError(f"Invalid tint estimate {best_alpha:.4f}: {path.name}")
    seam_before = float(np.median(np.abs(inside - outside)))
    restored = arr.copy()
    restored[:,left:right] = np.clip(
        (arr[:,left:right] - 255*best_alpha)/(1-best_alpha),0,255
    )
    temp = path.with_name(path.stem+".restored"+path.suffix)
    Image.fromarray(np.rint(restored).astype(np.uint8), "RGB").save(
        temp, format="JPEG", quality=95, subsampling=0, optimize=True
    )
    output = Image.open(temp)
    if output.size != img.size or output.format != "JPEG":
        raise RuntimeError("Bad output dimensions or format")
    after = np.asarray(output, dtype=np.float32)
    seam_after = float(np.median(np.abs(np.concatenate((
        after[sy,left+1:left+3].mean(axis=1)-after[sy,left-3:left-1].mean(axis=1),
        after[sy,right-3:right-1].mean(axis=1)-after[sy,right+1:right+3].mean(axis=1)
    ),axis=0))))
    print(f"{path.name}: size={width}x{height} band=[{left}:{right}] tint={best_alpha:.3f} seam-before={seam_before:.2f} seam-after={seam_after:.2f}", flush=True)
    if not (seam_after < seam_before*0.85):
        temp.unlink(missing_ok=True)
        raise RuntimeError(f"Seam correction did not improve sufficiently: {path}")
    os.replace(temp,path)

def main():
    for name,(width,left,right) in SOURCES.items():
        correct(ROOT/name,width,left,right)
    print("PASS: both wallpaper JPEGs restored; original art retained.",flush=True)

if __name__=="__main__":
    main()
