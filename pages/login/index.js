//index.js
//获取应用实例
const app = getApp()
var model = require('../../model/model.js')
var show = false;
var item = {};
var timeCounter;

Page({
  data: {
    codeImg:'',
    userInfo: null,
    userId:'',
    step:1,
    sexCode:1,
    approveFlag:false,
    mobile:'',
    smscode:'',
    timer:60,
    date:'',
    captchaIn:'',
    captcha:[],
    item: { show: show },
    winHeight:wx.getSystemInfoSync().windowHeight
  },
  is_phone:function(str){
    var reg=/^1\d{10}$/;
    if(reg.test(str))
      return true;
    else
      return false;
  },
  getCaptcha:function(){
     this.setData({codeImg:app.globalData.host+'/imgCode/getImageCode?mini=mini&v='+Math.floor(Math.random()*10)})
  },
  captchaFun:function(){
     var captcha = []
     for(var i=0;i<4;i++){
        captcha.push(Math.floor(Math.random()*10))
     }
     this.setData({captcha:captcha,captchaString:captcha.join('')})
  },
  captchaInput:function(e){
    this.setData({
        captchaIn: e.detail.value
    })
  },
  onShow:function(){
     this.captchaFun()
     this.getCaptcha()
     var approveFlag = wx.getStorageSync('approveRule')
     this.setData({approveFlag:approveFlag})
  },
  stepBack:function(){
     this.captchaFun()
     this.setData({step:1})
     clearInterval(timeCounter)
  },
  onLoad: function (option) {  
    wx.setStorageSync('approveRule',false)
    this.setData({openId:app.globalData.openId})
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }    
  },

  onReady: function (e) {
    var _this = this;
    model.updateAreaData(_this, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true,400);  
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false,400);
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    console.log(item)
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },

  phoneInput:function(e){
    this.setData({
        mobile: e.detail.value
    })
  },
  getCodeFun: function(e){
    if(this.data.clickLock) return;
    
    if(!e.detail.userInfo){
        wx.showModal({content:'请允许微信授权',showCancel:false})
        return
    } 
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      sexCode:e.detail.userInfo.gender==2?0:1
    })

    //参数校验
    var mobile = this.data.mobile
    if(mobile == ''){
       wx.showModal({content:'请输入手机号'})
       return
    } 
    
    if(!this.is_phone(mobile)){
       wx.showModal({content:'请输入正确的手机号'})
       return
    }
    
    var captchaIn = this.data.captchaIn
    if(captchaIn == ''){
       wx.showModal({content:'请输入图形验证码'})
       return
    }
    // if(captchaIn != captchaString){
    //    wx.showModal({content:'图形验证码有误'})
    //    this.captchaFun()
    //    return
    // }

    var _this = this
    var param = {
       mini:'mini',
       imgCode:captchaIn,
       openId:app.globalData.openId,
       mobile:mobile
    }
    _this.setData({clickLock:true})
    wx.showLoading({title:'加载中'})
    wx.request({
              url: app.globalData.host+"/imgCode/checkImgCode",
              method:'GET',
              data: param,
              success: function(res) {
                //服务器返回数据
                _this.setData({clickLock:false})
                wx.hideLoading()
                if(res.data.code == 0){
                    // var userId = res.data.data
                    // console.log(userId)

                    // _this.setData({step:2,
                    //                userId:userId})

                    _this.setData({step:2,timer:60})
                      timeCounter = setInterval(function(){
                      var timer =  _this.data.timer
                      if(timer == 0){
                        clearInterval(timeCounter)
                        return
                      }
                      _this.setData({timer:timer-1})                    
                    },1000)
                }else{
                    wx.showModal({content:res.data.msg})
                }
              }
    })    
   
  },

  RegetCodeFun:function(){
    this.setData({step:1})
    clearInterval(timeCounter)
    // var param = {
    //    mini:'mini',
    //    openId:app.globalData.openId,
    //    mobile:this.data.mobile
    // }
    // var _this = this
    // wx.showLoading({title:'加载中'})
    // wx.request({
    //           url: app.globalData.host+"/sms/sendCodeMini",
    //           method:'POST',
    //           header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
    //           data: param,
    //           success: function(res) {
    //             //服务器返回数据
    //             wx.hideLoading()
    //             if(res.data.errcode == 0){
    //                 _this.setData({timer:60})
    //                 var timeCounter = setInterval(function(){
    //                   var timer =  _this.data.timer
    //                   if(timer == 0){
    //                     clearInterval(timeCounter)
    //                     return
    //                   }
    //                   _this.setData({timer:timer-1})                    
    //                 },1000)
    //             }
    //           }
    // })     
  },


  codeInput:function(e){
    this.setData({
        smscode: e.detail.value
    })
  },
  yzCodeFun: function(){
    if(this.data.clickLock2) return;
    //参数校验
    var smscode = this.data.smscode
    if(smscode == ''){
       wx.showModal({content:'请输入验证码'})
       return
    }

    if(smscode.length!=6){
       wx.showModal({content:'请输入6位数字的验证码'})
       return
    }  

    // var userId = this.data.userId
    // console.log(userId)
    // if(userId){   //会员用户，直接跳转首页
    var param = {
       mini:'mini',
       openId:app.globalData.openId,
       mobile:this.data.mobile,
       code:smscode
    }
    var _this = this

    wx.showLoading({title:'加载中'})
    this.setData({clickLock2:true})
    wx.request({
              url: app.globalData.host+"/member/loginMini",
              method:'POST',
              header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
              data: param,
              success: function(res) {
                //服务器返回数据
                console.log(res)
                wx.hideLoading()
                if(res.data.errcode == 0){
                    var userId = res.data.userId;
                    if(userId){
                        app.globalData.userId = userId
                        wx.setStorageSync('userId',userId)
                        wx.switchTab({url:'../index/index'})
                    }else{
                        _this.setData({step:3})
                    }
                }else{
                    wx.showModal({content:res.data.msg})
                    _this.setData({clickLock2:false})
                }
              }
    })
   //}
    // else{
    //   var param = {
    //        mini:'mini',
    //        openId:app.globalData.openId,
    //        mobile:this.data.mobile,
    //        smscode:smscode
    //     }
    //     var _this = this
    //     wx.showLoading({title:'加载中'})
    //     wx.request({
    //               url: app.globalData.host+"/sms/checkCodeMini",
    //               method:'POST',
    //               header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
    //               data: param,
    //               success: function(res) {
    //                 //服务器返回数据
    //                 console.log(res)
    //                 wx.hideLoading()
    //                 if(res.data.errcode == 0){
    //                     var userId = res.data.userId
    //                     app.globalData.userId = userId
    //                     wx.setStorageSync('userId',userId)
    //                     _this.setData({step:3,
    //                                    userId:userId})
    //                 }else{
    //                     wx.showModal({content:res.data.msg})
    //                 }
    //               }
    //     })  
    // }
  },

  nameInput:function(e){
    this.setData({
        name: e.detail.value
    })
  },

  referrerInput:function(e){
    this.setData({
        referrer: e.detail.value
    })
  },

  pwdInput:function(e){
    this.setData({
        psw: e.detail.value
    })
  },

  bindDateChange:function(e){
    this.setData({
       date:e.detail.value
    })
  },

  completeFun: function(){

    if(this.data.clickLock3) return;

    var mobile = this.data.mobile,
        gender = this.data.sexCode,
        name = this.data.name,
        birth = this.data.date.replace(/(^\s*)|(\s*$)/g, ""),
        referrer = this.data.referrer?this.data.referrer:'',
        province = this.data.province,
        city = this.data.city,
        district = this.data.county,
        psw = this.data.psw,
        approveFlag = this.data.approveFlag
    
    //参数校验
    if(!name){
       wx.showModal({content:'请输入姓名'})
       return
    }

    if(!birth){
       wx.showModal({content:'请选择生日'})
       return
    }

    // if(!province){
    //    wx.showModal({content:'请选择省市区'})
    //    return
    // }

    // if(!psw){
    //    wx.showModal({content:'请输入登录密码'})
    //    return
    // }
     
    if(!approveFlag){
       //wx.showModal({content:'阅读《会员手册》并同意条款'})
       this.openProtocol()
       return
    }

    // "address":province+'-'+city+'-'+district,
    var param = {
          "mini":"mini",
          "referrer":referrer,
          "name":name,
          "birth":birth,
          "psw":psw,
          "gender":gender,
          "openId":app.globalData.openId,
          "address":'',
          "email":'',
          "mobile":mobile
    }
    var _this = this

    wx.showLoading({title:'加载中'})
    this.setData({clickLock3:true})
    wx.request({
              url: app.globalData.host+"/member/registerNewMini",
              method:'POST',
              header: {"Content-Type":"application/x-www-form-urlencoded"}, 
              data: param,
              success: function(res) {
                //服务器返回数据
                console.log(res)
                wx.hideLoading()
                if(res.data.errcode == 0){
                    var userId = res.data.userId;
                    app.globalData.userId = userId
                    wx.setStorageSync('userId',userId)
                    wx.redirectTo({
                      url:'../welcome/index',
                      success: function(res) {
                          setTimeout(function(){
                             _this.setData({clickLock3:false});
                          },500)
                      }
                    })
                }else{
                  wx.showModal({
                      content:res.data?res.data.msg:'服务器异常',
                      success: function(res) {
                          _this.setData({clickLock3:false})
                      }
                  })
                }
              }
    })   

  },
  approveFun:function(){
    var approveFlag = !this.data.approveFlag;
    this.setData({
      approveFlag:approveFlag
    })
  },
  chooseSex:function(e){
     var sexCode = e.currentTarget.dataset.param
     this.setData({sexCode:sexCode})
  },
  openProtocol:function(){
     wx.navigateTo({url:'../protocol/index'})
  }
})
