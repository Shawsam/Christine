//index.js
//获取应用实例
import { formatTime } from '../../utils/util.js'

const app = getApp()

Page({
  data: {
    userInfo: null
  },
  onLoad: function (option) {
     var time = formatTime(1000*option.date),
         fee = option.fee;
     this.setData({
     	time:time,
     	fee:fee
     })
  },
  backTap:function(){
     wx.switchTab({url:'../index/index'})
  }
})
