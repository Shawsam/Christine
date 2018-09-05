//index.js
//获取应用实例
var pageNum = 1
const app = getApp()

Page({
  data: {
    userInfo: null
  },
  onLoad: function () {
    pageNum = 1      //重置页码为1
    this.setData({noMore:false})

    var _this = this,
        userInfo = app.globalData.userInfo
     
    _this.setData({userInfo:userInfo})

    var param = {
      mini:'mini',
      openId:app.globalData.openId,
      userId:app.globalData.userId,
      pageNum:pageNum,
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
                   item.transDate = item.transDate.substr(4,2)+'月'+item.transDate.substr(6,2)
                   item.transTime = item.transTime.substr(0,2)+':'+item.transTime.substr(2,2)
                   item.transAmt = item.transAmt.toFixed(2)
               })
               _this.setData({transLogList:transLogList})
            }else{
               var errMsg = res.data.msg
               wx.redirectTo({ url:'../view_state/index?error='+res.statusCode+'&errorMsg='+errMsg})
            }
        }
    })
  },

  //分页加载
  loadMoreData:function(){   
     if(this.data.noMore) return  
     pageNum ++
     var param = {
       mini:'mini',
       openId:app.globalData.openId,
       userId:app.globalData.userId,
       pageNum:pageNum,
       pageCount:10
     }
    var _this = this
    wx.showLoading({title:'加载中'})
    wx.request({
        url: app.globalData.host+'/member/transLogListMini', 
        header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
        method:'GET',
        data: param,
        success: function (res) {
            //服务器返回的结果
            console.log('第'+pageNum+'页:');
            console.log(res);
            wx.hideLoading()
            if (res.data.errcode == 0) {
               var transLogList = res.data.transLogList
               if(transLogList.length){
                 transLogList.map(function(item){
                     item.transDate = item.transDate.substr(4,2)+'月'+item.transDate.substr(6,2)
                     item.transTime = item.transTime.substr(0,2)+':'+item.transTime.substr(2,2)
                     item.transAmt = item.transAmt.toFixed(2)
                 })
                 var  _transLogList = _this.data.transLogList
                      transLogList =  _transLogList.concat(transLogList)
                 _this.setData({transLogList:transLogList})
              }else{
                 _this.setData({noMore:true})
              }
            }else{
               var errMsg = res.data.msg
               wx.redirectTo({ url:'../view_state/index?error='+res.statusCode+'&errorMsg='+errMsg})
            }
        }
    })
  },
  refreshData:function(){
     this.onLoad()
  }
})
