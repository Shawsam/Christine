//index.js
//获取应用实例
import { formatTime } from '../../utils/util.js'

const app = getApp()

Page({
  data: {
    userInfo: null
  },
  onLoad: function (option) {
     console.log(formatTime(1000*option.date))
  },
  backTap:function(){
     wx.navigateBack()
  }
})
