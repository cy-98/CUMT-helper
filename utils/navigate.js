module.exports = {
  toLogin: () => {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  toMine: () => {
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },
  toIndex: ()=>{
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  toBack: ()=>{
    wx.navigateBack({
      delta: 1,
    })
  },
  toTable:()=>{
    wx.switchTab({
      url: '/pages/tables/tables'
    })
  },
  navTo:(path)=>{
    wx.navigateTo({
      url: `/pages/${path}/${path}`,
    })
  }

}