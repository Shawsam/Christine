//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null
  },
  onLoad: function (option) {
    var cardInfo = JSON.parse(option.cardInfo)
    var cardNo = cardInfo.cardNo
    this.setData({cardInfo:cardInfo,
                  cardImg:this.getSrc(cardInfo.typeId),
                  subcardNo:cardNo.substring(cardNo.length-6)})
  },
  ToConsume:function(){
     wx.navigateTo({url:'../account/index'})
  },
  ToCard:function(){
     wx.navigateTo({url:'../card/index'})
  },
  ToIndex:function(){
     wx.switchTab({url:'../index/index'})
  },
  getSrc:function(id){
      switch(id){
        case 6545: return('../../image/6545.jpg');break;
        case 6546: return('../../image/6546.jpg');break;
        case 6547: return('../../image/6547.jpg');break;
        case 6548: return('../../image/6548.jpg');break;
        case 6549: return('../../image/6549.jpg');break;
        case 6550: return('../../image/6550.jpg');break;
        default: return('../../image/0000.jpg'); break;
      }
  }
})
