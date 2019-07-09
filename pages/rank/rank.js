// pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { title: '人气榜', isCheck: true, flag: 'hot' },
      { title: '新书榜', isCheck: false, flag: 'new' },
      { title: '完结榜', isCheck: false, flag: 'over' },
    ],
    // 当前标签卡的索引
    currentTab: 0,
    //三个榜单
    hot: null,
    new: null,
    over: null,
    //对应排行榜的小说
    bookList: null,
    height: 600,
  },
  //滑动切换
  swiperTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.getCurrentRank()
  },
  //点击切换.会触发滑动事件
  clickTab: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
    this.getCurrentRank()
  },
  getHeight: function () {
    var wrapHeight
    var topHeight
    //创建节点选择器
    var classify = wx.createSelectorQuery();
    classify.select('.classify').boundingClientRect();
    classify.exec(function (rect) {
      wrapHeight = rect[0].height

    });
    var topbar = wx.createSelectorQuery();
    topbar.select('.swiper-tab').boundingClientRect();
    var that = this
    topbar.exec(function (rect) {
      topHeight = rect[0].height
      console.log(wrapHeight, topHeight)
      that.setData({
        height: wrapHeight - topHeight,
        wrapHeight: wrapHeight
      })
    });
    // 注意，exec是一个异步操作，所以下面的这一行会先打印，故为保证顺序，应该把this.setData放在exec中执行
    console.log(wrapHeight, topHeight)
    // 得出scroll-view 高度
    //  this.setData({
    //    height: wrapHeight - topHeight 

    //   })
    // console.log(this.data.height)
  },

 
  //获取所有排行榜,取出需要的榜单,以获取其id
  getAllRanks:function() {
    return new Promise( (resolve, reject) =>{
      var that = this
      console.log(that)
      wx.request({
        url: 'http://api.zhuishushenqi.com/ranking/gender',
        success(res) {
          console.log(that)
          that.setData({
            hot: res.data.picture[0],
            new: res.data.picture[3],
            over: res.data.picture[4]
          })
          resolve('getAllRanks sucess')
        },
        fail({ errMsg }) {
          console.log('request fail', errMsg)
          that.setData({
            loading: false
          })
          reject('getAllRanks fail')
        }
      })
    })
     
  },
  //获取排行榜小说
  getCurrentRank: function () {
    return new Promise((resolve, reject) =>{
      const that = this
      let id = ''
      console.log(this.data.currentTab)
      var index = this.data.currentTab
      switch (index){
        case 0:
          id = this.data.hot._id
          break
        case 1:
          id = this.data.new._id
          break
        case 2:
          id = this.data.over._id
          break
      }
      wx.showNavigationBarLoading()
      wx.request({
        url: 'http://api.zhuishushenqi.com/ranking/' + id,
        success(res) {
          wx.hideNavigationBarLoading()
          that.setData({
            bookList: res.data.ranking.books
          })
          resolve('getCurrentRank sucess')
        },
        fail({ errMsg }) {
          console.log('request fail', errMsg)
          that.setData({
            loading: false
          })
          reject('getCurrentRank fail')
        }
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    this.getAllRanks().then((res)=>{
      this.getCurrentRank().then((res)=>{
        wx.hideNavigationBarLoading()
      })
    })
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