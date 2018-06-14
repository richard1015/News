var CryptoJS = require('../libs/aes');
var CONFIG = require('../config');
function Encrypt(word, key, iv) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  //return encrypted.ciphertext.toString();
  return encrypted.toString();
}

function Decrypt(word, key, iv) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

function post(cb, requestMethod = "post") {
  //check reqData
  var key = CryptoJS.enc.Utf8.parse(CONFIG.key);
  var iv = CryptoJS.enc.Utf8.parse(CONFIG.iv);

  var host = CONFIG.host + this.paramData.cmd;
  var requestData = this.paramData.param;
  var sign = Encrypt(JSON.stringify(requestData), key, iv);
  sign = encodeURIComponent(sign);
  var sendData = `key=${sign}`;
  var self = this;
  // console.log(`${host}?${sendData}`);
  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType
      if (networkType != "none") {

        //检查是否需要加载动画
        if (self.loadingState) {
          wx.showLoading({
            // title: '正在请求...',
            mask: true
          });
          // wx.showToast({
          //   title: 'loading...',
          //   image: '/imgs/loading.gif',
          //   duration: 1000 * 30,
          //   mask: true
          // })
        }
        self.loadingState = true;
        wx.request({
          url: host,
          data: requestData,
          method: requestMethod, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'source': "2",//来源 1留学2gpa
          }, // 设置请求的 header
          success: function (res) {
            // success
          },
          fail: function (ex) {
            // fail
            console.log(ex);
          },
          complete: function (response) {
            //关闭加载动画
            wx.hideLoading();
            // wx.hideToast();

            var resData = {
              State: 0,
              Value: {},
              Msg: ""
            }
            if (response.errMsg != "request:ok") {
              resData.State = 1;
              resData.Value = {};
              resData.Msg = "系统错误,请稍后重试！";
            } else if (response.statusCode == 200) {
              resData = response.data;
            }
            // console.log(resData)
            typeof cb == "function" && cb(resData)
            if (resData.State == 1) {
              wx.showModal({
                title: '错误提示',
                content: resData.Msg,
                showCancel: false,
                success: function (res) {

                }
              });
            }
          }
        });
      } else {
        wx.showModal({
          title: '温馨提示',
          content: "请检查您的手机网络是否打开！",
          showCancel: false,
          success: function (res) {

          }
        });
      }
    }
  })
}
module.exports = {
  paramData: {
    "param": {},
    "cmd": "",
    "loadingState": true
  },
  post: post
}