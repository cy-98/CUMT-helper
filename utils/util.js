
const CryptoJS = require('./des.js')

const key = 'flyingstudioisgood' // 密码
// 用户信息加密
const encypt = (text)=>{
  const keyHex = CryptoJS.enc.Utf8.parse(key);

  const encrypted = CryptoJS.DES.encrypt(text, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString()
}
// 用户信息解密
const decrypt = (text) => {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  console.log(CryptoJS.enc.Base64.parse(text))
  const decrypted = CryptoJS.DES.decrypt({
    text: CryptoJS.enc.Base64.parse(text)
  }, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
  console.log(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Base64.parse(text).words))
  return decrypted.toString(CryptoJS.enc.Utf8);
}


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



module.exports = {
  formatTime: formatTime,
  encrypt: encypt,
  decrypt: decrypt
}
