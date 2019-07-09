// pages/bookRead/bookRead.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 全部章节，在详情页已经获取到了目录，那时缓存，现在取出
    chapters: '',
    // 排序控制的chapters，避免倒序时影响上下章功能
    orderChapters: '',
    // 当前章节号m
    currentOrder: 1,
    currentLink: '',
    currentChapter: '',
    content: '',
    text: '',
    // 一屏的高度
    height: 0,
    scroll_top: 0,
    //是否正在是滚动过的
    isScrolled: false,
    befroreScroll: 0,
    initFontSize: '14',
    startTime: 0, //点击开始时间
    endTime: 0　, //点击结束时间
    colorArr: [{
      value: '#f7eee5',
      name: '米白',
      font: '#000'
    }, {
      value: '#e9dfc7',
      name: '纸张',
      font: '#000',
      id: "font_normal"
    }, {
      value: '#a4a4a4',
      name: '浅灰',
      font: '#000'
    }, {
      value: '#cdefce',
      name: '护眼',
      font: '#000'
    }, {
      value: '#283548',
      name: '灰蓝',
      font: '#7685a2',
      bottomcolor: '#fff'
    }, {
      value: '#000',
      name: '夜间',
      font: '#4e534f',
      bottomcolor: 'rgba(255,255,255,0.7)',
      id: "font_night"
    }],
    nav: 'none',
    ziti: 'none',
    // 目录是否显示
    menu: 'none',
    // 正反序
    positiveOrder: true,
    _num: 1,
    bodyColor: '#e9dfc7',
    bodyFontColor: '#000',
    daynight: false,
    // 是否已添加书架,onload时判断
    isAdd: false,
    zj: 'none',
    // 书架对象
    // bookShelf: [],
  },
  // 获取当前章节内容
  getChapterContent() {
    // http://chapterup.zhuishushenqi.com/chapter/"+link
    const self = this
    console.log(self.data.chapters)
    return new Promise(function(resolve, reject) {
      wx.request({
        url: 'http://chapterup.zhuishushenqi.com/chapter/' + self.data.chapters[self.data.currentOrder - 1].link,
        success(result) {
          console.log('  getChapterContent() request success')
          console.log(result)
          var newCon = result.data.chapter.cpContent.replace(/\r\n/g, '\n  ')
          // console.log(newCon)
          var str = `<div style="text-indent:20px"> ${newCon}  </div>`
          self.setData({
            currentChapter: result.data.chapter,
            // content: result.data.chapter.cpContent,
            // 不支持&nbsp?,看来只能再套一层view来text-indent了
            content: newCon
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
  // 前往当前目录选择的章节
  goCurrentChapter(e){
    console.log(e.currentTarget.dataset.order)
    this.setData({
      currentOrder: e.currentTarget.dataset.order
    })
    //获取当前章节内容，在自动返回
    this.getChapterContent().then(()=>{
      this.menuToggle()
    })
  },
  // 切换目录正反序
  order: function() {
    if (this.data.positiveOrder == true) {
      this.setData({
        positiveOrder: false,
      })
    } else {
      this.setData({
        positiveOrder: true,
      })
    }
  },
  // 展开,收起目录页
  menuToggle() {
    console.log(this.data.menu)
    if (this.data.menu == "none") {
      this.setData({
        menu: "block",
      })
    } else {
      this.setData({
        menu: "none",
      })
    }

  },
  //上一章
  lastChapter() {
    if (this.data.currentOrder != 1) {
      // 更新currentOrder
      this.setData({
        currentOrder: this.data.currentOrder - 1
      })
      // 获取currentOrder对应章节内容
      this.getChapterContent()
    } else {
      wx.showToast({
        title: '已经是第一章了',
        icon: 'success',
        mask: true,
      })
    }
  },
  // 下一章
  nextChapter() {
    // 请求得到的当前章节有些没有order,只有chapters中的每一章带有order
    if (this.data.currentOrder < this.data.chapters.length) {
      // 更新currentOrder
      this.setData({
        currentOrder: this.data.currentOrder + 1
      })
      // 获取currentOrder对应章节内容
      this.getChapterContent()
    } else {
      wx.showToast({
        title: '已经是最后一章了',
        icon: 'success',
        mask: true,
      })
    }
  },
  // 点击scrol-View滚屏，根据中分线，点击在上上滚，点击中分线下下滚
  // 注意，为了区分长按事件会触发点击点击事件，为了区分两者，需要判断触摸时间
  //手指触摸开始赋值
  touchStart: function(e) {　　　　
    this.startTime = e.timeStamp;　　
  },
  //手指触摸结束赋值
  touchEnd: function(e) {　　　　
    this.endTime = e.timeStamp;　　
  },
  // isClick 不管点击还是长按都会触发的事件
  isClick: function(e) {　　　　　　
    //通过判断手指触摸时间来判断是否是点击事件，当时间差小于350时，为点击事件
    if (this.endTime - this.startTime < 350) {　　　
      //这里可以做点击事件的处理
      this.bindscrollClick(e)　　　　
    }　　
  },
  //长按显示底部导航
  longTapAction: function() {
    console.log('sss')
    if (this.data.nav == 'none') {
      this.setData({
        nav: 'block'
      })
    } else {
      this.setData({
        nav: 'none',
        ziti: 'none'
      })

    }
  },
  bindscrollClick(e) {
    // 是否滚动过，滚动过的话，要先更新scroll_top
    if (this.data.isScrolled) {
      this.setData({
        scroll_top: this.data.befroreScroll,
        // 更新完要isScrolled为false,表示上一次不是拉着滚动的
        isScrolled: false
      })
    }
    console.log(e)
    var middleLine = this.data.height / 2
    if (e.detail.y < middleLine) {
      // 小于为上，在上为上滚
      if (this.data.scroll_top == 0) {
        // 为0表示一到最上，再点前往上一章
        console.log('上一章')
      } else {
        this.setData({
          scroll_top: this.data.scroll_top - this.data.height
        })
      }

    } else {
      // 在上为下滚
      this.setData({
        scroll_top: this.data.scroll_top + this.data.height
      })

    }

  },
  //字体变大
  bindBig: function() {
    var that = this;
    if (that.data.initFontSize > 25) {
      return;
    }
    var FontSize = parseInt(that.data.initFontSize)
    that.setData({
      initFontSize: FontSize += 1
    })
    // console.log(that.data.initFontSize)
    wx.setStorage({
      key: "initFontSize",
      data: that.data.initFontSize
    })
  },
  //字体变小
  bindSmall: function() {
    var that = this;
    if (that.data.initFontSize < 12) {
      return;
    }
    var FontSize = parseInt(that.data.initFontSize)
    that.setData({
      initFontSize: FontSize -= 1
    })
    // console.log(that.data.initFontSize)
    wx.setStorage({
      key: "initFontSize",
      data: that.data.initFontSize
    })
  },

  //点击字体出现窗口
  zitiAction: function() {
    if (this.data.ziti == 'none') {
      this.setData({
        ziti: 'block'
      })
    } else {
      this.setData({
        ziti: 'none'
      })
    }
  },
  //选择背景色，并对应改变字体颜色
  bgChange: function(e) {
    // console.log(e.target.dataset.num)
    // console.log(e)
    this.setData({
      _num: e.target.dataset.num,
      bodyColor: this.data.colorArr[e.target.dataset.num].value,
      bodyFontColor: this.data.colorArr[e.target.dataset.num].font

    })
    // 存入缓存，方便下次进来是仍使用原来的配置
    wx.setStorage({
      key: "bodyColor",
      data: this.data.colorArr[e.target.dataset.num].value
    })
    wx.setStorage({
      key: "_num",
      data: e.target.dataset.num
    })
    wx.setStorage({
      key: "bodyFontColor",
      data: this.data.colorArr[e.target.dataset.num].font
    })
  },
  //切换白天夜晚
  dayNight: function() {
    if (this.data.daynight == true) {
      this.setData({
        daynight: false,
        bodyColor: '#e9dfc7',
        bodyFontColor: '#000',
        _num: 1
      })
      wx.setStorage({
        key: "bodyColor",
        data: '#e9dfc7'
      })
      wx.setStorage({
        key: "_num",
        data: 1
      })
      wx.setStorage({
        key: "bodyFontColor",
        data: "#000"
      })
    } else {
      this.setData({
        daynight: true,
        bodyColor: '#000',
        bodyFontColor: '#4e534f',
        _num: 5
      })
      wx.setStorage({
        key: "bodyColor",
        data: '#000'
      })
      wx.setStorage({
        key: "_num",
        data: 5
      })
      wx.setStorage({
        key: "bodyFontColor",
        data: "#4e534f"
      })

    }
    wx.setStorage({
      key: "daynight",
      data: this.data.daynight
    })
  },
  //添加移出书架
  addBookshelf: function() {
    //获取缓存中书架bookshelf对象，用来添加移出书架
    let books = []
    var that = this
    // 获取bookshelf,异步的，注意后面的逻辑放在sucess中
    wx.getStorage({
      key: 'bookShelf',
      success: function(res) {
        console.log(res.data)
        books = res.data
        if (that.data.isAdd == true) {
          wx.setStorage({
            key: "bookShelf",
            data: books.filter((book) => book.title !== that.data.title)
          })
          // 过滤掉书架中title为当前title的book,这种做法当有书架重名时不合适
          // this.data.bookShelf.filter((book)=>{book.title !== this.data.title})
          that.setData({
            isAdd: false,
          })
          wx.showToast({
            title: '成功移出',
            icon: 'success',
            duration: 2000
          })
        } else {
          // 将目录chapters,封页cover和书籍名title保存入book对象，再存入storage的书架对象
          let book = {}
          book = {
            chapters: that.data.chapters,
            title: that.data.title,
            cover: that.data.cover,
            order:that.data.currentOrder
          }
          console.log(books)
          console.log(book)
          wx.setStorage({
            key: "bookShelf",
            data: [...books, book]
          })
          that.setData({
            isAdd: true,
          })
          wx.showToast({
            title: '成功添加',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
    
    wx.setStorage({
      key: "isAdd",
      data: this.data.isAdd
    })
  },
  //滚动隐藏窗口，同时更新befroreScroll
  scrollContain: function(e) {

    this.setData({
      isScrolled: true,
      nav: 'none',
      ziti: 'none',
      zj: 'none',
      befroreScroll: e.detail.scrollTop
    })
    // 当scroll_top刚好为e.detail.scrollTop，那么此时应该是scroll_top改变导致的滚动，不是手动拉着滚动
    //isScrolled设为false。
    if (this.data.scroll_top == e.detail.scrollTop) {
      this.setData({
        isScrolled: false
      })
    }

    // 设置延时和开关，避免多次执行滚动事件
    /*
    setTimeout(() => {
      this.setData({
        isScrolling: false,
        nav: 'none',
        ziti: 'none',
        zj: 'none',
        // 因为是延时的，所以不能实时改变scroll_top，会有误差.
        //不如不设延时，用另外的变量存不断改变的e.detail.scrollTop
        //将可以在点击时判断是否滚动过
        // scroll_top: e.detail.scrollTop
      })
      console.log(e)
    }, 500)
      */



  },
  //滚动到底部
  bindscrolltolower: function() {
    console.log('底部')
    this.setData({
      zj: 'block',
    })
  },
  //获取缓存中的 bookShelf
  getBookShelf:function(){
    return new Promise(function (resolve, reject) {
      // var that = this
      let books = []
      wx.getStorage({
        key: 'bookShelf',
        success: function (res) {
          console.log(res.data)
          books = res.data
          resolve(books)
        },
        fail: function (res) {
          // 失败说明没有该对象，
          console.log(res)
          // 创建bookShelf
          wx.setStorage({
            key: "bookShelf",
            data: []
          })
          reject([])
        }
      })
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    console.log(options)
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
      title: options.title
    })
    wx.setNavigationBarTitle({
      title: options.title
    })
    
    var that = this;
    // 如果不是从书架进入，也就是说是从详情页进来的，就会携带cover和title，同时详情页也保存了chapters
    if (options.cover) {
      this.setData({
        currentOrder: Number(options.order),
        cover: options.cover,
      })
      // 取出chapters,因为getChapterContent需要用到chapters，所以应该先执行 wx.getStorage
      wx.getStorage({
        key: 'chapters',
        success: function (res) {
          // console.log(res.data)
          that.setData({
            chapters: res.data,
            orderChapters: [...res.data].reverse(),
          })
          //成功了再去执行
          that.getChapterContent().then((res) => {
            console.log('结束转圈')
            wx.hideNavigationBarLoading()
          })
        },
        fail: function () {
          console.log(res.data)
        }
      })
    }else{
      // 从书架进入，只携带title,order和chapters要根据title去storage中找,需要先获取到book
      // 判断书架中是否有该书，以显示添加状态和获取book
      let book = []
      this.getBookShelf().then((books) => {
        book = books.find((item) => item.title == that.data.title)
        if (book) {
          this.setData({
            isAdd: true
          })
        } else {
          this.setData({
            isAdd: false
          })
        }
        this.setData({
          currentOrder: Number(book.order),
          cover: book.cover,
          chapters: book.chapters,
          orderChapters: [...book.chapters].reverse(),
        })
        //成功了再去执行
        that.getChapterContent().then((res) => {
          console.log('结束转圈')
          wx.hideNavigationBarLoading()
        })
      })
    }
    wx.getStorage({
      key: 'initFontSize',
      success: function(res) {
        // console.log(res.data)
        that.setData({
          initFontSize: res.data
        })
      }
    })
    //存储背景色
    wx.getStorage({
      key: 'bodyColor',
      success: function(res) {
        // console.log(res.data)
        that.setData({
          bodyColor: res.data
        })
      }
    })
    wx.getStorage({
      key: '_num',
      success: function(res) {
        // console.log(res.data)
        that.setData({
          _num: res.data
        })
      }
    })
    wx.getStorage({
      key: 'daynight',
      success: function(res) {
        // console.log(res.data)
        that.setData({
          daynight: res.data
        })
      }
    })
    wx.getStorage({
      key: 'bodyFontColor',
      success: function(res) {
        // console.log(res.data)
        that.setData({
          bodyFontColor: res.data
        })
      }
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
    console.log('onHide')
   
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('onUnload')
    //如果是在书架中的，消失时保存当前currentOrder
    if(this.data.isAdd){
      let books = []
      var that = this
      wx.getStorage({
        key: 'bookShelf',
        success: function (res) {
          books = res.data
          // 将目录chapters,封页cover和书籍名title保存入book对象，再存入storage的书架对象
          let book = {}
          book = {
            chapters: that.data.chapters,
            title: that.data.title,
            cover: that.data.cover,
            order: that.data.currentOrder
          }
          //去掉之前保存的，以免重复
          // books.filter((book) => book.title !== that.data.title)
          wx.setStorage({
            key: "bookShelf",
            data: [...books.filter((book) => book.title !== that.data.title), book]
          })
        }
      })
    }
    
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