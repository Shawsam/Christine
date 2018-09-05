//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null,
    winHeight:wx.getSystemInfoSync().windowHeight
  },
  onLoad: function () {
     this.setData({userId:app.globalData.userId})
  },
  ToUserCenter:function(){
     wx.switchTab({url:'../index/index'})
  },
  ToBindCard:function(){
     wx.navigateTo({url:'../bindcard/index'})
  }
})
