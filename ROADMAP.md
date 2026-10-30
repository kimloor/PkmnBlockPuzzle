# Development Roadmap — PkmnBlockPuzzle

Repository: https://github.com/kimloor/PkmnBlockPuzzle
Status: planning document; items are proposals until confirmed by the owner.

## Safari portrait no-scroll fit — v0.7.10 (30 October 2026)

**Status: SOURCE IMPLEMENTED; OWNER SAFARI QA PENDING.** Owner rejected the large v0.7.9 portrait board because scrolling makes gameplay inconvenient. Use a medium-sized board constrained by Safari dynamic viewport: width min(100vw - 20px, (100dvh - 116px)/2, 252px), compact 70px score/next HUD and 24px level header. Keep board/header/HUD aligned and body/game scroll locked in Pokemon portrait. At 375px viewport width and 495px available height, target board is about 189.5×379 CSS px (vs ~153×306 in v0.7.5). Pikachu/balloon stay tap-through; mobile landscape and standard desktop unchanged. Leave wallpaper's remaining faint rectangular seams for later, per Owner. No APK build; require Safari on-device screenshot and touch QA.

## Safari corrected wallpaper + larger portrait board — source 0.7.9

**Asset processing: completed in GitHub Actions. Safari device visual acceptance pending.**

## Safari background correction and larger portrait board — 30 October 2026

**Status: v0.7.8 BOARD SOURCE UPDATED; WALLPAPER WORKFLOW VERSION GUARD FIXED; FINAL BINARY PUBLICATION AND SAFARI DEVICE QA PENDING.** Both mobile and desktop JPEGs contain a pale vertical band baked into source pixels. A guarded GitHub Actions workflow will estimate the white tint from both rectangle seams, reverse it only inside the stripe, verify seam reduction, commit updated JPEGs and invalidate the browser image cache in v0.7.7, then deploy Pages. Original images remain available in Git history. The portrait board/HUD/header now share a viewport-width value up to 360px, no longer shrunk by Safari visual viewport height. Pikachu gets a 104–130px portrait sprite; pointer events pass through to the board. Verify on-device Safari after both deployment stages; do not build APK without owner authorization.

## Safari portrait layout follow-up — v0.7.4 / regression maintenance v0.7.5 (30 October 2026)

**Status: SOURCE IMPLEMENTED; OWNER SAFARI QA PENDING.** Owner supplied Safari screenshot showing the v0.7.3 board narrower than HUD and a lighter vertical wallpaper stripe. Reclaim reserved Pikachu gutter to enlarge board and align board/header/HUD widths; allow Pikachu + speech bubble to overlap only the top-left portion of the board (noninteractive so board touch remains available). Use a single background image and remove overlaid CSS gradient and body pseudo-element. Existing sprite assets, scoring, and Android build unchanged. Verify iPhone Safari portrait and landscape and watch for any stripe baked into the source wallpaper image.

## Mobile Safari Pikachu visibility fix — v0.7.3 (30 October 2026)

**Status: SOURCE FIX IMPLEMENTED; OWNER SAFARI DEVICE QA PENDING.** Root cause: the old stylesheet explicitly hid the companion at viewport widths <=1050px and on portrait phones. Source now reserves an in-flow Pikachu column alongside the Tetris board on portrait phones, landscape phones and tablets. The score/next strip remains above the board in portrait; the speech bubble is contained inside the companion gutter. A new stylesheet query version prevents Safari using stale CSS. Standard desktop (>1050px), non-Pokemon themes, all five sprite poses and scoring mechanics remain unchanged. Verify 320/360/390/412px phone portrait, landscape, Safari on-device, Android and desktop. No APK build authorized.

## Future Skill Pose — owner-provided Pikachu artwork (30 October 2026)

**Status: ASSET REGISTERED IN SOURCE v0.7.2; SKILL GAMEPLAY NOT IMPLEMENTED.** Directly resized the owner's transparent original to the same 500×500 canvas as all existing Pikachu poses. Full alpha/lightning preserved; centered transparent content bounds x=46–453, y=25–475. Asset path: `TetrisApp/www/images/pokemon/characters/pikachu_skill.png`.

- Runtime controller preloads the new `skill` pose and exposes `window.pokemonCompanion.play('skill')` for a future owner-approved skill feature. The reserved pose holds for 1.8 seconds, then returns to idle/wave. Normal excited/celebrate reactions cannot interrupt an ongoing skill pose.
- Reuses the same existing `#pokemon-side-slot .pokemon-side-character` image element and current CSS positioning; **no skill event, new score rule, ability effect, input, or power is enabled**.
- Verification: image PNG RGBA and canvas 500×500, content alpha bounds checked locally; Git blob SHA and source registration verified. Browser and Android runtime/device QA remain pending. Do not build APK without explicit owner request.

## Next Feature — Pikachu Talking Companion V1 (Owner approved, 30 October 2026)

**Status: IMPLEMENTED IN SOURCE v0.7.0 / RUNTIME QA PENDING.** Existing reward dialogs remain authoritative; separate mobile/browser QA required before release. Pause/Game Over speech visibility remains a UI acceptance item. Text-only speech bubbles for the existing Pikachu companion near the top-left Tetris board. Offline; no TTS, voice, AI integration, or new Pikachu artwork. Keep gameplay input/HUD unobstructed. Do not build an APK until separately authorized.

### A. Start, idle, and play (6 triggers)
| Trigger | Thai speech | Condition |
| --- | --- | --- |
| New run | ปิก้า! เริ่มกันเลย! | Once when gameplay starts |
| Piece locks | ปิก้า! / เยี่ยม! | Random 10% chance, subject to cooldown |
| 5 pieces without clearing | อีกนิดเดียว สู้ ๆ! | Five successive placements without a line clear |
| 30 seconds without line clear | ปิก้า... ระวังบล็อกเต็มนะ! | While actively playing; do not count paused time |
| Pause | พักก่อนก็ได้นะ! | Only if Pikachu remains visible on pause UI |
| Resume | ลุยต่อกันเลย! | When returning from pause |

### B. Clears and scoring (6 triggers)
| Trigger | Thai speech | Condition |
| --- | --- | --- |
| Clear 1 line | ดีมากเลย! | One line in one clear event |
| Clear 2 lines | ว้าว! สองแถวเลย! | Two simultaneous lines |
| Clear 3 lines | สุดยอดไปเลย! | Three simultaneous lines |
| Clear 4 lines | ปิก้าาา! เทพมาก! | Four simultaneous lines |
| 3 successive line-clearing placements | คอมโบมาแล้ว! ⚡ | Consecutive successful clear placements; reset on non-clear |
| Overtake previous all-time #1 | ทำลายสถิติแล้ว! | First cross of the saved previous highest score during a run; no spam |

### C. Special blocks (4 triggers)
| Trigger | Thai speech | Condition |
| --- | --- | --- |
| Bomb activates | บูมมม! 💥 | Actual explosion, not mere appearance |
| Bomb cascade/chain clear | ระเบิดต่อเนื่องเลย! | Additional line clear caused by gravity after a bomb |
| Golden block contributes to a cleared line | คะแนนคูณมาแล้ว! | Actual golden multiplier scoring |
| Golden multiplier >= x3 | ปิก้า! คะแนนพุ่งเลย! | Prefer this over generic golden line speech |

### D. Existing reward milestones (4 triggers)
| Score | Thai text | Existing behavior |
| ---: | --- | --- |
| 10,000 | ยินดีด้วย! ได้ไอศกรีม Dairy Queen 1 โคน! | Existing reward dialog + pause until acknowledged |
| 20,000 | เย้! ได้กาโตะ 1 ขวดแล้ว! | Existing reward dialog + water-bottle image |
| 30,000 | สุดยอด! ได้กล่องการ์ดโปเกม่อนแล้ว! | Existing reward dialog + pause |
| 100,000 | ปิก้าาา! Nintendo Switch 1 เครื่อง! | Existing reward dialog + pause |

Do not spawn a second ordinary companion speech bubble while the reward dialog is shown. Existing prize labels/quantity, fulfillment disclaimers, once-per-run triggering, queue, and acknowledgment behavior remain authoritative.

### E. Risk and end-of-game (5 triggers)
| Trigger | Thai speech | Condition |
| --- | --- | --- |
| Board >= 70% occupied height | ระวังนะ! ใกล้เต็มแล้ว! | Entering threshold; avoid repeated warnings |
| Board >= 90% occupied height | ปิก้า!! อันตรายแล้ว! | Entering critical threshold; override 70% warning |
| Recover from >= 90% to < 60% | รอดแล้ว! เก่งมาก! | One recovery message per danger episode |
| Game Over, not Top 5 | ไม่เป็นไรนะ ลองใหม่กัน! | Only when Pikachu is visible on game-over UI |
| Game Over, in Top 5 | เยี่ยมเลย! ได้อันดับที่ {rank}! | Rank from current run unique ID in saved Top 5 |

**Trigger count: 25** (21 ordinary companion triggers and four existing reward-dialog triggers).

### Presentation and dispatch contract
- Cream/white rounded speech bubble with subtle yellow border and tail toward Pikachu; visually anchored alongside existing Pikachu within mobile-safe area; no board, controls, HUD, or reward-dialog overlap.
- Ordinary speech lasts approximately **2.5 seconds**, does not pause gameplay, and may animate companion with existing idle/wave/excited/happy frames.
- General speech cooldown **8 seconds**, except priority warning/ending events; ordinary piece-lock speech has **10% probability**. Never show identical speech twice consecutively.
- Priority order: **reward modal (existing; exclusive) > critical danger / Game Over > new record / combo > line clear / special block > casual / idle**. Higher priority may replace low priority; suppress or coalesce lower-priority events, not an unlimited message queue.
- Correctly restore or dismiss bubble on pause/resume, game over, new run, app backgrounding, and reward modal; cancel stale timers. Reset per-run streaks, dangers, and once-only triggers on new run.
- Support Thai (default), English, and Spanish based on selected language, including rank placeholder; language change refreshes or dismisses current bubble safely. No network dependency; accessibility-friendly readable text and non-interactive, non-blocking overlay.
- Warning heights use highest occupied row relative to board height, not count of filled cells; confirm exact implementation against board logic. If Pikachu is hidden on a given screen/layout, speech must not appear stranded or cover the board.

### QA acceptance checklist (required before merge/release)
- Verify all 25 triggers, priority handling when events collide, cooldown/10% random behavior, no duplicate reward popup, and no missed milestone/paused input leaks.
- Verify 1–4-line clears, gold multiplier x2/x3+, bomb/cascade, 3-clear streak, record crossing, danger threshold entry/recovery, Top 5 ranking and non-Top 5 end.
- Verify gameplay timing still works while bubbles display, background/visibility, pause/resume, restart/menu/gameover, and no stale bubble or timers.
- Verify 360/390/412px mobile portrait, landscape, desktop web and Android; overlays must not block touch controls or score/HUD.
- Verify all three languages and offline behavior. Automated source/unit checks plus actual runtime QA must be recorded separately as PASS/FAIL/NOT TESTED.
- **Owner gate:** visual/gameplay approval before merging production behavior; build APK only on explicit owner request.

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
