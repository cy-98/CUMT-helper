import {
  getUser
} from '../../utils/api.js'
import {
  decrypt,
  hasToLogin,
} from '../../utils/util.js'
const App = getApp()
Page({
  // init datas
  data: {
    userInfo: '',
    avatarUrl: '',
    nickName:''
  },
  // lifetimes 
  onLoad: function(options) {
    wx.getUserInfo({
      withCredentials: true,
      success: (res) => {
        const { avatarUrl,nickName } = res.userInfo
        this.setData({
          avatarUrl: avatarUrl,
          nickName: nickName
        })
      },
    })

    let userInfo
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          userInfo: res.data
        })
      },
      fail: () => {
        console.log('userinfo in storage failed')
        getUser()
          .then((res) => {
            if(res.data.code === 400) {
              hasToLogin()
              return 
            }
            const text = res.data.data
            userInfo = JSON.parse(decrypt(text))

            wx.setStorage({
              key: 'userInfo',
              data: userInfo,
            })

            this.setData({
              userInfo: userInfo
            })
          }).catch((err) => { // 本地没有token 无法发送getUser请求
            console.log(err)
            wx.showToast({
              title: '请先登陆',
            }).then(()=>{
              hasToLogin()
            })
          })
      }
    })

  },


  //生命周期函数--监听页面显示

  onShow: function() {

  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})