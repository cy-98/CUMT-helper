import { encrypt, setStore, getStore } from '../../utils/util'
import { loginCUMT } from '../../utils/api'
import { toMine, toIndex } from '../../utils/navigate.js'

var app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    username: '',
    password: ''
  },
  onLoad: function () { // 获取微信头像和昵称
    var _this = this;
    if (app.globalData.userInfo) {
      this.setUserData(app.globalData.userInfo)
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = (res) => {
        this.setUserData(res.userInfo)
      };
    } else {
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo;
          this.setUserData(res.userInfo)
        },
      });
    }
  },
  login: function() {
    wx.showLoading({ title: '登陆中' })
    let userData = JSON.stringify({
      username: this.data.username,
      password: this.data.password
    });

    loginCUMT(encrypt(userData))   // 登陆密文
      .then((res) => {
        wx.hideLoading()
        if (res.data.code !== 200) {
          wx.showModal({ title: '登陆失败' })
          return
        }else {
          let token = res.data.data
          setStore({ 'token': token })

          toMine() // 登陆成功
        }
      })
      .catch(err => {
        wx.hideLoading()
        console.log(err)
      })
  },
  getAccount: function (e) {
    var username = e.detail.value;
    this.setData({
      username: username
    });
  },
  getPassword: function (e) {
    var password = e.detail.value;
    this.setData({
      password: password
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    const userInfo = e.detail.userInfo
    app.globalData.userInfo = userInfo;
    this.setUserData(userInfo)
  },
  setUserData(userInfo) {
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
  }
});