import { parseParams }  from './util.js'

const rootUrl = 'https://met.chpz527.cn/uni/'

const commit = (payload, method) => {
  const {
    path,
    data,
    header
  } = payload

  return new Promise((resolve, reject) => {
    wx.request({
      url: rootUrl + path,
      data: data ? data : '',
      header: header,
      method: method,
      success: (res) => {
        resolve(res)
      },
      fail: function(err) {
        reject(err)
      },
    })
  })
}


const http_get = (payload) => {
  const { params } = payload
  params 
    && (payload.path += parseParams(params))
  return commit(payload, 'GET')
}
const http_post = (payload) => {
  payload.header ?
    payload.header['content-type'] = 'application/x-www-form-urlencoded' :
    payload.header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
  return commit(payload, 'POST')
}

module.exports = {
  http_get: http_get,
  http_post: http_post
}