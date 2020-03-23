// 按周分组
const processFormatForLesson = (timeTable) => {
  const weeks = {}
  let i = 0
  for (i; i < 20; i++) {
    weeks[i + 1] = []
  }
  timeTable.forEach(lesson => {
    lesson.week_list.forEach(w => {
      weeks[w].push(lesson)
    })
  })
  return weeks
}

// 当前学期
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

// 计算当前周
const getCurrentWeek = () => {
  // 2019年开学日期 定期维护...
  const openDate = new Date("2020-02-17")
  const nowDate = new Date()
  const duringDays = (nowDate - openDate) / 1000 / 60 / 60 / 24

  return mod(duringDays, 7)

  function mod(a, b) {
    let i = 0, rest = b
    while (a > 0) {
      a = a - b
      a > 0 ? i++ : rest = Math.ceil(a + b)  // 余数
    }
    console.log(`第${i + 1}周的第${rest}天`)
    return [i+1,rest]
  }
}

// 十六进制转rgb   复制粘贴
const hex2rgb =(arr)=> {
  arr = arr.substr(1);
  var str;
  var result;
  var a = [];
  for (var i = 0; i < 3; i++) {
    str = arr.substr(i * 2, 2);
    a[i] = parseInt(str, 16);
  }
  result = "rgba(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
  return result;
}

// 为每个课程添加颜色
const processColorForLessons = (colors, timetable)=>{
  let i = 0
  const map = {}

  timetable.forEach(lesson => {    // lesson: { id, name, room, teacher }
    !map[lesson.id] && (map[lesson.id] = colors[i++])
    lesson.color = hex2rgb( map[lesson.id] )
  })

  return
}

module.exports= {
  getTerm: getTerm,
  getCurrentWeek: getCurrentWeek,
  processFormatForLesson: processFormatForLesson,
  processColorForLessons: processColorForLessons
}