import {
  http_get,
  http_post
} from './http.js'

// util - start
const getlocalToken = () => {
  const token = wx.getStorageSync('token')
  if (token) return token
  return ''
}
const processPayload = (payload) => { // token
  payload.header.token = getlocalToken()
}
// util - end

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
// (header[token]):Promise=>{} path: userInfo 
const getUser = () => {
  const path = 'userInfo'
  const payload = {
    header: {},
    path: path
  }
  processPayload(payload)
  return http_get(payload)
}
// (header[token], params[years, term]):Promise=>{} path: all
const getTimeTables = (params) => {
  const path = 'all'
  const payload = {
    header: {},
    path: path,
    params: params
  }
  processPayload(payload)
  return http_get(payload)
}
module.exports = {
  loginCUMT: loginCUMT,
  getUser: getUser,
  getTimeTables: getTimeTables
}