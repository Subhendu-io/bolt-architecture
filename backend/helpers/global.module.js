const CryptoJS = require('crypto-js');

module.exports = {
  getEncrypted: (data, key) => {
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return encrypted;
  },

  getDecrypted: (data, key) => {
    var bytes = CryptoJS.AES.decrypt(data, key);
    var decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decrypted;
  },

  getEncryptedHex: (data, key) => {
    var b64 = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    var e64 = CryptoJS.enc.Base64.parse(b64);
    var eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex;
  },

  getDecryptedHex: (cipherText, key) => {
    var reb64 = CryptoJS.enc.Hex.parse(cipherText);
    var bytes = reb64.toString(CryptoJS.enc.Base64);
    var decrypt = CryptoJS.AES.decrypt(bytes, key);
    var decrypted = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
    return decrypted;
  }
};
