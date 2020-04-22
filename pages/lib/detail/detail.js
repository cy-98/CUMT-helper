import { decrypt } from "../../../utils/util.js"
import { findBook } from "../../../utils/api.js"

const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchResult:[],
    keyWord: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '搜索中',
      mask: true,
    })
    App.findBook.then(res => {
      const text = res.data.data
      const data = JSON.parse(JSON.parse(decrypt(text))).data
      console.log(data)
      const { searchResult } = data
      this.setData({
        searchResult: searchResult
      })
      wx.hideLoading()
    })
  },

  searchBook(){
    const { keyWord } = this.data
    findBook({
      name: keyWord
    })
      .then(res => {
        const text = res.data.data
        const data = JSON.parse(JSON.parse(decrypt(text))).data
        console.log(data)
        const { searchResult } = data
        this.setData({
          searchResult: searchResult
        })
      })
  },

  inputWord(e){
    this.setData({
      keyWord: (e.detail.value + '').trim()
    })
  },

  onShow: function() {

  },

})