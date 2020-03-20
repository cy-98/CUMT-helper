"use strict";
App({
  globalData: {},
  onLaunch: function() {
    var _this = this;
    var menuButtonObject = wx.getMenuButtonBoundingClientRect();
    var systemInfo = wx.getSystemInfoSync();
    var statusBarHeight = systemInfo.statusBarHeight,
      navTop = menuButtonObject.top,
      navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
    this.globalData.navHeight = navHeight;
    this.globalData.navTop = navTop;
    this.globalData.windowHeight = systemInfo.windowHeight;
    // wx.getStorage({
    //   key: 'token',
    //   success: (token)=>{
    //     if(token === '') return
    //     this.globalData.token = token
    //   }
    // })
    wx.login({
      success: function(res) {
        // console.log(res.code);  用户认证token
      },
    });
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              _this.globalData.userInfo = res.userInfo;
              if (_this.userInfoReadyCallback) {
                _this.userInfoReadyCallback(res);
              }
            },
          });
        }
      },
    });
  },
});