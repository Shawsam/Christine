//index.js
//获取应用实例
const app = getApp()
var model = require('../../model/model.js')
var show = false;
var item = {};

Page({
  data: {
    userInfo: null,
    userId:'',
    step:1,
    sexCode:1,
    approveFlag:false,
    mobile:'',
    smscode:'',
    timer:60,
    date:'',
    item: { show: show }
  },
  is_phone:function(str){
    var reg=/^1\d{10}$/;
    if(reg.test(str))
      return true;
    else
      return false;
  },
  onLoad: function (option) {
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
    console.log(!e.detail.userInfo)
    if(!e.detail.userInfo){
        wx.showModal({content:'请允许微信授权',showCancel:false})
        return
    } 
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      sexCode:e.detail.userInfo.gender
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
    
    var param = {
       mini:'mini',
       openId:app.globalData.openId,
       mobile:mobile
    }
    var _this = this

    wx.showLoading({title:'加载中'})
    wx.request({
              url: app.globalData.host+"/sms/sendCodeMini",
              method:'POST',
              header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
              data: param,
              success: function(res) {
                //服务器返回数据
                console.log(res)
                wx.hideLoading()
                if(res.data.errcode == 0){
                    var userId = res.data.data
                    console.log(userId)

                    _this.setData({step:2,
                                   userId:userId})
                    var timeCounter = setInterval(function(){
                      var timer =  _this.data.timer
                      if(timer == 0){
                        clearInterval(timeCounter)
                        return
                      }
                      _this.setData({timer:timer-1})                    
                    },1000)
                }
              }
    })             
  },

  RegetCodeFun:function(){
    var param = {
       mini:'mini',
       openId:app.globalData.openId,
       mobile:this.data.mobile
    }
    var _this = this
    wx.showLoading({title:'加载中'})
    wx.request({
              url: app.globalData.host+"/sms/sendCodeMini",
              method:'POST',
              header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
              data: param,
              success: function(res) {
                //服务器返回数据
                wx.hideLoading()
                if(res.data.errcode == 0){
                    _this.setData({timer:60})
                    var timeCounter = setInterval(function(){
                      var timer =  _this.data.timer
                      if(timer == 0){
                        clearInterval(timeCounter)
                        return
                      }
                      _this.setData({timer:timer-1})                    
                    },1000)
                }
              }
    })     
  },


  codeInput:function(e){
    this.setData({
        smscode: e.detail.value
    })
  },
  yzCodeFun: function(){
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

    var userId = this.data.userId
    console.log(userId)
    if(userId){   //会员用户，直接跳转首页
      var param = {
           mini:'mini',
           openId:app.globalData.openId,
           mobile:this.data.mobile,
           code:smscode
        }
        var _this = this

        wx.showLoading({title:'加载中'})
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
                        app.globalData.userId = userId
                        wx.setStorageSync('userId',userId)
                        wx.navigateTo({url:'../index/index'})
                    }else{
                        wx.showModal({content:res.data.msg})
                    }
                  }
        })
    }else{
      var param = {
           mini:'mini',
           openId:app.globalData.openId,
           mobile:this.data.mobile,
           smscode:smscode
        }
        var _this = this
        wx.showLoading({title:'加载中'})
        wx.request({
                  url: app.globalData.host+"/sms/checkCodeMini",
                  method:'POST',
                  header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
                  data: param,
                  success: function(res) {
                    //服务器返回数据
                    console.log(res)
                    wx.hideLoading()
                    if(res.data.errcode == 0){
                        var userId = res.data.userId
                        app.globalData.userId = userId
                        wx.setStorageSync('userId',userId)
                        _this.setData({step:3,
                                       userId:userId})
                    }else{
                        wx.showModal({content:res.data.msg})
                    }
                  }
        })  
    }
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

    if(!province){
       wx.showModal({content:'请选择省市区'})
       return
    }

    if(!psw){
       wx.showModal({content:'请输入登录密码'})
       return
    }

    if(!approveFlag){
       wx.showModal({content:'阅读《会员手册》并同意条款'})
       return
    }


    var param = {
          "mini":"mini",
          "referrer":referrer,
          "name":name,
          "birth":birth,
          "psw":psw,
          "gender":gender,
          "openId":app.globalData.openId,
          "address":province+city+district,
          "mobile":mobile
    }
    var _this = this

    wx.showLoading({title:'加载中'})
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
                    app.globalData.userId = res.data.userId
                    wx.navigateTo({url:'../welcome/index'})
                }else{
                    wx.showModal({content:res.data.msg})
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
  }
})
