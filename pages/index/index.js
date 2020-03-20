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
    
    wx.showLoading({
      title: '登陆中',
    })
    let token
    const userData = JSON.stringify({
      username: this.data.username,
      password: this.data.password
    });

    const text = encrypt(userData)
    loginCUMT(text)
      .then((res) => {
        wx.hideLoading()
        if (res.data.code !== 200) {
          wx.showModal({
            title: '登陆失败'
          })
          return
        }
        token = res.data.data 
        wx.setStorage({       // 本地存储token app.token = token
          key: 'token',
          data: token,
        })
        app.globalData.token = token
        toMine()
      }).catch(err=>{
        wx.hideLoading()
        console.log(err)
      })
  },
  getAccount: function(e) {
    var username = e.detail.value;
    this.setData({
      username: username
    });
  },
  getPassword: function(e) {
    var password = e.detail.value;
    this.setData({
      password: password
    });
  },
  onLoad: function() {
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
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
});