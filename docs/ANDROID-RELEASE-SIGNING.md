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

## GitHub website-only one-time key generation
A manual-only workflow exists at `.github/workflows/generate-android-release-key.yml`. It does not run automatically.

1. On GitHub: Repository → Settings → Secrets and variables → Actions → New repository secret. Name: `KEY_EXPORT_PASSPHRASE`. Set a unique 20+ character secret and retain it in a password manager. The workflow aborts if missing.
2. Open Actions → **Generate Android Release Key (one-time)** → Run workflow. This generates a new, random permanent PKCS12 release keystore and randomly generated password on the runner.
3. Download the `PkmnBlockPuzzle-encrypted-key-recovery` artifact promptly (1-day retention) and keep a permanent offline backup. The ZIP artifact contains an **encrypted** file `PkmnBlockPuzzle-key-recovery.zip.enc`, NOT a plaintext keystore.
4. Decrypt locally with OpenSSL and your export passphrase (do not share it):
   `openssl enc -d -aes-256-cbc -pbkdf2 -iter 250000 -in PkmnBlockPuzzle-key-recovery.zip.enc -out recovery.zip -pass stdin`
   Then extract recovery.zip into a private location. If you cannot run OpenSSL, keep the encrypted copy and ask for a supported local decryption workflow before proceeding.
5. Enter the extracted values into Actions repository secrets:
   - `RELEASE_KEYSTORE_BASE64` = content of `keystore-base64.txt`
   - `RELEASE_STORE_PASSWORD` = content of `store-password.txt`
   - `RELEASE_KEY_ALIAS` = content of `key-alias.txt`
   - `RELEASE_KEY_PASSWORD` = content of `key-password.txt`
6. After confirming secure backup and setting all four secrets, disable/delete the generator workflow to prevent accidental regeneration. Never run a second key generation for the same app.
7. Release APK workflow is **separate**, manual only. Do not trigger before secrets are configured and owner has confirmed readiness.

SECURITY: Do not upload decrypted keystores, passwords or base64 secrets into chats, GitHub commits, GitHub issues or logs. The downloaded encrypted bundle alone is insufficient without the export passphrase, but treat it as sensitive. Losing both the keystore and backup prevents normal app upgrades. The previous Debug APK cannot be updated in-place by a differently signed Release APK.
