//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null,
    step:1,
    sexCode:1,
    approveFlag:false
  },
  onLoad: function () {

  },
  ToUserCenter:function(){
     wx.navigateTo({url:'../index/index'})
  },
  ToBindCard:function(){
     wx.navigateTo({url:'../bindcard/index'})
  }
})
