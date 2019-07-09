// pages/searchResult/searchResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWord:'',
    bookList:'',
  },
  getNovels: function () {
    // console.log(e)
    // let keyword = '斗破'
    const that = this
    wx.request({
      url: 'http://api.zhuishushenqi.com/book/fuzzy-search',
      data: { query: that.data.keyWord },
      success(res) {
        that.setData({
          bookList: res.data.books,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      keyWord: options.keyword
    })
    this.getNovels()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})