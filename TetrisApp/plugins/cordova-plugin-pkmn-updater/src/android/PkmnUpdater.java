package com.kimloor.pkmnupdater;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import androidx.core.content.FileProvider;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.*;
import java.net.*;
import java.security.MessageDigest;
import java.util.Locale;

public final class PkmnUpdater extends CordovaPlugin {
    private static final String PACKAGE = "com.kimloor.pkmnblockpuzzle";
    private static final String PREFIX = "https://github.com/kimloor/PkmnBlockPuzzle/releases/download/";
    private File readyApk;

    @Override public boolean execute(String action, JSONArray args, CallbackContext callback) {
        if ("download".equals(action)) {
            String url = args.optString(0, "");
            String checksumUrl = args.optString(1, "");
            if (!url.startsWith(PREFIX) || !url.endsWith("/PkmnBlockPuzzle.apk")
                    || !checksumUrl.startsWith(PREFIX) || !checksumUrl.endsWith("/PkmnBlockPuzzle.apk.sha256")
                    || !url.substring(0, url.lastIndexOf('/')).equals(checksumUrl.substring(0, checksumUrl.lastIndexOf('/')))) {
                callback.error("Invalid release URLs"); return true;
            }
            readyApk = null;
            cordova.getThreadPool().execute(() -> download(url, checksumUrl, callback));
            return true;
        }
        if ("install".equals(action)) {
            cordova.getActivity().runOnUiThread(() -> install(callback));
            return true;
        }
        return false;
    }

    private static HttpURLConnection connect(String raw) throws Exception {
        URL u = new URL(raw);
        for (int i = 0; i < 6; i++) {
            if (!"https".equalsIgnoreCase(u.getProtocol()) || !allowed(u.getHost())) throw new IOException("Unexpected download host");
            HttpURLConnection conn = (HttpURLConnection) u.openConnection();
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(30000);
            conn.setInstanceFollowRedirects(false);
            conn.setRequestProperty("User-Agent", "PkmnBlockPuzzle-Updater");
            int status = conn.getResponseCode();
            if (status >= 300 && status < 400) {
                String location = conn.getHeaderField("Location");
                conn.disconnect();
                if (location == null) throw new IOException("Missing redirect");
                u = new URL(u, location);
                continue;
            }
            if (status != 200) { conn.disconnect(); throw new IOException("Download HTTP " + status); }
            return conn;
        }
        throw new IOException("Too many redirects");
    }

    private static boolean allowed(String host) {
        return "github.com".equalsIgnoreCase(host)
            || "release-assets.githubusercontent.com".equalsIgnoreCase(host)
            || "objects.githubusercontent.com".equalsIgnoreCase(host);
    }

    private void download(String url, String checksumUrl, CallbackContext callback) {
        File tmp = null;
        try {
            HttpURLConnection hashConn = connect(checksumUrl);
            String expected;
            try (BufferedReader r = new BufferedReader(new InputStreamReader(hashConn.getInputStream(), "UTF-8"))) {
                String line = r.readLine();
                if (line == null || !line.matches("(?i)^[a-f0-9]{64}\\s+\\*?PkmnBlockPuzzle\\.apk$"))
                    throw new IOException("Invalid release checksum");
                expected = line.substring(0, 64).toLowerCase(Locale.US);
            } finally { hashConn.disconnect(); }

            File folder = new File(cordova.getActivity().getCacheDir(), "pkmn-updates");
            if (!folder.exists() && !folder.mkdirs()) throw new IOException("Cannot create cache directory");
            tmp = new File(folder, "download.tmp");
            File apk = new File(folder, "PkmnBlockPuzzle.apk");
            if (apk.exists()) apk.delete();
            HttpURLConnection conn = connect(url);
            long total = conn.getContentLengthLong();
            if (total <= 0 || total > 200L * 1024 * 1024) throw new IOException("Invalid APK size");
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            long downloaded = 0;
            int previous = -1;
            try (InputStream in = conn.getInputStream(); OutputStream out = new FileOutputStream(tmp)) {
                byte[] buf = new byte[32768];
                int read;
                while ((read = in.read(buf)) != -1) {
                    downloaded += read;
                    if (downloaded > 200L * 1024 * 1024) throw new IOException("APK too large");
                    digest.update(buf, 0, read);
                    out.write(buf, 0, read);
                    int percent = (int)(downloaded * 100 / total);
                    if (percent != previous) {
                        previous = percent;
                        JSONObject data = new JSONObject();
                        data.put("state", "progress");
                        data.put("percent", Math.min(100, percent));
                        PluginResult progress = new PluginResult(PluginResult.Status.OK, data);
                        progress.setKeepCallback(true);
                        callback.sendPluginResult(progress);
                    }
                }
            } finally { conn.disconnect(); }
            if (downloaded != total) throw new IOException("Incomplete download");
            StringBuilder actual = new StringBuilder();
            for (byte b : digest.digest()) actual.append(String.format(Locale.US, "%02x", b & 0xff));
            if (!expected.equals(actual.toString())) throw new SecurityException("SHA-256 mismatch");
            verifyApk(tmp);
            if (!tmp.renameTo(apk)) throw new IOException("Cannot finalize APK");
            readyApk = apk;
            JSONObject done = new JSONObject();
            done.put("state", "ready");
            callback.success(done);
        } catch (Exception e) {
            if (tmp != null) tmp.delete();
            callback.error("Update failed: " + e.getMessage());
        }
    }

    private void verifyApk(File apk) throws Exception {
        PackageManager pm = cordova.getActivity().getPackageManager();
        int flags = PackageManager.GET_SIGNING_CERTIFICATES;
        PackageInfo archive = pm.getPackageArchiveInfo(apk.getAbsolutePath(), flags);
        PackageInfo installed = pm.getPackageInfo(cordova.getActivity().getPackageName(), flags);
        if (archive == null || !PACKAGE.equals(archive.packageName) || !PACKAGE.equals(installed.packageName))
            throw new SecurityException("Unexpected package");
        if (archive.signingInfo == null || installed.signingInfo == null)
            throw new SecurityException("Missing signing information");
        android.content.pm.Signature[] a = archive.signingInfo.getApkContentsSigners();
        android.content.pm.Signature[] b = installed.signingInfo.getApkContentsSigners();
        if (a.length != 1 || b.length != 1 || !a[0].equals(b[0]))
            throw new SecurityException("APK signing certificate differs from installed app");
        long candidate = Build.VERSION.SDK_INT >= 28 ? archive.getLongVersionCode() : archive.versionCode;
        long existing = Build.VERSION.SDK_INT >= 28 ? installed.getLongVersionCode() : installed.versionCode;
        if (candidate <= existing) throw new SecurityException("APK is not a newer version");
    }

    private void install(CallbackContext callback) {
        try {
            if (readyApk == null || !readyApk.isFile()) throw new IOException("No verified APK");
            verifyApk(readyApk);
            if (Build.VERSION.SDK_INT >= 26 && !cordova.getActivity().getPackageManager().canRequestPackageInstalls()) {
                Intent settings = new Intent(android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + cordova.getActivity().getPackageName()));
                cordova.getActivity().startActivity(settings);
                callback.error("Allow app installs for this app, then press Update again");
                return;
            }
            Uri fileUri = FileProvider.getUriForFile(cordova.getActivity(),
                cordova.getActivity().getPackageName() + ".pkmnupdater.fileprovider", readyApk);
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(fileUri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            cordova.getActivity().startActivity(intent);
            callback.success("Installer opened");
        } catch (Exception e) {
            callback.error("Could not open installer: " + e.getMessage());
        }
    }
}
