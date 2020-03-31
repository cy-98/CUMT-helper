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

  onShow: function() {
    //生命周期函数--监听页面显示
  },

  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
  },

  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function() {
    // 用户分享
  }
})