const rootUrl = 'https://met.chpz527.cn/uni/'

const commit = (payload, method)=>{
  const { path, data, headers } = payload

  const header ={} 
  method === 'POST' && 
  (header['content-type']='application/x-www-form-urlencoded')

  for(const key in headers) {
    header[key] = headers[key]
  }

  return new Promise((resolve, reject)=>{
    wx.request({
      url: rootUrl + path,
      data: data? data : '',
      header: header,
      responseType: 'text',
      method: method,
      success: (res)=>{ resolve(res) },
      fail: function(err) { reject(err) },
    })
  })
}


const http_get = (payload)=>{
  return commit(payload, 'GET')
}
const http_post = (payload)=>{
  return commit(payload, 'POST')
}

module.exports = {
  http_get: http_get,
  http_post: http_post
}