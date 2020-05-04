import { getUser } from '../../utils/api.js'
import { decrypt, hasToLogin, getStore, setStore, getWxUser } from '../../utils/util.js'

const App = getApp()
Page({
  data: {
    userInfo: '',
    avatarUrl: '',
    nickName: '',
    hasUserInfo: false,
    canIuse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShow() {
    console.log('mine page is showing')
    hasToLogin()
    const { userInfo, nickName } = this.data
    if(!userInfo) {
      getUser()
        .then((res) => {
          if (res.data.code === 400) {
            wx.showToast({ title: '服务器错误', })
            return
          }
          const text = res.data.data
          const userInfo = JSON.parse(decrypt(text))
          setStore({ 'userInfo': userInfo })
          this.setData({ userInfo: userInfo })
        })
    }
    if(!nickName) {
      getWxUser().then(res => {
        const { avatarUrl, nickName } = res.userInfo
        this.setUserData(nickName, avatarUrl)
      })
    }
  },
  onLoad: function(options) {
    // 微信用户
    console.log('mine page is onloading')
    if (App.globalData.userInfo) {
      const { nickName, avatarUrl } = App.globalData.userInfo
      this.setUserData(nickName, avatarUrl)
    } else if (this.data.canIUse) {
      App.userInfoReadyCallback = (res) => {
        const { nickName, avatarUrl } = App.globalData.userInfo = res.userInfo
        this.setUserData(nickName, avatarUrl)
      };
    } else {
      getWxUser().then(res => {
        const{ nickName, avatarUrl } = App.globalData.userInfo = res.userInfo
        this.setUserData(nickName, avatarUrl)
      })
    }
    // 教务信息
    getStore('userInfo')
      .then(res => {
        this.setData({ userInfo: res.data })
      })
  },
  setUserData(nickName, avatarUrl){
    this.setData({
      nickName: nickName,
      avatarUrl: avatarUrl,
      hasUserInfo: true
    })
  },
  getUserInfo: function (e) {
    const { nickName, avatarUrl } = e.detail.userInfo
    this.setUserData({
      nickName: nickName,
      avatarUrl: avatarUrl,
      hasUserInfo: true
    })
  },
})