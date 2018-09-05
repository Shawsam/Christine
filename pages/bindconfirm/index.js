//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null
  },
  onLoad: function (option) {
    var cardInfo = JSON.parse(option.cardInfo)
    this.setData({cardInfo:cardInfo})
  },
  completeFun:function(){
     var cardInfo = JSON.stringify(this.data.cardInfo)
     wx.navigateTo({url:'../bindsuccess/index?cardInfo='+cardInfo})
  }
})
