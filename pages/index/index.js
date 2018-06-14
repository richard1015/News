// pages/index/index.js
var apiHelper = require("../../utils/api.js");
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX ? true : false,
    array: []//国家下拉数组
  },
  toPage: function () {
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: `/pages/content/content?id=1`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    apiHelper.paramData.cmd = "gpa/arithmeticlist"; //cmd
    apiHelper.paramData.param = {};
    apiHelper.post((res) => {
      if (res.State == 0) {
        self.setData({
          array: res.Value,
          // ArithmeticTypeItem: res.Value[0].name,
          // arithmeticType: res.Value[0].id
        });
      }
    });
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