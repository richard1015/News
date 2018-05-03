//app.js
var apiHelper = require("utils/api.js");
App({
  onLaunch: function () {
    var self = this
    console.log('App Launch')
    // 获取手机信息
    wx.getSystemInfo({
      success: function (res) {
        let model = res.model.substring(0, res.model.lastIndexOf("X")) + "X";
        if (model == 'iPhone X') {
          self.globalData.isIphoneX = true  //判断是否为iPhone X 默认为值false，iPhone X 值为true
        }
      }
    })
    // 获取用户信息
    self.getUserInfo(function (res) {
      return
      //获取openId
      self.getUserOpenId(res, function (error, openid) {
        if (error) {
          console.error(error)
        } else {
          // userInfo.openId = openid;
          // //提交用户信息
          // apiHelper.paramData.cmd = "/wxuser"; //cmd
          // apiHelper.paramData.param = userInfo;
          // apiHelper.post((res) => {
          //   if (res.State == 0) {
          //     console.log('用户信息提交成功')
          //   }
          // });
        }
      });
    })

  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    userInfo: null,
    hasLogin: false,
    openid: null,
    isIphoneX: false
  },
  // lazy loadin userInfo
  getUserInfo: function (callback) {
    var self = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              self.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (callback) {
                callback(res)
              }
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  self.globalData.userInfo = res.userInfo
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (callback) {
                    callback(res)
                  }
                }
              })
            },
            fail(ex) {
              console.log(ex)
              self.getUserInfo();
            }
          })
        }
      }
    })


  },
  // lazy loading openid
  getUserOpenId: function (res, callback) {
    var self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function (data) {
          res.code = data.code;
          // console.log(res)
          //获取openId
          apiHelper.paramData.cmd = "wx/wxcallback"; //cmd
          apiHelper.paramData.param = {
            code: encodeURIComponent(res.code),
            encryptedData: encodeURIComponent(res.rawData),
            iv: encodeURIComponent(res.iv)
          };
          // apiHelper.errorMsgState = false;
          apiHelper.loadingState = false;
          apiHelper.post((res) => {
            if (res.State == 0) {
              // console.log('拉取openid成功', res.Value)
              self.globalData.openid = res.Value
              callback(null, self.globalData.openid)
            }
          });
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  }
})