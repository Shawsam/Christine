//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null
  },
  onLoad: function (option) {
    this.setData({chargeVal:option.val})
  },
  chargeConfirm:function(){
  	var _this = this,
  	    param = {
    			mini:'mini',
    			openId:app.globalData.openId,
    			userId:app.globalData.userId,	
    			fee:this.data.chargeVal,	
    			mobile:app.globalData.mobile
  	    }

  	wx.showLoading({title:'加载中'})
    wx.request({
        url: app.globalData.host+'/member/addBillMini', 
        header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
        method:'POST',
        data: param,
        success: function (res) {
            //服务器返回的结果
            console.log(res);
            wx.hideLoading()
            if (res.data.errcode == 0) {
                  //调微信支付
                  var resdata = res.data
                  if(resdata.paySign){                            
                     wx.requestPayment({
                       'timeStamp': resdata.timeStamp,
                       'nonceStr': resdata.nonceStr,
                       'package': resdata.packages,
                       'signType': resdata.signType,
                       'paySign': resdata.paySign,
                       'success':function(res){
                           wx.redirectTo({
                             url: '../chargesuccess/index?date='+resdata.timeStamp+'&fee='+_this.data.chargeVal
                           })
                        },
                       'fail':function(res){
                            wx.redirectTo({ url: '../chargefail/index?date='+resdata.timeStamp+'&fee='+_this.data.chargeVal })
                        }
                    }) 
                  }
            }else{
	           var errMsg = res.data.msg
	           wx.redirectTo({ url:'../view_state/index?error='+res.statusCode+'&errorMsg='+errMsg})
            }
        }
    })
  }
})
