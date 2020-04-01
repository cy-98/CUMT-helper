import { prices } from "../../utils/enum.js"
import { hasToLogin, decrypt } from "../../utils/util.js"
import { toLogin } from "../../utils/navigate.js"
import { getBalance, getOrder, recharge } from "../../utils/api.js"
import { parseBalance, parseAccount, processParamsForOrder } from "./helper.js"

const App = getApp()
Page({
  data: {
    modal     : false,
    // - 静态数据 - 
    prices    : prices,
    // - 网络数九
    account: {},
    balance: { int: 0, float: '00' },
    orderList : []
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '认证信息中',
    })

    hasToLogin()
    const { getBalance } = App.globalData
    getBalance // preRequest
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
        return account.account
      })
      .then(id => {
        let params = {
          account: id,
          page   : 1,
          row    : 7 // 最近五单
                     // 以row划分page  拿到以往账单[page]<row个> ，截止时间好像没有影响
                     // 如果要拿到上一个月的就是 page = 2 row = 31或30
        }
        params = processParamsForOrder(params)
        getOrder(params).then(res => {
          const text = res.data.data
          const data = JSON.parse(JSON.parse(decrypt(text)))
          const orderList = data.rows

          this.setData({
            orderList: orderList
          })
        })
      })
      .catch(err => {
        console.log(err)
        hasToLogin()
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
        this.setData({
          chargeNum: items[i].price
        })
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

  commit(){
    const { account, chargeNum } = this.data
    recharge({
      account: account.account,
      num: chargeNum
    })
      .then(res => {
        const data = JSON.parse(JSON.parse(decrypt(res.data.data)))
        const { errmsg } = JSON.parse(data.Msg)['transfer']
        if (errmsg === "当前时间不允许交易") {
          wx.showToast({
            title: errmsg
          })
        }
      })
    this.hideModal()
  },

  onShow: function() {

  },
  onPullDownRefresh: function() {

  },
})