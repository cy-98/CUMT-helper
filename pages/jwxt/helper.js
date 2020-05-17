const computedTime = (exam)=>{
  return exam.map((item)=>{
    const todayDate = new Date().getTime()
    const examDate = new Date(item.time).getTime()
    const deadLine = ( examDate - todayDate ) / 1000 / 60 / 60 / 24

    item.deadLine = deadLine > 0 ? Math.floor(deadLine) : -1
    console.log(deadLine, todayDate, examDate)
    return item
  })
}

module.exports = {
  computedTime
}