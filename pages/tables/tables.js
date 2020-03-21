import {
  decrypt
} from '../../utils/util.js'
import {
  getTimeTables
} from '../../utils/api.js'
import {
  weeks,
  scheduls
} from '../../utils/enum.js'

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

const App =getApp()
Page({

  // init data
  data: {
    // --- 导航高度 ---
    navHeight: App.globalData.navHeight,
    navTop:App.globalData.navTop,
    // --- 页面数据 ---
    month: new Date().getMonth() + 1,
    weeks: weeks,
    scheduls:scheduls,
    // --- 请求数九 ---
    year: '',
    term: '',
    exam: [],
    grade: [],
    timetable: [],
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
  tap:()=>{
    console.log('tap')
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