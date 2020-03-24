let i = 1
const id = () => {
  return i++
}

//  课表时间节次
const schedules = [{
  id: id(),
  begin: '8:00',
  end: '8:50'
}, {
  id: id(),
  begin: '8:55',
  end: '10:10'
}, {
  id: id(),
  begin: '10:15',
  end: '11:05'
}, {
  id: id(),
  begin: '11:10',
  end: '12:00'
}, {
  id: id(),
  begin: '14:00',
  end: '14:50'
}, {
  id: id(),
  begin: '14:55',
  end: '15:45'
}, {
  id: id(),
  begin: '16:15',
  end: '17:05'
}, {
  id: id(),
  begin: '17:10',
  end: '18:00'
}, {
  id: id(),
  begin: '19:00',
  end: '19:50'
}, {
  id: id(),
  begin: '19:55',
  end: '20:45'
}]
i = 0

// 课表星期节次
const weeks = [{
  zh: '周一',
  en: 'Mon',
  id: id()
}, {
  zh: '周二',
  en: 'Tue',
  id: id()
}, {
  zh: '周三',
  en: 'Web',
  id: id()
}, {
  zh: '周四',
  en: 'Thu',
  id: id()
}, {
  zh: '周五',
  en: 'Fri',
  id: id()
}, {
  zh: '周六',
  en: 'Sat',
  id: id()
}, {
  zh: '周日',
  en: 'Sun',
  id: id()
}]
i = 0

// 课表颜色
const lessonColors = [
  '#EF5350', '#26C6DA', '#66BB6A', '#ff4a00', '#13d0ab', '#5f6c72', '#ffc43e', '#5f6c72', '#ffc43e', '#13d0ab', '#5f6c72', '#ffc43e', '#5f6c72', '#ffc43e'
]

// 首页工具
const utils = [{
  name: '校园卡',
  children: [
    '校园卡充值',
    '查询余额',
    '查询流水'
  ]
}, {
  name: '图书馆',
  children: [
    '搜索图书',
    '查询借阅历史',
    '查询图书管用户信息',
    '图书续借'
  ]
}, {
  name: '教务',
  children: [
    '成绩查询',
    '考试查询'
  ]
}]

module.exports = {
  utils: utils,
  weeks: weeks,
  schedules: schedules,
  lessonColors: lessonColors
}