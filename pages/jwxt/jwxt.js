import { getTimeTables } from '../../utils/api.js'
import { getGrade, filteUseless, computedTime, GpaReducer } from "./helper.js"
import { getTerm } from "../../pages/tables/helper.js"
import { decrypt, flatten, hasToLogin, getOwnYearPicker, throttle } from "../../utils/util.js"

Page({
  data: {
    exam: [],
    grade: [],
    selectorIndex: 0,
    currentTerm: getTerm(),
    currentYear: new Date().getFullYear() - 1
  },

  onLoad() {
    this.getGpa = throttle(this.getGpa)
    hasToLogin()  // check token
    this.initExamAndGrade()
    this.initTimePicker()
  },

  initExamAndGrade() {
    const { currentTerm, currentYear } = this.data
    const getJwxt = getTimeTables
    getJwxt({
      year: currentYear,
      term: currentTerm
    })
      .then(res => {
        const text = res.data.data
        const data = JSON.parse(decrypt(text))
        const { exam, grade } = data
        this.setData({ exam: computedTime(exam), grade: grade })
        return grade
      })
      .catch(err => {
        console.log(err)
      })
  },
  initTimePicker() {
    getOwnYearPicker()
      .then(yearPicker => {
        let parentIndex = -1
        yearPicker = yearPicker.map(year => {
          ++ parentIndex
          return {
            year,
            select: false,
            text: `${year}学年`,
            children: [
              { text: '上学期', select: false, index: 0, code: 1, year, parentIndex },
              { text: '下学期', select: false, index: 1, code: 2, year, parentIndex },
            ]
          }
        })
        this.setData({yearPicker})
      })
  },

  selectCheckItem(e) {
    const { item } = e.currentTarget.dataset
    const { parentIndex, index } = item
    const { yearPicker : oldPicker } = this.data
    const yearChecked = oldPicker[parentIndex]
    const termChecked = yearChecked.children[index]

    termChecked.select = !termChecked.select
    const yearShouldChecked = yearChecked.children.reduce((pre, aft) => {
      return pre.select || aft.select
    })
    yearChecked.select =  yearShouldChecked

    this.setData({
      yearPicker : oldPicker
    })
  },

  // 获取gpa
  getGpa() {
    const grades = []                 // 请求结果汇总
    const { yearPicker } = this.data
    const childPool = []
    yearPicker.forEach(i => {
      childPool.push(i.children)
    })
    const terms = flatten(childPool)
    childPool.length = 0
    
    terms.forEach(term => {
      if(term.select) {
        childPool.push(
          { year: term.year, term: term.code }
          ) 
        }
      })
    Promise.all(
      childPool.map(
        fetchData => getGrade(fetchData)
      )
    )
    .then((grades) => grades.reduce(
      (pre, aft) => {
        return pre.concat(aft)
      })
    )
    .then(this.calcGPA)
    .then(gpa => {
      this.setData({
        gpa
      })
    })
},

calcGPA(grade = []) {
  const lessons = filteUseless(grade)
  return GpaReducer(lessons)
},
          
toggleSelector(e) {
    const KEY = 'selector'
    const selectorIndex = e.target.dataset[KEY]
    this.setData({ selectorIndex })
  }
})
