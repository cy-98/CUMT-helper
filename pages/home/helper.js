import {
  schedules
} from "../../utils/enum.js"

const getLessonsOfDay = (day, currentLessons)=>{
  const todayLessons = []
  currentLessons.forEach(lesson => {
    lesson.day === day 
      && todayLessons.push(lesson)
      && (lesson.time = schedules[lesson.start].begin) // 设置时间
  })
  return todayLessons
}

module.exports = {
  getLessonsOfDay: getLessonsOfDay
}