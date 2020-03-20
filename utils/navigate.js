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
  }
}