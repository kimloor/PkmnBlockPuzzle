/* Manual release update checker; never replaces local game files or installs silently. */
(function () {
  'use strict';
  const API = 'https://api.github.com/repos/kimloor/PkmnBlockPuzzle/releases/latest';
  const RELEASES = 'https://github.com/kimloor/PkmnBlockPuzzle/releases/latest';
  const current = document.querySelector('.game-version')?.textContent.trim().replace(/^v/i, '') || '0.0.0';
  const versionLabel = document.getElementById('update-current-version');
  if (versionLabel) versionLabel.textContent = 'v' + current;
  const status = document.getElementById('update-status');
  const check = document.getElementById('check-update-button');
  const download = document.getElementById('download-update-button');
  const notes = document.getElementById('update-notes');
  if (!check || !status || !download) return;
  const versions = (v) => {
    const m = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(v || '').trim());
    return m ? m.slice(1).map(Number) : null;
  };
  function newer(remote, local) {
    const a = versions(remote), b = versions(local);
    if (!a || !b) return false;
    for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
    return false;
  }
  function message(s) { status.textContent = s; }
  function openExternal(url) {
    // The Android build installs cordova-plugin-inappbrowser to support _system.
    if (window.cordova && window.cordova.InAppBrowser) {
      window.cordova.InAppBrowser.open(url, '_system');
    } else if (window.cordova) {
      message('ไม่สามารถเปิดเบราว์เซอร์ภายนอกได้ กรุณาเปิด GitHub Releases ผ่านเบราว์เซอร์');
      download.hidden = true;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
  check.addEventListener('click', async function () {
    check.disabled = true;
    download.hidden = true;
    notes.hidden = true;
    message('กำลังตรวจสอบเวอร์ชันล่าสุด…');
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      let response;
      try { response = await fetch(API, {headers: {Accept: 'application/vnd.github+json'}, signal: controller.signal, cache: 'no-store'}); }
      finally { clearTimeout(timer); }
      if (response.status === 404) { message('ยังไม่มี Release สำหรับดาวน์โหลด'); return; }
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const release = await response.json();
      const latest = String(release.tag_name || '').replace(/^v/i, '');
      if (!versions(latest)) { message('ข้อมูลเวอร์ชันบน GitHub ไม่ถูกต้อง'); return; }
      if (!newer(latest, current)) { message('คุณใช้เวอร์ชันล่าสุดแล้ว (v' + current + ')'); return; }
      const asset = Array.isArray(release.assets) ? release.assets.find(a => a.name === 'PkmnBlockPuzzle.apk' && a.browser_download_url && a.state === 'uploaded') : null;
      if (!asset) { message('พบ v' + latest + ' แต่ยังไม่มี APK ที่พร้อมดาวน์โหลด'); return; }
      const safeUrl = new URL(asset.browser_download_url);
      if (safeUrl.protocol !== 'https:' || safeUrl.hostname !== 'github.com' || !safeUrl.pathname.startsWith('/kimloor/PkmnBlockPuzzle/releases/download/')) throw new Error('Unsafe download URL');
      message('มีอัปเดตใหม่ v' + latest + ' (ปัจจุบัน v' + current + ')');
      notes.hidden = false;
      notes.textContent = String(release.body || 'เปิดเบราว์เซอร์เพื่อดาวน์โหลด APK จาก GitHub Releases').slice(0, 700);
      download.hidden = false;
      download.onclick = () => openExternal(safeUrl.href);
    } catch (error) {
      message(error.name === 'AbortError' ? 'เชื่อมต่อหมดเวลา กรุณาลองใหม่' : 'ไม่สามารถตรวจสอบอัปเดตได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่');
    } finally { check.disabled = false; }
  });
  document.getElementById('update-release-link')?.addEventListener('click', () => openExternal(RELEASES));
})();
