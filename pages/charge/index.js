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
  	 this.setData({currentVal:currentVal,
  	               inputState:false})
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
     var inputState = this.data.inputState,
         inputVal = this.data.inputVal,
         currentVal = this.data.currentVal,
         val = inputState?inputVal:currentVal;
  	 wx.navigateTo({url:'../chargeconfirm/index?val='+val})
  }
})
