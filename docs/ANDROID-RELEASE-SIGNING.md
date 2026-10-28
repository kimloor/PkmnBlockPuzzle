# Permanent Android Release Signing — owner setup
The `.github/workflows/android-apk.yml` workflow is **manual only** (`workflow_dispatch`), and cannot build until four repository Actions secrets exist.

Create a signing key once on a trusted Windows/macOS/Linux computer with JDK keytool, for example:

```bash
keytool -genkeypair -v -keystore PkmnBlockPuzzle-release.jks -storetype PKCS12 -alias pkmnblockpuzzle -keyalg RSA -keysize 3072 -validity 10000
```

Use strong unique store/key passwords and keep a protected offline backup of the .jks and passwords. Never upload keystore files or passwords to the git repository, issues, or chat. Configure these GitHub Repository → Settings → Secrets and variables → Actions secrets:

- `RELEASE_KEYSTORE_BASE64`: base64 representation of the exact keystore bytes (single line). On Windows PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes('PkmnBlockPuzzle-release.jks'))`
- `RELEASE_STORE_PASSWORD`: keystore store password.
- `RELEASE_KEY_ALIAS`: `pkmnblockpuzzle` (or alias selected at key creation).
- `RELEASE_KEY_PASSWORD`: key password; for PKCS12, generally the same as store password.

Run Actions → Android Release APK → Run workflow only after secrets have been configured. Download the `PkmnBlockPuzzle-release` artifact and inspect its cert fingerprint, application ID and versionCode before distributing.

Do not use the previous debug APK as an update base: its certificate is different. Owner approved a one-time clean install without data migration. Maintain the new keystore permanently and keep `com.kimloor.pkmnblockpuzzle` unchanged. Increment Android versionCode for every later APK release.

NOTE: This config is a release build pipeline, not the Settings updater. v0.5.0 will be reserved for the ready release APK when authorized functionality and validation are complete. No APK was built here.
