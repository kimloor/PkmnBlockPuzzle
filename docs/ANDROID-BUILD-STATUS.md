# Android GitHub Actions build status reporting

The Android release workflow writes a machine-readable report to `.github/build-status/latest.json` after each build attempt (including failed steps, using `always()`). ChatGPT can read this file through the connected GitHub repository instead of asking the owner for screenshots.

Fields: `schema_version`, `workflow`, `run_id`, `run_attempt`, `run_url`, `source_sha`, `source_ref`, `version`, `reported_at_utc`, `steps.version_validation`, `steps.apk_build_and_signing`, `steps.artifact_upload`, `steps.release_publish`, `result` and `release_url`.

The report is written back to `master` using the workflow's `contents: write` GitHub token, which requires repository Actions workflow permissions to allow writing. Changes under `.github/build-status/` do **not** trigger another APK build; only explicit changes to `.github/build-requests/request.json` do.

A report is best-effort: a failed checkout, token permissions issue, runner outage or early cancellation can prevent it from being written. When unavailable or stale, report that limitation rather than claiming a build succeeded. Check `run_id` and `source_sha` to distinguish the result from a newer source commit. A passing source inspection is **not** Android device QA.

Latest source version as of setup: 0.5.4. The last explicitly requested release remains v0.5.2; do not build or publish v0.5.4 without owner approval.
