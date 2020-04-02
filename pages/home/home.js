import {
  utils
} from "../../utils/enum.js"
import {
  navTo,
  toTable
} from "../../utils/navigate.js"
import {
  getCurrentWeek,
  processimeForLessons
} from "../../pages/tables/helper.js"
import { getBalance, getOrder } from "../../utils/api.js"
import {
  getStore,
  hasToLogin
} from "../../utils/util.js"
import {
  getWeather,
  getLessonsOfDay,
} from "./helper.js"
import {
  processParamsForOrder
} from "../ykt/helper.js"


const date = new Date()
const App = getApp()
Page({
  // init data
  data: {
    // --- 页面数据 ---
    navHeight : App.globalData.navHeight,
    navTop    : App.globalData.navTop,
    // --- 计算数据 ---
    currentWeek : getCurrentWeek()[0],
    currentDay  : getCurrentWeek()[1],
    date : date.getDate(),
    month : date.getMonth() + 1,
    // --- 请求数据 ---
    humidity    : 0,
    weather     : '',
    temperature : 0,
    winddirection : '',
    todaysLessons : [],
    tomorrowLessons : [],    // 当夜晚的时候显示明日课程
    currentWeekLessons : [],
    store : false,
    night : false,
    // --- 静态数据 ---
    utils : utils
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
    
    getStore('timetable')
      .then(res => {
        if (res.errMsg === "getStorage:fail data not found") {
          toTable()
        }

        const {
          currentWeek,
          currentDay
        } = this.data
        const timetable = res.data
        const currentWeekLessons = timetable[currentWeek]

        const hours = date.getHours()
        if(hours > 20 ) {   // 判断时间是否是晚上
          const tomorrowLessons = getLessonsOfDay(currentDay + 1, currentWeekLessons)
          this.setData({
            tomorrowLessons: tomorrowLessons,
            currentWeekLessons: currentWeekLessons,
            store: true,
            night: true
          })
        } else {            // 时间是白天
          // 今日课程
          const todaysLessons = getLessonsOfDay(currentDay, currentWeekLessons)
          this.setData({
            todaysLessons: todaysLessons,
            currentWeekLessons: currentWeekLessons,
            store: true,
            night: false
          })
        }
      })

      .catch(err => {
        console.log(err)

        this.setData({
          todaysLessons: [],
          currentWeekLessons: [],
          store: false
        })
      })
  },
  onShow(){
    // 一卡通预请求
  App.globalData.preGetBalance = getBalance()
   const accountid = wx.getStorageSync('accountid')
   if(accountid) {
     let params = {
       account: accountid,
       page: 1,
       row: 6
     }
     params = processParamsForOrder(params)
     App.globalData.preGetOrder = getOrder(params)
   }
  },
  // 工具详情
  tapUtil: function(e) {
    const { path } = e.currentTarget.dataset
   
    navTo(path)
  },
  login:()=>{
    hasToLogin()
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