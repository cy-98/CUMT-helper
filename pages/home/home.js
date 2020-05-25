import { utils } from "../../utils/enum.js"
import { getTimeTables } from "../../utils/api.js"
import { getCurrentWeek, processimeForLessons } from "../../pages/tables/helper.js"
import { getStore, hasToLogin } from "../../utils/util.js"
import { getWeather, getLessonsOfDay, } from "./helper.js"
import { processParamsForOrder } from "../ykt/helper.js"
import { navTo, toTable } from "../../utils/navigate.js"


const date = new Date()
const App = getApp()
Page({
  data: {
    // --- 页面数据 ---
    navHeight: App.globalData.navHeight,
    navTop: App.globalData.navTop,
    // --- 计算数据 ---
    currentWeek: getCurrentWeek()[0],
    currentDay: getCurrentWeek()[1],
    date: date.getDate(),
    month: date.getMonth() + 1,
    is_night: date.getHours() >= 20,
    store: false,
    hasLogin: false,
    // --- 请求数据 ---
    humidity: 0,
    weather: '',
    temperature: 0,
    winddirection: '',
    todayLessons: [],
    tomorrowLessons: [], // 当夜晚的时候显示明日课程
    currentWeekLessons: [],
    // --- 静态数据 ---
    utils: utils
  },
  onReady: function(options) {
    // 今日徐州天气
    getWeather().then(info => {
      const { city, weather, temperature, humidity, winddirection } = info
      this.setData({
        weather: weather,
        temperature: temperature,
        humidity: humidity,
        winddirection: winddirection
      })
    })

  },
  onShow() {
    // 校验是否登陆
    const token = wx.getStorageSync('token')
    if (token) {
      this.setData({
        hasLogin: true
      })
    }

    const { store } = this.data
    if (!store) {
      this.getTimeTable()
    }
  },
  getTimeTable: function() {
    getStore('timetable')
      .then(res => {
        const { currentWeek, currentDay, is_night } = this.data
        const timetable = res.data
        const currentWeekLessons = timetable[currentWeek]
        if (is_night) { // 判断时间是否是晚上
          const tomorrowLessons = getLessonsOfDay(currentDay + 1, currentWeekLessons)
          this.setLessons(tomorrowLessons, is_night)
        } else {
          // 今日课程
          const todayLessons = getLessonsOfDay(currentDay, currentWeekLessons)
          this.setLessons(todayLessons, is_night)
        }
      })
      .catch(err => {
        console.log(err)
        this.setData({
          todayLessons: [],
          currentWeekLessons: [],
          store: false
        })
      })
  },
  toTable() {
    toTable()
  },
  // 工具详情
  tapUtil: function(e) {
    navTo(
      e.currentTarget.dataset.path // path
    )
  },
  login: () => {
    hasToLogin()
  },
  setLessons(lessons, isNight) {
    if(isNight) {
      this.setData({
        store: true,
        tomorrowLessons: lessons
      })
    }else {
      this.setData({
        todayLessons: lessons,
        store: true
      })
    }
  }
})