# Asset cleanup baseline

This branch removes imported image and MP3 assets with unverified rights. All existing theme color palettes remain, but use CSS solid-color backdrops instead of referenced images. Audio elements are retained without sources so existing mute controls and calls do not crash; effects/music are intentionally silent until suitably licensed replacements are added.

The original MIT LICENSE and attribution remain at repository root.

External Google Fonts preconnect and CSS requests have been removed to allow offline rendering with local fallback fonts. Do not assume the Android APK is tested; this is source-level cleanup only.

## Manual QA before release
- Load offline and inspect browser Network console (no requests)
- Switch all themes and ensure backgrounds/colors apply
- Start, pause, resume, restart; move, rotate, drop and clear rows
- Open high scores and ensure local persistence
- Build Cordova Android APK, install on device, enable airplane mode and retest
- Add own/authorized sound, logo and art before publishing
