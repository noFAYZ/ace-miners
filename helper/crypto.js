import { cryptoKey } from "@/constant/consonants";

var CryptoJS = require("crypto-js");

export const encrypt = (txt) => {
  var ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(txt),
    cryptoKey
  ).toString();
  return ciphertext;
};

export const decrypt = (txt) => {
  var bytes = CryptoJS.AES.decrypt(txt, cryptoKey);
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};
