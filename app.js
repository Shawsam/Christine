//app.js
var host = "https://weixin.chinauff.com/lnj-weixin/console/dc";
var host_dev = "https://demo.i-manji.com/weixin-klst/console/klstweixin";

App({
  globalData: {
     host:host_dev,
     userInfo:null,
     openId:''
  },
  onLaunch: function () {
    // 缓存的useId
    var userId = wx.getStorageSync('userId')
    this.globalData.userId = userId

    // 登录
    var _this = this
    wx.login({
        success: function (r) {
            var code = r.code;        //登录凭证
            if (code) {
                  //请求服务器，解密用户信息 获取unionId等加密信息
                  var param = { mini:'mini',
                                jsCode:code
                              };
                  wx.request({
                      url: _this.globalData.host+'/page/getMiniOpen', 
                      method:'POST',
                      header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
                      data: param,
                      success: function (res) {
                          //服务器返回的结果
                          console.log('用户信息')
                          console.log(res)
                          
                          if (res.data.errcode == 0) {
                             var openId = res.data.miniOpenId
                             _this.globalData.openId = openId

                             if (getCurrentPages().length != 0) {
                                getCurrentPages()[getCurrentPages().length - 1].onLoad()
                             }
                             
                          } else {
                             var errMsg = res.data.msg
                             console.log(errMsg);
                             wx.redirectTo({ url:'../view_state/index?error='+res.statusCode+'&errorMsg='+errMsg})
                          }

                      },
                      fail: function () {
                          console.log('网络错误，请重试')
                          wx.redirectTo({ url:'../view_state/index?errorMsg=网络错误，请重试'})
                      }
                  })

            } else {
                console.log('获取用户登录态失败' + r.errMsg)
                var errMsg = '获取用户登录态失败' + r.errMsg;
                wx.redirectTo({ url:'../view_state/index?errorMsg='+errMsg })
            }
        }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }

})
