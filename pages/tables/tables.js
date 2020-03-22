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
      fail: reject
    })
  })
}
const sliceTimeTables = (timeTable) => {
  const weeks = Array(20).fill([])

  timeTable.forEach(lesson => {
    lesson.week_list.forEach(w => { // 周数
      weeks[w - 1].push(lesson) // 填进周
    })
  })
  return weeks
}
const getTerm = () => {
  const laterTerm = [3, 4, 5, 6, 7] // 下学期
  const currentTime = new Date()
  const month = currentTime.getMonth() + 1 // 月份
  const day = currentTime.getDay()

  return (laterTerm.find(i => i === month) ||
      (month === 2 && day > 15) ||
      (month === 8 && day < 15)) ?
    2 : 1
}

const App = getApp()
Page({

  // init data
  data: {
    // --- 导航高度 ---
    navHeight: App.globalData.navHeight,
    navTop: App.globalData.navTop,
    // --- 页面数据 ---
    month: new Date().getMonth() + 1,
    weeks: weeks,
    scheduls: scheduls,
    // --- 请求数据 ---
    year: new Date().getFullYear(),
    term: getTerm(),
    exam: [],
    grade: [],
    timetable: [],
    // --- 用户数据 ---

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
      .catch((err) => { // storage wrong 存储情况出现错误, 重新请求
        wx.showLoading({ title: '加载课表中' })

        const { year, term } = this.data

        getTimeTables({
          year: year,
          term: term
        }).then(res => {
          const text = res.data.data
          console.log(text)
          const datas = JSON.parse(decrypt(text))
          console.log(datas)
          const { grade, exam, timetable } = datas
          console.log(timetable)
          let weeks, weekCounter = 0

          weeks = sliceTimeTables(timetable)
          weeks.forEach(i => {
            setStore({
              [`week_${++weekCounter}`]: i
            })
          })
          
          wx.hideLoading()
          setStore({ exam, grade }) // 考试和分数存储本地
        })
        .catch(err => {
          wx.hideLoading()
          wx.showToast({ title: '获取失败' })
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
  tap: () => {
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