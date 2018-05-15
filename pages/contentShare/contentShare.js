// pages/contentShare/contentShare.js
var apiHelper = require("../../utils/api.js");
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
function breakLinesForCanvas(context, text, width, font) {
  var result = [];
  if (font) {
    context.font = font;
  }
  var textArray = text.split('\r\n');
  for (let i = 0; i < textArray.length; i++) {
    let item = textArray[i];
    var breakPoint = 0;
    while ((breakPoint = findBreakPoint(item, width, context)) !== -1) {
      result.push(item.substr(0, breakPoint));
      item = item.substr(breakPoint);
    }
    if (item) {
      result.push(item);
    }
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
    var contentTitle = "2018年QS排名最新出炉，悉尼大学的毕业生就业能力在全澳大利亚排名第1";
    var contentStr = "2018年QS全球毕业生就业能力排名榜于近期公布，其中，悉尼大学发挥稳定，与去年排名同为第4，超过麻省理工、剑桥、牛津等国内大学生心中的梦想大学。而墨尔本大学紧随其后屈居第7，新南威尔士大学排名36，昆士兰大学排名49、悉尼科技大学排名69，美国斯坦福大学毫无意外地占据榜首。值得一提的是，在本次的榜单中。2018年QS全球毕业生就业能力排名榜于近期公布，其中，悉尼大学发挥稳定，与去年排名同为第4，超过麻省理工、剑桥、牛津等国内大学生心中的梦想大学。而墨尔本大学紧随其后屈居第7，新南威尔士大学排名36，昆士兰大学排名49、悉尼科技大学排名69，美国斯坦福大学毫无意外地占据榜首。值得一提的是，在本次的榜单中。2018年QS全球毕业生就业能力排名榜于近期公布，其中，悉尼大学发挥稳定，与去年排名同为第4，超过麻省理工、剑桥、牛津等国内大学生心中的梦想大学。而墨尔本大学紧随其后屈居第7，新南威尔士大学排名36，昆士兰大学排名49、悉尼科技大学排名69，美国斯坦福大学毫无意外地占据榜首。值得一提的是，在本次的榜单中。";
    this.drawInit({
      title: contentTitle,
      intro: contentStr
    });
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
   * 绘制图片
   */
  drawInit: function (info) {
    var contentTitle = info.title;
    var contentStr = info.intro;
    var that = this
    var res = wx.getSystemInfoSync();
    var canvasHeight = res.windowHeight;
    var canvasWidth = res.windowWidth;
    // 获取canvas的的宽  自适应宽（设备宽/750) px
    var Rpx = canvasWidth / 375;
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('secondCanvas')

    //设置行高
    var lineHeight = Rpx * 30;
    //左边距
    var paddingLeft = Rpx * 20;
    //右边距
    var padingRight = Rpx * 20;
    //当前行高
    var currentLineHeight = Rpx * 20;

    //设置标题
    var resultTitle = breakLinesForCanvas(context, contentTitle, canvasWidth - paddingLeft - padingRight, `${(Rpx * 20).toFixed(0)}px PingFangSC-Regular`);
    resultTitle.forEach(function (line, index) {
      currentLineHeight += Rpx * 30;
      context.fillText(line, paddingLeft, currentLineHeight);
    });
    //画分割线
    currentLineHeight += Rpx * 30;
    context.setLineDash([Rpx * 6, Rpx * 3.75]);
    context.moveTo(paddingLeft, currentLineHeight);
    context.lineTo(canvasWidth - padingRight, currentLineHeight);
    context.strokeStyle = '#cccccc';
    context.stroke();
    //设置内容
    var result = breakLinesForCanvas(context, contentStr || '无内容', canvasWidth - paddingLeft - padingRight, `${(Rpx * 16).toFixed(0)}px PingFangSC-Regular`);
    //字体颜色
    context.fillStyle = '#666666';
    result.forEach(function (line, index) {
      currentLineHeight += Rpx * 30;
      context.fillText(line, paddingLeft, currentLineHeight);
    });
    //查看是否 有广告位 需绘制
    apiHelper.paramData.cmd = "studyAbroadNews/getNewsAdvertising"; //cmd
    apiHelper.paramData.param = {
      pageCode: "introPage"
    };
    apiHelper.post((res) => {
      if (res.State == 0 && res.Value) {
        let imgUrl = res.Value.img;
        wx.downloadFile({
          url: imgUrl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              context.drawImage(res.tempFilePath, paddingLeft, currentLineHeight + Rpx * 30, canvasWidth - paddingLeft - padingRight, Rpx * 200);
              context.draw();
            }
          }
        })
      } else {
        context.draw();
      }
    });
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