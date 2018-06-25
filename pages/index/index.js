// pages/index/index.js
var apiHelper = require("../../utils/api.js");
var util = require("../../utils/util.js");
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX ? true : false,
    currentPageIndex: 1,//当前请求全局页数
    currentDate: util.getLocalTime(),//当前请求日期
    currentDateIsNoData: true,//当前天是否还有数据
    isBusy: false,//是否正在请求数据中
    fastScroll: true,//第一次滚动加载
    array: [],//日期结构数据
    newsArray: []//所有文章存放数组
  },
  toPage: function (event) {
    wx.navigateTo({
      url: `/pages/content/content?id=${event.currentTarget.id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListNew(this.data.currentPageIndex);
  },

  //滚动加载 new 
  scrolltolowerNewEvent: function (e) {
    if (!this.data.isBusy) {
      //查看当天是否还有数据
      if (this.data.currentDateIsNoData) {
        this.data.currentPageIndex = this.data.newsArray[this.data.newsArray.length-1].order;
        this.getListNew(this.data.currentPageIndex);
      } else {
        wx.showToast({
          title: '没有数据了',
          icon: 'none',
          duration: 500
        })
      }
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
        res.Value=res.Value.data;
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
            let array = res.Value;
            for (let i = 0; i < array.length; i++) {
              // console.log(array[i].publishDate)
              let pushdate = array[i].publishDate.substr(0, 10);
              // console.log(pushdate)
              pushdate = util.getLocalTime(0, new Date(pushdate));
              if (pushdate == util.getLocalTime()) {
                pushdate = "今天";
              } else if (pushdate == util.getLocalTime(-1)) {
                pushdate = "昨天";
              }
              let index = self.data.array.findIndex(item => { return item.date == pushdate });
              if (index != -1) {
                //如果有数据，数组
                if (res.Value.length > 0) {
                  self.data.array[index].array.push(array[i])
                }
                else {
                  //标识当天数据已被全部请求完
                  self.data.currentDateIsNoData = false;
                  self.data.currentPageIndex = 1;
                }
              } else {
                self.data.array.push({
                  date: pushdate,
                  array: [array[i]]
                })
              }
            }
            self.data.currentDateIsNoData = true;
          }
        }
      }
      self.setData({
        array: self.data.array
      });
      this.data.isBusy = false;
    },'get');
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
    console.log("xial")
    // wx.startPullDownRefresh()
    //在标题栏中显示加载
    // wx.showNavigationBarLoading()
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '留学新闻',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})