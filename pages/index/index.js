import {
  encrypt,
  setStore,
  getStore
} from '../../utils/util'
import {
  loginCUMT
} from '../../utils/api'
import {
  toBack
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
    // 登录微信
    const {hasUserInfo} = this.data
    if(!hasUserInfo) {
      wx.showModal({ title: '请先授权登陆微信', content: '点击按钮获取头像昵称' })
      return
    }

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

          wx.hideLoading()
          toBack()
        }
      })
      .catch(err => {
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