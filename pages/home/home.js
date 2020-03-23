import {
  getCurrentWeek,
  processimeForLessons
} from "../../pages/tables/helper.js"
import {
  getStore
} from "../../utils/util.js"
import { getLessonsOfDay } from "./helper.js"

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
    todaysLessons: []
  },
  onLoad: function(options) {
    // 今日课程
    getStore('timetable')
      .then(res => {
        let todaysLessons

        const { currentWeek, currentDay } = this.data
        const timetable = res.data

        const recentLessons = timetable[currentWeek]
        todaysLessons = getLessonsOfDay(currentDay, recentLessons)

        this.setData({
          todaysLessons: todaysLessons
        })
      })

      .catch(err => {
        console.log(err)
        wx.showToast({
          title: '请先导入课表'
        })
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