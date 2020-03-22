import {
  encrypt
} from '../../utils/util'
import {
  loginCUMT
} from '../../utils/api'
import {
  toMine
} from '../../utils/navigate.js'

var app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    username: '',
    password: ''
  },
  login: function() {
    wx.showLoading({ title: '登陆中' })
    let token, userData

    userData = JSON.stringify({
      username: this.data.username,
      password: this.data.password
    });

    loginCUMT(encrypt(userData))   // 登陆密文
      .then((res) => {
        wx.hideLoading()
        if (res.data.code !== 200) {
          wx.showModal({ title: '登陆失败' })
          return
        }

        token = res.data.data 
        wx.setStorage({ key: 'token', data: token })  // 本地存储token app.token = token

        wx.hideLoading()
        toMine()
      }).catch(err=>{
        wx.hideLoading()
        console.log(err)
      })
  },
  onLoad: function() { // 获取微信头像和昵称
    var _this = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = function(res) {
        _this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      };
    } else {
      wx.getUserInfo({
        success: function(res) {
          app.globalData.userInfo = res.userInfo;
          _this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
        },
      });
    }
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
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
});