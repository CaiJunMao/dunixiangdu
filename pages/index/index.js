//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎来到静夜思',
    userInfo: {},
    hasUserInfo: false,
    // 判断d当前版本是否可用，参照：https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.canIUse.html
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindGoInto:function(){
    wx.switchTab({
      url: '../classify/classify'
    })
    
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
  //  console.log('ss')
    //调试用，1s后直接到该界面
    setTimeout(()=>{
      wx.switchTab({
        url: '../bookshelf/bookshelf',
      })
    },1000)
   
    //判断全局状态，其他界面如果已授权，将不再重复授权
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
  
})
