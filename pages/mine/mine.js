import {
  getUser
} from '../../utils/api.js'
import {
  decrypt,
  hasToLogin,
  getStore,
  setStore,
  getWxUser
} from '../../utils/util.js'

const App = getApp()
Page({
  // init datas
  data: {
    userInfo: '',
    avatarUrl: '',
    nickName: ''
  },
  onShow() {
    const { userInfo, nickName } = this.data
    if(!userInfo) {
      console.log(userInfo)
      getUser()
        .then((res) => {
          if (res.data.code === 400) {
            wx.showToast({
              title: '服务器错误',
            })
            return
          }
          const text = res.data.data
          const userInfo = JSON.parse(decrypt(text))

          setStore({
            'userInfo': userInfo
          })
          this.setData({
            userInfo: userInfo
          })
        })
    }
    if(!nickName) {
      wx.getUserInfo({
        withCredentials: true,
        success: function(res) {
          console.log(res)
        },
      })
    }
  },
  // lifetimes 
  onLoad: function(options) {
    hasToLogin()
    getWxUser()
      .then(res => {
        const {
          avatarUrl,
          nickName
        } = res.userInfo
        this.setData({
          avatarUrl: avatarUrl,
          nickName: nickName
        })
        App.globalData.userInfo = res.userInfo
      })
      .catch(err => {
        console.log(err)
      })
    let userInfo
    getStore('userInfo')
      .then(res => {
        this.setData({
          userInfo: res.data
        })
      })
      .catch(err => {
        console.log('userinfo in storage failed')
        getUser()
          .then((res) => {
            if (res.data.code === 400) {
              wx.showToast({
                title: '服务器错误',
              })
              return
            }
            const text = res.data.data
            userInfo = JSON.parse(decrypt(text))

            setStore({
              'userInfo': userInfo
            })
            this.setData({
              userInfo: userInfo
            })
          }).catch((err) => { // 本地没有token 无法发送getUser请求
            console.log(err)
            hasToLogin()
          })
      })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl,
    });
  },
})