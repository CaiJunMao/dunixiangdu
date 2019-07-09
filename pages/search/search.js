// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyWord: null,
    suggestKeyWords: null,
    historys:[],
  },
  getSugess: function(e) {
    // console.log(e)
    // let keyword = '斗破'
    this.setData({
      searchKeyWord: e.detail.value
    })
      const that = this
      wx.request({
        url: 'http://api.zhuishushenqi.com/book/auto-complete',
        data: { query: that.data.searchKeyWord},
        success(res) {
          that.setData({
            suggestKeyWords: res.data.keywords,
          })
        },
        fail({
          errMsg
        }) {
          console.log('request fail', errMsg)
          that.setData({
            loading: false
          })
        }
      })
  },
  // 保存搜索记录
  saveHistory:function(e){
    console.log(e)
    // navigator点击会跳走，不执行点击事件，所以把跳转写进点击事件中
   
    var that=this
  
    that.setData({
      historys: [...that.data.historys, e.currentTarget.dataset.suggest]
    })
    wx.setStorage({
      key: "historys",
      data: that.data.historys
    })
    wx.navigateTo({
      url: '../searchResult/searchResult?keyword=' + e.currentTarget.dataset.suggest,
    })
  },
  // 使用历史记录
  useHistory:function(e){
    console.log(e)
    wx.navigateTo({
      url: '../searchResult/searchResult?keyword=' + e.currentTarget.dataset.history,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'historys',
      success: function (res) {
        that.setData({
          historys: res.data
        })
      },
      fail: function (res) {
        wx.setStorage({
          key: "historys",
          data: []
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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