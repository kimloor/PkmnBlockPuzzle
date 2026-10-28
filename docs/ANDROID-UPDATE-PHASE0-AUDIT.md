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

