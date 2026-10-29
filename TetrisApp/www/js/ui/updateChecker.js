/* Manually check GitHub Releases; install is always user-controlled. */
(function () {
  'use strict';
  const API = 'https://api.github.com/repos/kimloor/PkmnBlockPuzzle/releases/latest';
  const current = document.querySelector('.game-version')?.textContent.trim().replace(/^v/i, '') || '0.0.0';
  const versionLabel = document.getElementById('update-current-version');
  if (versionLabel) versionLabel.textContent = 'v' + current;
  const status = document.getElementById('update-status');
  const check = document.getElementById('check-update-button');
  const notes = document.getElementById('update-notes');
  if (!check || !status || !notes) return;
  const defaultLabel = 'Check for Update';
  let updateUrl = null;
  let checksumUrl = null;
  let nativeReady = false;
  let downloading = false;
  const versions = v => {
    const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(v || '').trim());
    return match ? match.slice(1).map(Number) : null;
  };
  function newer(remote, local) {
    const a = versions(remote), b = versions(local);
    if (!a || !b) return false;
    for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
    return false;
  }
  function message(value) { status.textContent = value; }
  function reset() {
    updateUrl = null;
    checksumUrl = null;
    nativeReady = false;
    check.textContent = defaultLabel;
    notes.hidden = true;
    notes.textContent = '';
  }
  function openExternal(url) {
    if (window.cordova && window.cordova.InAppBrowser) {
      window.cordova.InAppBrowser.open(url, '_system');
    } else if (window.cordova) {
      message('ไม่สามารถเปิดเบราว์เซอร์ภายนอกได้ กรุณาเปิด GitHub Releases ผ่านเบราว์เซอร์');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
  check.addEventListener('click', async function () {
    if (updateUrl) {
      if (downloading) return;
      if (!window.cordova || !window.PkmnUpdater || !checksumUrl) {
        openExternal(updateUrl);
        return;
      }
      if (nativeReady) {
        window.PkmnUpdater.install(
          () => message('เปิดหน้าติดตั้ง Android แล้ว'),
          error => message(String(error))
        );
        return;
      }
      downloading = true;
      check.disabled = true;
      message('กำลังดาวน์โหลดอัปเดต 0%');
      window.PkmnUpdater.download(updateUrl, checksumUrl, result => {
        if (result.state === 'progress') {
          message('กำลังดาวน์โหลดอัปเดต ' + result.percent + '%');
        } else if (result.state === 'ready') {
          downloading = false;
          nativeReady = true;
          check.disabled = false;
          message('ดาวน์โหลดและตรวจสอบ APK สำเร็จ พร้อมติดตั้ง');
          window.PkmnUpdater.install(
            () => message('เปิดหน้าติดตั้ง Android แล้ว'),
            error => message(String(error))
          );
        }
      }, error => {
        downloading = false;
        check.disabled = false;
        message('ดาวน์โหลดภายในเกมไม่สำเร็จ: ' + String(error) + ' กด Update อีกครั้งเพื่อเปิด Browser');
        // The browser fallback is opt-in and never bypasses user confirmation.
        nativeReady = false;
        window.PkmnUpdater = null;
      });
      return;
    }
    check.disabled = true;
    message('กำลังตรวจสอบเวอร์ชันล่าสุด…');
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      let response;
      try {
        response = await fetch(API, { headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal, cache: 'no-store' });
      } finally { clearTimeout(timer); }
      if (response.status === 404) { reset(); message('ยังไม่มี Release สำหรับดาวน์โหลด'); return; }
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const release = await response.json();
      const latest = String(release.tag_name || '').replace(/^v/i, '');
      if (!versions(latest)) { reset(); message('ข้อมูลเวอร์ชันบน GitHub ไม่ถูกต้อง'); return; }
      if (!newer(latest, current)) { reset(); message('คุณใช้เวอร์ชันล่าสุดแล้ว (v' + current + ')'); return; }
      const asset = Array.isArray(release.assets)
        ? release.assets.find(a => a.name === 'PkmnBlockPuzzle.apk' && a.browser_download_url && a.state === 'uploaded')
        : null;
      if (!asset) { reset(); message('พบ v' + latest + ' แต่ยังไม่มี APK ที่พร้อมดาวน์โหลด'); return; }
      const checksumAsset = Array.isArray(release.assets)
        ? release.assets.find(a => a.name === 'PkmnBlockPuzzle.apk.sha256' && a.browser_download_url && a.state === 'uploaded')
        : null;
      const safeUrl = new URL(asset.browser_download_url);
      if (safeUrl.protocol !== 'https:' || safeUrl.hostname !== 'github.com' ||
          !safeUrl.pathname.startsWith('/kimloor/PkmnBlockPuzzle/releases/download/')) throw new Error('Unsafe download URL');
      updateUrl = safeUrl.href;
      checksumUrl = checksumAsset ? checksumAsset.browser_download_url : null;
      check.textContent = 'Update';
      message('มีอัปเดตใหม่ v' + latest + ' (ปัจจุบัน v' + current + ')');
      notes.hidden = false;
      notes.textContent = 'Version v' + latest + '\n\n' +
        String(release.body || 'อัปเดตเป็นเวอร์ชันล่าสุด').slice(0, 1200);
    } catch (error) {
      reset();
      message(error.name === 'AbortError' ? 'เชื่อมต่อหมดเวลา กรุณาลองใหม่' : 'ไม่สามารถตรวจสอบอัปเดตได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่');
    } finally { check.disabled = false; }
  });
})();
