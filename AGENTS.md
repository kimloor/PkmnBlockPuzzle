# Development rules — PkmnBlockPuzzle

Canonical repository: https://github.com/kimloor/PkmnBlockPuzzle

## Repository workflow (owner instruction — 2026-10-26)
- **No pull request or merge step is required.** Authorized work may be committed directly to `master`. Do not create a branch or PR merely to publish routine work.
- The owner has approved the Phase 1 identified P1 gameplay fixes in the current task. **For any newly discovered issue, ambiguity, unexpected behavior, or proposed fix in future work, first report the issue, impact, and intended change and request the owner's explicit approval before changing it.** Never treat discovery alone as permission to fix.
- Complete relevant tests and record actual results, including PASS / FAIL / WARNING / NOT TESTED and any environmental limitations. Do not claim a runtime PASS on source inspection alone.
- Check the latest `master` SHA before writing; verify the resulting commit and read back modified files. No destructive or unrelated changes.

## Version bump required for every change
Increment the semantic version in `TetrisApp/config.xml` for **every** change (including docs, assets, bug fixes, and UI) and synchronize the visible `.game-version` in `TetrisApp/www/index.html`.
- PATCH for fixes, documentation or minor adjustments.
- MINOR for backwards-compatible features.
- MAJOR for breaking changes.
- Validate the version alignment before every direct commit. PR-only version workflows are not a substitute for direct-commit verification.

## Android APK builds — owner opt-in (updated 2026-10-29)
An explicit owner instruction to ChatGPT to build/release authorizes a single GitHub Actions run through a committed `.github/build-requests/request.json` change on `master`. The workflow listens **only** to this exact file path on pushes, and also supports `workflow_dispatch` as fallback. Normal code/document edits must not trigger builds. Never update the request file unless the owner explicitly requests a build. Each request must have the source version string and a distinct request_id; validate both before building. Do not store signing keys in git; use GitHub Secrets. Publish a matching GitHub Release only after a successful signed APK build. GitHub Pages deployment remains automatic.

## License
Preserve original upstream MIT LICENSE and third-party notices.

## Project conventions
- Thai is the default UI language; keep other languages usable.
- Preserve web and Android compatibility and run appropriate smoke tests wherever tooling permits.
- Do not remove assets or modify unrelated features without approval.
- Keep `README.md`, `ROADMAP.md`, `GAME_DESIGN.md`, `CHANGELOG.md`, and QA records consistent with verified behavior.

## Backup image import
When direct binary upload is unavailable, follow the documented **Google Drive → GitHub Actions → master** fallback in [`docs/ASSET-IMPORT-FALLBACK.md`](docs/ASSET-IMPORT-FALLBACK.md). Keep it as a fallback, verify the actual image commit and UI asset path, and do not run an APK build.
