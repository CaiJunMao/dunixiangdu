// pages/bookDetail/bookDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bid: null,
    book: '',
    resouceId: '',
    chapters: '',
    open: false,
    index: 0,
  },
  // 跳转到对应章节的bookRead,传过去章节号、书名、和书籍封页cover
  goToWhichChapter(order){
    wx.navigateTo({
      // link:chaLink,resouceId:this.resouceId,bookName:this.book.title,chaNum:currCha
      url: '../bookRead/bookRead?order=' + order + '&title=' + this.data.book.title + '&cover=' + this.data.book.cover,
    })
  },
  //开始阅读
  beginRead(){
    // var firstChapterLink = this.data.chapters[0].link
    this.goToWhichChapter(1)
  },
  //阅读最新一章
  readLastCha() {
    // var lastChapterLink = this.data.chapters[chapters.length - 1].link
    this.goToWhichChapter(chapters.length)
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    // var currentChapterLink = this.data.chapters[this.data.index].link
    this.goToWhichChapter(Number(e.detail.value)+1)
  },
  //章节显示隐藏
  toggle: function(e) {
    var newStatus = !this.data.open
    this.setData({
      open: newStatus
    });
  },
  //获取小说详情
  getNovelDetail() {
    const self = this
    return new Promise(function(resolve, reject) {
      wx.request({
        url: 'http://api.zhuishushenqi.com/book/' + self.data.bid,
        success(result) {
          console.log('  getNovelDetail() request success')
          console.log(result)
          self.setData({
            book: result.data
          })
          resolve('成功')
        },
        fail({
          errMsg
        }) {
          console.log('request fail', errMsg)
          self.setData({
            loading: false
          })
          reject('失败')
        }
      })
    })
  },
  //获取小说正版源与盗版源，根据boodid
  getSource() {
    const self = this
    return new Promise(function(resolve, reject) {
      wx.request({
        url: 'http://api.zhuishushenqi.com/atoc?view=summary&book=' + self.data.bid,
        success(result) {
          console.log(' getSource() request success')
          console.log(result)
          self.setData({
            resouceId: result.data[0]._id
          })
          resolve('成功')
        },
        fail({
          errMsg
        }) {
          console.log('request fail', errMsg)
          self.setData({
            loading: false
          })
          reject('失败')
        }
      })
    })
  },
  //获取小说章节，根据书籍源
  getChapters() {
    const self = this
    return new Promise(function(resolve, reject) {
      wx.request({
        url: 'http://api.zhuishushenqi.com/atoc/' + self.data.resouceId + '?view=chapters',
        success(result) {
          console.log(' getChapters() request success')
          console.log(result)
          self.setData({
            chapters: result.data.chapters
          })
          // 缓存，这样进入阅读页面不用再请求一次
          wx.setStorage({
            key: "chapters",
            data: self.data.chapters
          })
          resolve('成功')
        },
        fail({
          errMsg
        }) {
          console.log('request fail', errMsg)
          self.setData({
            loading: false
          })
          reject('失败')
        }
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 在当前页面显示导航条加载动画，显示在标题旁，提示页面正在加载
    wx.showNavigationBarLoading()
    this.setData({
      bid: options.bid
    })
    this.getNovelDetail()
    this.getSource().then((res) => {
      this.getChapters().then((res) => {
        console.log('结束转圈')
        wx.hideNavigationBarLoading()
      })
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