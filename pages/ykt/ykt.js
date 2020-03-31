import {
  prices
} from "../../utils/enum.js"

import {
  hasToLogin
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

const App = getApp()
Page({
  data: {
    // 一卡通账户
    account: {},
    balance: {
      int: 0,
      float: '00'
    },
    modal: false,
    prices: prices
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '认证信息中',
    })
    hasToLogin()

    getBalance()
      .then(res => {
        if(res.code === 400) { return new Promise().reject() }

        const text = res.data.data
        const account = parseAccount(text)
        const balance = parseBalance(account, "db_balance")

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
        console.log(err)
        wx.hideLoading()
        // wx.showModal({
        //   title: '请先登陆教务系统',
        //   success: function(res) {
        //     toLogin()
        //   }
        // })
      })
  },
  // 多选
  ChooseCheckbox(e) {
    let items = this.data.prices;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
      }else{
        items[i].checked = false
      }
    }
    this.setData({
      prices: items
    })
  },
  // modal
  showModal(e) {
    this.setData({
      modal: true
    })
  },
  hideModal(e) {
    this.setData({
      modal: false
    })
  },
  // list页面
  toOrderList: function() {
    const {
      account
    } = this.data
    toOrder(account)
  },
  onShow: function() {

  },
  onPullDownRefresh: function() {

  },
})