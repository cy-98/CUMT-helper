import {
  encrypt
} from '../../utils/util'
import {
  loginCUMT
} from '../../utils/api'

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
    let token
    const userData = JSON.stringify({
      username: this.data.username,
      password: this.data.password
    });

    const text = encrypt(userData)
    loginCUMT(text)
      .then((res) => {
        token = res.data.data // 保存token

        wx.setStorage({  
          key: 'token',
          data: token,
        })
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