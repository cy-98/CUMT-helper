import {
  http_get,
  http_post
} from "./http.js"

// - util - start
const getlocalToken = () => {
  const token = wx.getStorageSync('token')
  if (token) return token
  return ''
}
const processPayload = (payload) => {
  !payload.head && (payload.header = {})
  payload.header.token = getlocalToken() // token
}
// - util - end

// 教务 : 登陆
// (data:String):Promise =>{}  登陆密文 得到token 
const loginCUMT = (data) => {
  const payload = {
    path: 'login',
    data: {
      "data": data
    }
  }
  return http_post(payload)
}
// 教务 : 用户
// (header[token]):Promise=>{} path: userInfo 
const getUser = () => {
  const path = 'userInfo'
  const payload = {
    path: path
  }
  processPayload(payload)
  return http_get(payload)
}
// 课程表
// (header[token], params[years, term]):Promise=>{} path: all
const getTimeTables = (params) => {
  const path = 'all'
  const payload = {
    path: path,
    params: params
  }
  processPayload(payload)
  return http_get(payload)
}

// 一卡通 : 余额
const getBalance = () => {
  const path = 'ykt/balance'
  const payload = {
    path: path
  }
  processPayload(payload)
  return http_get(payload)
}

module.exports = {
  getUser: getUser,                   // 教务
  loginCUMT: loginCUMT,
  getTimeTables: getTimeTables,
  getBalance: getBalance              // 一卡通
}