import {
  getWxUser
} from "../../utils/util.js"
import {
  toLogin
} from "../../utils/navigate.js"
import {
  getBalance
} from "../../utils/api.js"
import {
  parseBalance,
  parseAccount,
} from "./helper.js"

Page({
  data: {
    noWxUser: true,
    nickName: '',
    avatarUrl: '',
    // 一卡通账户
    account: {},
    balance:0
  },

  onLoad: function(options) {
    // check wx login
    const { noWxUser } = this.data
    if (!noWxUser) return

    getWxUser()
      .then(res => {
        const {
          avatarUrl,
          nickName
        } = res.userInfo
        this.setData({
          avatarUrl: avatarUrl,
          nickName: nickName,
          noWxUser: false
        })
      })
      .then(() => {
        // 确认登陆后， 获取余额
        getBalance()
          .then(res => {
            const text = res.data.data
            const account = parseAccount(text)
            const balance = parseBalance(account,"db_balance")

            this.setData({
              account: account,
              balance: balance
            })

          })
          .catch(err => {
            console.log(err) // 超时
          })
      })
      .catch(err => {
        this.setData({
          noWxUser: true
        })
        wx.showModal({
          title: '请先授权登录微信',
          success: function(res) {
            toLogin()
          }
        })
      })
  },

  onShow: function() {

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