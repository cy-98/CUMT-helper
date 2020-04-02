
const getStore = (key) => {
  return wx.getStorageSync(key)
}

const comptLessonsOfWeek = (day, lessonsOfWeek) => {
  let num = 0
  lessonsOfWeek.forEach(item => {
    item.day < day
      && num++
  })
  return num
}
const sliceRoomName = (room)=>{
  return room.slice(0,2)
}
module.exports = {
  getStore: getStore,
  comptLessonsOfWeek: comptLessonsOfWeek,
  sliceRoomName: sliceRoomName
}