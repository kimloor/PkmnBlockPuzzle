# Development rules — PkmnBlockPuzzle

## Version bump required for every change
For every future change merged through a PR (including documentation, assets, bug fixes and UI changes), increment the semantic version in `TetrisApp/config.xml` and synchronize the visible version in `TetrisApp/www/index.html` (selector `.game-version`).

- PATCH for fixes, documentation or minor adjustments.
- MINOR for new backwards-compatible features.
- MAJOR for breaking changes.
- The PR version check must pass before merge. Current baseline: **0.1.1**.
- When updating multiple open PRs, rebase on latest master and re-bump to avoid version conflicts.

## Android APK builds — owner opt-in only
`.github/workflows/android-apk.yml` must use **workflow_dispatch only**. Do not add push, pull_request or schedule triggers without the owner's explicit instruction. Only the owner explicitly requesting an APK build authorizes running this workflow. Website GitHub Pages deployment remains automatic.

## License
Preserve original upstream MIT LICENSE and third-party notices.
