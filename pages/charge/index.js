//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null,
    currentVal:100,
    inputVal:''
  },
  chooseItem:function(e){
  	 var currentVal = e.currentTarget.dataset.param
     if(this.data.jumpLock) return
     this.setData({jumpLock:true})
     var _this = this
     wx.navigateTo({
       url:'../chargeconfirm/index?val='+currentVal,
       success:function(){
            setTimeout(function(){
               _this.setData({jumpLock:false});
            },500)
        }
      })
  },
  inputItem:function(e){
  	 var inputVal = e.currentTarget.dataset.param
  	 this.setData({currentVal:0,
  	 	           inputVal:inputVal,
  	 	           inputState:true})
  },
  valInput:function(e){
  	 var inputVal = e.detail.value
  	 this.setData({inputVal:inputVal})
  },
  chargeTap:function(){
     var _this = this
     if(this.data.jumpLock) return
     var inputState = this.data.inputState,
         inputVal = this.data.inputVal.replace(/(^\s*)|(\s*$)/g, ""),
         currentVal = this.data.currentVal


     if(inputState){
         var val = inputVal
         if(val<0.1){
             wx.showModal({content:'最低充值金额为0.1元'})
             return
         }
     }else{
         var val = currentVal
     }
     this.setData({jumpLock:true})
  	 wx.navigateTo({
       url:'../chargeconfirm/index?val='+val,
       success:function(){
            setTimeout(function(){
               _this.setData({jumpLock:false});
            },500)
        }
      })
  }
})
