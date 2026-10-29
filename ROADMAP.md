# Development Roadmap — PkmnBlockPuzzle

Repository: https://github.com/kimloor/PkmnBlockPuzzle
Status: planning document; items are proposals until confirmed by the owner.

## Current verified baseline (26 October 2026)
- A playable Tetris-style falling-block game is described in `README.md`.
- Web source is stored in `TetrisApp/www/`, with Cordova configuration at `TetrisApp/config.xml`.
- Audit baseline: 0.1.3; current version after authorized P1 fixes: 0.1.5.
- Android APK build is manual (`workflow_dispatch` only), subject to owner approval.

## Phase 1 — Baseline audit
- [ ] Run desktop/mobile gameplay smoke tests: start, move, rotate, soft drop, hard drop, pause, restart, game over.
- [ ] Check scoring, level advancement, difficulty scaling and persistence against actual source.
- [ ] Check touch controls, responsive portrait/landscape layouts and accessibility.
- [ ] Check themes, language switching, music/SFX controls.
- [x] Document source-review defects with reproduction steps and priorities (see [QA baseline](docs/QA-BASELINE.md); browser/device reproduction remains pending).

## Phase 2 — Quality and reliability
- [ ] Add automated regression tests for gameplay rules and edge cases (still pending).
- [ ] Establish consistent lint/test checks and a lightweight manual QA checklist.
- [ ] Validate behavior on common Android screen sizes and browsers.
- [ ] Review offline functionality and asset-loading errors.

## Phase 3 — UI/UX and player experience
- [ ] Improve touch responsiveness, HUD readability and game-over feedback.
- [ ] Validate Thai as default language and fallback strings.
- [ ] Review settings persistence, music and SFX volume/mute behavior.
- [ ] Evaluate player-requested enhancements after audit.

## Phase 4 — Release readiness
- [ ] Verify version alignment: `TetrisApp/config.xml` and `.game-version`.
- [ ] Verify website deployment independently from Android builds.
- [ ] Build Android APK **only on explicit owner instruction**.
- [ ] Update changelog, test report and release notes before release.

## Android In-App Update V1 + Pikachu First Update (Owner-authorized 2026-10-28)
Status: Phase 0 SOURCE AUDIT COMPLETE; binary/device gate BLOCKED / NOT TESTED. See docs/ANDROID-UPDATE-PHASE0-AUDIT.md. No Phase 1–7 implementation or APK build authorized.

- [x] Phase 0: audit current Android workflow, package identity, versionCode, signing, data persistence (source review; binary/device QA pending).
- [ ] Phase 1: release-signed APK pipeline with persistent secure key, stable app ID, monotonic versionCode (manual dispatch).
- [ ] Phase 2: GitHub Releases with APK, release notes, machine-readable version metadata and checksum.
- [ ] Phase 3: Settings manual Check for Updates, online/offline handling and version comparison.
- [ ] Phase 4: download progress, checksum verification, Android user-confirmed installer, retry/error handling.
- [ ] Phase 5: fix Pikachu mobile layout, preserve visible board/HUD, bundle idle/wave/excited/celebrate assets; verify 360/390/412px portrait and landscape.
- [ ] Phase 6: **first real update test**: install signed baseline A with updater but without Pikachu fix, upgrade in place to signed B carrying Pikachu fix; confirm scores/settings persist.
- [ ] Phase 7: QA evidence, release acceptance, documentation and production checks.

Binary inspection update: Owner-provided v0.4.13 APK inspected. Package `com.kimloor.pkmnblockpuzzle`, versionCode 413; Android Debug signing certificate and four Pikachu assets found. Release-signing migration remains BLOCKED pending owner decision and Android device upgrade QA (see audit report).\n\nSource-asset follow-up: four Pikachu PNG paths were confirmed in Git source; APK inclusion remains NOT TESTED. Binary artifact/run ID is required to close Phase 0 (see audit report).

### Phase 0 source evidence
- PASS: Cordova app ID `com.kimloor.pkmnblockpuzzle`; baseline version 0.4.13 before documentation bump; cordova-android 14.0.1 specified.
- PASS: `.github/workflows/android-apk.yml` uses `workflow_dispatch`, debug build, renames output to PkmnBlockPuzzle.apk, uploads a 14-day artifact.
- WARNING: current workflow has no release signing/keystore configuration. Cannot guarantee installed debug APK can upgrade to newly release-signed APK due to signing identity mismatch.
- WARNING: explicit Android versionCode absent from `TetrisApp/config.xml`; inspect generated APK code and establish monotonic code policy.
- PASS: High scores saved to localStorage via `TetrisApp/www/js/services/storage.js`. Retaining data requires compatible in-place upgrade; inventory remaining settings keys.
- PASS: companion referenced in HTML and 4 pose paths in `js/ui/pokemonCompanion.js`; `mobile-fix.css` includes CSS hiding companion at <=1050px and portrait <=768px.
- NOT TESTED: binary signing fingerprint, APK contents, runtime persistence, device/emulator installation and upgrade, live GitHub releases.
- EXIT GATE: inspect real existing APK certificate/package/versionCode, data backup/transition plan, full storage key inventory, and signing decision before Phase 1.
- SEQUENCING: do not ship Pikachu fix in baseline APK A; A and B share app ID/signing key; B higher versionCode.

## Working agreement
Authorized changes may go straight to master without PR; request owner approval before fixing *newly discovered* issues, preserve gameplay, report real test evidence and obey `AGENTS.md`. Roadmap checkboxes are not completion claims.

### Owner signing decision — 2026-10-28
- APPROVED: no backup or migration of data from the previously installed Debug APK. Owner will uninstall/replace it once with the first Release-signed APK, acknowledging that local high scores/settings may be lost.
- MANDATORY: generate one permanent Release signing keystore, secure it outside the repository, and supply its keystore bytes/passwords only through protected GitHub Actions Secrets or equivalent secure mechanism. Never commit secrets or put them in workflow logs.
- All future APKs MUST retain package ID `com.kimloor.pkmnblockpuzzle`, the same signing certificate/key, and a strictly increasing Android versionCode. A lost signing key prevents normal in-place updates; keep secure offline backup of KEY itself (not player data).
- First test sequence remains: Release-signed APK A (updater present, Pikachu old layout) -> Release-signed APK B (responsive fix), with A and B signed identically. APK builds remain owner-opt-in.
- Decision resolves data-migration design blocker; Release signing provisioning and on-device APK A→B QA remain outstanding.

### Phase 1 progress — 2026-10-28
- [x] Manual GitHub Actions release APK workflow configured; fail closed when any of four signing secrets are missing; output APK and SHA-256.
- [ ] Provision permanent owner-custodied signing key and GitHub repository secrets.
- [ ] Run release workflow, verify signature/manifest and install on Android.
- [ ] Publish baseline APK A with updater in a later authorized phase. Target v0.5.0 only when release APK and update functionality are actually ready; do not mislabel docs-only commits.

- [x] One-time manual GitHub Actions key generator added with AES-256 PBKDF2 encrypted recovery artifact; key generation **not run**. Owner must supply KEY_EXPORT_PASSPHRASE secret and run it, then configure permanent release secrets.
