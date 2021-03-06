//index.js
//获取应用实例
const app = getApp()

Page({
  onLoad: function (option) {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
      }
    }) 

    var _this = this,
        userInfo = app.globalData.userInfo,
        userId = app.globalData.userId,
        openId = app.globalData.openId

    // wx.showLoading({title:'加载中'})
    if (!userId){
      wx.reLaunch({url:'../login/index'})
      return
    }

    //获取全局数据，初始化当前页面
    if(!openId) return;
    _this.setData({openId:openId})
    var param = { mini:'mini',
                  openId:openId,
                  userId:userId
                }
    wx.request({
        url: app.globalData.host+'/member/userInfo2', 
        method:'GET',
        data: param,
        success: function (res) {
            //服务器返回的结果
            console.log(res);
            //wx.hideLoading()
            if (res.data.errcode == 0) {
                var info = res.data
                info.bala = info.bala.toFixed(2)
                _this.setData({info:info,
                               userInfo:userInfo})
                app.globalData.mobile = res.data.mobile    //手机号当做全局变量
                app.globalData.cardNo = res.data.cardNo
            }
        }
    })
  },
  openTrade:function(){
     wx.navigateTo({url:'../tradelist/index'})
  },
  openAccount:function(){
    wx.navigateTo({url:'../account/index'})
  },
  openCoupon:function(){
    wx.navigateTo({url:'../coupon/index'})
  },
  openCard:function(){
    wx.navigateTo({url:'../card/index'})
  },
  openCharge:function(){
    wx.navigateTo({url:'../charge/index'})
  },
  TobindCard:function(){
    wx.navigateTo({url:'../bindcard/index'})
  },
  openUserinfo:function(){
    wx.navigateTo({url:'../userinfo/index'})
  },
  openDev:function(){
    wx.navigateTo({url:'../dev/index'})
  },
  onShow:function(){
    this.onLoad()
  }
})
