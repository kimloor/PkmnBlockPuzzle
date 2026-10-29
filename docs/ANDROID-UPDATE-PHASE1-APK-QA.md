# Phase 1 — Release APK Binary Verification
Date: 2026-10-29
Source: Owner-uploaded `PkmnBlockPuzzle-release.zip` (GitHub Actions release artifact).

## Verified locally
- PASS: ZIP contains `PkmnBlockPuzzle.apk` and `PkmnBlockPuzzle.apk.sha256`.
- PASS: APK size 12,731,153 bytes.
- PASS: SHA-256 matches provided checksum: `5582375f79e44f811525f66cd70d8e6631086a68d40d8a29bf495f72385e62c2`.
- PASS: APK manifest binary includes application ID `com.kimloor.pkmnblockpuzzle` and version `0.4.20`; source config declares `android-versionCode="420"`. VersionCode in compiled manifest not independently parsed with Android SDK analyzer here.
- PASS: APK v2 signing block present, signing cert subject `CN=PkmnBlockPuzzle,O=kimloor,C=TH`, SHA256 cert fingerprint `61d420741962f1c1f5b19ec2e496d44dd1a2d7bc8caae21a552fbab709bfc46d`.
- PASS: Four companion poses inside APK: `assets/www/images/pokemon/characters/pikachu.png`, `pikachu_wave.png`, `pikachu_excited.png`, `pikachu_celebrate.png`.
- PASS: packaged `assets/www/index.html` shows version `v0.4.20`.
- OWNER REPORTED: GitHub Actions release workflow succeeded. Its build includes `apksigner verify`, but independent full cryptographic signature verification was not performed in this environment.
- NOT TESTED: install on Android hardware/emulator, game smoke tests, release A→B update, data persistence.
- IMPORTANT: release certificate differs from previously supplied debug APK's certificate. Owner explicitly approves one-time reinstall without data migration.
- SECURITY: keep exact signing key and protected offline backup. All future APKs must use same certificate, app ID and strictly increasing versionCode.

## Status
Phase 1 pipeline and artifact verification: PASS (source/binary checks).
Phase 1 on-device acceptance: PENDING.
Phase 2–4 updater implementation: NOT STARTED. v0.5.0 NOT BUILT.
