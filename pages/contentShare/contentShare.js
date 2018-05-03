// pages/contentShare/contentShare.js
function findBreakPoint(text, width, context) {
  var min = 0;
  var max = text.length - 1;

  while (min <= max) {
    var middle = Math.floor((min + max) / 2);
    var middleWidth = context.measureText(text.substr(0, middle)).width;
    var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
    if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
      return middle;
    }
    if (middleWidth < width) {
      min = middle + 1;
    } else {
      max = middle - 1;
    }
  }

  return -1;
}
function breakLinesForCanvas(text, width, font) {
  var context = wx.createCanvasContext('secondCanvas')
  var result = [];
  var breakPoint = 0;

  if (font) {
    context.font = font;
  }

  while ((breakPoint = findBreakPoint(text, width, context)) !== -1) {
    result.push(text.substr(0, breakPoint));
    text = text.substr(breakPoint);
  }

  if (text) {
    result.push(text);
  }

  return result;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    windowWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#010101',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    var that = this
    var res = wx.getSystemInfoSync();
    var canvasHeight = res.windowHeight;
    var canvasWidth = res.windowWidth;


    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('secondCanvas')

    //设置行高
    var lineHeight = 30;
    //左边距
    var paddingLeft = 20;
    //右边距
    var padingRight = 20;
    //当前行高
    var currentLineHeight = 0;

    //设置标题
    var resultTitle = breakLinesForCanvas('2018年QS排名最新出炉，悉尼大学的毕业生就业能力在全澳大利亚排名第1', canvasWidth - paddingLeft - padingRight, '20px PingFangSC-Regular');
    context.font = "20px PingFangSC-Regular";
    resultTitle.forEach(function (line, index) {
      currentLineHeight = lineHeight * index + 30;
      context.fillText(line, paddingLeft, currentLineHeight);
    });
    //画分割线
    currentLineHeight += 30;
    context.setLineDash([6, 3.75]);
    context.moveTo(paddingLeft, currentLineHeight);
    context.lineTo(canvasWidth - padingRight, currentLineHeight);
    context.strokeStyle = '#cccccc';
    context.stroke();
    //设置内容
    var result = breakLinesForCanvas('2018年QS全球毕业生就业能力排名榜于近期公布，其中，悉尼大学发挥稳定，与去年排名同为第4，超过麻省理工、剑桥、牛津等国内大学生心中的梦想大学。而墨尔本大学紧随其后屈居第7，新南威尔士大学排名36，昆士兰大学排名49、悉尼科技大学排名69，美国斯坦福大学毫无意外地占据榜首。值得一提的是，在本次的榜单中。2018年QS全球毕业生就业能力排名榜于近期公布，其中，悉尼大学发挥稳定，与去年排名同为第4，超过麻省理工、剑桥、牛津等国内大学生心中的梦想大学。而墨尔本大学紧随其后屈居第7，新南威尔士大学排名36，昆士兰大学排名49、悉尼科技大学排名69，美国斯坦福大学毫无意外地占据榜首。值得一提的是，在本次的榜单中。2018年QS全球毕业生就业能力排名榜于近期公布，其中，悉尼大学发挥稳定，与去年排名同为第4，超过麻省理工、剑桥、牛津等国内大学生心中的梦想大学。而墨尔本大学紧随其后屈居第7，新南威尔士大学排名36，昆士兰大学排名49、悉尼科技大学排名69，美国斯坦福大学毫无意外地占据榜首。值得一提的是，在本次的榜单中。', canvasWidth - paddingLeft - padingRight, '16px PingFangSC-Regular');
    //字体大小
    context.font = "16px PingFangSC-Regular";
    //字体颜色
    context.fillStyle = '#666666';
    result.forEach(function (line, index) {
      context.fillText(line, paddingLeft, lineHeight * index + currentLineHeight + 30);
    });
    context.draw();
  },
  saveImg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'secondCanvas',
      fileType: 'jpg',
      success: function (res) {
        console.log(res.tempFilePath)  // 返回图片路径

        wx.showLoading({
          title: '保存中...',
          mask: true
        });
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          }, fail: function (res) {
            wx.hideLoading()
            console.log(res)
          }
        })
      }
    })
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