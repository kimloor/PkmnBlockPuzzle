# Development rules — PkmnBlockPuzzle

Canonical repository: https://github.com/kimloor/PkmnBlockPuzzle

## Version bump required for every change
For every future change merged through a PR (including documentation, assets, bug fixes and UI changes), increment the semantic version in `TetrisApp/config.xml` and synchronize the visible version in `TetrisApp/www/index.html` (selector `.game-version`).

- PATCH for fixes, documentation or minor adjustments.
- MINOR for new backwards-compatible features.
- MAJOR for breaking changes.
- The PR version check must pass before merge. Baseline before documentation update: **0.1.2**; this documentation PR targets **0.1.3**.
- When updating multiple open PRs, rebase on latest master and re-bump to avoid version conflicts.

## Android APK builds — owner opt-in only
`.github/workflows/android-apk.yml` must use **workflow_dispatch only**. Do not add push, pull_request or schedule triggers without the owner's explicit instruction. Only the owner explicitly requesting an APK build authorizes running this workflow. Website GitHub Pages deployment remains automatic.

## License
Preserve original upstream MIT LICENSE and third-party notices.

## Project conventions
- Thai is the default UI language; keep other languages usable.
- Preserve web and Android compatibility and run appropriate smoke tests.
- Work in reviewable pull requests; do not merge or trigger APK builds without owner approval.
- Keep `README.md`, `ROADMAP.md`, `GAME_DESIGN.md` and `CHANGELOG.md` consistent with verified behavior.
