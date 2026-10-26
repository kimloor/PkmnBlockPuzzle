# Android and offline runbook

## Debug APK via GitHub Actions
Open **Actions → Android Debug APK → Run workflow** (or push to master / open PR). After a successful run, download artifact `PkmnBlockPuzzle-debug-apk` and unzip it. Transfer `app-debug.apk` to your Android device and install; Android may request authorization to install apps from your file manager.

## Local build
Install JDK 17, Android SDK, Node.js 22 and Gradle compatible with cordova-android 14. Then:

```sh
cd TetrisApp
npm ci
npm install -g cordova@12
cordova platform add android@14.0.1
cordova build android --debug -- --packageType=apk
```

Check `TetrisApp/platforms/android/app/build/outputs/apk/debug/`.

## Offline smoke test
Verify all game UI and theme switching, rotate and move pieces with touch, score and high score persistence, exit/reopen, and airplane mode. Background music is intentionally disabled; all five SFX files remain.

## Import licensing
Original MIT LICENSE is retained. The only removed media are `audio/background_music.mp3`, two imported screenshots and four third-party franchise theme backgrounds. Original logo and remaining neutral theme backgrounds are retained as requested. Their provenance is not independently verified; avoid distributing assets until rights are established. See upstream https://github.com/iDerra/tetris-game.

Debug APK is not signed for Play Store distribution. This runbook does not itself establish an APK build pass.
