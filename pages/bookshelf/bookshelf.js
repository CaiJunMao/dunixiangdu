// pages/bookshelf/bookshelf.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookShelf:[]
  },

  setBooks:function(){
    var that = this
    wx.getStorage({
      key: 'bookShelf',
      success: function (res) {
        //先置为空，否则第二次执行时重复
        that.setData({
          bookShelf: []
        })
        // console.log(res.data)
        // res.data数据太大，setdata时bookShelf:res.data时 会报错：
        //vdSyncBatch 数据传输长度为 1748945 已经超过最大长度 1048576
        // 解决方法：拆分
        for (let { title, cover } of res.data) {
          // var { title, cover } = book
          // console.log({ title, cover })
          that.setData({
            bookShelf: [...that.data.bookShelf, { title, cover }]
          })
        }
        // var [{ title, cover }] = book
        // console.log(title)
        that.setData({
          // bookShelf:res.data
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
   this.setBooks()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
    // 再次返回这个页面时，可能bookshel移改变，应该重新sheData
    this.setBooks()
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