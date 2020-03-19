// components/navbar/index.js
const App = getApp()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    mode: String, // index || menu
    pageName: String,
    showBack: {
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    navHeight: App.globalData.navHeight,
    navTop: App.globalData.navTop
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navBack: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    toIndex: function () {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    },
  }
})
