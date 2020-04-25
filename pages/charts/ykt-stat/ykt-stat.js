import * as echarts from "../../../ec-canvas/echarts.js"
import { processDateMap, processOutMap } from "./helper.js"
const currentMonth = new Date().getMonth() + 1

let outDatas = [],   // 流水商家分布
    dateDatas = []   // 流水月份分布
let billOfMonth = []
const App = getApp()
Page({

  data: {
    totalIn  : 0,
    totalOutOfMonth : 0,
    ec_pie: {
      onInit: initPieChart
    },
    ec_line :{
      onInit: initLineChart
    }
  },

  onLoad: function (options) {
    const {
      orderList
    } = App.globalData
    console.log(orderList)
    if (orderList) {
      const outMap = {}, // 输出地点         
           dateMap = {}, // 日期
          monthMap = {}  // 本月统计
      let totalOutOfMonth= 0, 
          totalIn = 0

      orderList.forEach(item => {    // 开始处理数据
        const { 
          MERCNAME, // 商家
          TRANAMT,  // 消费金额
          TRANNAME, // 消费来源
          EFFECTDATE // 消费时间
        } = item
        const date = EFFECTDATE.split(' ')[0].split('-')[1]

        TRANAMT < 0 
          && (outMap[MERCNAME]                  // 统计商家
            ? outMap[MERCNAME] += TRANAMT
            : outMap[MERCNAME]  = TRANAMT) 
          && (dateMap[date]                     // 统计日期
            ? dateMap[date] += TRANAMT
            : dateMap[date]  = TRANAMT)
          && (date - currentMonth === 0) // 开始计算本月开销  '09'-9=0
          // && (monthMap[MERCNAME]      // 取消注释则统计本月  现在还未开学
          //     ? monthMap[MERCNAME] += TRANAMT
          //     : monthMap[MERCNAME]  = TRANAMT)
          // && (totalOutOfMonth += TRANAMT)

       TRANAMT > 0
          && (totalIn += TRANAMT)                 // 统计收入: 如果账单大于零就是收入
      })

      outDatas = processOutMap(outMap) // 所有账单的分布
      dateDatas = processDateMap(dateMap)
      billOfMonth = processOutMap(monthMap)  // 本月账单的分布
      this.setData({
        totalIn,
        totalOutOfMonth
      })

    }else {
      wx.showToast({
        title: '操作频繁， 换个时间试试~',
      })
    }
  },
})


function initPieChart(canvas, width, height, dpr) {
  let chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart)
  let option = {
    backgroundColor: "#ffffff",
    series: [{
      label: {
        normal: {
          fontSize: 8
        }
      },
      type: 'pie',
      center: ['50%','50%'],
      radius: [30,40],
      data: outDatas
    }]
  }
  chart.setOption(option)

  return chart
}

function initLineChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  let xDatas = dateDatas.map(i => i.name)
  let yDatas = dateDatas.map(i => i.value)
  var option = {
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xDatas,
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [
      {
        label: {
          normal: {
            fontSize: 8
          }
        },
      name: '金额',
      type: 'line',
      smooth: true,
      data: yDatas
    }]
  };

  chart.setOption(option);
  return chart;
}