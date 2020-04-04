import {
  hasToLogin,
  decrypt
} from "../../utils/util.js"

import {
  getLibUser,
  findBook
} from "../../utils/api.js"
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
    getLibUser().then(res => {
      const text = res.data.data
      const data = JSON.parse(JSON.parse(decrypt(text)))

      const { numFound, searchResult } = data
      // author: "刘火良, 杨森编著"
      // barcode: "C01849247"
      // docAbstract: null
      // docCode: "1"
      // isbn: "978-7-111-42637-0"
      // loanDate: "2019-11-01"
      // loanId: 6515929
      // loanType: null
      // locationName: "南湖自然科学图书阅览室"
      // normReturnDate: "2019-12-07"
      // phyLibName: "中国矿业大学"
      // publishYear: "2013"
      // publisher: "机械工业出版社"
      // recordId: 479045
      // returnDate: "2019-12-07"
      // title: "STM32库开发实战指南"
    })

    findBook({
      name: 'web'
    }).then(res => {
      const text = res.data.data
      const data = JSON.parse(JSON.parse(decrypt(text)))
      console.log(data)
    })



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
})