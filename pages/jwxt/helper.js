const processExamForTime = (exam)=>{
  const examsFilted = []
  const date = new Date()
  exam.forEach(item => {
    const examTime = new Date(item.time)
    const instance = examTime.getTime - date.getTime()
    const days = instance >= 0
      && instance / 1000 / 60 / 60 / 24 
    days 
      && (item.days = days)
      && texamsFilted.push(item)
  })
  return examsFilted
}
module.exports = {
  processExamForTime: processExamForTime
}