// pages/classifyDetail/classifyDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 由分类页跳过来时带参数gender，major，在onload中获取
    //当前种类
    gender: 'male',
    //当前大分类
    major: '玄幻',
    //状态分类
    types: [{
        eName: 'hot',
        cName: "热门"
      },
      {
        eName: 'new',
        cName: "新书"
      },
      {
        eName: 'reputation',
        cName: "好评"
      },
      {
        eName: 'over',
        cName: "完结"
      },
      {
        eName: 'monthly',
        cName: "包月"
      }
    ],
    //选中的状态分类
    checkedTypeC: '',
    checkedType: "hot",
    //选中的小类别
    checkedMin: "",
    // 选中结果的集合,初始值
    allChecked: [2, 2],
    //分页开始页
    start: 0,
    //分页条数
    limit: 20,
    //根据分类得到的小说列表
    novelList: [],
    //大分类下的所有小分类
    mins: null
  },
  //请求获取小分类
  getMins() {
    const self = this
    return new Promise(function(resolve, reject) {
      wx.request({
        url: 'http://api.kele8.cn/agent/http://api.zhuishushenqi.com/cats/lv2',
        success(result) {
          // wx.showToast({
          //   title: '请求成功',
          //   icon: 'success',
          //   mask: true,
          // })
          console.log('request success')
          console.log(result)
          var majorList = result.data[self.data.gender];
          //majorList是数组，用for of
          for (var majorItem of majorList) {
            //找到male下，对应大分类为玄幻的小分类mins
            if (self.data.major == majorItem.major) {
              self.setData({
                mins: majorItem.mins,
                // 默认选中第一个类别,不可放这里，此时self.data.mins还未赋值
                // checkedMin:self.data.mins[0]
              })
              self.setData({
                checkedMin: self.data.mins[0],
              })
              break;
            }
          }
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
  //根据选择请求获取小说列表
  getNovels() {
    const self = this
    return new Promise(function(resolve, reject) {
      wx.request({
        url: 'https://api.zhuishushenqi.com/book/by-categories',
        data: {
          gender: self.data.gender,
          type: self.data.checkedType,
          major: self.data.major,
          minor: self.data.checkedMin,
          start: self.data.start,
          limit: self.data.limit,
        },
        success(result) {
          // wx.showToast({
          //   title: '请求成功',
          //   icon: 'success',
          //   mask: true,
          // })
          console.log('request success')
          console.log(result)
          self.setData({
            //每当拉到底部再次请求时，应该是往已有的novelList里添加
            novelList: [...self.data.novelList, ...result.data.books],
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
  //picker-view切换
  bindChange: function(e) {
    const val = e.detail.value
    console.log(val)
    this.setData({
      checkedType: this.data.types[val[0]].eName,
      checkedMin: this.data.mins[val[1]],
    })
    //切换时同时请求指定类型的小说
    this.getNovels()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 在当前页面显示导航条加载动画，显示在标题旁，提示页面正在加载
    wx.showNavigationBarLoading()
    this.setData({
      gender: options.gender,
      major: options.major
    })
    //getMins和getNovels两个请求都是异步的，为保证先得到mins再去获取novel,需要让getMins返回promise，
    //成功时会去执行resove,可以调用then,来执行this.getNovels()

    this.getMins().then((res) => {
      console.log(res)
      console.log('调用getNovels()')
      this.getNovels().then((res) => {
        console.log(res)
        // 在当前页面显示导航条加载动画，显示在标题旁，提示页面加载完成
        wx.hideNavigationBarLoading()
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //改变标题,写在onload会一直显示第一次渲染的标题，所以应该写在这里？
    wx.setNavigationBarTitle({
      title: this.data.major
    })
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
    console.log('到底了')

    this.setData({
      start: this.data.start + 20,
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getNovels().then(() => { wx.hideLoading()})
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})