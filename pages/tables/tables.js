import { weeks, scheduls } from '../../utils/enum.js'
import { decrypt } from '../../utils/util.js'
import { getTimeTables } from '../../utils/api.js'

let setStore,
  getStore,
  sliceTimeTables,
  getTerm

setStore = (datas) => {
  for (const key in datas) {
    const data = datas[key]
    wx.setStorage({
      key: key,
      data: data,
    })
  }
}
getStore = (key) => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: resolve,
      fail: reject
    })
  })
}
sliceTimeTables = (timeTable) => {
  const weeks = Array(20).fill([])

  timeTable.forEach(lesson => {
    lesson.week_list.forEach(w => { // 周数
      weeks[w - 1].push(lesson) // 填进周
    })
  })
  return weeks
}
getTerm = () => {
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
  },
  // lifetimes: onload
  onLoad: function(options) {
    const getExam = getStore('exam').then(res => res.data)
    const getGrade = getStore('grade').then(res => res.data)
    const getTimeTable = getStore('timetable').then(res => res.data)
    Promise.all([getExam, getGrade, getTimeTable])
      .then(res => {
        console.log('get exam, grad and timeTable success') // all success
      })
      .catch((err) => { // storage wrong 存储情况出现错误, 重新请求
        wx.showLoading({
          title: '加载课表中'
        })

        const {
          year,
          term
        } = this.data
      console.log(year,term)
        getTimeTables({
            year: year,
            term: term
          }).then(res => {
            const text = res.data.data
            const datas = JSON.parse(decrypt(text))
            const {
              grade,
              exam,
              timetable
            } = datas
            let weeks, weekCounter = 0

            weeks = sliceTimeTables(timetable)
            weeks.forEach(i => {
              setStore({
                [`week_${++weekCounter}`]: i
              })
            })

            wx.hideLoading()
            setStore({
              exam,
              grade
            }) // 考试和分数存储本地
          })
          .catch(err => {
            wx.hideLoading()
            wx.showToast({
              title: '获取失败'
            })
            console.log(err)
          })
      })

  },

  onPullDownRefresh: function() {
    // 页面下拉事件的处理函数
  },

  onReachBottom: function() {
    //页面上拉触底事件的处理函数
  },

  onShareAppMessage: function() {
    // 用户点击右上角分享
  }
})