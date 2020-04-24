import { prices } from "../../utils/enum.js"
import { hasToLogin, decrypt, getStore, setStore } from "../../utils/util.js"
import { toLogin } from "../../utils/navigate.js"
import { getBalance, getOrder, recharge } from "../../utils/api.js"
import { fetchBalance, fetchOrder, parseBalance, parseAccount, processParamsForOrder, parseOrder } from "./helper.js"

const App = getApp()
Page({
  data: {
    modal     : false,
    // - 静态数据 - 
    prices    : prices,
    // - 网络数据 -
    account: {},
    balance: { int: 0, float: '00' },
    orderList : [],
    store: false
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '认证信息中',
    })

    hasToLogin()
    let account_id
    const getBlc = getStore('balance')
      .then(balanceFromStore => {
        const balance = balanceFromStore.data
        
        this.setData({
          balance:{
            int: balance.split('.')[0],
            float: balance.split('.')[1]
          }
        })
      }).catch(e => {
        fetchBalance()
          .then(res => {
            const balance = parseBalance(res)
            account_id = res.account

            this.setData({
              balance: {
                int: balance.split('.')[0],
                float: balance.split('.')[1]
              }
            })
            setStore({
              balance: balance,
              account_id: account_id
            })
          })
      })



      // const getOrd = getStore
    const getOrd = getStore('orderlist')
      .then(res => {
        const order = res.data
      })
      .catch(e =>{ // 获取失败
        if(account_id) {
          fetchOrder(account_id)
        }else{
          getStore('accountid')
            .then(res => res.data)
              .then(res =>{
                return fetchOrder(res)
              })
              .then(order => {
                console.log(order)
              })
        }
      })
   
  },

  updateAccount() {

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
        console.log(data)
        const { errmsg } = JSON.parse(data.Msg)['transfer']
        if (errmsg === "当前时间不允许交易") {
          wx.showToast({
            title: errmsg
          })
        }
      })
    this.hideModal()
  },
  toChart () {
    wx.navigateTo({
      url: '/pages/charts/ykt-stat/ykt-stat'
    })
  }
})