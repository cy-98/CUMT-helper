import * as echarts from "../../../ec-canvas/echarts.js"
import { getCurrentWeek } from "../../tables/helper.js"
import { map2Arr, getStore, comptLessonsOfWeek, sliceRoomName } from "./helper.js"

const App = getApp()

// 初始化图表配置: 课程饼状图
const lessons_passed = { value: 0 }
const lessons_rest = { value:0 }
const computedLessons = [lessons_rest, lessons_passed]

const pieChartsConfig = {
  type: 'pie',
  color: ["#37A2DA", "#32C5E9"],
  radius: ["30", "40"],
  center: ['50%','50'],
  computedLessons: computedLessons
}

// 初始化图表配置: 教学楼柱状图
const roomsData = []
const barChartConfig = {
    category:[]
}

Page({
  // 页面的初始数据
  data: {
    passedLessonsCount: 0,
    allLessonsCount: 0,
    maxLessonCount: 0,
    maxLessonName: '',
    ec_pie: {
      onInit: initPieChart
    },
    ec_bar: {
      onInit: initBarChart
    }
  },

  onLoad: function (options) {
    const timetable =  getStore('timetable')
    console.log(timetable)
    if(!timetable) {
      this.getTablesFirst()
      return
    }
    this.getMostLessonRoom(timetable)
    // 统计最多教室
    this.getPassedLesson(timetable)
  },
  getTablesFirst() {
    setTimeout(wx.navigateBack, 2000)
    wx.showToast({
      title: '请先请求课表',
    })
  },

  getMostLessonRoom(timetable) {
    //  统计已上课程
    const currentWeek = getCurrentWeek()[0]  // 得到本周
    const currenDay = getCurrentWeek()[1]   // 得到今天

    let process       // 课程进度
    let passedLessonsCount = 0
    let allLessonsCount = 0

    for (let i = 1; i <= 20; i++) {
      if (i <= currentWeek) {
        if (i === currentWeek) {
          const lessonsOfWeek = timetable[i]['lessons']
          const lessonsPassed = comptLessonsOfWeek(currenDay, lessonsOfWeek) // 本周已上课程
          passedLessonsCount += lessonsPassed
          allLessonsCount += lessonsOfWeek.length - lessonsPassed + passedLessonsCount        // 开始计算所有课程数量
        } else {
          passedLessonsCount += timetable[i]['lessons'].length
        }
      } else {
        allLessonsCount += timetable[i]['lessons'].length
      }
    }

    lessons_passed.value = lessons_passed.name = passedLessonsCount
    lessons_rest.value = lessons_rest.name = allLessonsCount - passedLessonsCount  // 剩余课程
    process = Math.floor(((passedLessonsCount / allLessonsCount) * 100))
    this.setData({
      allLessonsCount: allLessonsCount,
      passedLessonsCount: passedLessonsCount,
      process: process
    })
  },
  getPassedLesson(timetable) {
    const lessonMap = {}
    const roomMap = {}
    let max = 0,
      maxLessonName = ''
    for (let i = 1; i < 20; i++) {
      timetable[i]['lessons'].forEach(lesson => {
        const room_name = sliceRoomName(lesson.room)
        roomMap[room_name]
          ? roomMap[room_name]++
          : (roomMap[room_name] = 1)

        const lesson_name = lesson.name
        lessonMap[lesson_name]
          ? lessonMap[lesson_name]++
          : lessonMap[lesson_name] = 1
      })
    }
    if (roomsData.length === 0) {
      for (const key in roomMap) {
        const value = roomMap[key]
        barChartConfig.category.push(key)
        roomsData.push(value)
      }
    }

    for (const key in lessonMap) {
      const value = lessonMap[key]

      max < value
        && (max = value)
        && (maxLessonName = key)
    }

    this.setData({
      maxLessonCount: max,
      maxLessonName: maxLessonName
    })
  }
})

function initPieChart(canvas, width, height, dpr) {
  let chart = echarts.init(canvas,null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart)

  let option = {
    backgroundColor: "#ffffff",
    color: pieChartsConfig.color,
    series: [{
      label: {
        normal: {
          fontSize: 10
        }
      },
      type  : pieChartsConfig.type,
      center: pieChartsConfig.center,
      radius: pieChartsConfig.radius,
      data  : pieChartsConfig.computedLessons
    }]
  }
  chart.setOption(option)

  return chart
}
// 
function initBarChart(canvas, width, height, dpr) {
  let chart = echarts.init(canvas, null, {
    width : width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'line'        
      },
      confine: true
    },
    yAxis: [
      {
        type: 'value',
        data: []
      }
    ],
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: barChartConfig.category,
        axisLine: {
          lineStyle: {
            color: '#666'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name : '课程数',
        type : 'bar',
        label: {
          normal: {
            show: false,
            position: 'inside'
          },
        barWidth: 20
        },
        data: roomsData,
        itemStyle: {
          emphasis: {
            color: '#37a2da'
          }
        }
      },
    ]
  };
  chart.setOption(option);

  return chart;
}