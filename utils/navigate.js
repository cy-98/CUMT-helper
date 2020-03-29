module.exports = {
  toLogin: () => {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  toMine: () => {
    wx.redirectTo({
      url: '/pages/mine/mine',
    })
  },
  toBack: ()=>{
    wx.navigateBack({
      delta: 1,
    })
  },
  navTo:(path)=>{
    wx.navigateTo({
      url: `/pages/${path}/${path}`,
    })
  }

}