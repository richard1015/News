// pages/content/content.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '1', '2', '3', '4'
    ],
    animation: ''
  },
  toPage: function () {
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: `/pages/contentDetails/contentDetails?id=1`
    })
  },
  nothing: function () { },
  /**
   * 保存分享事件
   */
  saveShare: function () {
    console.log('save share event !')
    this.cancelShare();
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: `/pages/contentShare/contentShare?id=1`
    })
  },
  /**
   * 分享事件
   */
  share: function () {
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
  onShareAppMessage: function () {

  }
})