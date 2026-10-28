# Asset import fallback — Google Drive → GitHub Actions → Repository

Status: **Validated for the two Pokémon background JPEG files** on 2026-10-28.
Repository: https://github.com/kimloor/PkmnBlockPuzzle
Branch: `master`

## Purpose and priority

This is a **backup procedure**, not the primary asset import mechanism. Use it when directly committing binary images to the repository is unavailable (for example, an integration cannot transmit local file bytes). Prefer a normal Git upload or a direct binary-capable GitHub integration when available.

## Prerequisites

- A PNG/JPG/JPEG/WebP/GIF file, maximum **15 MB**.
- An individual Google Drive file shared as **Anyone with the link → Viewer**. Do not use a folder link, private file, or a link requiring sign-in.
- The repository GitHub Actions workflow `.github/workflows/import-game-image.yml`, which accepts public Drive links via `gdown`.
- Write access to run the workflow on `master`.

## Repeatable manual fallback procedure

1. Upload each image to Google Drive; verify name, file type, dimensions, and permission (`anyone:reader`).
2. Go to https://github.com/kimloor/PkmnBlockPuzzle/actions/workflows/import-game-image.yml.
3. Select **Run workflow**, branch **master**.
4. For each image (run once per file), set:
   - `image_url`: public single-file Drive URL, e.g. `https://drive.google.com/file/d/FILE_ID/view`
   - `image_base64`: leave blank
   - `destination`: path relative to `TetrisApp/www/`, **starting with `images/` or `assets/`**, and ending with the correct image extension, e.g. `images/pokemon/backgrounds/pokemon_bg_desktop.jpg`.
5. Start the run; inspect the **import-image** job logs for download, signature validation, version bump and Git push. Retry only after investigating failures.
6. Check the resulting `master` commit for the image **binary file entries**, path, and matching extension. The standard text-only file-fetch connector may report 404 or fail to decode binary files: use the commit file list or raw file download to verify instead.
7. Confirm CSS/theme/HTML references use the uploaded filenames, including extension and case. Test GitHub Pages with the Pokémon Theme on desktop and mobile; record browser results separately from source checks.
8. Confirm `TetrisApp/config.xml` version equals the visible version in `TetrisApp/www/index.html`, and `CHANGELOG.md` records the actual import. Do not trigger Android APK build without an explicit owner request.

## Alternative supported input

The workflow also accepts a **direct HTTPS image URL** as `image_url`, or a small Base64 image in `image_base64` (leave URL empty). Only one source may be supplied. GitHub workflow dispatch input-size limits make Base64 unsuitable for large images.

## Previously validated example

The owner shared the following individual Drive files as anyone-with-link Viewer:
- Desktop: `https://drive.google.com/file/d/10rnA9lcJJR9HbJ87526L6pTqYducwyqA/view` → `images/pokemon/backgrounds/pokemon_bg_desktop.jpg`
- Mobile: `https://drive.google.com/file/d/1aZQ8Mc4iVl3LOC4y_S28cKUw_w8SO-vU/view` → `images/pokemon/backgrounds/pokemon_bg_mobile.jpg`

The one-time background bootstrap in `import-game-image.yml` committed both images and updated their CSS/theme references at commit `cbbdb93236332f4ad0f44abd01637f2c46c61408` (v0.4.5). This confirms **repository import**, not a completed visual QA of the deployed game. Do not edit the workflow file just to retrigger the one-time bootstrap; for future assets use the manual `workflow_dispatch` importer.

## Constraints / safety

- Public Drive files are readable by anyone with the link; do not use for private assets or secrets. Revoke public sharing when appropriate after verifying upload.
- The importer restricts destinations to asset locations and validates file signature and size, but public network sources still require reasonable trust.
- Never overwrite existing assets inadvertently; agree on the intended destination path and verify any replacement.
- Avoid putting copyrighted third-party assets into published builds without suitable rights.
- This process does **not** authorize APK builds.
