# Android in-app updater — v0.5.2

## Purpose
The Settings button checks the GitHub latest release. If the tag is newer and PkmnBlockPuzzle.apk exists, the same button becomes Update, with release notes below.

On Android v0.5.2+, Update invokes a local Cordova plugin that downloads the APK into an app-private cache and reports progress. It downloads the matching PkmnBlockPuzzle.apk.sha256, checks SHA-256, APK package ID, signing certificate against the installed app, and increasing Android versionCode before opening the Android system installer. **The user must approve system installation prompts; silent installation and automatic relaunch are not promised.**

If the native plugin or matching checksum asset is unavailable, the established browser download remains available. If a native download fails, another tap uses the browser fallback.

## Release contract
- GitHub Releases tag: semver vX.Y.Z (not just a GitHub Actions artifact).
- Assets: PkmnBlockPuzzle.apk and PkmnBlockPuzzle.apk.sha256.
- The APK must use the same Android release signing key and package ID com.kimloor.pkmnblockpuzzle.
- A new versionCode higher than the installed version is required.
- Never replace signing secrets or upload them to git.
- Build is opt-in via the manual Android Release APK workflow.
- Workflow installs the local plugin after Cordova Android platform creation.

## Limitations / QA needed
- Android may require enabling Install unknown apps for this app and confirmation in the package installer.
- Download runs on Cordova's background thread while the app process is alive; it is **not** a resumable foreground service. If Android kills the app, restart the download.
- Automatic post-install app relaunch is not implemented.
- Browser/Web build uses browser fallback.
- No Android device or emulator runtime test has been performed as of source implementation. Do not label install-flow PASS until tested on device.
- Test upgrade from signed 0.5.2 to a later release; 0.5.1 cannot itself use the new native plugin and will follow its existing browser route once more.
