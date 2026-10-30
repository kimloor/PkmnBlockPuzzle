# Development Roadmap — PkmnBlockPuzzle

Repository: https://github.com/kimloor/PkmnBlockPuzzle
Status: planning document; items are proposals until confirmed by the owner.

## Current milestone — 30 October 2026: Android v0.6.3 released and owner-installed

- [x] **CI PASS:** Signed Android APK build, signing, artifact upload and GitHub Release publication, run [40998438741](https://github.com/kimloor/PkmnBlockPuzzle/actions/runs/40998438741), tag [v0.6.3](https://github.com/kimloor/PkmnBlockPuzzle/releases/tag/v0.6.3).
- [x] **Owner device QA PASS:** In-game update to v0.6.3 completed successfully.
- [x] **Owner web QA PASS:** v0.6.2 rewards, play-time High Score and Game Over two-button layout were checked on website.
- [x] **Owner web QA PASS:** v0.6.3 rank display and 20,000-point water-bottle graphic were checked.
- [x] **Prior owner QA PASS:** High Score and Settings survive app close and reopen, and Pikachu is visible on Android after prior update.
- [x] **PR #11 merged:** Rewards at 10k/20k/30k/100k, reward pause/acknowledgment, active play-time High Score; current UI fixes included in v0.6.3.
- [ ] **Additional QA pending, not release-blocking for accepted v0.6.3:** Negative update tests (checksum failure, interrupted download, retry), data preservation verified explicitly across version upgrade, broader Android portrait/landscape and gameplay regression.
- **Version distinction:** Last built/released and owner-installed APK is **v0.6.3** (versionCode 603). Documentation update bumps repository-only source to **v0.6.4** per AGENTS.md; no v0.6.4 APK build or release has been requested.

## Owner device QA — 30 October 2026
- [x] **PASS (owner-reported):** Installed v0.5.1 successfully updated to v0.5.4 using the Update button inside the Android game.
- [x] **PASS (owner-reported):** Pikachu is visible in the updated v0.5.4 game.
- [x] **PASS (GitHub Actions reporter):** v0.5.4 signed build, artifact upload and release publication succeeded (run 40817827367).
- [x] **PASS (owner-reported):** High Score and Settings persist after closing and reopening the installed game.
- [ ] **NOT YET CONFIRMED:** Data preservation specifically across the upgrade (before vs. after v0.5.1→v0.5.4); error/retry and rejected-checksum paths; portrait/landscape animations and full gameplay regression.
- [x] **CLOSED:** PR #11 merged, website owner QA accepted, and features included in signed Android v0.6.3; comprehensive Android runtime regression remains additional QA.
- Note: Passing update from v0.5.1 to v0.5.4 confirms the user-facing upgrade path, not every failure path or device layout.

## Project status snapshot — 29 October 2026

- [x] Added GitHub Actions status reporter to write `.github/build-status/latest.json` with run ID, version, commit, step outcomes and release URL. Source is v0.5.4; reporter runtime verification pending the next authorized build.


**Repository:** `master`. **Current source:** v0.5.3 (Android versionCode 503) after documentation update; **v0.5.2 release build** was triggered at an earlier commit and remains pending verification. This is a progress snapshot; older Phase 0 audit entries below are historical and must not be read as current blockers.

### Completed — code and owner acceptance
- [x] Core game playable on web and Android; menu/Settings, Thai default, local BGM/SFX, Pokémon theme, Pikachu companion and its idle/wave/land/line-clear reactions implemented.
- [x] Golden-cell multiplier, bomb / chain gravity, repeated row clearing and score-on-exit fixes implemented; device-level regression remains a separate gate.
- [x] Release signing workflow uses owner-managed GitHub Secrets, stable package `com.kimloor.pkmnblockpuzzle`, and increasing Android versionCode.
- [x] **Owner QA accepted** manual in-app version check and update from signed v0.5.0 to v0.5.1 (browser download → Android installer → reopen). No claim of unattended installation.
- [x] One-button Settings update UI: Check for Update becomes Update with GitHub Release notes shown underneath.
- [x] v0.5.2 native Cordova updater source implemented: internal APK download/progress, SHA-256 verification, package/signature/version checks and Android installer handoff, with browser fallback.
- [x] GitHub Actions Build Trigger wired to explicit `.github/build-requests/request.json` changes; normal code commits do not trigger APK builds. Signing secrets remain in GitHub.
- [x] Prior v0.5.2 workflow run progressed through native plugin install, Android release APK build and artifact upload (as shown in owner-provided workflow screenshot).

### Pending / acceptance gates
- [ ] **v0.5.2 release publication:** last evidenced workflow failed at GitHub Release publishing with HTTP 403 (token write authorization). Owner reports updating workflow permissions; ChatGPT sent a new authorized trigger `a5ad1e3adf39b49ece151bda4a209ba1ddd4cb5b`. **Result of that new run not yet confirmed.**
- [ ] Confirm v0.5.2 Release assets `PkmnBlockPuzzle.apk` and `PkmnBlockPuzzle.apk.sha256`, release tag and signing fingerprint against prior signed APK.
- [ ] Android device test of native update **from v0.5.2 to a future higher version** (v0.5.1→v0.5.2 still uses older browser-based updater).
- [ ] Test download/progress, error/retry, checksum rejection, installer permission/prompt, resumed app and high-score/settings preservation across an in-place upgrade.
- [ ] Validate Pikachu positioning/animation and gameplay regression on Android portrait/landscape and desktop/mobile web.
- [ ] Improve automated unit and smoke coverage, release evidence and rollback procedures.

### Release workflow policy
Only an explicit owner request may initiate an APK build. ChatGPT may update the dedicated request file for that purpose; GitHub Actions builds/signs with protected Secrets and publishes a release after successful verification. **Code complete, Build PASS, Release published and Device QA accepted are distinct statuses.**

## Next Feature — Score Milestone Rewards (Owner requested 2026-10-29)
**Status: IMPLEMENTED / MERGED / RELEASED in v0.6.3.** Owner accepted the main web flows and confirmed Android upgrade; edge-case and full-device regression are tracked separately.

### Fixed rewards (per game run)
| Score threshold | Reward | Pikachu dialogue (Thai) |
| ---: | --- | --- |
| 10,000 | Dairy Queen ice cream, 1 cone | ยินดีด้วย! คุณได้รับไอศกรีม Dairy Queen 1 โคน! |
| 20,000 | Gato drink, 1 bottle | ยินดีด้วย! คุณได้รับกาโตะ 1 ขวด! |
| 30,000 | Pokémon trading card box, 1 box | ยินดีด้วย! คุณได้รับกล่องการ์ดโปเกม่อน 1 กล่อง! |
| 100,000 | Nintendo Switch, 1 console | ยินดีด้วย! คุณได้รับ Nintendo Switch 1 เครื่อง! |

### Gameplay and UI contract (proposed acceptance criteria)
- When the active run's score first meets or exceeds a threshold, pause gameplay **immediately** and display a text speech bubble anchored to the side Pikachu, showing the exact awarded item and quantity.
- Keep the board, score and reward text visible; block gravity, piece input, scoring and lock timers during reward pause. Only a deliberate tap/click on the reward bubble/continue overlay dismisses it and resumes gameplay; avoid a tap-through that also moves or drops a piece.
- Each threshold triggers once per **game run**, not on every score refresh; store awarded milestone IDs within run state to avoid duplicates on pause/resume or reload. Starting a new run resets eligibility. Preserve earned reward history only if a later owner decision authorizes persistent records.
- If one scoring action crosses multiple thresholds, queue eligible rewards in ascending threshold order, presenting one Pikachu bubble at a time; gameplay remains paused until all are acknowledged.
- Ensure Pikachu and bubble stay visible and readable on Android portrait/landscape and mobile web where companion may currently be hidden. Provide keyboard/click/touch continuation and accessibility labeling.
- Regression tests: exact threshold, jump across thresholds, simultaneous multi-row clear / bomb cascades, repeated score updates, menu exit, app background/resume, game over, and audio/pause behavior.
- Real-world fulfillment is **not** implemented by this feature: these are in-game reward announcements. Redemption, inventory, physical distribution and terms require separate owner approval.

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

### Phase 1 artifact QA — 2026-10-29
- [x] Owner-provided v0.4.20 signed Release APK inspected: checksum, APK v2 cert, package identity, four Pikachu pose assets; see docs/ANDROID-UPDATE-PHASE1-APK-QA.md.
- [ ] Android device install/smoke acceptance remains pending; actual update A→B belongs to later phases.

### Update-capable base APK preparation (2026-10-29)
- [x] Add manual Check for Updates in Settings, comparing semantic version against GitHub latest published Release; show offline, 404 and error states.
- [x] Present release notes and open the verified APK asset in the Android system browser via cordova-plugin-inappbrowser; Android handles download and prompts for user installation. This is NOT a background auto-install or embedded APK download manager.
- [x] Preserve pre-fix Pikachu mobile hiding in baseline APK A; responsive fix reserved for APK B as first upgrade test.
- [ ] Run GitHub Actions Android Release APK, confirm embedded plugin and settings functionality on phone.
- [ ] Publish a properly signed GitHub Release containing PkmnBlockPuzzle.apk for APK B and perform A → B update test.
