import {
  http_get,
  http_post
} from './http.js'

// util
const getlocalToken = ()=>{
  const token = wx.getStorageSync('token')
  if(token) return token
  return false
}

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
// (header[token]):Promise=>{} userInfo
const getUser = ()=>{
  const payload = {}
  const headers = {}
  const path = 'userInfo'
  const token = getlocalToken()

  token
    && (headers['token'] = token)
    && (payload['headers'] = headers)
    && (payload['path'] = path)
  
  if(!token) {
    wx.showModal({
      title: '未检查到登陆信息',
      content: '请先登陆教务系统',
    })
    return
  }
  return http_get(payload)
}

module.exports = {
  loginCUMT: loginCUMT,
  getUser: getUser
}