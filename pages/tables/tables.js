import {
  decrypt
} from '../../utils/util.js'
import {
  getTimeTables
} from '../../utils/api.js'
const setStore = (datas) => {
  for (const key in datas) {
    const data = datas[key]
    console.log(key, data)
    wx.setStorage({
      key: key,
      data: data,
    })
  }
}
const getStore = (key) => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: resolve,
    })
  })
}

Page({

  // init data
  data: {
    year: number,
    term: number,
    exam: [],
    grade: [],
    timetable: []
  },

  // onload lifetimes
  onLoad: function(options) {
    
    const getExam = getStore('exam').then(res => res.data)
    const getGrade = getStore('grade').then(res => res.data)
    const getTimeTable = getStore('timetable').then(res => res.data)
    Promise.all([getExam, getGrade, getTimeTable])
      .then(res => {
        console.log('成功获取考试课表以及分数') // all success
      })
      .catch((err) => {                     // storage wrong
        console.log(err)
        getTimeTables({
          year: 2019,
          term: 1
        }).then(res => {
          const text = res.data.data
          const datas = JSON.parse(decrypt(text))
          const { exam, timetable } = datas

          setStore({ exam, grade, timetable })
        }).catch(err => {
          console.log(err)
        })
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
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