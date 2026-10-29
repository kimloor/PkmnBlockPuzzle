module.exports = {
  download: function (url, checksumUrl, progress, error) {
    cordova.exec(progress, error, 'PkmnUpdater', 'download', [url, checksumUrl]);
  },
  install: function (success, error) {
    cordova.exec(success, error, 'PkmnUpdater', 'install', []);
  }
};
