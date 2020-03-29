import {
  getWxUser
} from "../../utils/util.js"
import {
  toLogin
} from "../../utils/navigate.js"

Page({
  data: {
    noWxUser: true,

  },

  onLoad: function(options) {
    
  },

  onShow: function() {
    // check wx login
    if(!noWxUser) return
    getWxUser().then(res => {
      const {
        avatarUrl,
        nickName
      } = res.userInfo
      this.setData({
        avatarUrl: avatarUrl,
        nickName: nickName,
        noWxUser: false
      })
    }).catch(err => {
      this.setData({
        noWxUser: true
      })
      wx.showModal({
        title: '请先授权登录微信',
        success: function (res) {
          toLogin()
        }
      })
    })
  },

  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})