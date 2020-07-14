const CryptoJS = require('./des.js')
import {
  toLogin
} from './navigate.js'

// import { key } from '../desKey'
const key = 'flyingstudioisgood'
// 用户信息加密
const encypt = (text) => {
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
  const decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(text)
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
// 路由: 请先登录
const hasToLogin = () => {
  const token = wx.getStorageSync('token')

  !token 
    && wx.showToast({
    title: '请先登录教务系统',
  })
    && toLogin()
}

// get请求 解析参数
const parseParams = (params) => {
  let querys = [],
    value
  for (const key in params) {
    value = params[key]
    if (Array.isArray(value)) {
      parseArr(key)
    } else {
      typeof value === 'object' ?
        parseObj(value) : querys.push(`${key}=${value}`)
    }
  }
  return '?' + querys.join('&')

  function parseArr(key) { // value: Array<string>
    // 拼接数组形式的query
    const value = params[key]
    let i, l = value.length;
    for (i = 0; i < l; i++) {
      querys.push(`${key}[]=${value[i]}`)
    }
  }

  function parseObj(obj) {
    // 拼接对象形式的query
    for (const key in obj) {
      const value = obj[key]
      querys.push(`${key}=${value}`)
    }
  }
}

// 本地存储
const setStore = (datas) => {
  return new Promise((resolve, reject)=>{
    for (const key in datas) {
      const data = datas[key]
      // wx.setStorageSync({
      //   key: key,
      //   data: data,
      // })
      wx.setStorageSync(key, data)
    }
    resolve()
  })
}
const getStore = (key) => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: resolve,
      fail: reject
    })
  })
}

const getWxUser = ()=>{
  return new Promise((resolve, reject)=>{
    wx.getUserInfo({
      withCredentials: true,
      success: resolve,
      fail: reject
    })
  })
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

const getOwnYearPicker = () => {
  return getStore('userInfo')
    .then((res) => {
      let { year } = res.data
      year = Number(year)
      
      let yearShcedule = 4
      const yearPicker = []
      while(yearShcedule) {
        yearPicker.unshift(
          year + --yearShcedule
        )
      }
      return yearPicker
    })
}

const flatten = (arr, result = []) => {
  arr.forEach(a => {
    if(Array.isArray(a)) {
      flatten(a, result)
    }else{
      result.push(a)
    }
  })
  return result
}
// 节流
const throttle = function (fn, delay = 500) {
  let timer = new Date().getTime()
  return function() {
    const instance = this
    const now = new Date().getTime()
    if(now - timer > delay) {
      fn.call(instance)
    }
    timer = new Date().getTime()
  }
}
// 防抖
const debounce = function(fn, delay = 500) {
  let timer
  return function() {
    const instance = this
    if(timer){ clearTimeout(timer) }
    timer = setTimeout(() => {
        fn.call(instance)
    }, delay);
  }
}

module.exports = {
  encrypt: encypt,
  decrypt: decrypt,
  
  //
  flatten: flatten,
  getStore: getStore,
  setStore: setStore,
  formatTime: formatTime,
  
  //
  getWxUser: getWxUser,
  hasToLogin: hasToLogin,
  getOwnYearPicker: getOwnYearPicker,
  
  // 
  throttle: throttle,
  debounce: debounce,
  
  parseParams: parseParams,
}