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
  toOrder,
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
    balance:{
      int:0,
      float:'00'
    }
  },

  onLoad: function(options) {
    // check wx login
    const { noWxUser } = this.data
    if (!noWxUser) return
    wx.showLoading({
      title: '认证信息中',
    })
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
              balance: {
                int: balance.split('.')[0],
                float: balance.split('.')[1]
              }
            })
            wx.hideLoading()
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
  toOrderList:function(){
    const { account } = this.data
    toOrder(account)
  },
  onShow: function() {

  },
  onPullDownRefresh: function() {

  },
})