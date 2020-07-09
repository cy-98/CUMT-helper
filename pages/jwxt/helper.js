import { getTimeTables } from '../../utils/api.js'
import { decrypt } from "../../utils/util.js"

const computedTime = (exam)=>{
  return exam.map((item)=>{
    const todayDate = new Date().getTime()
    const examDate = new Date(item.time).getTime()
    const deadLine = ( examDate - todayDate ) / 1000 / 60 / 60 / 24

    item.deadLine = deadLine >= 0 ? Math.ceil(deadLine) : -1
    return item
  })
}
const filteUseless = (arr) => {
  if (arr.length === 0) return []
  const map = {}
  arr.forEach(item => {
    const key = item.name
    const cach = map[key]
    if (
      (cach && cach.grade < item.grade) ||
      (!cach)
    ) {
      map[key] = item
    } else {
      return
    }
  })

  return Object.keys(map).map(
    key => map[key]
  )
}

const getGrade = (data) => {
  return getTimeTables(data).then(res => {
      const text = res.data.data
      const data = JSON.parse(decrypt(text))
      const { grade } = data
      return grade
    })
}

const GpaReducer = (arr) => {
  const allGpa = arr.reduce((pre, after) => {
    return pre += after.gpa * after.credit
  }, 0)
  const weightOfAll = arr.reduce((pre, after) => {
    return pre += Number(after.credit)
  }, 0)

  return allGpa/weightOfAll 
}
module.exports = {
  getGrade,
  filteUseless,
  computedTime,
  GpaReducer
}