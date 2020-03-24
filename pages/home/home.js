import {
  utils
} from "../../utils/enum.js"
import {
  getCurrentWeek,
  processimeForLessons
} from "../../pages/tables/helper.js"

import {
  getStore
} from "../../utils/util.js"

import {
  getExam,
  getWeather,
  getLessonsOfDay,
} from "./helper.js"

const date = new Date()
const App = getApp()
Page({
  // init data
  data: {
    // --- 页面数据 ---
    navHeight: App.globalData.navHeight,
    navTop: App.globalData.navTop,
    // --- 计算数据 ---
    currentWeek: getCurrentWeek()[0],
    currentDay: getCurrentWeek()[1],
    date: date.getDate(),
    month: date.getMonth() + 1,
    // --- 请求数据 ---
    weather: '',
    temperature: 0,
    humidity: 0,
    winddirection: '',
    todaysLessons: [],
    currentWeekLessons: [],
    store: false,
    // --- 静态数据 ---
    utils: utils
  },
  onLoad: function(options) {
    // 今日徐州天气
    getWeather().then(info => {
      const {
        city,
        weather,
        temperature,
        humidity,
        winddirection
      } = info

      this.setData({
        weather: weather,
        temperature: temperature,
        humidity: humidity,
        winddirection: winddirection
      })
    })
    // 今日课程
    getStore('timetable')
      .then(res => {
        let todaysLessons

        const {
          currentWeek,
          currentDay
        } = this.data
        const timetable = res.data

        const currentWeekLessons = timetable[currentWeek]
        todaysLessons = getLessonsOfDay(currentDay, currentWeekLessons)
        this.setData({
          todaysLessons: todaysLessons,
          currentWeekLessons: currentWeekLessons,
          store: true
        })
      })

      .catch(err => {
        this.setData({
          todaysLessons: [],
          currentWeekLessons: [],
          store: false
        })
      })
    // 近日考试
    getExam().then(res => {
      console.log(res)
    })
  },


  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
  },

  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  },

  onShareAppMessage: function() {
    // 用户点击右上角分享
  }
})