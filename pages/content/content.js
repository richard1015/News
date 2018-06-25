// pages/content/content.js
var apiHelper = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsArray: [],
    animation: '',
    shareId: 0,
    swiperIndex: 0,
    previousMargin: 35,//swiper 前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值
    nextMargin: 35,//swiper 后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
    isBusy: false,//是否正在请求数据中
    backButton: false,// 返回首页 按钮显示状态，识别二维码进入显示 ，否则不显示
    currentPageIndex: 1,//当前请求全局页数
    currentDateIsNoData: true,//当前天是否还有数据
  },
  toPage: function (event) {
    wx.navigateTo({
      url: `/pages/contentDetails/contentDetails?id=${event.target.id}`
    })
  },
  toPageIndex: function (event) {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  loadData: function () {
    if (!this.data.isBusy) {
      //查看当天是否还有数据
      if (this.data.currentDateIsNoData) {
        this.data.currentPageIndex = this.data.newsArray[this.data.newsArray.length - 1].order;
        this.getListNew(this.data.currentPageIndex);
      }
    }
  },

  swiperChange: function (event) {
    console.log(event);
    if (event.detail.current == this.data.newsArray.length - 1) {
      this.loadData();
    }
  },
  /* new  */
  getListNew(pageIndex, pageSize = 10) {
    this.data.isBusy = true;
    var self = this;
    apiHelper.paramData.cmd = "news"; //cmd
    apiHelper.paramData.loadingState = false;
    apiHelper.paramData.param = {
      pageIndex,
      pageSize
    };
    apiHelper.post((res) => {
      if (res.State == 0) {
        res.Value = res.Value.data;
        if (res.Value.length == 0) {
          //标识数据已被全部请求完
          self.data.currentDateIsNoData = false;
        } else {
          self.data.newsArray = self.data.newsArray.concat(res.Value);
          //数据  剩余条数不超过请求条数，说明下一页已没有数据
          if (res.Value.length < pageSize) {
            //标识数据已被全部请求完
            self.data.currentDateIsNoData = false;
          } else {
            self.data.currentDateIsNoData = true;
          }
        }
      }
      self.setData({
        newsArray: self.data.newsArray
      });
      this.data.isBusy = false;
    },'get');
  },
  nothing: function () { },
  /**
   * 保存分享事件
   */
  saveShare: function (event) {
    console.log('save share event !' + this.data.shareId)
    this.cancelShare();
    wx.navigateTo({
      url: `/pages/contentShare/contentShare?id=${this.data.shareId}`
    })
  },
  /**
   * 分享事件
   */
  share: function (event) {
    this.data.shareId = event.target.id;
    //弹出
    this.animation.translate3d(0, 0, 0).step();
    this.setData({
      animation: this.animation.export()
    })
  },
  /**
   * 取消分享事件
   */
  cancelShare: function () {
    //收起
    this.animation.translate3d(0, 1000, 0).step();
    this.setData({
      animation: this.animation.export()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      options.id = scene;
      this.setData({
        backButton: true
      });
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    //判断入口
    if (prevPage) {
      //直接调用上一个页面的setData()方法，把数据存到上一个页面即编辑款项页面中去  
      let swiperIndex = prevPage.data.newsArray.findIndex(item => { return item.id == options.id });
      this.setData({
        swiperIndex: swiperIndex,
        currentPageIndex: prevPage.data.currentPageIndex,
        currentDateIsNoData: prevPage.data.currentDateIsNoData
      });
      this.setData({
        newsArray: prevPage.data.newsArray //当前选择的好友名字赋值给编辑款项中的姓名临时变量
      });
    } else {
      let id = options.id;
      var self = this;
      self.setData({ id });
      apiHelper.paramData.cmd = "studyAbroadNews/getNewsDetail"; //cmd
      apiHelper.paramData.param = {
        id
      };
      apiHelper.post((res) => {
        if (res.State == 0 && res.Value) {
          self.setData({
            newsArray: [res.Value] //当前选择的好友名字赋值给编辑款项中的姓名临时变量
          });
          self.loadData();
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation()
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
  onShareAppMessage: function (res) {

  }
})