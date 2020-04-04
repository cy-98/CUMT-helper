import {
  getTerm,
} from "../../pages/tables/helper.js"
import {
  processExamForTime
} from "./helper.js"
import {
  decrypt,
  hasToLogin
} from "../../utils/util.js"
import {
  getTimeTables
} from '../../utils/api.js'

Page({

  data: {
    exam:[],
    grade:[],
    selectorIsLeft: true,
    currentTerm: getTerm(),
    currentYear: new Date().getFullYear() -1
  },

  onLoad: function (options) {
    // check token
    hasToLogin()

    const { currentTerm, currentYear } = this.data

    getTimeTables({
      year: currentYear,
      term: currentTerm
      // year: 2019,
      // term:1
    })
      .then(res => {
        const text = res.data.data
        const data = JSON.parse(decrypt(text))
        const { exam, grade } = data
        const examFilted = processExamForTime(exam)
        this.setData({
          exam: examFilted,
          grade: grade
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  toggleSelector: function(){
    const { selectorIsLeft } = this.data
    this.setData({
      selectorIsLeft: !selectorIsLeft
    })
  },
})