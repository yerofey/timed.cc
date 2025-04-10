import CryptoJS from 'crypto-js';

export function useEncryption(key) {
  function encrypt(text) {
    if (!key) throw new Error('Encryption key is not provided');
    return CryptoJS.AES.encrypt(text, key).toString();
  }

  function decrypt(ciphertext) {
    if (!key) throw new Error('Encryption key is not provided');
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  return { encrypt, decrypt };
}
