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

        const { numFound, searchResult } = data
        console.log(data.searchResult)
        this.setData({
          user_numFound: numFound,
          user_searchResult: searchResult
        })
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