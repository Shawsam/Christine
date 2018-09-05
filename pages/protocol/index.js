const app = getApp()

Page({
  data: {
    approveFlag:false
  },
  onLoad: function () {
    var approveFlag = wx.getStorageSync('approveRule')
    this.setData({
      approveFlag:approveFlag
    })
  },
  approveFun:function(){
    var approveFlag = !this.data.approveFlag;
    this.setData({
      approveFlag:approveFlag
    })
    wx.setStorageSync('approveRule',approveFlag)
  }
})
