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
  approveFun:function(){
    this.setData({approveFlag:true})
  },
  completeFun:function(){
     wx.navigateTo({url:'../bindsuccess/index'})
  }
})
