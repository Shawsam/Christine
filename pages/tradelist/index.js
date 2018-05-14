//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null
  },
  onLoad: function () {
    var _this = this,
        userInfo = app.globalData.userInfo

    var param = {
      mini:'mini',
      openId:app.globalData.openId,
      userId:app.globalData.userId,
      pageNum:1,
      pageCount:10
    }

    wx.showLoading({title:'加载中'})
    wx.request({
        url: app.globalData.host+'/member/transLogListMini', 
        header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
        method:'GET',
        data: param,
        success: function (res) {
            //服务器返回的结果
            console.log(res);
            wx.hideLoading()
            if (res.data.errcode == 0) {
               var transLogList = res.data.transLogList
               transLogList.map(function(item){
                   item.transTime = item.transTime.substr(0,2)+':'+item.transTime.substr(2,2)+':'+item.transTime.substr(4,2)
               })
               _this.setData({transLogList:transLogList})
            }else{
               var errMsg = res.data.msg
               wx.redirectTo({ url:'../view_state/index?error='+res.statusCode+'&errorMsg='+errMsg})
            }
        }
    })
  }
})
