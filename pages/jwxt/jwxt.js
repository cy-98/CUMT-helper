import {
  getTerm,
} from "../../pages/tables/helper.js"
import {
  decrypt,
  hasToLogin
} from "../../utils/util.js"
import {
  getTimeTables
} from '../../utils/api.js'

Page({

  data: {
    exam:[],
    grade:[],
    currentTerm: getTerm(),
    currentYear: new Date().getFullYear() -1,
    selectorIsLeft: true
  },

  onLoad: function (options) {
    hasToLogin()
    const { currentTerm, currentYear } = this.data
    getTimeTables({
      currentTerm: currentTerm,
      currentYear: currentYear
    })
      .then(res => {
        
        const data = JSON.parse(decrypt(res))
        console.log(data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  toggleSelector: function(){
    const { selectorIsLeft } = this.data
    this.setData({
      selectorIsLeft: !selectorIsLeft
    })
  },

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },

  onShow: function () {
    // 生命周期函数--监听页面显示
  },

 
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },


  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },

  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },

  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },

  onShareAppMessage: function () {
    // 用户点击右上角分享
  }
})