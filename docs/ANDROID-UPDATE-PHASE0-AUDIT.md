# Android Update V1 — Phase 0 Audit
Date: 2026-10-28
Scope: source and build-configuration review only. No APK build, install, Android emulator run, or release-key creation.

## Verified source evidence
- PASS — App ID: `com.kimloor.pkmnblockpuzzle` (`TetrisApp/config.xml`).
- PASS — Current Android workflow `.github/workflows/android-apk.yml` only accepts manual `workflow_dispatch`, builds Cordova Android debug APK, renames to `PkmnBlockPuzzle.apk`, and uploads an artifact (14-day retention).
- PASS — Cordova Android pinned in workflow as 14.0.1; package.json specifies ^14.0.1.
- WARNING — No release signing setup in workflow; each runner may have a different debug signing identity. Cannot promise updates on top of currently installed debug APK.
- WARNING — `config.xml` does not explicitly specify Android versionCode. Actual binary code must be inspected; do not infer a fixed integer from semantic version.
- PASS — High Score persists through `localStorage` (`tetrisJSHighScores_v1`). Retention across APK upgrades requires same package/signature and app data.
- PASS — Other localStorage keys identified: `tetrisJSLanguage`, `tetrisJSMusicMuted_v1`, `tetrisJSSfxMuted_v1`, `tetrisJSMusicVolume_v1`, `tetrisJSSfxVolume_v1`, `tetrisJSTSelectedTheme`, `pkmnTutorialSeen_v1`. Total eight keys including High Score.
- PASS — Companion source includes four referenced poses (`pikachu.png`, `pikachu_wave.png`, `pikachu_excited.png`, `pikachu_celebrate.png`). CSS has hiding rules for <=1050px and mobile portrait <=768px, explaining lack of display on mobile by design.
- NOT TESTED — Check APK ZIP asset presence, SHA/signing fingerprint and package ID/versionCode from actual binary.
- NOT TESTED — Emulator/phone side-load, settings/high-score continuity, upgrades A→B, network downloads, Android installer prompts.

## Blocking gates before release pipeline
1. Obtain a previously installed APK **and its signing fingerprint**, package ID, versionCode from the actual APK, ideally by `apksigner verify --print-certs PkmnBlockPuzzle.apk` and `aapt dump badging PkmnBlockPuzzle.apk` (or `apkanalyzer manifest application-id/version-code`).
2. On a device with existing scores/settings, record app version and preserved data; back up before any signing migration. Do not uninstall without deliberate approval; debug-to-release certificate mismatch may require one-time reinstall and data migration.
3. Establish release-keystore custody, secure backup and GitHub Actions secrets. Never commit keystore/password into repo.
4. Define stable monotonic Android versionCode, same package ID and signer across A and B.
5. Preserve First Update sequencing: APK A contains updater and old Pikachu hiding; APK B includes responsive fix. Both signed with same key; APK B versionCode higher.
6. Explicit owner instruction needed for launching the APK workflow (AGENTS.md); currently **NOT authorized** by this Phase 0 request.

## Outcome
Phase 0 source audit: COMPLETE.
Phase 0 binary/device compatibility gate: BLOCKED / NOT TESTED due to no verified APK + signing/certificate and no live device/emulator evidence.
Phase 1: NOT STARTED. No APK built.


## Phase 0 follow-up — 2026-10-28
- PASS (repository evidence): all four pose source assets exist under `TetrisApp/www/images/pokemon/characters/`. Their Git blob SHAs: idle `b3a4b4c3e24636f0c4452c0931bc204cea616170`; wave `79509e37e9fd1b343570775c3baa8ddef027c2cf`; excited `702d6784528ae070db75dff564f0f7068d14a174`; celebrate `0f84b561218928b59304794e73e2ead81676200b`. This proves presence in source only, NOT APK inclusion.
- BLOCKED: no verified Android APK binary or workflow run artifact could be obtained during this audit, hence signing certificate, installed versionCode, APK ZIP contents and update compatibility are NOT TESTED.
- Manual binary checks when existing APK is available: `apksigner verify --print-certs PkmnBlockPuzzle.apk`; `aapt dump badging PkmnBlockPuzzle.apk`; `unzip -l PkmnBlockPuzzle.apk | grep -E 'pikachu(_wave|_excited|_celebrate)?\\.png'`. Cordova web assets can be located under `assets/www/` inside the APK.
- Next gate: provide the exact existing APK binary or its GitHub Actions run ID/artifact; then inspect signing and installed-app identity before choosing transition strategy. Do not uninstall existing app or discard locally saved scores.

## APK Binary Verification — supplied Google Drive APK (2026-10-28)
Source: PkmnBlockPuzzle.apk from owner-provided Drive file ID `1l5On1zTnrhahRDZ5y0kLtg2SJcae4UtN`.
- PASS — ZIP/APK readable; size `13,451,987` bytes, SHA-256 `ac6de4af904556620c52dfae79a1e9805d1bfbcb4fe90f4d041304cdeeaf8f4f`.
- PASS — Binary AndroidManifest.xml: package `com.kimloor.pkmnblockpuzzle`, versionName `0.4.13`, versionCode `413`, minSdk `24`, targetSdk `35`.
- PASS — APK v2 signing block present (ID `0x7109871a`); certificate subject `C=US,O=Android,CN=Android Debug`, DER cert SHA-256 fingerprint `FDB767B0DC01EB4DEBCBCF35A63442B22C363647BAA004ED6714FC5E68646B21`. Certificate identity was extracted from signing block; full cryptographic `apksigner verify` NOT RUN (SDK tool unavailable).
- PASS — 4 Pikachu images included under `assets/www/images/pokemon/characters/`: idle/wave/excited/celebrate. APK's bundled HTML displays `v0.4.13`.
- WARNING — The actual installed Android APK certificate must match this exact certificate before this downloaded APK can be treated as its base. Do not infer matching signatures solely from file names.
- BLOCKER — Android Debug certificate differs from any newly created release key; ordinary Android package installation cannot upgrade it in place to a differently signed release. A one-time migration/reinstall with explicit save-data backup or retaining the same signing identity must be decided before Phase 1. A per-run debug signing key is not a durable release strategy.
- NOT TESTED — Android device installation, upgrade preserving localStorage, system package manager confirmation, gameplay visual QA, end-to-end update A→B.
- DECISION GATE — Owner approval required for proposed Phase 1 Release Signing and migration approach; do not delete device app or trigger APK build without explicit owner instruction.
