//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null
  },
  onLoad: function () {
    
  },
  cardNoInput:function(e){
    var val = e.detail.value
    this.setData({cardNo:val})  
  },
  pwdInput:function(e){
    var val = e.detail.value
    this.setData({pwd:val})
  },
  bindFun:function(){
    var cardNo = this.data.cardNo,
        pwd = this.data.pwd,
        param = {
          mini:'mini',
          openId:app.globalData.openId,
          userId:app.globalData.userId,
          cardNo:cardNo,
          password:pwd
        }

    wx.showLoading({title:'加载中'})
    wx.request({
              url: app.globalData.host+"/card/bindCard",
              method:'POST',
              header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
              data: param,
              success: function(res) {
                //服务器返回数据
                console.log(res)
                wx.hideLoading()
                if(res.data.errcode == 0){
                   wx.redirectTo({url:'../bindconfirm/index'})
                }else{
                   var errMsg = res.data.msg
                   wx.showModal({content:errMsg})
                   // wx.redirectTo({ url:'../view_state/index?error='+res.statusCode+'&errorMsg='+errMsg})
                }
              }
    })             
  }
})
