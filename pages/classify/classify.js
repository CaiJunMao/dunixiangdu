// pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //大分类
    bigClassifyType: [{
        eName: 'male',
        cName: '男生'
      },
      {
        eName: 'female',
        cName: '女生'
      },
      {
        eName: 'picture',
        cName: '其他'
      },
      {
        eName: 'press',
        cName: '出版'
      }
    ],
    // 当前标签卡的索引
    currentTab: 0,
    //请求得到的所有分类
    bigClassify: null,
    //scroll-view的height
    height: 600,
    wrapHeight: 640
  },
  //滑动切换
  swiperTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function(e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }

  },
  getHeight: function() {
    var wrapHeight
    var topHeight
    //创建节点选择器
    var classify = wx.createSelectorQuery();
    classify.select('.classify').boundingClientRect();
    classify.exec(function(rect) {
      wrapHeight = rect[0].height

    });
    var topbar = wx.createSelectorQuery();
    topbar.select('.swiper-tab').boundingClientRect();
    var that = this
    topbar.exec(function(rect) {
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

  //发起请求
  makeRequest() {
    const self = this

    wx.showNavigationBarLoading()

    wx.request({
      url: 'http://api.zhuishushenqi.com/cats/lv2/statistics',
      success(result) {
        wx.hideNavigationBarLoading()
        delete result.data.ok;
        self.setData({
          bigClassify: result.data
        })
        console.log('request success')
        console.log(result.data)
      },

      fail({
        errMsg
      }) {
        console.log('request fail', errMsg)
        self.setData({
          loading: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.makeRequest()
    this.getHeight()
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