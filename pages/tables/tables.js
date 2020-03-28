import { weeks, schedules, lessonColors } from '../../utils/enum.js'
import { decrypt, getStore, setStore } from '../../utils/util.js'
import { getTimeTables } from '../../utils/api.js'
import { processFormatForLesson, getTerm, getCurrentWeek, processColorForLessons } from './helper.js'

const App = getApp()
Page({
  data: {
    // --- 静态数据 ---
    is_pre:false,
    weeks: weeks,
    schedules: schedules,
    lessonBlockMarginLeft: '(100%)/7',
    lessonBlockMarginTop: '100%/10',
    lessonsColors: lessonColors,
    // --- 导航高度 ---
    navHeight: App.globalData.navHeight,
    navTop: App.globalData.navTop,
    // --- 计算数据 ---
    currentYear: new Date().getFullYear() - 1,
    currentMonth: new Date().getMonth() + 1,
    currentWeek: getCurrentWeek()[0],
    currentDay: getCurrentWeek()[1],
    currentTerm: getTerm(),
    // --- 请求数据 ---
    exam: [],
    grade: [],
    timetable: [],
  },
  // lifetimes: onload
  onLoad: function(options) {
    const getTimeTable = getStore('timetable')
      .then(res => {
        this.setData({
          timetable: res.data
        })
      })
    Promise.all([getTimeTable])
      .then(res => {
        console.log('get exam, grad and timeTable success') // all success
      })
      .catch((err) => { // storage wrong 存储情况出现错误, 重新请求
        wx.showLoading({ title: '加载课表中' })

        const {
          currentYear,
          currentTerm
        } = this.data
        getTimeTables({
            year: currentYear,
            term: currentTerm
          }).then(res => {
            const text = res.data.data
            const datas = JSON.parse(decrypt(text))

            let { timetable } = datas

            processColorForLessons(lessonColors, timetable)
            timetable = processFormatForLesson(timetable)

            setStore({
              'timetable': timetable
            })
            this.setData({
              timetable: timetable
            })
            wx.hideLoading()
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
  togglePre:function(){
    const { is_pre } = this.data

    this.setData({
      is_pre: !is_pre
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