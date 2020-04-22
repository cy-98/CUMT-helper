import {
  hasToLogin,
  decrypt
} from "../../utils/util.js"

import {
  getLibUser,
  findBook
} from "../../utils/api.js"

import {
  fiveRandomBooks
} from "./helper.js"

const App = getApp()
Page({
  data: {
    name: '',
    major: '',
    school: '',
    commendBook: [],
    user_numFound: [],
    user_searchResult: [],
    extend: false,
    keyWord: ''
  },

  onLoad: function(options) {
    // check Token
    hasToLogin()

    // 获取专业信息
    const userInfo = wx.getStorageSync('userInfo')
    const {
      name,
      major,
      school
    } = userInfo
    this.setData({
      name: name,
      school: school,
      major: major
    })

    // 根据专业推荐
    findBook({
        name: major
      })
      .then(res => {
        const text = res.data.data
        const data = JSON.parse(JSON.parse(decrypt(text))).data
        const { searchResult } = data
        const filtedResult = fiveRandomBooks(searchResult)

        this.setData({
          commendBook: filtedResult
        })
      })

    // 用户借阅历史
    getLibUser()
      .then(res => {
        const text = res.data.data
        const data = JSON.parse(JSON.parse(decrypt(text))).data

        const {
          numFound,
          searchResult
        } = data
        console.log(data.searchResult)
        this.setData({
          user_numFound: numFound,
          user_searchResult: searchResult
        })
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
  },
  getHistory() {
    const { extend } = this.data
    this.setData({
      extend: !extend
    })  
  },
  inputWord(e){
    this.setData({
      keyWord: (e.detail.value + '').trim()
    })
  },
  searchBook(){
    const { keyWord } = this.data
    App.findBook = findBook({
      name: keyWord
    })
    wx.navigateTo({
      url: './detail/detail',
    })
  }
})