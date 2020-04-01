import {
  hasToLogin
} from "../../utils/util.js"
const App = getApp()
Page({
  data: {
    avatarUrl: '',
    nickName: 'nickName'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    // check token
    hasToLogin()
    // 用户信息
    wx.getUserInfo({
      withCredentials: true,
      success: (res) => {
        const {
          avatarUrl,
          nickName
        } = res.userInfo
        this.setData({
          avatarUrl: avatarUrl,
          nickName: nickName
        })
      },
      fail: (res) => {
        console.log(res)
      }
    })

    // 图书馆信息

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})